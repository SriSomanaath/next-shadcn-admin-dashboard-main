import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '@/lib/auth';
import { getApiBaseUrl } from '../config';

const baseURL = `${getApiBaseUrl()}/utm_backend/`;

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

const formatDate = (dateString:any) => {
  const [yyyy, mm, dd] = dateString.split('-');
  return `${yyyy}-${mm}-${dd}`;
};

const convertObjectToQueryString = (obj: any) => {
  const query = new URLSearchParams();

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      if (key === "dates") {
        obj[key].forEach((date: any) => query.append(key, formatDate(date)));
      } else {
        obj[key].forEach((value: any) => query.append(key, value));
      }
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Handle nested objects (e.g., tables_and_pages)
      Object.entries(obj[key]).forEach(([nestedKey, nestedValues]: [string, any]) => {
        if (Array.isArray(nestedValues)) {
          nestedValues.forEach((nestedValue) =>
            query.append(key, `${nestedKey}, ${nestedValue}`)
          );
        } else {
          query.append(key, `${nestedKey}, ${nestedValues}`);
        }
      });
    } else {
      query.append(key, obj[key]);
    }
  }

  return query.toString().replace(/\+/g, "%20");
};


export const urmTrackerServiceApi = createApi({
  reducerPath: 'urmTrackerServiceApi',
  baseQuery,
  endpoints: (builder) => ({
    utmGetCounts: builder.mutation({
      query: (userData) => {
        const queryString = convertObjectToQueryString(userData);
        return {
          url: `/get_counts?${queryString}`,
          method: 'GET',
        };
      },
    }),
    utmGetDistinct: builder.mutation({
      query: (params) => {
        const query = new URLSearchParams();
        params.forEach((param:any) => query.append('fetch', param));
        return {
          url: `/get_distincts?${query.toString()}`,
          method: 'GET',
        };
      },
    }),
  })
});

export const { useUtmGetCountsMutation, useUtmGetDistinctMutation } = urmTrackerServiceApi;
