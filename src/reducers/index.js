import { combineReducers } from "redux";
import authReducer from "./authReducer";
import ressourceTypeReducer from "./ressourceTypeReducer";
import spaceReducer from "./spaceReducer";

const rootReducer = combineReducers({
  authReducer,
  ressourceTypeReducer,
  spaceReducer
});

export default rootReducer;
