import requestPromise from "request-promise";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api/v1';
const commonHeaders = {
    'Content-Type': 'application/json'
}

export function get(url, requestBody, headers) {
    return sendRequest('GET', url, requestBody, headers);
}

export function post(url, requestBody, headers) {
    return sendRequest('POST', url, requestBody, headers);
}

export function put(url, requestBody, headers) {
    return sendRequest('PUT', url, requestBody, headers);
}

export function _delete(url, requestBody, headers) {
    return sendRequest('DELETE', url, requestBody, headers);
}

export function download(httpMethod, url, requestBody, headers) {
    
    const requestUrl = `${apiBaseUrl}${url}`;
    const requestHeaders = Object.assign(commonHeaders, headers);
    const requestOptions = {
		url: requestUrl,
		method: httpMethod,
		headers: requestHeaders,
		json: requestBody
	};
    return requestPromise(requestOptions).then(response => {
        return response
    });
}

export function sendRequest(httpMethod, url, requestBody, headers) {
    const requestUrl = `${apiBaseUrl}${url}`;

    const requestHeaders = Object.assign(commonHeaders, headers);
    const requestOptions = {
		url: requestUrl,
		method: httpMethod,
		headers: requestHeaders,
		json: requestBody
	};
  return requestPromise(requestOptions).then(response => {
    if(typeof response === "string") {
        return JSON.parse(response);
    }
    return JSON.parse(JSON.stringify(response));
  });
}