import React from "react";

function ReadOnlyTextInput(props) {
  let wrapperClass = "form-group";
  if (props.error.length > 0) {
    wrapperClass += " has-error";
  }

  return (
    <div className={wrapperClass}>
      <label htmlFor={props.id}>{props.label}</label>
      <div className="field">
        <input
          id={props.id}
          type="text"
          onChange={props.onChange}
          name={props.name}
          className="form-control"
          readOnly
          value={props.value}
        />
      </div>
      {props.error && <p className="text-danger">{props.error}</p>}
    </div>
  );
}


ReadOnlyTextInput.defaultProps = {
  error: ""
};

export default ReadOnlyTextInput;
