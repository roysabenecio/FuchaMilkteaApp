import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';

export const apiSlice = createApi({
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
  endpoints: (build) => ({
    login: build.mutation({
      query: (userCredentials) => ({
        url: "/api/Auth/LoginUser",
        method: "POST",
        body: userCredentials,
        // mode: 'cors'
      }),
    }),
  }),
});

export const { useLoginMutation } = apiSlice;