import { centralApiSlice } from "../../app/centralApiSlice";

const apiSlice = centralApiSlice.injectEndpoints({
    endpoints: build => ({
        getLoginActivities: build.query({
            query: () => '/api/History/AllLoginHistory',
            providesTags: ['Login Activity']
        }),
        getActivityHistory: build.query({
            query: () => '/api/History/AllActivityHistory',
            providesTags: ['User Activity']
        })
        
    })
});

export const {
    useGetLoginActivitiesQuery,
    useGetActivityHistoryQuery,
} = apiSlice