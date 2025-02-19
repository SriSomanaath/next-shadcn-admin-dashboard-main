import { getAccessToken } from '@/lib/auth';
import { getApiBaseUrl } from '../config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = `${getApiBaseUrl()}`;

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

export const leadqaApi = createApi({
  reducerPath: 'leadqaApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getleadqa: builder.mutation({
        query: (lead_id) => ({
          url: `/calls_qa/get_lead_qa?lead_id=${lead_id}`,  // Adjust endpoint as needed
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      }),
    getleadqaRecordActivities: builder.mutation({
      query: (lead_id) => ({
        url: `/leads_calls_activity_ui/get_lead_activities?lead_id=${lead_id}`,  // Adjust endpoint as needed
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getOwnerDetails: builder.mutation({
      query: () => ({
        url: `/leads_calls_activity_ui/get_owner_emails`,
        method: 'GET',
      }),
    }),
    getCountryDetails: builder.mutation({
      query: () => ({
        url: `/leads_calls_activity_ui/get_countries`,
        method: 'GET',
      }),
    }),
    getProspectDetails: builder.mutation({
      query: () => ({
        url: `/leads_calls_activity_ui/get_prospect_stage_list`,
        method: 'GET',
      }),
    }),
    getleadqaLeadId: builder.mutation({
      query: (lead_ID) => ({
        url: `/leads_calls_activity_ui/search_lead_by_email?email_addr=${encodeURIComponent(lead_ID)}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
       
    getLeadqaActivity: builder.mutation({
      query: ({ page_num, per_page, agent_email, from_date, to_date, country, propect_stage }: 
        { page_num: number; per_page: number; agent_email?: string; from_date?: string; to_date?: string, country?: string; propect_stage?: string; }) => ({
          url: `/leads_calls_activity_ui/get_lead_calls_details?${new URLSearchParams({
            page_num: page_num.toString(),
            per_page_records: per_page.toString(),
            ...(agent_email ? { agent_email } : {}),
            ...(from_date ? { from_date } : {}),
            ...(to_date ? { to_date } : {}),
            ...(country ? { country } : {}),
            ...(propect_stage ? { propect_stage } : {}),
          }).toString()}`,
          method: 'GET',
        }),
    }),    
    updateleadqa: builder.mutation({
        query: (lead_id) => ({
          url: '/calls_qa/perform_auto_qa_for_lead',
          method: 'PUT',
          body: lead_id,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
    }),
    postManualQA: builder.mutation({
        query: (lead_id) => ({
          url: '/calls_qa/save_manual_qa',
          method: 'POST',
          body: lead_id,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
    }),
  }),
});

export const { useGetleadqaMutation, useGetleadqaRecordActivitiesMutation, useGetOwnerDetailsMutation, useGetCountryDetailsMutation, useGetleadqaLeadIdMutation, useGetProspectDetailsMutation, useGetLeadqaActivityMutation, useUpdateleadqaMutation, usePostManualQAMutation } = leadqaApi;
