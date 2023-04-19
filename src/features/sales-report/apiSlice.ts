import { centralApiSlice } from "../../app/centralApiSlice";

const apiSlice = centralApiSlice.injectEndpoints({
    endpoints: build => ({
        getCurrentYearMonthlySales: build.query({
            query: () => 'api/Sales/CurrentYearMonthlyTransactions',
            providesTags: ['MonthlySales']
        }),
        getDailySales: build.query({
            query: () => 'api/Sales/DailySales',
            providesTags: ['DailySales']
        }),
    })
})

export const { 
    useGetCurrentYearMonthlySalesQuery,
    useGetDailySalesQuery
} = apiSlice;