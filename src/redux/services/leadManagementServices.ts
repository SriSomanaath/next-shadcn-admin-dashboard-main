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
        return 'manage_users';
      },
    }),
    postlead: builder.mutation({
      query: ({userData}) => ({
        url: `manage_users_v2`,
        method: 'POST',
        body: userData,
      })
    }),
    getSheetNames: builder.query({
      query: () => "/get_sheet_names"
    }),
    getUsersForSheet: builder.query<{ data: any }, string>({
      query: (sheetName) => `/sheet_management?sheet_name=${encodeURIComponent(sheetName)}`,
    }),
    postSheetsUser: builder.mutation({
      query: ({ sheetName, userData }) => ({
        url: `sheet_management?sheet_name=${encodeURIComponent(sheetName)}`,
        method: 'POST',
        body: userData,
      })
    }),
    refreshUsers: builder.mutation({
      query: () => ({
        url: "/refresh",
        method: 'PUT',
      })
    }),
  }),
});

export const { useGetLeadsQuery, usePostleadMutation, useGetSheetNamesQuery, useGetUsersForSheetQuery, usePostSheetsUserMutation, useRefreshUsersMutation } = leadManagementApi;