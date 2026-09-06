import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "../apps/bifrost-design-system/node_modules/playwright/index.mjs";
const base = process.env.QA_BASE_URL ?? "http://127.0.0.1:4173";
const output = new URL("../.impeccable/screenshots/", import.meta.url).pathname;
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1536, height: 1080 } });
page.on("pageerror", error => errors.push(error.message));
try {
  await page.goto(`${base}/execution`, { waitUntil: "networkidle" });
  await page.getByText("Waiting for execution to start.").waitFor();
  for (const theme of ["dark", "light"]) {
    if (theme === "light") await page.getByRole("switch", { name: "Switch to light theme" }).click();
    await page.getByRole("button", { name: "Run example" }).evaluate(async (button) => {
      await Promise.all(button.getAnimations({ subtree: true }).map(animation => animation.finished));
    });
    const colors = await page.getByRole("button", { name: "Run example" }).evaluate(button => ({
      foreground: getComputedStyle(button).color,
      children: [...button.querySelectorAll("span, svg")].map(child => getComputedStyle(child).color),
    }));
    assert(colors.children.every(color => color === colors.foreground), `${theme}: toolbar styles must not override button label/icon color`);
  }
  await page.getByRole("switch", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Run example" }).click();
  await page.waitForFunction(() => document.querySelectorAll('.bds-execution__events li').length >= 11);
  const viewport = page.getByRole("region", { name: "Execution events" });
  await viewport.evaluate(node => { node.scrollTop = 0; node.dispatchEvent(new Event("scroll")); });
  await page.getByRole("button", { name: "Jump to latest" }).waitFor();
  await page.waitForFunction(() => document.querySelectorAll('.bds-execution__events li').length >= 13);
  assert.equal(await viewport.evaluate(node => node.scrollTop), 0, "arrival must preserve reader position");
  await page.screenshot({ animations: "disabled", path: `${output}execution-dark-desktop.png` });
  await page.getByRole("button", { name: "Jump to latest" }).click();
  assert(await viewport.evaluate(node => node.scrollHeight - node.clientHeight - node.scrollTop < 24));
  await page.getByText("Succeeded", { exact: true }).waitFor();
  await page.getByRole("switch", { name: "Switch to light theme" }).click();
  await page.screenshot({ animations: "disabled", path: `${output}execution-light-desktop.png` });
  await page.getByLabel("Scenario").selectOption("failure");
  await page.getByRole("button", { name: "Run example" }).click();
  await page.getByText("Failed", { exact: true }).waitFor();
  await page.getByText(/Inventory request failed/).waitFor();
  await page.getByLabel("Scenario").selectOption("disconnect");
  await page.getByRole("button", { name: "Run example" }).click();
  await page.getByRole("button", { name: "Reconnect", exact: true }).waitFor();
  assert.equal(await page.locator('.bds-execution').getAttribute('data-status'), 'running');
  assert.equal(await page.locator('.bds-execution__bridge span').evaluate(node => getComputedStyle(node).animationName), 'none');
  await page.screenshot({ animations: "disabled", path: `${output}execution-disconnected-light.png` });
  await page.getByRole("button", { name: "Reconnect", exact: true }).click();
  await page.getByText("Reconnecting. Output may be delayed.").waitFor();
  await page.waitForFunction(() => document.querySelector('.bds-execution').dataset.connection === 'connected');
  await page.getByRole("button", { name: "Cancel example" }).click();
  await page.getByText("Cancelled", { exact: true }).waitFor();
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await page.screenshot({ animations: "disabled", path: `${output}execution-dark-${width}.png` });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert(await page.locator('.bds-execution').evaluate(node => node.getBoundingClientRect().right <= innerWidth));
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await page.screenshot({ animations: "disabled", path: `${output}execution-light-${width}.png` });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByLabel("Scenario").selectOption("success");
  await page.getByRole("button", { name: "Run example" }).click();
  assert.equal(await page.locator('.bds-execution__bridge span').evaluate(node => getComputedStyle(node).animationName), 'none');
  assert.deepEqual(errors, []);
  console.log("Execution QA passed: streaming, reader position, jump to latest, success, failure, reconnect, cancellation, responsive themes and reduced motion.");
} finally { await browser.close(); }
