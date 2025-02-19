import * as React from "react";
import { useState, useEffect } from "react";
import { useUtmGetDistinctMutation } from "@/redux/services/utmTrackerServices";
import { DateRange } from "react-day-picker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format, eachDayOfInterval } from "date-fns";
import { ChevronDown, FileSpreadsheet, Globe, Layers, Tag, Users, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedDates, setUtmData } from "@/redux/slices/utmSlice";
import { SelectedParamsData } from "@/types/utmType";
import { DateRangePicker } from "./date-range-picker";

interface SidebarDropdownsProps {
  params: SelectedParamsData;
  handleSubmit: () => void;
  setParamsData: any;
}

const SidebarDropdowns: React.FC<SidebarDropdownsProps> = ({ params, handleSubmit, setParamsData }) => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const utmSliceData = useSelector((state: RootState) => state.utm);
  const selectedDates = useSelector((state: RootState) => state.utm.selectedDates);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);
  const [fetchDataKeys] = useUtmGetDistinctMutation();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch UTM data only if it's empty in Redux store
  useEffect(() => {
    if (
      Object.keys(utmSliceData.tables_and_pages).length === 0 &&
      utmSliceData.utm_sources.length === 0 &&
      utmSliceData.utm_mediums.length === 0 &&
      utmSliceData.utm_campaigns.length === 0
    ) {
      const handleUtmKeys = async () => {
        try {
          const response = await fetchDataKeys([
            "tables_and_pages",
            "utm_sources",
            "utm_mediums",
            "utm_campaigns",
          ]).unwrap();
          dispatch(setUtmData(response.data)); // Store UTM data in Redux
          console.log("Fetched UTM Data:", response.data);
        } catch (error) {
          console.log("Error fetching UTM data:", error);
        }
      };
      handleUtmKeys();
    }
  }, [dispatch, utmSliceData, fetchDataKeys]);

  // Store selected date range in Redux and `setParamsData`
  useEffect(() => {
    const getAllDatesInRange = (start: Date, end: Date) => {
      return eachDayOfInterval({ start, end }).map((date) =>
        format(date, "yyyy-MM-dd")
      );
    };

    if (selectedRange?.from && selectedRange?.to) {
      const dateArray = getAllDatesInRange(selectedRange.from, selectedRange.to);
      dispatch(setSelectedDates(dateArray)); // Store dates in Redux

      setParamsData((prev:any) => ({
        ...prev,
        dates: dateArray, // Update `setParamsData`
      }));

      console.log("Updated Selected Dates:", dateArray);
    }
  }, [selectedRange, dispatch, setParamsData]);

  const handleSelectionChange = (
    key: keyof SelectedParamsData,
    value: string[] | Record<string, string[]>,
    parentKey?: string
  ) => {
    setParamsData((prev: any) => {
      const shouldUpdateUTM = Object.keys(value).some((k) =>
        ["utm_sources", "utm_mediums", "utm_campaigns"].includes(k)
      );
  
      if (shouldUpdateUTM) {
        return {
          ...prev,
          ...Object.entries(value).reduce((acc, [k, v]) => {
            if (["utm_sources", "utm_mediums", "utm_campaigns"].includes(k)) {
              const newValues = Array.isArray(v) ? v : [];
              acc[k] = Array.isArray(prev[k])
                ? Array.from(new Set([...prev[k], ...newValues])) // ✅ Fix
                : newValues;
            }
            return acc;
          }, {} as Record<string, string[]>),
        };
      }
  
      return {
        ...prev,
        tables_and_pages: {
          ...(prev.tables_and_pages || {}),
          ...(parentKey ? { [parentKey]: value } : (value as Record<string, string[]>)),
        },
      };
    });
  };

  const renderDropdown = (
    key: keyof SelectedParamsData,
    options: string[] | Record<string, string[]>,
    Icon: React.ElementType,
    parentKey?: string
  ) => {
    if (typeof options === "object" && !Array.isArray(options)) {
      return Object.keys(options).map((parentKey) => (
        <div key={parentKey} className="space-y-2">
          {renderDropdown(parentKey as keyof SelectedParamsData, options[parentKey] || [], Layers, parentKey)}
        </div>
      ));
    }

    // console.log("DBG:renderDropDown", key)
  
    return (
      <DropdownMenu onOpenChange={(open) => setOpenDropdown(open ? (key as string) : null)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="md"
            className="w-full !justify-between px-5 mb-1 rounded-none text-gray-600 relative"
          >
            <Icon className="!h-4 !w-4" />
            {parentKey ? `${parentKey} > ${String(key)}` : String(key).replace("_", " ")}
            <ChevronDown
              className={`ml-auto transition-transform duration-200 ${
                openDropdown === key ? "rotate-0" : "-rotate-90"
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-60 max-h-60 overflow-y-auto absolute text-gray-600 whitespace-normal break-words"
        >
          <DropdownMenuCheckboxItem
            checked={
              params.tables_and_pages[parentKey || key]?.length === (options as string[]).length
            }
            onCheckedChange={(checked) => {
              handleSelectionChange(
                "tables_and_pages", // Ensure this goes inside tables_and_pages
                {
                  ...params.tables_and_pages,
                  [parentKey || key]: checked ? [...(options as string[])] : [],
                }
              );
            }}            
          >
            All
          </DropdownMenuCheckboxItem>
          {(options as string[]).map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={params.tables_and_pages[parentKey || key]?.includes(option)}
              onCheckedChange={(checked) => {
                const updatedValues = checked
                  ? [...(params.tables_and_pages[parentKey || key] || []), option]
                  : (params.tables_and_pages[parentKey || key] || []).filter((item) => item !== option);
              
                handleSelectionChange(
                  "tables_and_pages",
                  {
                    ...params.tables_and_pages,
                    [parentKey || key]: updatedValues,
                  }
                );
              }}              
              className="text-[0.8rem]"
            >
              {option.replace(/[^a-zA-Z0-9]/g, " ")}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-1 pr-2 mt-2">
      <DateRangePicker selectedRange={selectedRange} onChangeRange={setSelectedRange} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="md"
            className="w-full !justify-between px-5 mb-1 rounded-none text-gray-600"
          >
            <FileSpreadsheet className="!h-4 !w-4" /> tables & pages{" "}
            <ChevronDown className="ml-auto transition-transform duration-200 -rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 max-h-60 overflow-y-auto absolute right-0 whitespace-normal break-words"
        >
          {Object.keys(utmSliceData.tables_and_pages).map((parentKey) => (
            <div key={parentKey} className="space-y-2">
              {renderDropdown(parentKey, utmSliceData.tables_and_pages[parentKey] || [], Layers)}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="space-y-1">
        {[
          { key: "utm_sources", icon: Globe },
          { key: "utm_mediums", icon: Users },
          { key: "utm_campaigns", icon: Tag },
        ].map(({ key, icon }) => (
          <div key={key}>{renderDropdown(key as keyof SelectedParamsData, utmSliceData[key] || [], icon)}</div>
        ))}
      </div>

      <Button
        onClick={() => {
          setLoading(true);
          handleSubmit();
          setTimeout(() => setLoading(false), 2000); // Simulate API delay
        }}
        variant="outline"
        size="default"
        className="w-full pb-1 mx-1 bg-[#f4fbfe] text-[#1e1e1e]"
        disabled={loading}
      >
        {loading ? <Loader className="animate-spin mr-2" /> : null} Submit
      </Button>
    </div>
  );
};

export default SidebarDropdowns;
