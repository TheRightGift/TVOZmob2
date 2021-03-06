import { combineReducers, createStore } from "redux";
import initialState from "./initialState";
import { connectionStatusReducer, navigationStateReducer, dataReducer, userReducer } from "./reducers";


// Create a single main "root" reducer that combines all of them.  The keys in
// this object determine what chunk of the state object each reducer manages.
const rootReducer = combineReducers({
  serverState : connectionStatusReducer,
  navigationState : navigationStateReducer,
  data : dataReducer,
  user: userReducer
});


// Create the store.
export default createStore(rootReducer, initialState);
