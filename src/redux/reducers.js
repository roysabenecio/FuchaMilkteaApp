import { combineReducers } from "redux";
import appReducer from "../features/main/duck";

const rootReducer = combineReducers({
  appReducer
});

export default rootReducer;