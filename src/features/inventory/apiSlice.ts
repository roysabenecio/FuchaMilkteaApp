import { centralApiSlice } from "../../app/centralApiSlice";

const apiSlice = centralApiSlice.injectEndpoints({
    endpoints: build => ({
        getStockInfo: build.query({
            query: () => '/api/Inventory/AllStocks'
        })
    })
})

export const { 
    useGetStockInfoQuery,
} = apiSlice;