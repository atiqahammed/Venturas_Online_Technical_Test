import fetch from 'node-fetch';
const url = "/api/book/";

export function getBooks() {  
  return fetch(url)
     .then((res) => {return res.json()});
}

export function getBook(id) {  
  return fetch(url + id)
     .then((res) => {return res.json()});
}

export function updateBook(book) {

  const tempBook = {...book, authorId: Number(book.authorId) }

  const myHeaders = {
    "Content-Type": "application/json"
  };

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(tempBook)
  };

  return fetch(url + book.id, requestOptions);
}

export function saveBook(book) {

  const tempBook = {...book, id: Number(book.id), authorId: Number(book.authorId) }

  const myHeaders = {
    "Content-Type": "application/json"
  };
  
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(tempBook)
  };

  return fetch(url, requestOptions);
}