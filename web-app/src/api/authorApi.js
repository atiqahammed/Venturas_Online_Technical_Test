import fetch from 'node-fetch';
const url = "/api/author/";


export function getAuthors() {  
  return fetch(url)
     .then((res) => {return res.json()});
}

export function getAuthor(id) {  
  return fetch(url + id)
     .then((res) => {return res.json()});
}

export function updateAuthor(author) {

  const myHeaders = {
    "Content-Type": "application/json"
  };

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(author)
  };

  return fetch(url+author.id, requestOptions);
}

export function saveAuthor(author) {

  const tempAuthor = {...author, id: Number(author.id)}

  const myHeaders = {
    "Content-Type": "application/json"
  };
  
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(tempAuthor)
  };

  return fetch(url, requestOptions);
}