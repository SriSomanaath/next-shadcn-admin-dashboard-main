import { createSlice } from "@reduxjs/toolkit";

interface LeadActivityState {
    data: Record<string, any[]>; // Store data as key-value pairs
    loading: boolean;
    error: string | null;
    filters: {
      currentPage: number;
      perPage: number;
      selectedAgent: string | undefined;
      selectedCountryName: string | undefined;
      selectedProspect: string | undefined;
      dateRange: { startDate: string | null; endDate: string | null };
    };
  }
  
export const generateCacheKey = (filters: any) => {
    return JSON.stringify({
      page_num: filters.currentPage,
      per_page: filters.perPage,
      agent_email: filters.selectedAgent || null,
      from_date: filters.dateRange.startDate || null,
      to_date: filters.dateRange.endDate || null,
      country: filters.selectedCountryName || null,
      propect_stage: filters.selectedProspect || null,
    });
  };
  

const initialState: LeadActivityState = {
  data: {},
  loading: false,
  error: null,
  filters: {
    currentPage: 1,
    perPage: 10,
    selectedAgent: undefined,
    selectedCountryName: undefined,
    selectedProspect: undefined,
    dateRange: { startDate: null, endDate: null },
  },
};

const leadqaSlice = createSlice({
    name: "leadqa",
    initialState,
    reducers: {
      setFilters: (state, action) => {
        state.filters = { ...state.filters, ...action.payload };
      },
      setData: (state, action) => {
        const { key, data } = action.payload;
        state.data[key] = data; // Store data with the unique key
        state.loading = false;
        state.error = null;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
        state.loading = false;
      },
    },
  });
  

export const { setFilters, setData, setLoading, setError } = leadqaSlice.actions;
export default leadqaSlice.reducer;
