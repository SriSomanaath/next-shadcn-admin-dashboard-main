import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeadData } from '@/types/leadTypes';

interface LeadState {
  leads: LeadData | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeadState = {
  leads: null,
  loading: false,
  error: null,
};

export const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<LeadData>) => {
      state.leads = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLeads, setLoading, setError } = leadSlice.actions;
export default leadSlice.reducer;
