import { combineReducers } from "redux";
import authReducer from "./authReducer";
import ressourceTypeReducer from "./ressourceTypeReducer";
import spaceReducer from "./spaceReducer";
import assetReducer from "./assetReducer";

const rootReducer = combineReducers({
  authReducer,
  ressourceTypeReducer,
  spaceReducer,
  assetReducer
});

export default rootReducer;
