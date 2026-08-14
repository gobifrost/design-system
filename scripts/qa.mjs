import { mkdir } from "node:fs/promises";
import { chromium } from "../apps/bifrost-design-system/node_modules/playwright/index.mjs";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = new URL("../.impeccable/screenshots/", import.meta.url).pathname;
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });

function luminance(color) {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
  const linear = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function collectErrors(page, failures, prefix = "") {
  page.on("pageerror", (error) => failures.push(`${prefix}pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`${prefix}console: ${message.text()}`);
  });
}

async function desktopContract() {
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });
  const failures = [];
  collectErrors(page, failures);
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Build interfaces that feel native to Bifrost." }).waitFor();
  const navigation = page.getByRole("navigation", { name: "Design system sections" });

  const scroll = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).overflowY,
    body: getComputedStyle(document.body).overflowY,
    main: getComputedStyle(document.querySelector(".catalog-main")).overflowY,
  }));
  if (scroll.html !== "hidden" || scroll.body !== "hidden" || scroll.main !== "auto") failures.push(`scroll contract: ${JSON.stringify(scroll)}`);

  const logoLoaded = await page.locator(".rail-brand img").evaluate((image) => image.complete && image.naturalWidth > 0);
  if (!logoLoaded) failures.push("brand: native Bifrost square asset did not load");

  const initialSwitch = page.getByRole("switch", { name: "Switch to light theme" });
  if (await initialSwitch.getAttribute("aria-checked") !== "true") failures.push("theme: catalog should start in website-led dark mode");
  await page.screenshot({ path: `${outputDir}field-guide-dark-desktop.png`, fullPage: true });

  await page.getByRole("radio", { name: "Compact", exact: true }).click();
  if (await page.locator(".catalog-shell").getAttribute("data-density") !== "compact") failures.push("density: compact mode did not apply");
  await page.getByRole("radio", { name: "Compact", exact: true }).press("ArrowRight");
  if (await page.locator(".catalog-shell").getAttribute("data-density") !== "comfortable") failures.push("density: arrow-key selection did not apply");

  const installCommandLayout = await page.locator(".quick-install code").evaluate((element) => ({ scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, whiteSpace: getComputedStyle(element).whiteSpace }));
  if (installCommandLayout.scrollWidth > installCommandLayout.clientWidth + 1 || installCommandLayout.whiteSpace === "nowrap") failures.push(`install command is not fully legible: ${JSON.stringify(installCommandLayout)}`);

  const homeIconGap = await page.getByLabel("Search assets").evaluate((input) => {
    const icon = input.parentElement?.querySelector(".bds-field__icon");
    if (!icon) return 0;
    const inputBox = input.getBoundingClientRect();
    return inputBox.left + Number.parseFloat(getComputedStyle(input).paddingLeft) - icon.getBoundingClientRect().right;
  });
  if (homeIconGap < 8) failures.push(`field spacing: expected at least 8px after icon, received ${homeIconGap}px`);

  await initialSwitch.click();
  await page.locator("html:not(.dark)").waitFor();
  const lightContrast = await page.evaluate(() => ({ foreground: getComputedStyle(document.body).color, background: getComputedStyle(document.body).backgroundColor }));
  if (contrast(lightContrast.foreground, lightContrast.background) < 4.5) failures.push(`light contrast below AA: ${JSON.stringify(lightContrast)}`);
  await page.screenshot({ path: `${outputDir}field-guide-light-desktop.png`, fullPage: true });

  await navigation.getByRole("link", { name: "Foundations" }).click();
  await page.getByRole("heading", { name: "A small vocabulary, used deliberately." }).waitFor();
  if (await page.locator(".catalog-main").evaluate((element) => element.scrollTop) !== 0) failures.push("navigation: route did not reset the content scroll position");
  const brandAssets = await page.locator(".logo-foundation img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0));
  if (!brandAssets) failures.push("foundations: one or more native logo assets failed to load");
  const bridgeAnimation = await page.locator(".motion-bridge-demo span").evaluate((element) => getComputedStyle(element).animationName);
  if (bridgeAnimation !== "bridge-shift") failures.push(`motion: bridge animation missing (${bridgeAnimation})`);
  await page.screenshot({ path: `${outputDir}foundations-light-desktop.png`, fullPage: true });
  await page.getByRole("switch", { name: "Switch to dark theme" }).click();
  await page.locator(".logo-wordmark--dark").waitFor();
  const darkWordmarkDisplay = await page.locator(".logo-wordmark__dark-neutral").evaluate((element) => getComputedStyle(element).display);
  if (darkWordmarkDisplay === "none") failures.push("foundations: dark-surface wordmark neutral layer did not activate");
  await page.screenshot({ path: `${outputDir}foundations-dark-desktop.png`, fullPage: true });
  await page.getByRole("switch", { name: "Switch to light theme" }).click();
  await page.locator("html:not(.dark)").waitFor();

  await navigation.getByRole("link", { name: "Components" }).click();
  await page.getByRole("heading", { name: "See the behavior, not just the shape." }).waitFor();
  const familyCount = await page.getByRole("tablist", { name: "Component families" }).getByRole("tab").count();
  if (familyCount !== 9) failures.push(`components: expected 9 families, received ${familyCount}`);

  await page.getByRole("tab", { name: "Actions", exact: true }).press("ArrowRight");
  if (await page.getByRole("tab", { name: "Forms", exact: true }).getAttribute("aria-selected") !== "true") failures.push("components: arrow-key family selection did not update");

  await page.getByRole("tab", { name: "Forms", exact: true }).click();
  const invalidField = page.getByLabel("Review date");
  if (await invalidField.getAttribute("aria-invalid") !== "true") failures.push("forms: invalid state is not programmatic");
  const cadence = page.getByRole("combobox", { name: "Review cadence" });
  await cadence.click();
  await page.getByRole("searchbox", { name: "Search cadences" }).fill("high touch");
  await page.getByRole("option", { name: /Monthly/ }).click();
  if (!(await cadence.textContent())?.includes("Monthly")) failures.push("forms: searchable combobox did not select a filtered option");
  const owners = page.getByRole("combobox", { name: "Account owners" });
  await owners.click();
  const ownersListbox = page.getByRole("listbox", { name: "Account owners" });
  const ownersPopover = await ownersListbox.evaluate((listbox) => {
    const panel = listbox.parentElement;
    const bounds = panel.getBoundingClientRect();
    return {
      bottom: bounds.bottom,
      top: bounds.top,
      viewportHeight: window.innerHeight,
      listOverflow: getComputedStyle(listbox).overflowY,
      panelPosition: getComputedStyle(panel).position,
    };
  });
  if (ownersPopover.top < 7 || ownersPopover.bottom > ownersPopover.viewportHeight - 7 || ownersPopover.listOverflow !== "auto" || ownersPopover.panelPosition !== "fixed") failures.push(`forms: multi-select viewport containment failed (${JSON.stringify(ownersPopover)})`);
  await page.getByRole("searchbox", { name: "Search people" }).fill("security");
  await page.getByRole("option", { name: /Ruth Kim/ }).click();
  if (!(await owners.textContent())?.includes("+1 more")) failures.push("forms: multi-select overflow summary did not update");
  await page.locator(".workbench").screenshot({ path: `${outputDir}components-forms-search-light-desktop.png` });
  await page.getByRole("searchbox", { name: "Search people" }).press("Escape");

  await page.getByRole("tab", { name: "Selection", exact: true }).click();
  const reminder = page.getByRole("switch", { name: "Review reminders" });
  await reminder.click();
  if (await reminder.getAttribute("aria-checked") !== "true") failures.push("selection: switch state did not update");

  await page.getByRole("tab", { name: "Navigation", exact: true }).click();
  const tabWidths = await page.getByRole("tablist", { name: "Account sections" }).getByRole("tab").evaluateAll((tabs) => tabs.map((tab) => tab.getBoundingClientRect().width));
  if (Math.max(...tabWidths) - Math.min(...tabWidths) > 1) failures.push(`navigation: equal tabs drifted (${tabWidths.join(", ")})`);
  await page.getByRole("tab", { name: "Activity", exact: true }).click();
  await page.getByRole("tabpanel").getByText("Recent notes, reviews, and status changes.").waitFor();

  await page.getByRole("tab", { name: "Data", exact: true }).click();
  const stageFilter = page.getByRole("combobox", { name: "Filter by stage" });
  await stageFilter.click();
  const stageListbox = page.getByRole("listbox", { name: "Filter by stage" });
  const stagePopover = await stageListbox.evaluate((listbox) => {
    const bounds = listbox.parentElement.getBoundingClientRect();
    return { bottom: bounds.bottom, top: bounds.top, viewportHeight: window.innerHeight, overflow: getComputedStyle(listbox).overflowY };
  });
  if (stagePopover.top < 7 || stagePopover.bottom > stagePopover.viewportHeight - 7 || stagePopover.overflow !== "auto") failures.push(`data: stage filter viewport containment failed (${JSON.stringify(stagePopover)})`);
  await page.getByRole("searchbox", { name: "Search options" }).press("Escape");
  const opportunities = page.getByRole("table", { name: "Sales opportunities" });
  await opportunities.getByRole("button", { name: /Opportunity/ }).click();
  if (await opportunities.getByRole("columnheader", { name: /Opportunity/ }).getAttribute("aria-sort") !== "ascending") failures.push("data: sortable header did not expose ascending state");
  await opportunities.getByRole("checkbox", { name: "Select all visible rows" }).click();
  if (!(await page.getByText(/4 selected/).isVisible())) failures.push("data: visible-row bulk selection did not update");
  await page.getByRole("button", { name: "Next page" }).click();
  await opportunities.getByText("Compliance evidence").waitFor();
  await page.getByLabel("Search opportunities").fill("identity");
  await opportunities.getByText("Identity hardening").waitFor();
  await page.screenshot({ path: `${outputDir}components-data-light-desktop.png`, fullPage: true });

  await page.getByRole("tab", { name: "Overlay", exact: true }).click();
  await page.getByRole("button", { name: "Account actions" }).click();
  await page.getByRole("menuitem", { name: "Assign owner" }).click();
  await page.getByText("Assigned owner").waitFor();
  await page.getByRole("button", { name: "Review plan" }).click();
  const dialog = page.locator("dialog[open]");
  await dialog.waitFor();
  const dialogContract = await dialog.evaluate((node) => {
    const surface = node.querySelector(".bds-dialog__surface");
    const body = node.querySelector(".bds-dialog__body");
    return {
      surfaceOverflow: getComputedStyle(surface).overflowY,
      bodyOverflow: getComputedStyle(body).overflowY,
      surfaceHeight: surface.getBoundingClientRect().height,
      allowance: window.innerHeight - 32,
    };
  });
  if (dialogContract.surfaceOverflow !== "hidden" || dialogContract.bodyOverflow !== "auto" || dialogContract.surfaceHeight > dialogContract.allowance + 1) failures.push(`dialog containment: ${JSON.stringify(dialogContract)}`);
  await page.screenshot({ path: `${outputDir}components-overlay-light-desktop.png`, fullPage: true });
  await page.getByRole("button", { name: "Close dialog" }).click();

  await page.getByRole("tab", { name: "Motion" }).click();
  const loadingAnimation = await page.locator(".motion-loading-line i").evaluate((element) => getComputedStyle(element).animationName);
  if (loadingAnimation !== "loading-line") failures.push(`motion: loading animation missing (${loadingAnimation})`);
  await page.getByRole("button", { name: "Replay" }).click();
  await page.screenshot({ path: `${outputDir}components-motion-light-desktop.png`, fullPage: true });

  await page.getByRole("switch", { name: "Switch to dark theme" }).click();
  await page.locator("html.dark").waitFor();
  await page.screenshot({ path: `${outputDir}components-motion-dark-desktop.png`, fullPage: true });

  await navigation.getByRole("link", { name: "App patterns" }).click();
  await page.getByRole("heading", { name: "Recurring structures for recurring work." }).waitFor();
  const secondPriority = page.getByRole("button", { name: /Plan device replacements/ });
  await secondPriority.click();
  if (await secondPriority.getAttribute("aria-expanded") !== "true") failures.push("patterns: disclosure did not open");
  await page.screenshot({ path: `${outputDir}patterns-dark-desktop.png`, fullPage: true });

  await navigation.getByRole("link", { name: "Start building" }).click();
  await page.getByRole("heading", { name: "Begin with the work, then choose the rhythm." }).waitFor();
  await page.getByText("node scripts/add.mjs button --root ../your-app", { exact: false }).waitFor();
  await page.screenshot({ path: `${outputDir}start-dark-desktop.png`, fullPage: true });

  await page.close();
  return failures;
}

async function mobileContract() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const failures = [];
  collectErrors(page, failures, "mobile ");
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Build interfaces that feel native to Bifrost." }).waitFor();
  await page.screenshot({ path: `${outputDir}field-guide-dark-mobile.png`, fullPage: true });

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (horizontalOverflow > 1) failures.push(`mobile overflow: ${horizontalOverflow}px`);

  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("navigation", { name: "Design system sections" }).getByRole("link", { name: "Components" }).click();
  await page.getByRole("heading", { name: "See the behavior, not just the shape." }).waitFor();
  await page.getByRole("tab", { name: "Forms", exact: true }).click();
  await page.screenshot({ path: `${outputDir}components-forms-dark-mobile.png`, fullPage: true });
  await page.close();
  return failures;
}

async function reducedMotionContract() {
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, reducedMotion: "reduce" });
  const failures = [];
  await page.goto(`${baseUrl}/foundations`, { waitUntil: "networkidle" });
  const values = await page.evaluate(() => ({
    route: getComputedStyle(document.querySelector(".catalog-main")).animationDuration,
    bridge: getComputedStyle(document.querySelector(".motion-bridge-demo span")).animationName,
  }));
  const routeMs = values.route.endsWith("ms") ? Number.parseFloat(values.route) : Number.parseFloat(values.route) * 1000;
  if (routeMs > 1) failures.push(`reduced motion: route duration is ${values.route}`);
  if (values.bridge !== "none") failures.push(`reduced motion: bridge still animates (${values.bridge})`);
  await page.close();
  return failures;
}

const failures = [...await desktopContract(), ...await mobileContract(), ...await reducedMotionContract()];
await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("QA passed: routes, native assets, dark/light themes, density, component states, dialogs, motion, reduced motion, mobile layout, and browser console.");
