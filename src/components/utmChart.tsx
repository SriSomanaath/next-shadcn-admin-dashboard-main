import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { Tooltip as RechartsTooltip } from "recharts";

// Predefined Colors for Consistent Styling
const predefinedColors = [
  "#1E90FF", "#e5598c", "#FF4500", "#00CED1", "#7FFF00", "#8A2BE2", "#800080", "#FFD700", "#40E0D0", "#FF6347",
  "#6495ED", "#FF69B4", "#4682B4", "#20B2AA", "#DAA520", "#8B008B", "#228B22", "#800000", "#4169E1", "#FFA07A",
  "#FF7F50", "#00FA9A", "#32CD32", "#00FF7F", "#9932CC", "#00FF00", "#FF1493", "#7CFC00", "#9370DB", "#00FFFF",
  "#B22222", "#ADFF2F", "#FA8072", "#FFE4B5", "#00FFFF", "#FF8C00", "#FAEBD7", "#556B2F", "#FF4500", "#00FF00",
  "#FFD700", "#8B008B", "#000080", "#FF69B4", "#808000", "#20B2AA", "#B0C4DE", "#FF8C00", "#7B68EE", "#8A2BE2",
  "#BC8F8F", "#FF6347", "#20B2AA", "#F08080", "#4682B4", "#B8860B", "#8B0000", "#D8BFD8", "#8FBC8F"
];

const ChartStyle = ({ id, config = {} }: { id: string; config?: ChartConfig }) => {
  const colorConfig = Object.entries(config || {}).filter(([_, value]) => value?.color);
}

const assignColor = (index: number) => predefinedColors[index % predefinedColors.length];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "4px 8px",
          color: "#1e1e1e",
          border: "#f5f5f5",
          borderRadius: "10px",
          boxShadow: "6px 6px 6px rgba(76, 75, 75, 0.1)",
          fontSize: "0.7rem",
          textAlign: "left",
          maxWidth: "200px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "800", fontSize: "0.7rem" }}>{label}</p>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {payload.map((data: any) => (
            <li
              key={data.dataKey}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "2px 0",
                color: "#1e1e1e", // Slightly dark text for contrast
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "15px",
                  backgroundColor: data.stroke,
                  marginRight: "8px",
                  display: "inline-block",
                  borderRadius: "15px",
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  color: "#737373", // Slightly lighter text color for readability
                }}
              >
                {data.dataKey}:
              </span>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  color :"#1e1e1e", // Matching color for the number
                }}
              >
                {data.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

const UtmChart = ({ chartParams = [] }: { chartParams?: any[] }) => {
  const [timeRange, setTimeRange] = React.useState("90d");

  // Transform Data
  const transformedData = React.useMemo(() => {
    if (!chartParams || !Array.isArray(chartParams)) return [];

    return chartParams.map((item) => {
      // Dynamically concatenate all relevant keys into the label
      const label = Object.keys(item)
        .filter(key => key !== 'dates' && key !== 'count') // Exclude 'dates' and 'count' from the label
        .map(key => `${item[key]}`) // Convert each value to string
        .join(" - "); // Join the values with a separator (e.g., dash, comma, or space)

      return {
        date: item.dates ? new Date(item.dates).toISOString().split("T")[0] : null,
        count: Math.max(item.count ?? 0, 0), // Ensure count is never below zero
        label: label, // Dynamically created label
      };
    }).filter((item) => item.date); // Remove null dates
  }, [chartParams]);

  // Convert `Set` to an array before mapping
  const uniqueLabels = Array.from(new Set(transformedData.map((item) => item.label)));

  // Convert Data into Multi-Line Format for Stacking
  const groupedData = transformedData.reduce((acc, item) => {
    const existing = acc.find((d) => d.date === item.date);
    if (existing) {
      existing[item.label] = item.count;
    } else {
      acc.push({ date: item.date, [item.label]: item.count });
    }
    return acc;
  }, [] as Record<string, any>[]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>Showing data for the selected time range</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{ count: { label: "Count", color: "#1E90FF" } }}
          className="aspect-auto h-[250px] w-full">
          <AreaChart data={groupedData}>
            <defs>
              {uniqueLabels.map((label, index) => (
                <linearGradient key={label} id={`fill-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={assignColor(index)} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={assignColor(index)} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={false} />
            {uniqueLabels.map((label, index) => (
              <Area
                key={label}
                dataKey={label} // ✅ Ensure unique dataKey
                type="natural"
                strokeWidth={2}
                stroke={assignColor(index)}
                fillOpacity={0.1}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>

        {/* Custom Legend at the bottom */}
        <ChartLegend>
          <ChartLegendContent>
            {uniqueLabels.map((label, index) => (
              <div key={label} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: assignColor(index),
                    marginRight: "8px",
                    display: "inline-block",
                  }}
                />
                <span>{label}</span>
              </div>
            ))}
          </ChartLegendContent>
        </ChartLegend>
      </CardContent>
    </Card>
  );
};

export default UtmChart;
