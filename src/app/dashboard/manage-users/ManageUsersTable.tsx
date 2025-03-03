import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { flexRender } from "@tanstack/react-table";
import PaginationComponent from "@/components/pagination-user";
import { useSidebar } from "@/components/ui/sidebar";
import { User, Phone, Layers, ShieldCheck, IdCard, Briefcase, Mail, Users, Globe, ChevronDown, ArrowUpDown, Settings, Group, LoaderCircle } from "lucide-react";

interface ManageUsersTableProps {
  table: any;
  manage_users: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleColumnChange: (id: string, value: boolean) => void;
  setPageIndex: (index: number) => void;
  isLoading: boolean;
}

const columnIcons: any = {
    ASSIGNMENT_STATUS: <div className="w-5 h-5 flex items-center justify-center bg-white text-gray-500 "><Group className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    AssociatedPhoneNumbers: <div className="w-5 h-5 flex items-center justify-center"><Phone className="w-3.5 h-3.5 text-[#138dff]" /></div>,
    ELIGIBLE_GROUPS_PROFESSIONAL: <div className="w-5 h-5 flex items-center justify-center"><ShieldCheck className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    ELIGIBLE_GROUPS_STUDENT: <div className="w-5 h-5 flex items-center justify-center"><Group className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    FirstName: <div className="w-5 h-5 flex items-center justify-center"><User className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    ID: <div className="w-5 h-5 flex items-center justify-center"><IdCard className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    LastName: <div className="w-5 h-5 flex items-center justify-center"><User className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    Role: <div className="w-5 h-5 flex items-center justify-center"><Briefcase className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    SlackEmail: <div className="w-5 h-5 flex items-center justify-center"><Mail className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    SlackUser: <div className="w-5 h-5 flex items-center justify-center"><Users className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
    TEAM: <div className="w-5 h-5 flex items-center justify-center"><Globe className="w-3.5 h-3.5 text-[#4e02c4]" /></div>,
    sheets: <div className="w-5 h-5 flex items-center justify-center"><Layers className="w-3.5 h-3.5 text-[#2ab0cb]" /></div>,
    mail_id: <div className="w-5 h-5 flex items-center justify-center"><Mail className="w-3.5 h-3.5 text-[#00606d]" /></div>,
  };

const ManageUsersTable = ({
  table,
  manage_users,
  activeTab,
  setActiveTab,
  handleColumnChange,
  setPageIndex,
  isLoading
}: ManageUsersTableProps) => {
const { state } = useSidebar();
const widthClass = state === "expanded"
    ? "w-[calc(100vw-0.5rem)] lg:w-[calc(100vw-15rem)] md:w-[calc(100vw-15rem)] sm:w-[calc(100vw-1rem)] xs:w-[calc(100vw-1rem)]"
    : "w-[calc(100vw)] lg:w-[calc(100vw-4rem)] md:w-[calc(100vw-4rem)] sm:w-[calc(100vw-1rem)] xs:w-[calc(100vw-1rem)]";

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-[100vh]">
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className={`${widthClass} overflow-y-auto `}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
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
                .filter((column:any) => column.getCanHide())
                .map((column: any) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => handleColumnChange(column.id, !!value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  
        <div className="rounded-md border">
          <div className="space-y-4">
            <div className="space-y-4 h-[65vh]">
              <Table className="max-h-[65vh]">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup:any) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header:any) => {
                      const headerText = header.column.columnDef.header as string;
                      console.log("Group", header.column);
                      const icon = columnIcons[header.column.id];
                      return (
                        <TableHead borderCols key={header.id} onClick={header.column.getToggleSortingHandler()}>
                          <div className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-[#818181]">
                            {icon || <span className="text-red-500"></span>}
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() ? (header.column.getIsSorted() === "desc" ? " 🔽" : " 🔼") : ""}
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row:any) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell:any) => {
                          const columnKey = cell.column.id;
                          return (
                            <TableCell
                              borderCols
                              key={cell.id}
                              className={
                                columnKey === "TEAM" ||
                                columnKey === "ELIGIBLE_GROUPS_STUDENT" ||
                                columnKey === "ELIGIBLE_GROUPS_PROFESSIONAL"
                                  ? "bg-[#faf9ff]"
                                  : ""
                              }
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <PaginationComponent
              table={{
                previousPage: table.previousPage,
                nextPage: table.nextPage,
                getCanPreviousPage: table.getCanPreviousPage,
                getCanNextPage: table.getCanNextPage,
                getPageCount: table.getPageCount,
                getPageIndex: () => table.getState().pagination.pageIndex,
              }}
              setPageIndex={setPageIndex}
            />
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ManageUsersTable;