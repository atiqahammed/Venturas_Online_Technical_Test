import { createStore, applyMiddleware } from "redux";
import rootReducer from  "./reducers";
import thunk from "redux-thunk";

export default function configureStore(initiateState) {
	return createStore(
		rootReducer, 
		initiateState,
		applyMiddleware(thunk));
}