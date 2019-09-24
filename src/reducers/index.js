import { combineReducers } from "redux";
import authReducer from "./authReducer";
import ressourceTypeReducer from "./ressourceTypeReducer";

const rootReducer = combineReducers({
  authReducer,
  ressourceTypeReducer
});

export default rootReducer;
