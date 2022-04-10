import React, { useState } from "react";
import { toast } from "react-toastify";
import { post } from "./../../util/httpClient";
import TextInput from "../common/TextInput";
import { useHistory } from "react-router-dom";

function CompleteRegistration(props) {
  let history = useHistory();

  const query = new URLSearchParams(props.location.search);
  const token = query.get('token');

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    name: '',
    zipCode: '',
    address: '',
    phoneNumber: '',
    department: '',
    password: '',
    temporaryPassword: '',
    remarks: '',
    dateOfBirth: ''
  });

  function handleChange({target}) {
    setUser({
      ...user, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!user.name) _errors.name = "Name is required";
    if (!user.zipCode) _errors.zipCode = "Zip Code is required";
    if (!user.address) _errors.address = "Address is required";
    if (!user.phoneNumber) _errors.phoneNumber = "Phone Number is required";
    if (!user.department) _errors.department = "Department is required";
    if (!user.password) _errors.password = "Password is required";
    if (!user.temporaryPassword) _errors.temporaryPassword = "Temporary Password is required";
    if (!user.remarks) _errors.remarks = "Remarks is required";
    if (!user.dateOfBirth) _errors.dateOfBirth = "Date Of Birth is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    const requestBody = {
      "uuid": token,
      "name": user.name,
      "zipCode": user.zipCode,
      "address": user.address,
      "phoneNumber": user.phoneNumber,
      "department": user.department,
      "password": user.password,
      "temporaryPassword": user.temporaryPassword,
      "remarks": user.remarks,
      "dateOfBirth": user.dateOfBirth
    }

    post('/complete-user-registration', requestBody).then(response => {
      if(response && response.data && response.data.isSuccess) {
        toast("User registration is completed. Please login");
        history.push('/');
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
      <h1>Complete User Registration</h1>
    </div>
    <div className="container">
      <form onSubmit={handleSubmit}>

        <TextInput
          id="name"
          label="Name"
          name="name"
          onChange={handleChange}
          value={user.name}
          error={errors.name}
        />

        <TextInput
          id="address"
          label="Address"
          name="address"
          onChange={handleChange}
          value={user.address}
          error={errors.address}
        />

        <TextInput
          id="zipCode"
          label="Zip Code"
          name="zipCode"
          onChange={handleChange}
          value={user.zipCode}
          error={errors.zipCode}
        />

        <TextInput
          id="phoneNumber"
          label="Phone Number"
          name="phoneNumber"
          onChange={handleChange}
          value={user.phoneNumber}
          error={errors.phoneNumber}
        />

        <TextInput
          id="department"
          label="Department"
          name="department"
          onChange={handleChange}
          value={user.department}
          error={errors.department}
        />

        <TextInput
          id="dateOfBirth"
          label="Date Of Birth"
          name="dateOfBirth"
          onChange={handleChange}
          value={user.dateOfBirth}
          error={errors.dateOfBirth}
        />

        <TextInput
          id="remarks"
          label="Remarks"
          name="remarks"
          onChange={handleChange}
          value={user.remarks}
          error={errors.remarks}
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

        <TextInput
          id="temporaryPassword"
          label="Temporary Password"
          name="temporaryPassword"
          type="password"
          onChange={handleChange}
          value={user.temporaryPassword}
          error={errors.temporaryPassword}
        />

        <input type="submit" value="Save" className="btn btn-dark" /> {"   "}
      </form>
    </div>
    </>
  );
}

export default CompleteRegistration;