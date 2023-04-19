import { centralApiSlice } from "../../app/centralApiSlice";

const apiSlice = centralApiSlice.injectEndpoints({
    endpoints: build => ({
        getAllMenus: build.query({
            query: () => '/api/Inventory/AllMenus'
        }),
        getAllAddOns: build.query({
            query: () => ({url: '/api/Inventory/AllAddOns'})
        }),
        getAllSizes: build.query({
            query: () => '/api/Inventory/AllSizes'
        }),
        getMenuPrices: build.query({
            query: () => '/api/Inventory/MenuPrices'
        }),
        postBill: build.mutation({
            query: orders => ({
                url: '/api/Sales/SalesOrders',
                method: 'POST',
                body: orders
            }),
            invalidatesTags: ['DailySales', 'MonthlySales']
        })
    })
})

export const { 
    useGetAllMenusQuery, 
    useGetAllAddOnsQuery,  
    useGetAllSizesQuery,
    useGetMenuPricesQuery,
    usePostBillMutation
} = apiSlice;