"use client";

import * as React from "react";
import SidebarDropdowns from "@/components/sidebarDropDowns";
import { useUtmGetCountsMutation } from "@/redux/services/utmTrackerServices";
import UtmChart from "@/components/utmChart";
import { useState } from "react";
import { SelectedParamsData } from "@/types/utmType";

const Page = () => {
  const [params, setParamsData] = useState<SelectedParamsData>({
    dates: [],
    tables_and_pages: {},
    utm_sources: [],
    utm_mediums: [],
    utm_campaigns: [],
  });

  const [tempParams, setTempParams] = useState<any[]>([]); // Ensure it's always an array

  const [fetchParamCounts, { isLoading, isError, data, error }] = useUtmGetCountsMutation();

  const handleSubmit = async () => {
    console.log("params", params);
    try {
      const response = await fetchParamCounts(params);
  
      if (response) {
        setTempParams(response.data.data); // Only set the `data` array
        console.log("Response Data:", response.data.data);
      } else {
        setTempParams([]); // Default empty array if data is missing
        console.error("Invalid API Response:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTempParams([]); // Prevent app crash by setting empty array on error
    }
  };  

  return (
    <div>
      <div className="flex h-screen border-t">
        {/* Sidebar */}
        <aside className="w-64 text-color flex flex-col space-y-2 -ml-2 border-r border-gray-200 bg-white">
          <nav className="space-y-1">
            <SidebarDropdowns handleSubmit={handleSubmit} params={params} setParamsData={setParamsData} />
          </nav>
        </aside>

        {/* Chart Content */}
        <main className="flex-1 bg-white text-black p-6">
          <UtmChart chartParams={tempParams} />
        </main>
      </div>
    </div>
  );
}

export default Page;