import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '@/lib/auth';
import { getApiBaseUrl } from '../config';

const baseURL = `${getApiBaseUrl()}`;

const baseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers, { getState }) => {
        try {
            const token = await getAccessToken();
            headers.set('Authorization', `Bearer ${token}`);
        } catch (error) {
            console.error('Error getting access token:', error);
        }
        return headers;
    },
});

export const MessagesApi = createApi({
    reducerPath: 'MessagesApi',
    baseQuery: baseQuery,
    tagTypes: ['User', 'SheetsUser'],
    endpoints: (builder) => ({
        // Webinar API Endpoints
        postFileStats: builder.mutation({
            query: ({ file }) => {
                const formData = new FormData();
                formData.append('file', file);

                return {
                    url: `/webinar_live_attended/obtain_minimum_attended_time`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        postAttendees: builder.mutation({
            query: ({ file, queryParams }) => {
                const queryString = new URLSearchParams(queryParams).toString();

                const formData = new FormData();
                formData.append('file', file);

                return {
                    url: `/webinar_live_attended/upload_report?${queryString}`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        postSmsStatsFile: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sms_stats_file",
                method: 'POST',
                body: data,
            }),
        }),
        getWebinarConfig: builder.query({
            query: () => "/sms/live_webinar_config",
        }),
        postAddLeads: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/add_sms_leads",
                method: 'POST',
                body: data,
            }),
        }),
        postDeleteLeads: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/delete_sms_leads",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
        postSmsWebinarStats: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sms_stats_webinar_time",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
        postScheduleMsg: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/schedule_msg",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
        postSmsSentStats: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sms_sent_stats",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
        postEnableSmsCountryCode: builder.mutation({
            query: (code) => ({
                url: "/sms/enable_sms_country_code",
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { code },
            }),
        }),
        postDisableSmsCountryCode: builder.mutation({
            query: (code) => ({
                url: "/sms/disable_sms_country_code",
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: { code },
            }),
        }),
        // Sales Campaign API Endpoints
        postSalesCampaignAddLeads: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sales_campaign_add_sms_leads",
                method: 'POST',
                body: data,
            }),
        }),
        postSalesCampaignDeleteLeads: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sales_campaign_delete_sms_leads",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
        postSalesCampaignStats: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sms_stats_sales_campaign_time",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
        postSalesCampaignScheduleMsg: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sales_campaign_schedule_msg",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
        postSalesCampaignSmsSentStats: builder.mutation({
            query: ({ data }) => ({
                url: "/sms/sales_campaign_sms_sent_stats",
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data,
            }),
        }),
    }),
});

export const {
    usePostFileStatsMutation,
    usePostAttendeesMutation,
    usePostSmsStatsFileMutation,
    useGetWebinarConfigQuery,
    usePostAddLeadsMutation,
    usePostDeleteLeadsMutation,
    usePostSmsSentStatsMutation,
    usePostScheduleMsgMutation,
    usePostSmsWebinarStatsMutation,
    usePostEnableSmsCountryCodeMutation,
    usePostDisableSmsCountryCodeMutation,
    usePostSalesCampaignAddLeadsMutation,
    usePostSalesCampaignDeleteLeadsMutation,
    usePostSalesCampaignSmsSentStatsMutation,
    usePostSalesCampaignScheduleMsgMutation,
    usePostSalesCampaignStatsMutation,
} = MessagesApi;