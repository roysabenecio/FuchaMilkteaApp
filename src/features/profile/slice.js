// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const putProfileInfoApi = createAsyncThunk('edit-profile', async(data) => {
//     axios.post(`http://localhost:9092/users/${data.id}`, data).then(response => {
//       console.log(response, 'response');
//     });
//   })

//   export const profileSlice = createSlice({
//     name: 'profile',
//     initialState: {
//       profileInfo: null,
//       fetchStatus: ''
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//       builder
//       .addCase(registerUser.fulfilled, (state, action) => {
//         console.log(state, 'state');
//         console.log(action, 'action');
//         // state.userInfo = action.payload.find(() => true);
//         // localStorage.setItem('userData', JSON.stringify(state.userInfo));
//         state.fetchStatus = 'success';
//       })
//       .addCase(registerUser.pending, (state) => {
//         state.fetchStatus = 'loading';
//       })
//       .addCase(registerUser.rejected, (state) => {
//         state.fetchStatus = 'error';
//       })
  
//     }
//   })
  
//   export const registerReducer = registerSlice.reducer;