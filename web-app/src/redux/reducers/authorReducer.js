import { CREATE_AUTHOR, LOAD_AUTHOR_SUCCESS } from "../actionType";

export default function authorReducer(state = [], action) {
	switch (action.type) {
		case CREATE_AUTHOR:
			console.log("create author reducer");
			return state;
		case LOAD_AUTHOR_SUCCESS:
			return action.authors;
		default:
			return state;
	}
}