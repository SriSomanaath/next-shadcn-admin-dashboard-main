"use client";

import * as React from "react";
import { useMemo, useEffect, useState } from "react";
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
import { useGetLeadsQuery, usePostleadMutation, usePostSheetsUserMutation } from "@/redux/services/leadManagementServices";
import Cookies from "js-cookie";
import { getAllUsersForSheets_v2 } from "@/hooks/use-manage-sheets";
import ManageUsersTable from "./ManageUsersTable";
import TableColumns from "./DropdownColumn";
import { CheckCircle2, XCircle } from "lucide-react";

interface AlertProps {
  variant: "destructive" | "default";
  alert: { type: "success" | "error"; message: string };
  lastAction?: boolean;
  handleUndo?: () => void;
}

const Alert: React.FC<AlertProps> = ({ variant, alert, lastAction, handleUndo }) => {
  return (
    <div className="fixed rounded-xl bottom-4 right-4 z-50">
      <div className={`relative flex items-center gap-4 rounded p-4 border ${variant === "destructive" ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"}`}>
        {alert.type === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <div className="flex-1">
          <div className="text-sm font-semibold">{alert.type === "success" ? "Success" : "Error"}</div>
          <div className="text-xs text-muted-foreground">{alert.message}</div>
        </div>
        {/* {lastAction && (
          <button
            className="ml-2 text-blue-500 underline hover:text-blue-700"
            onClick={handleUndo}
          >
            Undo
          </button>
        )} */}
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
          <div className="h-full bg-blue-500 animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = React.useState("All");
  const [pageIndex, setPageIndex] = React.useState(0);
  const dispatch = useDispatch();
  const { data: manage_users, error: fetchError, isLoading } = useGetLeadsQuery();
  const [postLead, { isLoading: isPostingLead }] = usePostleadMutation();
  const [postSheetUser, { isLoading: isPostingSheetUser }] = usePostSheetsUserMutation();  
  const [updatedData, setUpdatedData] = React.useState<any>();
  const pageSize = 8; // Rows per page
  const COLUMN_COOKIE_KEY = "selectedColumns";
  const storedColumns = Cookies.get(COLUMN_COOKIE_KEY)
    ? JSON.parse(Cookies.get(COLUMN_COOKIE_KEY) || "[]")
    : [];
  const [isInitialRender, setIsInitialRender] = React.useState(true);
  const [tableData, setTableData] = React.useState<any[]>([]);
  const { SelectColumn, DropdownColumn, renderTeamColumn, renderSheetsColumn, InputColumn } = TableColumns;

  // Alert state
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Optional: if you want to allow undo action
  const [lastAction, setLastAction] = useState(false);
  const handleUndo = () => {
    // Implement undo functionality if needed
    console.log("Undo action triggered");
    setLastAction(false);
  };

  // Helper to trigger an alert
  const onAlert = (data: { type: "success" | "error"; message: string }) => {
    setAlert(data);
    // Optionally, set lastAction true for success alerts (if you want undo)
    if (data.type === "success") {
      setLastAction(true);
    }
    // Auto-dismiss after a few seconds if desired:
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersDataResponse = await getAllUsersForSheets_v2();
        console.log("sheetNamev2sheetNamev2", usersDataResponse);
        if (!manage_users?.data || !usersDataResponse) {
          console.error("manage_users or usersDataResponse is not available");
          return;
        }
        const usersData = usersDataResponse;
        let mergedUsers = JSON.parse(JSON.stringify(manage_users.data));

        Object.entries(mergedUsers).forEach(([role, users]) => {
          Object.entries(users as Record<string, any>).forEach(([email, userData]) => {
            if (typeof userData === "object" && userData !== null) {
              userData["mail_id"] = email;
            }
          });
        });

        Object.entries(usersData).forEach(([sheetName, roles]) => {
          Object.entries(roles).forEach(([role, emailsSet]) => {
            const emails = Array.isArray(emailsSet) ? emailsSet : Array.from(emailsSet);
            emails.forEach((email) => {
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
        console.log("manage_usersCheck", mergedUsers);
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

  useEffect(() => {
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

      if (key === "ASSIGNMENT_STATUS") {
        return {
          id: key,
          header: headerLabel,
          cell: ({ row }) => (
            <SelectColumn row={row} columnKey={key} handleSubmitChanges={handleSubmitChangesWrapper} isLoading={isPostingLead}/>
          ),
        };
      }

      if (columnType === "dropdown") {
        return {
          id: key,
          header: headerLabel,
          cell: ({ row }) => (
            <DropdownColumn row={row} columnKey={key} handleSubmitChanges={handleSubmitChangesWrapper} isLoading={isPostingLead}/>
          ),
        };
      }

      if (key === "TEAM") {
        return {
          id: key,
          header: headerLabel,
          cell: ({ row }) => (
            <SelectColumn row={row} columnKey={key} handleSubmitChanges={handleSubmitChangesWrapper} isLoading={isPostingLead}/>
          ),
        };
      }

      if (key === "sheets") {
        return {
          id: key,
          header: headerLabel,
          cell: ({ row }) => renderSheetsColumn(row, key, handleSubmitChangesWrapper, isPostingSheetUser) 
        };
      }

      if (key === "SlackEmail" || key === "SlackUser") {
        return {
          accessorKey: key,
          header: headerLabel,
          cell: ({ row }) => <InputColumn row={row} columnKey={key} handleSubmitChanges={handleSubmitChangesWrapper} isLoading={isPostingLead}/>,
        };
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

  const handleSubmitChangesWrapper = async (mail: string, updatedColumnData: any, sheetData: boolean = false) => {
    try {
      if (sheetData) {
        const payload = {
          sheetName: updatedColumnData["sheet"],
          userData: JSON.stringify({ [mail]: { "ACTIVE_STATUS": true } }),
        };
        console.log(`Updated Data for ${mail}:`, payload);
        await postSheetUser(payload);
        onAlert({
          type: "success",
          message: `Updated data for ${mail}`,
        });
        return;
      }
      const payload = { [mail]: { ...updatedColumnData } };

      await postLead({ userData: payload });

      onAlert({
        type: "success",
        message: `Updated data for ${mail}`,
      });

      console.log(`Updated Data for ${mail}:`, payload);
    } catch (error) {
      onAlert({
        type: "error",
        message: "There was an error updating the data.",
      });
      console.error("Error updating data:", error);
    }
  };

  return (
    <>
      {alert && (
        <Alert
          variant={alert.type === "error" ? "destructive" : "default"}
          alert={alert}
          lastAction={lastAction}
          handleUndo={handleUndo}
        />
      )}
      <ManageUsersTable table={table} manage_users={manage_users} activeTab={activeTab} setActiveTab={setActiveTab} handleColumnChange={handleColumnChange} setPageIndex={setPageIndex} isLoading={isLoading} />
    </>
  );
}

export default Page;