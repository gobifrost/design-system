import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { BfDataTable, type BfDataColumn } from "./BfDataTable";

type Row = { id: string; name: string; value: number };
const rows: Row[] = [
  { id: "b", name: "Backup", value: 900 },
  { id: "a", name: "Access", value: 1200 },
];
const columns: BfDataColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "value", header: "Value", cell: (row) => `$${row.value}`, sortValue: (row) => row.value, sortable: true, align: "end" },
];

function Harness({ onActivate = vi.fn() }: { onActivate?: (row: Row) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  return (
    <BfDataTable
      ariaLabel="Opportunities"
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      selection="multiple"
      selectedRowIds={selected}
      onSelectionChange={setSelected}
      onRowActivate={onActivate}
      pagination={{ page, pageSize: 2, total: 4, onPageChange: setPage }}
    />
  );
}

describe("BfDataTable", () => {
  it("sorts semantic rows and selects all visible rows", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const table = screen.getByRole("table", { name: "Opportunities" });

    await user.click(within(table).getByRole("button", { name: /Name/ }));
    const bodyRows = within(table).getAllByRole("row").slice(1);
    expect(bodyRows[0]).toHaveTextContent("Access");
    expect(within(table).getByRole("columnheader", { name: /Name/ })).toHaveAttribute("aria-sort", "ascending");

    await user.click(within(table).getByRole("checkbox", { name: "Select all visible rows" }));
    expect(within(table).getByRole("checkbox", { name: "Select row a" })).toBeChecked();
    expect(within(table).getByRole("checkbox", { name: "Select row b" })).toBeChecked();
  });

  it("activates rows by keyboard and keeps pagination outside the scroller", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<Harness onActivate={onActivate} />);

    const row = screen.getByRole("row", { name: /Backup/ });
    row.focus();
    await user.keyboard("{Enter}");
    expect(onActivate).toHaveBeenCalledWith(rows[0]);

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Page 2 of 2")).toBeVisible();
  });

  it("renders an actionable empty state", () => {
    render(<BfDataTable ariaLabel="Empty" rows={[]} columns={columns} getRowId={(row) => row.id} emptyState={{ title: "No matches", description: "Clear a filter." }} />);
    expect(screen.getByText("No matches")).toBeVisible();
    expect(screen.getByText("Clear a filter.")).toBeVisible();
  });

  it("does not manufacture horizontal overflow without an explicit minimum", () => {
    render(<BfDataTable ariaLabel="Fitting table" rows={rows} columns={columns} getRowId={(row) => row.id} />);
    const table = screen.getByRole("table", { name: "Fitting table" });
    expect(table.closest(".bds-data-table")).toHaveStyle({ "--bds-data-table-min-width": "100%" });
  });
});
