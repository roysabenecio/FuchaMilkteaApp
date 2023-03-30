import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    baseQuery: fetchBaseQuery({
        // baseUrl: 'https://localhost:7280'; // local SQL Server Connection
        baseUrl: 'https://fuchawebapp.azurewebsites.net'
    }),
    endpoints: build => ({})
});