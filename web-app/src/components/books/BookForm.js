import React from "react";
import TextInput from "../common/TextInput";
import { Link } from "react-router-dom";
// import Dropdown from 'react-dropdown';
import ReadOnlyTextInput from "../common/ReadOnlyTextInput";

function BookForm(props) {
    
    function getIdField() {
        if(props.update) {
            return (
                <ReadOnlyTextInput
                    id="id"
                    label="ID"
                    onChange={props.onChange}
                    name="id"
                    value={props.book.id}
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
                    value={props.book.id}
                    error={props.errors.id}
                />
            );
        }
    }
  
    return (
    <form onSubmit={props.onSubmit}>
      
      {getIdField()}

      <TextInput
        id="name"
        label="Book's Name"
        name="name"
        onChange={props.onChange}
        value={props.book.name}
        error={props.errors.name}
      />

    <TextInput
        id="category"
        label="Category"
        name="category"
        onChange={props.onChange}
        value={props.book.category}
        error={props.errors.category}
    />

    <TextInput
        id="authorId"
        label="Author Id"
        name="authorId"
        onChange={props.onChange}
        value={props.book.authorId}
        error={props.errors.authorId}
    />

    {/* <Dropdown options={options} onChange={props.onChange} value={defaultOption} placeholder="Select an option" /> */}

    <input type="submit" value="Save" className="btn btn-dark" /> {"   "}
    <Link to="/books" className="btn btn-dark">Cancel</Link>
    </form>
  );
}

export default BookForm;