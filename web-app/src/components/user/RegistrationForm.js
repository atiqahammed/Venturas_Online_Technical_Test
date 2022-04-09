import React from "react";
import TextInput from "../common/TextInput";
import { Link } from "react-router-dom";
// import Dropdown from 'react-dropdown';
import ReadOnlyTextInput from "../common/ReadOnlyTextInput";

function RegistrationForm(props) {
    
    return (
    <form onSubmit={props.onSubmit}>

      <TextInput
        id="email"
        label="Email"
        name="email"
        onChange={props.onChange}
        value={props.user.email}
        error={props.errors.email}
      />

    <input type="submit" value="Save" className="btn btn-dark" /> {"   "}
    <Link to="/" className="btn btn-dark">Cancel</Link>
    </form>
  );
}

export default RegistrationForm;