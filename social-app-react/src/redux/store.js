import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducer";


// create Redux store
// export const store = createStore(rootReducer); // simple store without debugger
// If you setup your store with middleware and enhancers, change:
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
)); // store with support for thunk and redux-dev-tools and React Native Debugger

export default store;