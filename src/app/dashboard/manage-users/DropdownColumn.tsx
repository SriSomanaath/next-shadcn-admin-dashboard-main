"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check, Edit, Loader2, LoaderCircle, X } from "lucide-react";
interface DropdownColumnProps {
  row: any;
  columnKey: string;
  handleSubmitChanges?: any;
  isLoading: boolean;
}

const DropdownColumn: React.FC<DropdownColumnProps> = ({ row, columnKey, handleSubmitChanges, isLoading }) => {
  const isAssignmentDisabled = row.original["ASSIGNMENT_STATUS"]?.["ENABLED"] === false;

  const selectedItems = Object.entries(row.original[columnKey] || {})
    .filter(([_, value]) => value)
    .map(([subKey]) => subKey);

  console.log("row.original[columnKey]", row.original["ASSIGNMENT_STATUS"]?.["ENABLED"]);

  const getColor = (item: string) => {
    if (columnKey === "ELIGIBLE_GROUPS_PROFESSIONAL" || columnKey === "ELIGIBLE_GROUPS_STUDENT") {
      return "border border-[#5c97c2] bg-[#f0f6fe] text-[#7c54cf]";
    }
    return "border border-gray-100 text-gray-700";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex gap-1 text-[0.65rem] whitespace-nowrap ${isAssignmentDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {selectedItems.length > 0 ? (
            <div className="flex gap-1">
              {selectedItems.map((item, index) => (
                <span key={index} className={`px-2 py-[0.6px] rounded-xl ${getColor(item)}`}>
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">Select...</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto no-scrollbar">
        {Object.entries(row.original[columnKey] || {}).map(([subKey, subValue]) => (
          <DropdownMenuCheckboxItem
            key={subKey}
            checked={!!subValue}
            onCheckedChange={(value) => {
              // Prevent updating if disabled
              if (isAssignmentDisabled) return;
              const updatedData = { ...row.original[columnKey], [subKey]: value };
              row.original[columnKey] = updatedData;
              handleSubmitChanges(row.original["mail_id"], { [columnKey]: { [subKey]: value } });
            }}
            onSelect={(e) => e.preventDefault()}
            className={isAssignmentDisabled ? "cursor-not-allowed" : ""}
          >
            {subKey}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SelectColumn: React.FC<DropdownColumnProps> = ({
  row,
  columnKey,
  handleSubmitChanges,
  isLoading,
}) => {
  console.log("SelectColumnisLoading", isLoading);
  const initialValue =
    columnKey === "ASSIGNMENT_STATUS"
      ? Object.entries(row.original[columnKey] || {}).find(([_, value]) => value)?.[0] || ""
      : row.original[columnKey] || "";

  const [selectedValue, setSelectedValue] = useState(initialValue);

  // Sync local state with prop changes
  useEffect(() => {
    setSelectedValue(
      columnKey === "ASSIGNMENT_STATUS"
        ? Object.entries(row.original[columnKey] || {}).find(([_, value]) => value)?.[0] || ""
        : row.original[columnKey] || ""
    );
  }, [row.original[columnKey], columnKey]);

  const handleChange = (value: string) => {
    // If loading, do not allow changes
    if (isLoading) return;
    // Update local state immediately
    setSelectedValue(value);

    let updatedData;
    if (columnKey === "ASSIGNMENT_STATUS") {
      // Build an object where the selected value is true and all others are false.
      const currentOptions = Object.keys(row.original[columnKey] || {});
      updatedData = currentOptions.reduce((acc, option) => {
        acc[option] = option === value;
        return acc;
      }, {} as Record<string, boolean>);

      // Update the row data
      row.original[columnKey] = updatedData;
      // Send only the selected option which becomes true
      handleSubmitChanges(row.original["mail_id"], { [columnKey]: value });
    } else {
      updatedData = value;
      row.original[columnKey] = updatedData;
      handleSubmitChanges(row.original["mail_id"], { [columnKey]: updatedData });
    }
  };

  // Define options dynamically for ASSIGNMENT_STATUS or TEAM
  const options =
    columnKey === "ASSIGNMENT_STATUS"
      ? Object.keys(row.original[columnKey] || {})
      : columnKey === "TEAM"
        ? ["EUROPE", "ROW", "US"]
        : [];

  return (
    <Select onValueChange={handleChange} value={selectedValue}>
      <SelectTrigger className="w-[11rem] text-[0.65rem] focus:ring-0">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <SelectValue placeholder="Select..." />
          </div>
        ) : (
          <SelectValue placeholder="Select..." />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className="text-[0.65rem] focus:ring-0">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const getTeamColor = (value: string) => {
  return value === "EUROPE" ? "bg-[#daf4fc] border border-[#96ddf1] text-[#1e5d6f]" :
    value === "US" ? "bg-[#f5eeff] border border-[#d1aeff] text-[#7346d1]" :
      value === "ROW" ? "bg-green-100 border border-green-400 text-green-700" : "";
};

const renderTeamColumn = (row: any, key: string) => {
  const value = row.original[key];
  return (
    <span className={`px-2 py-[0.6px] rounded-xl text-[0.65rem] ${getTeamColor(value)}`}>
      {value}
    </span>
  );
};

const SHEET_NAMES = [
  "AI 100 Day",
  "Black Friday Signup",
  "CVDL_Enquiry",
  "CareerX",
  "Courses Certificates",
  "Curriculum",
  "Decision",
  "Download Brochure",
  "Free Courses",
  "Inquiry",
  "OpenCV University Abandond Cart",
  "Organization",
  "Program Upgrade",
  "Student Certified",
  "Students",
  "Upsell C0",
  "Waitlist",
  "Webinar Live Attended",
  "Webinar-Fuel",
];

const renderSheetsColumn = (row: any, key: string, handleSubmitChanges: any, isLoading: boolean) => {
  const [selectedSheets, setSelectedSheets] = useState<string[]>(row.original[key] || []); ``

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex gap-1 text-[0.65rem] whitespace-normal overflow-hidden">
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {selectedSheets.length > 0 ? (
            <div className="flex gap-1 overflow-hidden">
              {selectedSheets.map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-[0.6px] rounded-xl text-[0.65rem] bg-[#daf4fc] border border-[#96ddf1] text-[#1e5d6f] whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">Select...</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto no-scrollbar">
        {SHEET_NAMES.map((sheet, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={selectedSheets.includes(sheet)}
            onCheckedChange={(checked) => {
              const newSelection = checked
                ? [...selectedSheets, sheet]
                : selectedSheets.filter((s) => s !== sheet);

              setSelectedSheets(newSelection);
              row.original[key] = newSelection;

              // Send updated data for this column
              handleSubmitChanges(row.original["mail_id"], { sheet }, true);
            }}
            onSelect={(e) => e.preventDefault()}
          >
            {sheet}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface InputColumnProps {
  row: any;
  columnKey: string;
  handleSubmitChanges: (mail: string, updatedColumnData: any) => void;
  isLoading: boolean;
}

const InputColumn: React.FC<InputColumnProps> = ({
  row,
  columnKey,
  handleSubmitChanges,
  isLoading,
}) => {
  const mail = row.original["mail_id"]; // assume mail_id exists in row.original
  const initialValue = row.original[columnKey] || "";
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  // Sync with external updates
  useEffect(() => {
    setValue(row.original[columnKey] || "");
  }, [row.original[columnKey]]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Update row data
    const updatedData = { [columnKey]: value };
    row.original[columnKey] = value;
    await handleSubmitChanges(mail, updatedData);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 focus:ring-0">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={!isEditing || isLoading}
        className="w-full !text-[0.75rem] min-w-[10rem] !focus:ring-0"
      />
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
      ) : (
        !isEditing ? (
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-2 w-2 text-gray-500" />
          </Button>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )
      )}
    </div>
  );
};

const TableColumns = { SelectColumn, DropdownColumn, renderTeamColumn, renderSheetsColumn, getTeamColor, InputColumn };
export default TableColumns;