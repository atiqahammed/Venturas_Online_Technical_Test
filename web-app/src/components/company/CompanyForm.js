import React from "react";
import TextInput from "../common/TextInput";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { USER_TYPE } from "./../../util/const";

function CompanyForm(props) {

  const {UserType} = useContext(AppContext);
  
    return (
    <form onSubmit={props.onSubmit}>

      <TextInput
        id="name"
        label="Company's Name"
        name="name"
        onChange={props.onChange}
        value={props.company.name}
        error={props.errors.name}
      />

    <TextInput
        id="companyNameKana"
        label="Company Name Kana"
        name="companyNameKana"
        onChange={props.onChange}
        value={props.company.companyNameKana}
        error={props.errors.companyNameKana}
      />

    <TextInput
        id="email"
        label="Email"
        name="email"
        onChange={props.onChange}
        value={props.company.email}
        error={props.errors.email}
      />    

    <TextInput
        id="address"
        label="Company Address"
        name="address"
        onChange={props.onChange}
        value={props.company.address}
        error={props.errors.address}
      />

    <TextInput
        id="zipCode"
        label="Company Zip Code"
        name="zipCode"
        onChange={props.onChange}
        value={props.company.zipCode}
        error={props.errors.zipCode}
      />

    <TextInput
        id="phoneNumber"
        label="Company Phone Number"
        name="phoneNumber"
        onChange={props.onChange}
        value={props.company.phoneNumber}
        error={props.errors.phoneNumber}
      />

    <TextInput
        id="dateOfEstablishment"
        label="Company Date Of Establishment"
        name="dateOfEstablishment"
        onChange={props.onChange}
        value={props.company.dateOfEstablishment}
        error={props.errors.dateOfEstablishment}
      />

    <TextInput
        id="urlOfHP"
        label="Company Url Of HP"
        name="urlOfHP"
        onChange={props.onChange}
        value={props.company.urlOfHP}
        error={props.errors.urlOfHP}
      />

    <TextInput
        id="remarks"
        label="Remarks"
        name="remarks"
        onChange={props.onChange}
        value={props.company.remarks}
        error={props.errors.remarks}
      />

    {UserType != USER_TYPE.GENERAL_AUTHORITY && <input type="submit" value="Save" className="btn btn-dark" />} {"   "}
    {UserType == USER_TYPE.SYSTEM_ADMIN &&<Link to="/company-list" className="btn btn-dark">Cancel</Link>}
    </form>
  );
}

export default CompanyForm;