import { centralApiSlice } from "../../app/centralApiSlice";
import { UserDTO } from "../../app/types/types";

const apiSlice = centralApiSlice.injectEndpoints({
    endpoints: build => ({
        getAllUsers: build.query({
            query: () => 'api/users/AllUsers',
            providesTags: ['Users']
        }),
        getAllExistingUsers: build.query<UserDTO[], ''>({
            query: () => '/api/Users/AllExistingUsers',
            // transformResponse: (response: {data: User[]}) => response.data,
            providesTags: ['Users']
        }),
        getAllRemovedUsers: build.query<UserDTO[], ''>({
            query: () => '/api/Users/AllRemovedUsers',
            providesTags: ['Users']
        }),
        register: build.mutation({
            query: userInfo => ({
                url: "/api/Users/Register",
                method: "POST",
                body: userInfo,
            }),
            invalidatesTags: ['Users']
        }),
        editUser: build.mutation({
            query: userInfo => ({
                url: '/api/Users/EditUser',
                method: 'PUT',
                body: userInfo
            }),
            invalidatesTags: ['Users', 'User Activity']
        }),
        deleteUser: build.mutation({
            query: data => ({
                url: '/api/Users/RemoveUser',
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Users', 'User Activity']
        }),
        restoreUser: build.mutation({
            query: data => ({
                url: "/api/Users/RestoreUser",
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Users', 'User Activity']
        }),
    })
});

export const {
    useGetAllUsersQuery,
    useGetAllExistingUsersQuery,
    useGetAllRemovedUsersQuery,
    useRegisterMutation,
    useEditUserMutation,
    useDeleteUserMutation,
    useRestoreUserMutation,
} = apiSlice;