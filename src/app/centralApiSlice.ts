import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const centralApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7280", // local SQL Server Connection
    // baseUrl: "https://fuchawebapp.azurewebsites.net",
    // credentials: 'same-origin',
    // prepareHeaders: (headers) => {
    //   headers.set('Accept', 'application/json');
    //   // const token = (getState() as RootState).auth.token;

    //   // // If we have a token set in state, let's assume that we should be passing it.
    //   // if (token) {
    //   //   headers.set("authorization", `Bearer ${token}`);
    //   // }
    //   console.log(headers)

    //   return headers;
    // },
  }),
  tagTypes: ['MonthlySales', 'DailySales', 'Users', 'Login Activity', 'User Activity'],
  endpoints: (build) => ({
    
    validateUsername: build.mutation({
      query: username => ({
        url: "/api/Users/ValidateUsername",
        method: "POST",
        body: username,
      })
    }),
    salesTransacInfo: build.query({
      query: () => "/api/Sales/AllSaleTransactions"
    }),
    //   getAllSizes: build.query({
    //     query: () =>({ url: "/api/Inventory/AllSizes"})
    // }),
  }),
});

export const {
  useValidateUsernameMutation,
  useSalesTransacInfoQuery,
  // useGetAllSizesQuery

} = centralApiSlice;