import { createSlice } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        usersInfo: null,
        profileStatus: null,
        fetchStatus: ''
    },
    reducers: {
        clearProfileStatus: (state ) => {
            state.profileStatus = null;
        }
    },
    
});

export const usersReducer = usersSlice.reducer;

export const { clearProfileStatus } = usersSlice.actions;