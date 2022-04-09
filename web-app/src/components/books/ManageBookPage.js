import React, { useState, useEffect } from "react";
import * as bookApi from "../../api/bookApi"
import { toast } from "react-toastify";
import BookForm from "./BookForm";

function ManageBookPage(props) {

  const [errors, setErrors] = useState({});
  const [book, setBook] = useState({
    id: null,
    name: "",
    authorId: null,
    category: ""
  });

  useEffect(() => {
    const id = props.match.params.id;
    if(id) {
      bookApi.getBook(id).then((_book) => {
        setBook(_book)
      });
    }
  }, [props.match.params.id]);

  function handleChange({target}) {
    setBook({
      ...book, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!book.id) _errors.id = "ID is required";
    if (!book.name) _errors.name = "Name is required";
    if (!book.authorId) _errors.authorId = "Author Id is required";
    if (!book.category) _errors.category = "Category is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    console.log(book);

    if(props.match.params.id) {
        bookApi.updateBook(book).then(() => {
            props.history.push("/books");
            toast.success("Book Updated Successfully.");
        });
    } else {
        bookApi.saveBook(book).then(() => {
            props.history.push("/books");
            toast.success("Book Created Successfully.");
        });
    }
    
  }


  return (
    <>
    <div className="jumbotron">
      <h1>{props.match.params.id ? "Update Book" : "Create New Book"}</h1>
    </div>
    <div className="container">
      <BookForm book={book} errors={errors} onChange={handleChange} update={props.match.params.id ? true: false} onSubmit={handleSubmit} />
    </div>
    </>
  );
}

export default ManageBookPage;