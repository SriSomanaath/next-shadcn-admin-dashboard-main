"use client";

import * as React from "react";
import { useMemo, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDispatch } from "react-redux";
import { setError, setLeads, setLoading } from "@/redux/slices/leadSlice";
import { useGetLeadsQuery } from "@/redux/services/leadManagementServices";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useSidebar } from "@/components/ui/sidebar";

export function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [activeTab, setActiveTab] = React.useState("Administrator");
  const { state } = useSidebar()
  // console.log("sidebar_state", state);

  const widthClass =
  state === "expanded"
    ? "max-w-[calc(100%-16rem)]"
    : "max-w-[calc(100%-3rem)]";

  const dispatch = useDispatch();
  const { data: manage_users, error: fetchError, isLoading } = useGetLeadsQuery();

  useEffect(() => {
    if (isLoading) dispatch(setLoading());
    if (fetchError) dispatch(setError(fetchError.toString()));
    if (manage_users) {
      dispatch(setLeads(manage_users));
    }
  }, [manage_users, fetchError, isLoading, dispatch]);

  const tableData = useMemo(() => {
    return manage_users?.data?.[activeTab] ? Object.values(manage_users.data[activeTab]) : [];
  }, [manage_users, activeTab]);

  const determineColumnType = (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      const values = Object.values(value);
      if (values.every((v) => typeof v === "boolean")) {
        return "dropdown"; // Dropdown for boolean object
      }
    }
    if (typeof value === "boolean") {
      return "checkbox"; // Select for single boolean values
    }
    return "text"; // Text for other values
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!tableData.length) return [];

    const firstRow = tableData[0];
    return Object.keys(firstRow).map((key) => {
      const columnType = determineColumnType(key, firstRow[key]);

      if (columnType === "dropdown") {
        return {
          id: key,
          header: key.replace("_", " "),
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">{key}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(row.original[key]).map(([subKey, subValue]) => (
                  <DropdownMenuCheckboxItem
                    key={subKey}
                    checked={!!subValue}
                    onCheckedChange={(value) => {
                      row.original[key][subKey] = value;
                    }}
                  >
                    {subKey}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        };
      }

      if (columnType === "checkbox") {
        return {
          id: key,
          header: key.replace("_", " "),
          cell: ({ row }) => (
            <Checkbox
              checked={!!row.original[key]}
              onCheckedChange={(value) => {
                row.original[key] = value;
              }}
            />
          ),
        };
      }

      return {
        accessorKey: key,
        header: key.replace("_", " "),
      };
    });
  }, [tableData]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: useMemo(() => ({
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }), [sorting, columnFilters, columnVisibility, rowSelection]),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className={`${widthClass} overflow-y-auto`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          {Object.keys(manage_users?.data || {}).map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab.replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("SlackEmail")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("SlackEmail")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide()) // Filter columns that can be hidden
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()} // Set visibility state
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value) // Toggle visibility when checked or unchecked
                    }
                  >
                    {column.id} {/* Show column name */}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === "desc" ? " 🔽" : " 🔼") : ""}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Page;
