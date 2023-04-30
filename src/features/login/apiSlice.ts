import { centralApiSlice } from "../../app/centralApiSlice";

const apiSlice = centralApiSlice.injectEndpoints({
    endpoints: build => ({
        addLoginActivity: build.mutation({
            query: userId => ({
                url: '/api/Auth/LoginActivity',
                method: 'POST',
                body: userId
            }),
            invalidatesTags: ['Login Activity']
        }),
        login: build.mutation({
            query: (userCredentials) => ({
                url: "/api/Auth/Login",
                method: "POST",
                body: userCredentials,
                // mode: 'cors'
                invalidatesTags: ['Login Activity']
            }),
        }),
    })
});

export const {
    useLoginMutation,
    useAddLoginActivityMutation,
} = apiSlice