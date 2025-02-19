"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useGetCountryDetailsMutation, useGetLeadqaActivityMutation, useGetleadqaLeadIdMutation, useGetOwnerDetailsMutation, useGetProspectDetailsMutation } from "@/redux/services/leadqaServices";
import { useRouter } from "next/navigation";

const sampleData = [
  { LeadName: "Hadi Noori", ProspectStage: "RNR2", OwnerIdName: "Vennila Mohan", LeadMailID: "hadi@example.com", Latest_Call: "2025-02-17 23:58:03" },
  { LeadName: "Kiruthiga’s r", ProspectStage: "RNR1", OwnerIdName: "Harish Nair", LeadMailID: "kiruthiga@example.com", Latest_Call: "2025-02-17 23:56:52" },
  { LeadName: "Lily Qin", ProspectStage: "RNR2", OwnerIdName: "Vennila Mohan", LeadMailID: "lily@example.com", Latest_Call: "2025-02-17 23:55:18" },
  { LeadName: "Theotime Bakunzi", ProspectStage: "RNR2", OwnerIdName: "Harish Nair", LeadMailID: "theotime@example.com", Latest_Call: "2025-02-17 23:53:32" },
  { LeadName: "Travis McMackin", ProspectStage: "RNR2", OwnerIdName: "Vennila Mohan", LeadMailID: "travis@example.com", Latest_Call: "2025-02-17 23:51:35" },
];

const initialColumnsVisibility = {
  LeadName: true,
  ProspectStage: true,
  OwnerIdName: true,
  LeadMailID: true,
  Latest_Call: true,
};

export default function CallAuditPage() {
  const [search, setSearch] = useState("");
  const [leadMail, setLeadMail] = useState("");
  const [filteredData, setFilteredData] = useState(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [columnsVisibility, setColumnsVisibility] = useState(initialColumnsVisibility);
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>("");
  const [selectedCountryName, setSelectedCountryName] = useState<string | undefined>("");
  const [selectedProspect, setSelectedProspect] = useState<string | undefined>("");
  const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({ startDate: null, endDate: null });
  const [triggered, setTriggered] = useState(false);
  const [leadID, setLeadID] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const router = useRouter();

  const [getLeadqaActivity, { data: leadActivityData, error, isLoading }] = useGetLeadqaActivityMutation();
  const [fetchOwnerDetails, { data: fetchedOwnerDetails }] = useGetOwnerDetailsMutation();
  const [fetchCountryDetails, { data: fetchedCountryDetails }] = useGetCountryDetailsMutation();
  const [fetchProspectDetails, { data: fetchedProspectDetails }] = useGetProspectDetailsMutation();
  const [fetchLeadIdDetails, { data: fetchedLeadIdDetails }] = useGetleadqaLeadIdMutation();

  useEffect(() => {
    // Fetch lead data based on the selected filters
    getLeadqaActivity({
      page_num: currentPage,
      per_page: perPage,
      agent_email: selectedAgent || undefined,
      from_date: dateRange.startDate ? dateRange.startDate.toISOString() : undefined,
      to_date: dateRange.endDate ? dateRange.endDate.toISOString() : undefined,
      country: selectedCountryName || undefined,
      propect_stage: selectedProspect || undefined,
    });

    console.log("leadActivityData", leadActivityData, currentPage, perPage, selectedAgent, selectedCountryName, dateRange, selectedProspect);
    
  }, [currentPage, perPage, selectedAgent, selectedCountryName, dateRange, selectedProspect]);

  useEffect(() => {
    // Fetch options for dropdown menus
    fetchOwnerDetails('');
    fetchCountryDetails('');
    fetchProspectDetails('');
  }, []);

  const handleSearch = () => {
    setFilteredData(
      sampleData.filter(
        (item) =>
          item.LeadName.toLowerCase().includes(search.toLowerCase()) &&
          item.LeadMailID.toLowerCase().includes(leadMail.toLowerCase())
      )
    );
  };

  const handleSearchThroughLeadID = async () => {
    if (!leadID) {
      setErrorMessage('Please enter a valid Lead Mail ID.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setSearching(true); // Start loading
    try {
      const response = await fetchLeadIdDetails({ lead_id: leadID });

      if (response?.data?.lead_ID) {
        router.push(`/dashboard/call_audit/lead_details?lead_id=${response.data.lead_ID}`);
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Call Audit</h1>

      {/* First Row: Filters (Left) | Lead Mail ID & Search Button (Right) */}
      <div className="flex justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Agents" />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">All Agents</SelectItem> */}
              {fetchedOwnerDetails?.map((owner:any) => (
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
              {fetchedCountryDetails?.map((country:any) => (
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
              {fetchedProspectDetails?.map((prospect:any) => (
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

      {/* Second Row: Search (Left) | Columns Dropdown (Right) */}
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
            {Object.keys(columnsVisibility).map((column) => (
              <DropdownMenuCheckboxItem
                key={column}
                className="capitalize"
                checked={columnsVisibility[column as keyof typeof columnsVisibility]}
                onCheckedChange={(value) => handleColumnChange(column as keyof typeof columnsVisibility, value)}
                onSelect={(e) => e.preventDefault()}
              >
                {column}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columnsVisibility.LeadName && <TableHead borderCols>Lead Name</TableHead>}
              {columnsVisibility.ProspectStage && <TableHead borderCols>Prospect Stage</TableHead>}
              {columnsVisibility.OwnerIdName && <TableHead borderCols>Owner</TableHead>}
              {columnsVisibility.LeadMailID && <TableHead borderCols>Lead Mail ID</TableHead>}
              {columnsVisibility.Latest_Call && <TableHead borderCols>Latest Call</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                {columnsVisibility.LeadName && (
                  <TableCell borderCols>
                    <a href="#" className="text-blue-600 hover:underline">
                      {item.LeadName}
                    </a>
                  </TableCell>
                )}
                {columnsVisibility.ProspectStage && <TableCell borderCols>{item.ProspectStage}</TableCell>}
                {columnsVisibility.OwnerIdName && <TableCell borderCols>{item.OwnerIdName}</TableCell>}
                {columnsVisibility.LeadMailID && <TableCell borderCols>{item.LeadMailID}</TableCell>}
                {columnsVisibility.Latest_Call && <TableCell borderCols>{item.Latest_Call}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
