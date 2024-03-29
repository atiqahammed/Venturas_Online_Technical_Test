import React, { useState } from "react";
import { toast } from "react-toastify";
import { post } from "../../util/httpClient";
import TextInput from "../common/TextInput";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Profile(props) {

  const { 
    Id,
    UserType,
    Name,
    Remarks,
    ZipCode,
    Address,
    PhoneNumber,
    Department,
    DateOfBirth,
  } = useContext(AppContext);

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    name: Name,
    zipCode: ZipCode,
    address: Address,
    phoneNumber: PhoneNumber,
    department: Department,
    remarks: Remarks,
    dateOfBirth: DateOfBirth
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
    if (!user.remarks) _errors.remarks = "Remarks is required";
    if (!user.dateOfBirth) _errors.dateOfBirth = "Date Of Birth is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    const requestBody = {
      "name": user.name,
      "zipCode": user.zipCode,
      "address": user.address,
      "phoneNumber": user.phoneNumber,
      "department": user.department,
      "remarks": user.remarks,
      "dateOfBirth": user.dateOfBirth,
      id: Id
    }

    post('/update-profile', requestBody).then(response => {
      if(response && response.data && response.data.isSuccess) {
        toast(response.data.message);
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
      <h1>{UserType} Profile</h1>
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

        <input type="submit" value="Save" className="btn btn-dark" /> {"   "}
      </form>
    </div>
    </>
  );
}

export default Profile;