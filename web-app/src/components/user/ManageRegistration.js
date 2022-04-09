import React, { useState, useEffect } from "react";
import * as bookApi from "../../api/bookApi"
import { toast } from "react-toastify";
import BookForm from "../books/BookForm";
import RegistrationForm from "./RegistrationForm";

function ManageRegistration(props) {

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    email: null
  });

  function handleChange({target}) {
    setUser({
      ...user, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.email) _errors.id = "ID is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    console.log(user);

    // if(props.match.params.id) {
    //     bookApi.updateBook(book).then(() => {
    //         props.history.push("/books");
    //         toast.success("Book Updated Successfully.");
    //     });
    // } else {
    //     bookApi.saveBook(book).then(() => {
    //         props.history.push("/books");
    //         toast.success("Book Created Successfully.");
    //     });
    // }
    
  }


  return (
    <>
    <div className="jumbotron">
      <h1>New System Administrator Registration</h1>
    </div>
    <div className="container">
      <RegistrationForm user={user} errors={errors} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
    </>
  );
}

export default ManageRegistration;