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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import logoUrl from "@/assets/open-sacco.png";
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

  searchable?: boolean; // <-- Add this
  exportable?: boolean;
  reportHeading?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  route,
  btnTitle,
  title,
  filters,
  reportHeading,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter,
    },
  });

  const getExportData = () => {
    const headers = table.getVisibleLeafColumns().map((col) => {
      const h = col.columnDef.header;
      return typeof h === "string" ? h : col.id;
    });

    const rows = table.getRowModel().rows.map((row) =>
      row.getVisibleCells().map((cell) => {
        const val = cell.getValue() as unknown;
        if (val === null || val === undefined) return "";
        if (typeof val === "object") {
          try {
            return JSON.stringify(val);
          } catch {
            return String(val);
          }
        }
        return String(val);
      })
    );

    return { headers, rows };
  };

  const exportToPDF = async () => {
    const { headers, rows } = getExportData();

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    // Header content
    const heading = reportHeading || title || "Report";
    const orgInfoLines = [
      "Address:",
      "Nextgen Mall, 1st floor Unit UC",
      "Nairobi - Kenya",
      "",
      "Email:",
      "info(at)softclans.co.ke",
      "",
      "Phone & Fax:",
      "011 5630531",
      "",
      "Postal Address:",
      "P.O. BOX 36907-00200,",
      "Nairobi - Kenya",
    ];

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const drawHeader = async () => {
      const margin = 36; // 0.5in
      let imgW = 120;
      let imgH = 50;
      try {
        const img = await loadImage(logoUrl);
        const ratio = img.width / img.height || 1;
        imgW = 120;
        imgH = imgW / ratio;
        doc.addImage(img, "PNG", margin, margin, imgW, imgH);
      } catch {
        // If image fails, continue without logo
      }

      // Heading centered
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(heading, pageWidth / 2, margin + 18, { align: "center" });

      // Org info on the right
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const infoX = pageWidth - margin - 250;
      let infoY = margin;
      orgInfoLines.forEach((line) => {
        doc.text(line, infoX, infoY, { maxWidth: 240 });
        infoY += 12;
      });

      // Horizontal rule
      doc.setDrawColor(180);
      doc.line(
        margin,
        margin + Math.max(imgH, 60) + 10,
        pageWidth - margin,
        margin + Math.max(imgH, 60) + 10
      );
    };

    const drawFooter = () => {
      const margin = 36;
      doc.setFontSize(9);
      doc.setTextColor(120);
      const str = `Generated: ${new Date().toLocaleString()} | Page ${doc.getNumberOfPages()}`;
      doc.text(str, margin, pageHeight - 16);
    };

    // First page header before table
    await drawHeader();

    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [138, 185, 241], textColor: 20, halign: "left" },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      margin: { top: 110, right: 36, bottom: 42, left: 36 },
      didDrawPage: (data: any) => {
        // Draw header on subsequent pages
        const isFirstDraw = (doc as any).__header_drawn__;
        if (!isFirstDraw) {
          (doc as any).__header_drawn__ = true;
        } else {
          // For pages after first, draw simplified header
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text(heading, doc.internal.pageSize.getWidth() / 2, 36, {
            align: "center",
          });
          doc.setDrawColor(180);
          doc.line(36, 48, doc.internal.pageSize.getWidth() - 36, 48);
        }
        // Footer on every page
        drawFooter();
      },
    });

    const name = `${(reportHeading || title || "data").toString()}-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(name);
  };

  const exportToExcel = () => {
    const { headers, rows } = getExportData();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const name = `${title || "data"}-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, name);
  };

  return (
    <div className="rounded-lg border bg-white dark:bg-blue-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-4 gap-3">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <div className="flex w-full md:w-auto items-center gap-3">
          {/* Global search across all columns */}
          <Input
            placeholder="Search all..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full md:w-64"
          />
          {/* Optional column-specific filter */}
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
          {/* Export actions */}
          <Button
            onClick={exportToPDF}
            className="bg-white border text-slate-800 hover:bg-slate-50"
          >
            Export PDF
          </Button>
          <Button
            onClick={exportToExcel}
            className="bg-white border text-slate-800 hover:bg-slate-50"
          >
            Export Excel
          </Button>
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
