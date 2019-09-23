import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(storeEnhancers(applyMiddleware(thunk)));

export default store;
