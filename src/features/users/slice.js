import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../api";

export const getAllUsersInfoApi = createAsyncThunk('get-all-users-info', async () => {
    const res = await axios.get(`${BASE_URL}/api/Users/AllUsers`);
    return res.data;
});

export const postUserInfoApi = createAsyncThunk('post-user-info', async (data) => {
  data = {...data, userStatus: 'Pending'};
    return await axios.post(`${BASE_URL}/api/Users/RegisterUser/`, data).catch(error => {
        console.log(error.message, '--ERROR MESSAGE');
    }).then(response => {
        return response.data;
    });
});

export const putUserInfoApi = createAsyncThunk('put-user-info', async (data) => {
    return await axios.put(`${BASE_URL}/api/Users/EditUser/`, data)
    .catch(error => {
        console.log(error.message, '--ERROR MESSAGE');
    })
    .then(response => {
        return response.data;
    });
});

export const putProfileInfoApi = createAsyncThunk('put-profile-info', async (data) => {
    return await axios.put(`${BASE_URL}/api/Users/EditProfile/${data.id}`, data)
    .catch(error => {
        console.log(error.message, '--ERROR MESSAGE');
    })
    .then(response => {
        return response.data;
    });
});

export const removeUserInfoApi = createAsyncThunk('remove-user-info', async (data) => {
    return await axios.put(`${BASE_URL}/api/Users/RemoveUser/`, data)
    .catch(error => {
        console.log(error.message, '--ERROR MESSAGE');
    })
    .then(response => {
        return response.data;
    });
});

export const restoreUserInfoApi = createAsyncThunk('restore-user-info', async (data) => {
    return await axios.put(`${BASE_URL}/api/Users/RestoreUser/`, data)
    .catch(error => {
        console.log(error.message, '--ERROR MESSAGE');
    })
    .then(response => {
        return response.data;
    });
});

export const usersSlice = createSlice({
    name: 'users',
    initialState: {
        usersInfo: null,
        profileStatus: null,
        fetchStatus: ''
    },
    reducers: {
        clearProfileStatus: (state, action) => {
            state.profileStatus = null;
        }
    },
    extraReducers: {
        [getAllUsersInfoApi.fulfilled]: (state, action) => {
            state.usersInfo = action.payload;
            // state.fetchStatus = 'success';
        },
        [getAllUsersInfoApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [getAllUsersInfoApi.rejected]: (state, action) => {
            state.fetchStatus = 'loading';
        },

        [postUserInfoApi.fulfilled]: (state, action) => {
            state.usersInfo.push(action.payload);
            state.fetchStatus = 'success';
        },
        [postUserInfoApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [postUserInfoApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [putUserInfoApi.fulfilled]: (state, action) => {
            const index = state.usersInfo.findIndex((object) => {
                return object.id === action.payload.id
            });
            state.usersInfo.splice(index, 1, action.payload);
            state.fetchStatus = 'success';
        },
        [putUserInfoApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [putUserInfoApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [putProfileInfoApi.fulfilled]: (state, action) => {
            state.profileStatus = action.payload;
            state.fetchStatus = 'success';
        },
        [putProfileInfoApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [putProfileInfoApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [removeUserInfoApi.fulfilled]: (state, action) => {
            if (action.payload == true){
                const index = state.usersInfo.findIndex((object) => {
                    return object.id === action.payload.id
                });
                state.usersInfo.splice(index, 1);
            }
            state.fetchStatus = 'success';
        },
        [removeUserInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [removeUserInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },
        [restoreUserInfoApi.fulfilled]: (state, action) => {
            const index = state.usersInfo.findIndex((object) => {
                return object.id === action.payload.id
            });
            // state.usersInfo.splice(index, 1);
            state.fetchStatus = 'success';

        },
        [restoreUserInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [restoreUserInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },
    }
});

export const usersReducer = usersSlice.reducer;

export const { getDeleteStatus, clearProfileStatus } = usersSlice.actions;