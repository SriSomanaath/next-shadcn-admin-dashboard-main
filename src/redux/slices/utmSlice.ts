import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UTMState {
    tables_and_pages: { [key: string]: string[] };
    utm_sources: string[];
    utm_mediums: string[];
    utm_campaigns: string[];
    [key: string]: any; // Add this line to allow indexing with a string
}

const initialState: UTMState = {
  tables_and_pages: {},
  utm_sources: [],
  utm_mediums: [],
  utm_campaigns: [],
  selectedDates: [], // Initially empty
};

const utmSlice = createSlice({
  name: "utm",
  initialState,
  reducers: {
    setUtmData: (state, action: PayloadAction<Omit<UTMState, "selectedDates">>) => {
      return { ...state, ...action.payload };
    },
    setSelectedDates: (state, action: PayloadAction<string[]>) => {
      state.selectedDates = action.payload;
    },
  },
});

export const { setUtmData, setSelectedDates } = utmSlice.actions;
export default utmSlice.reducer;
