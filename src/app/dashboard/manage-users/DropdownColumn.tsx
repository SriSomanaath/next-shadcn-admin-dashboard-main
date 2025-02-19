import { 
    DropdownMenu, 
    DropdownMenuCheckboxItem, 
    DropdownMenuContent, 
    DropdownMenuTrigger 
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  
  interface DropdownColumnProps {
    row: any;
    columnKey: string;
  }
  
  const DropdownColumn: React.FC<DropdownColumnProps> = ({ row, columnKey }) => {
    const selectedItems = Object.entries(row.original[columnKey] || {})
      .filter(([_, value]) => value) // Get only selected items
      .map(([subKey]) => subKey); // Extract the key names
  
    // Define color mapping for different keys
    const getColor = (item: string) => {
      if (columnKey === "ASSIGNMENT_STATUS") {
        return item === "ENABLED" ? "border border-green-400 text-green-600" :
               item === "ALL_GROUPS" ? "border border-blue-400 text-blue-600" :
               "bg-red-100 text-red-700"; // DISABLED
      } 
      if (columnKey === "ELIGIBLE_GROUPS_PROFESSIONAL" || columnKey === "ELIGIBLE_GROUPS_STUDENT") {
        return "border border-[#5c97c2] bg-[#f0f6fe] text-[#7c54cf]";
      }
      return "border border-gray-100 text-gray-700"; // Default color
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex gap-1 text-[0.65rem] whitespace-nowrap">
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
        <DropdownMenuContent align="end">
          {Object.entries(row.original[columnKey] || {}).map(([subKey, subValue]) => (
            <DropdownMenuCheckboxItem
              key={subKey}
              checked={!!subValue}
              onCheckedChange={(value) => {
                row.original[columnKey][subKey] = value;
              }}
              onSelect={(e) => e.preventDefault()}
            >
              {subKey}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
    
    const renderSheetsColumn = (row: any, key: string) => {
      const value = row.original[key] as string[];
      return (
        <div className="flex gap-1">
          {value?.length ? (
            value.map((sheet, index) => (
              <span
                key={index}
                className="px-2 py-[0.6px] rounded-xl text-[0.65rem] bg-[#daf4fc] border border-[#96ddf1] text-[#1e5d6f] whitespace-nowrap"
              >
                {sheet}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No sheets assigned</span>
          )}
        </div>
      );
    };
  
  const TableColumns = { DropdownColumn, renderTeamColumn, renderSheetsColumn, getTeamColor };
  export default TableColumns;
  