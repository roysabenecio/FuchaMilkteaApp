// import axios from 'axios';

// //ACTION TYPE
// const SAMPLE_ACTION_GET_REQUEST = 'SAMPLE_ACTION_GET_REQUEST';
// // const SAMPLE_ACTION_GET_SUCCESS = 'SAMPLE_ACTION_GET_SUCCESS';


// export default (state = {
//   userInfo: null
// }, action) => {
//   switch (action.type) {
//     case SAMPLE_ACTION_GET_REQUEST:
//       return state = {
//         ...state,
//         userInfo: action.payload
//       }
//     default:
//       return state;
//   }
// }


// const sampleActionSuccess = (userInfo) => ({
//   type: SAMPLE_ACTION_GET_REQUEST,
//   payload: userInfo
// })

// export const sampleActionCall = () => (dispatch) => {
//   axios.get('https://jsonplaceholder.typicode.com/todos/1').then(response => {
//     dispatch(sampleActionSuccess(response.data));
//   })
// }