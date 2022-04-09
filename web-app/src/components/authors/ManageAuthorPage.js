import React, { useState, useEffect } from "react";
import * as authorApi from "../../api/authorApi"
import { toast } from "react-toastify";
import AuthorForm from "./AuthorForm";

function ManageAuthorPage(props) {

  const [errors, setErrors] = useState({});
  const [author, setCourse] = useState({
    id: null,
    firstName: "",
    lastName: "",
    gender: null
  });

  useEffect(() => {
    const id = props.match.params.id;
    if(id) {
      authorApi.getAuthor(id).then((_author) => {
        setCourse(_author)
      });
    }
  }, [props.match.params.id]);

  function handleChange({target}) {
    setCourse({
      ...author, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!author.id) _errors.id = "ID is required";
    if (!author.firstName) _errors.firstName = "First name is required";
    if (!author.lastName) _errors.lastName = "Last name is required";
    if (!author.gender) _errors.gender = "Gender is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    console.log(author);

    if(props.match.params.id) {
        authorApi.updateAuthor(author).then(() => {
            props.history.push("/authors");
            toast.success("Author Updated Successfully.");
        });
    } else {
        authorApi.saveAuthor(author).then(() => {
            props.history.push("/authors");
            toast.success("Author Created Successfully.");
        });
    }
    
  }


  return (
    <>
    <div className="jumbotron">
      <h1>{props.match.params.id ? "Update Author" : "Create New Author"}</h1>
    </div>
    <div className="container">
      <AuthorForm author={author} errors={errors} onChange={handleChange} update={props.match.params.id ? true: false} gender={author.gender} onSubmit={handleSubmit} />
    </div>
    </>
  );
}

export default ManageAuthorPage;