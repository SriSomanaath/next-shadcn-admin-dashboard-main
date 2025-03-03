"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { BookHeart, ChevronDown, FolderTree, Globe, Inbox, LandPlot, Loader2, PhoneCall, User } from "lucide-react";
import { useGetCountryDetailsMutation, useGetLeadqaActivityMutation, useGetleadqaLeadIdMutation, useGetOwnerDetailsMutation, useGetProspectDetailsMutation } from "@/redux/services/leadqaServices";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useSidebar } from "@/components/ui/sidebar";

interface LeadActivityItem {
  ProspectID: string;
  [key: string]: any;
}

const columnIcons: any = {
  ProspectID: <div className="w-5 h-5 flex items-center justify-center bg-white text-gray-500 "><Globe className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
  ProspectStage: <div className="w-5 h-5 flex items-center justify-center"><FolderTree className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
  FirstName	: <></>,
  LastName	: <></>,
  OwnerId	: <div className="w-5 h-5 flex items-center justify-center"><BookHeart className="w-3.5 h-3.5 text-[#fc488f]" /></div>,
  OwnerIdName: <div className="w-5 h-5 flex items-center justify-center"><User className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>,
  OwnerIdEmailAddress	: <div className="w-5 h-5 flex items-center justify-center"><Inbox className="w-3.5 h-3.5 text-[#fbd030]" /></div>,
  Country	: <div className="w-5 h-5 flex items-center justify-center"><LandPlot className="w-3.5 h-3.5 text-[#ce001c]" /></div>,
  Latest_Call	: <div className="w-5 h-5 flex items-center justify-center"><PhoneCall className="w-3.5 h-3.5 text-[#1e1e1e]" /></div>
};

const Page = () => {
  const [search, setSearch] = useState("");
  const [leadMail, setLeadMail] = useState("");
  const [filteredData, setFilteredData] = useState<LeadActivityItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [columnsVisibility, setColumnsVisibility] = useState<{ [key: string]: boolean }>({});
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>("");
  const [selectedCountryName, setSelectedCountryName] = useState<string | undefined>("");
  const [selectedProspect, setSelectedProspect] = useState<string | undefined>("");
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const totalPages = Math.ceil((1000) / perPage);
  const visiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);
  const router = useRouter();

  const [getLeadqaActivity, { data: leadActivityData, error, isLoading: isLoadingLeadActivity }] = useGetLeadqaActivityMutation();
  const [fetchOwnerDetails, { data: fetchedOwnerDetails }] = useGetOwnerDetailsMutation();
  const [fetchCountryDetails, { data: fetchedCountryDetails }] = useGetCountryDetailsMutation();
  const [fetchProspectDetails, { data: fetchedProspectDetails }] = useGetProspectDetailsMutation();
  const [fetchLeadIdDetails, { data: fetchedLeadIdDetails }] = useGetleadqaLeadIdMutation();
  const { state } = useSidebar();
  const widthClass = state === "expanded"
      ? "w-[calc(100vw-0.5rem)] lg:w-[calc(100vw-15rem)] md:w-[calc(100vw-15rem)] sm:w-[calc(100vw-1rem)] xs:w-[calc(100vw-1rem)]"
      : "w-[calc(100vw)] lg:w-[calc(100vw-4rem)] md:w-[calc(100vw-4rem)] sm:w-[calc(100vw-1rem)] xs:w-[calc(100vw-1rem)]";

  useEffect(() => {
    getLeadqaActivity({
      page_num: currentPage,
      per_page: perPage,
      agent_email: selectedAgent || undefined,
      from_date: dateRange.startDate ? dateRange.startDate.toISOString() : undefined,
      to_date: dateRange.endDate ? dateRange.endDate.toISOString() : undefined,
      country: selectedCountryName || undefined,
      propect_stage: selectedProspect || undefined,
    })
      .unwrap()
      .then((res) => { setFilteredData(res.data); console.log("API Response:", res); })
      .catch((err) => console.error("API Error:", err));

    // console.log("leadActivityData", leadActivityData);
  }, [currentPage, perPage, selectedAgent, selectedCountryName, dateRange, selectedProspect]);

  useEffect(() => {
    // Fetch options for dropdown menus
    fetchOwnerDetails('');
    fetchCountryDetails('');
    fetchProspectDetails('');
  }, []);

  const handleSearch = () => {
    if (!leadActivityData?.data) return; // Ensure API data exists before filtering

    const lowerCaseSearch = search.toLowerCase();
    const lowerCaseLeadMail = leadMail.toLowerCase();

    const filteredResults = leadActivityData.data.filter((item: any) => {
      const fullName = `${item.FirstName || ""} ${item.LastName || ""}`.trim().toLowerCase();
      const email = item.OwnerIdEmailAddress ? item.OwnerIdEmailAddress.toLowerCase() : "";

      return (
        fullName.includes(lowerCaseSearch) &&
        email.includes(lowerCaseLeadMail)
      );
    });

    setFilteredData(filteredResults);
  };

  const handleSearchThroughLeadID = async (leadID: string) => {
    if (!leadID) {
      setErrorMessage('Please enter a valid Lead Mail ID.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setSearching(true); // Start loading
    try {
      const response = await fetchLeadIdDetails({ lead_id: leadID });

      if (response?.data?.lead_ID) {
        router.push(`/dashboard/call-audit/lead-details?lead_id=${response.data.lead_ID}`);
      }
    } catch (error) {
      console.error('Error fetching lead details:', error);
      setErrorMessage('Failed to fetch lead details. Please try again.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setSearching(false); // Stop loading
    }
  };

  const handleColumnChange = (column: keyof typeof columnsVisibility, value: boolean) => {
    setColumnsVisibility((prev) => ({ ...prev, [column]: value }));
  };

  return (
    <div  className={`${widthClass} overflow-y-auto`}>
      <h1 className="text-2xl font-semibold mb-4">Call Audit</h1>

      <div className="flex justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Agents" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Agents</SelectItem> */}
              {fetchedOwnerDetails?.map((owner: any) => (
                <SelectItem key={owner.id} value={owner}>
                  {owner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCountryName} onValueChange={setSelectedCountryName}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Countries</SelectItem> */}
              {fetchedCountryDetails?.map((country: any) => (
                <SelectItem key={country.id} value={country.name}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProspect} onValueChange={setSelectedProspect}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Prospects" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Prospects</SelectItem> */}
              {fetchedProspectDetails?.map((prospect: any) => (
                <SelectItem key={prospect.id} value={prospect}>
                  {prospect}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Lead Mail ID"
            className="w-60"
            value={leadMail}
            onChange={(e) => setLeadMail(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <div className="flex justify-between gap-4 mb-4">
        <Input
          placeholder="Search Lead Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex items-center gap-1">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(filteredData[0] || {}).map((column) => (
              <DropdownMenuCheckboxItem
                key={column}
                className="capitalize"
                checked={columnsVisibility[column] ?? true}
                onCheckedChange={(value) => handleColumnChange(column, value)}
                onSelect={(e) => e.preventDefault()}
              >
                {column.replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-lg overflow-y-auto max-h-[62vh]">
        {isLoadingLeadActivity ? (
          <div className="flex justify-center items-center h-[62vh]">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <Table>
            <TableHeader borderCols >
              <TableRow>
                {Object.keys(filteredData[0] || {}).map((key) => {
                  const icon = columnIcons[key];
                  return columnsVisibility[key as keyof typeof columnsVisibility] !== false ? (
                    <TableHead key={key} className="capitalize text-[#1e1e1e]" borderCols>
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => console.log("Sorting by", key)}>
                        {icon || <span className="text-red-500"></span>}
                        {key.replace(/_/g, " ")}                        
                      </div>
                    </TableHead>
                  ) : null;
                })}
              </TableRow>
            </TableHeader>

            <TableBody className="!text-[#474949]">
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  {Object.keys(item).map((key) =>
                    columnsVisibility[key as keyof typeof columnsVisibility] !== false && (
                      <TableCell key={key} borderCols className={
                        key === "ProspectID" 
                          ? "bg-[#faf9ff]"
                          : ""
                      }>
                        {key === "ProspectID" ? (
                          <a
                            href={`/dashboard/call-audit/lead-details?lead_id=${item.ProspectID}`}
                            className="text-blue-400 hover:underline"
                          >
                            {item.ProspectID}
                          </a>
                        ) : (
                          item[key] ? String(item[key]) : "N/A"
                        )}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex justify-end mt-4">
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  // disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    getLeadqaActivity({ page_num: currentPage - 1, per_page: perPage });
                  }}
                />
              </PaginationItem>

              {startPage > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => {
                      setCurrentPage(page);
                      getLeadqaActivity({ page_num: page, per_page: perPage });
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {endPage < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  // disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    getLeadqaActivity({ page_num: currentPage + 1, per_page: perPage });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
    </div>
  );
}

export default Page;