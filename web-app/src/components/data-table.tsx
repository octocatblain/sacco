import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CirclePlus } from "lucide-react";
// components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  route?: string;
  title?: string;
  btnTitle?: string;
  filters: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  route,
  btnTitle,
  title,
  filters,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="rounded-lg border bg-white dark:bg-blue-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <div className="flex w-full md:w-auto items-center gap-3">
          <Input
            placeholder="Search..."
            value={(table.getColumn(filters)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filters)?.setFilterValue(event.target.value)
            }
            className="w-full md:w-64"
          />
          <Link to={route ? route : ""}>
            <Button className="flex gap-x-2 bg-primary text-black hover:opacity-90">
              <CirclePlus size={18} />
              {btnTitle}
            </Button>
          </Link>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-lg border-t">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="bg-slate-50 dark:bg-blue-950 text-slate-700 dark:text-slate-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-3">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-3 py-2 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="px-3 py-2 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="px-3 py-2 rounded-md border bg-white hover:bg-slate-50 disabled:opacity-50"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <span>Page</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            <span>| Go to page:</span>
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border px-2 py-1 rounded w-16 dark:bg-blue-900"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border px-2 py-1 rounded bg-white dark:bg-blue-900"
          >
            {[10, 25, 50, 75, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
