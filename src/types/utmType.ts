export interface SelectedParamsData {
    dates: string[];
    tables_and_pages: { [key: string]: string[] }; // Nested object for tables_and_pages
    utm_sources: string[];
    utm_mediums: string[];
    utm_campaigns: string[];
    [key: string]: any; // Add index signature to allow access by any string key
  }

export type ParamKey = "dates" | "tables_and_pages" | "utm_sources" | "utm_mediums" | "utm_campaigns";
 