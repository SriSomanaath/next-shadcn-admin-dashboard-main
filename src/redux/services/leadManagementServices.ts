import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '@/lib/auth';
import { LeadData } from '@/types/leadTypes';
import { getApiBaseUrl } from '../config';

const baseURL = `${getApiBaseUrl()}/lead_assignment`;

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: async (headers) => {
    try {
      const token = await getAccessToken();
      headers.set('Authorization', `Bearer ${token}`);
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return headers;
  },
});

export const leadManagementApi = createApi({
  reducerPath: 'leadManagementApi',
  baseQuery,
  endpoints: (builder) => ({
    getLeads: builder.query<LeadData, void>({
      query: () => {
        // Don't need to specify the full path, just the endpoint
        return 'manage_users';
      },
    }),
    getSheetNames: builder.query({
      query: () => "/get_sheet_names"
    }),
    getUsersForSheet: builder.query<{ data: any }, string>({
      query: (sheetName) => `/sheet_management?sheet_name=${encodeURIComponent(sheetName)}`,
    }),
  }),
});

export const { useGetLeadsQuery, useGetSheetNamesQuery, useGetUsersForSheetQuery } = leadManagementApi;