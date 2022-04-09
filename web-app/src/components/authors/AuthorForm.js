import React from "react";
import TextInput from "../common/TextInput";
import { Link } from "react-router-dom";
// import Dropdown from 'react-dropdown';
import ReadOnlyTextInput from "../common/ReadOnlyTextInput";

function AuthorForm(props) {
    
    function getIdField() {
        if(props.update) {
            return (
                <ReadOnlyTextInput
                    id="id"
                    label="ID"
                    onChange={props.onChange}
                    name="id"
                    value={props.author.id}
                    error={props.errors.id}
                />
            )
        } else {
            return (
                <TextInput
                    id="id"
                    label="ID"
                    onChange={props.onChange}
                    name="id"
                    value={props.author.id}
                    error={props.errors.id}
                />
            );
        }
    }
  
    return (
    <form onSubmit={props.onSubmit}>
      
      {getIdField()}

      <TextInput
        id="firstName"
        label="First Name"
        name="firstName"
        onChange={props.onChange}
        value={props.author.firstName}
        error={props.errors.firstName}
      />

    <TextInput
        id="lastName"
        label="Last Name"
        name="lastName"
        onChange={props.onChange}
        value={props.author.lastName}
        error={props.errors.lastName}
    />

    <TextInput
        id="gender"
        label="Gender"
        name="gender"
        onChange={props.onChange}
        value={props.author.gender}
        error={props.errors.gender}
    />

    {/* <Dropdown options={options} onChange={props.onChange} value={defaultOption} placeholder="Select an option" /> */}

    <input type="submit" value="Save" className="btn btn-dark" /> {"   "}
    <Link to="/authors" className="btn btn-dark">Cancel</Link>
    </form>
  );
}

export default AuthorForm;