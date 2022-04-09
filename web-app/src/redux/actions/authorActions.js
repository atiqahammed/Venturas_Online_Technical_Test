import { CREATE_AUTHOR, LOAD_AUTHOR_SUCCESS } from "../actionType";
import * as authorApi from "../../api/authorApi";

export function createAuthor(author) {
	return { type: CREATE_AUTHOR, author };
}

export function loadAuthorSucccess(authors) {
	return { type: LOAD_AUTHOR_SUCCESS, authors };
}

export function loadAuthors() {
	return (dispatch) => {
		authorApi.getAuthors().then((authors) => {
			dispatch(loadAuthorSucccess(authors));
		}).catch(error => {
			throw error;
		});
	}
}