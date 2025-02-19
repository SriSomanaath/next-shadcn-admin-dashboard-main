"use client";

import * as React from "react";
import { useMemo, useEffect } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import { setError, setLeads, setLoading } from "@/redux/slices/leadSlice";
import { useGetLeadsQuery } from "@/redux/services/leadManagementServices";
import Cookies from "js-cookie";
import { useSidebar } from "@/components/ui/sidebar";
import { getAllUsersForSheets } from "@/hooks/use-manage-sheets";
import ManageUsersTable from "./ManageUsersTable";
import TableColumns from "./DropdownColumn";
import { LoaderCircle } from "lucide-react";
const { DropdownColumn, renderTeamColumn, renderSheetsColumn } = TableColumns;

export function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState("Administrator"); // Default tab
  const { state } = useSidebar();
  const [pageIndex, setPageIndex] = React.useState(0);
  const dispatch = useDispatch();
  const { data: manage_users, error: fetchError, isLoading } = useGetLeadsQuery();
  const [updatedData, setUpdatedData] = React.useState();
  const pageSize = 8; // Rows per page
  const widthClass = state === "expanded"
      ? "w-[calc(100vw-0.5rem)] lg:w-[calc(100vw-18rem)] md:w-[calc(100vw-17rem)] sm:w-[calc(100vw-1rem)] xs:w-[calc(100vw-1rem)]"
      : "w-[calc(100vw)] lg:w-[calc(100vw-4rem)] md:w-[calc(100vw-4rem)] sm:w-[calc(100vw-1rem)] xs:w-[calc(100vw-1rem)]";
  const COLUMN_COOKIE_KEY = "selectedColumns";
  const storedColumns = Cookies.get(COLUMN_COOKIE_KEY)
    ? JSON.parse(Cookies.get(COLUMN_COOKIE_KEY) || "[]")
    : [];
    const [isInitialRender, setIsInitialRender] = React.useState(true); // To track initial render
    const [tableData, setTableData] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersDataResponse = await getAllUsersForSheets();
        if (!manage_users?.data || !usersDataResponse) {
          console.error("manage_users or usersDataResponse is not available");
          return;
        }
        const usersData = usersDataResponse; 
        let mergedUsers = JSON.parse(JSON.stringify(manage_users.data));
    
        // Iterate over the fetched data
        Object.entries(usersData).forEach(([sheetName, roles]) => {
          Object.entries(roles).forEach(([role, emailsSet]) => {
            // Convert Set to Array if necessary
            const emails = Array.isArray(emailsSet) ? emailsSet : Array.from(emailsSet);
    
            emails.forEach(email => {
              if (mergedUsers[role] && mergedUsers[role][email]) {
                if (!mergedUsers[role][email].hasOwnProperty("sheets")) {
                  mergedUsers[role][email]["sheets"] = [];
                }
                mergedUsers[role][email]["sheets"].push(sheetName);
              }
            });
          });
        });
        setUpdatedData(mergedUsers);
        setIsInitialRender(false);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };
    fetchUsers();
  }, [manage_users]);

  useEffect(() => {
    if (isLoading) dispatch(setLoading());
    if (fetchError) dispatch(setError(fetchError.toString()));
    if (updatedData) {
      dispatch(setLeads(updatedData));
    }
  }, [manage_users, fetchError, isLoading, dispatch, updatedData]);
 
  const getTableData = () => {
    if (activeTab === "All") {
      return [
        ...(Object.values(updatedData?.["Sales_Manager"] || [])),
        ...(Object.values(updatedData?.["Administrator"] || [])),
        ...(Object.values(updatedData?.["Sales_User"] || [])),
        ...(Object.values(updatedData?.["Marketing_User"] || [])),
      ];
    }
    return updatedData?.[activeTab] ? Object.values(updatedData[activeTab]) : [];
  };

  useEffect(() => { // Only update tableData when updatedData changes
    if (!isInitialRender) {
      const newTableData = getTableData();
      setTableData(newTableData);
    }
  }, [updatedData, activeTab, isInitialRender]);

  const determineColumnType = (key: string, value: any) => {
    if (Array.isArray(value)) return "array";
    if (typeof value === "boolean") return "checkbox";
    if (typeof value === "object" && value !== null) {
      return Object.values(value).every((v) => typeof v === "boolean") ? "dropdown" : "text";
    }
    return "text";
  };
  
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!tableData.length) return [];
  
    return Object.keys(tableData[0] ?? {}).map((key) => {
      const columnType = determineColumnType(key, tableData[0][key]);
      const headerLabel = key.replace("_", " ");
  
      if (columnType === "dropdown") {
        return {
          id: key,
          header: headerLabel,
          cell: ({ row }) => <DropdownColumn row={row} columnKey={key} />,
        };
      }

      if (key === "TEAM") {
        return { id: key, header: headerLabel, cell: ({ row }) => renderTeamColumn(row, key) };
      }
  
      if (key === "sheets") {
        return { id: key, header: headerLabel, cell: ({ row }) => renderSheetsColumn(row, key) };
      }
  
      return { accessorKey: key, header: headerLabel };
    });
  }, [tableData]);
  
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: useMemo(
      () => ({
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination: { pageIndex, pageSize },
      }),
      [sorting, columnFilters, columnVisibility, rowSelection, pageIndex, pageSize]
    ),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    if (storedColumns.length > 0) {
      setColumnVisibility((prev) => {
        const updatedVisibility = { ...prev };
        let hasChanges = false;

        table.getAllColumns().forEach((column) => {
          if (column.getCanHide()) {
            const newValue = storedColumns.includes(column.id);
            if (updatedVisibility[column.id] !== newValue) {
              updatedVisibility[column.id] = newValue;
              hasChanges = true;
            }
          }
        });
        return hasChanges ? updatedVisibility : prev;
      });
    }
  }, [table, storedColumns]);

  const handleColumnChange = (columnId: string, value: boolean) => {
    setColumnVisibility((prev) => {
      const updatedVisibility = { ...prev, [columnId]: value };
      const selectedColumns = Object.keys(updatedVisibility).filter(
        (key) => updatedVisibility[key]
      );
      Cookies.set(COLUMN_COOKIE_KEY, JSON.stringify(selectedColumns), {
        expires: 7,
      });
      return updatedVisibility;
    });
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-full">
      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
    </div>
  ) : (
    <ManageUsersTable
      table={table}
      manage_users={manage_users}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleColumnChange={handleColumnChange}
      setPageIndex={setPageIndex}
      isLoading={isLoading} 
    />
  );
}

export default Page;