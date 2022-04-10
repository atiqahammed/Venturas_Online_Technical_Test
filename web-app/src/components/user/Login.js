import React, { useEffect, useState } from "react";
import { post } from "../../util/httpClient";
import { toast } from "react-toastify";
import TextInput from "../common/TextInput";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Login() {

  let history = useHistory();
  const { setUserInfo, logout } =
        useContext(AppContext);

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    logout();
  }, []);

  function handleChange({target}) {
    setUser({
      ...user, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.email) _errors.email = "Email is required";
    if (!user.password) _errors.password = "Password is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    const requestBody = {
      "email": user.email,
      "password": user.password
    }
    
    post('/login', requestBody).then(response => {
      if(response && response.data && response.data.isSuccess) {
        toast("User successfully logged in.");
        setUserInfo(response.data.user);
        history.push('/profile');
      }
      else if(!response.isSuccess && response.data.message) {
        toast(response.data.message);
      }
    }).catch(error => {
        console.log(error);
    });
  }

  return (
    <>
    <div className="jumbotron">
      <h1>Login</h1>
    </div>
    <div className="container">
      <form onSubmit={handleSubmit}>

        <TextInput
          id="email"
          label="Email"
          name="email"
          onChange={handleChange}
          value={user.email}
          error={errors.email}
        />

        <TextInput
          id="password"
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
          value={user.password}
          error={errors.password}
        />

        <input type="submit" value="Login" className="btn btn-dark" /> {"   "}
      </form>
    </div>
    </>
  );
}

export default Login;