import { combineReducers } from "redux";
import authReducer from "./authReducer";
import ressourceTypeReducer from "./ressourceTypeReducer";
import spaceReducer from "./spaceReducer";
import assetReducer from "./assetReducer";
import userReducer from "./userReducer";
import reservationReducer from "./reservationReducer";

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  ressourceTypeReducer,
  spaceReducer,
  assetReducer,
  reservationReducer
});

export default rootReducer;
