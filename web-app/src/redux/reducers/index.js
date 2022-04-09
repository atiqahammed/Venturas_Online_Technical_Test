import { combineReducers } from "redux";
import authors from "./authorReducer";

const rootReducer = combineReducers({
	authors
});

export default rootReducer;