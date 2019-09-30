import { combineReducers } from "redux";
import authReducer from "./authReducer";
import ressourceTypeReducer from "./ressourceTypeReducer";
import spaceReducer from "./spaceReducer";
import assetReducer from "./assetReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  ressourceTypeReducer,
  spaceReducer,
  assetReducer
});

export default rootReducer;
