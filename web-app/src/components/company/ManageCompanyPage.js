import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CompanyForm from "./CompanyForm";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { post } from "../../util/httpClient";
import { useHistory } from "react-router-dom";

function ManageCompanyPage(props) {

  let history = useHistory();
  const { Id } =
        useContext(AppContext);

  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState({
    name: '',
    email: '',
    zipCode: '',
    address: '',
    phoneNumber: '',
    companyNameKana: '',
    urlOfHP: '',
    remarks: '',
    dateOfEstablishment: ''
  });

  useEffect(() => {
    // const id = props.match.params.id;
    // if(id) {
    //   bookApi.getBook(id).then((_book) => {
    //     setBook(_book)
    //   });
    // }
  }, [props.match.params.id]);

  function handleChange({target}) {
    setCompany({
      ...company, [target.name]: target.value
    });
  }

  function formIsValid() {
    const _errors = {};

    if (!company.name) _errors.name = "Name is required";
    if (!company.email) _errors.email = "Email is required";
    if (!company.zipCode) _errors.zipCode = "Zip Code is required";
    if (!company.address) _errors.address = "Address is required";
    if (!company.phoneNumber) _errors.phoneNumber = "Phone Number is required";
    if (!company.remarks) _errors.remarks = "Remarks is required";
    if (!company.dateOfEstablishment) _errors.dateOfEstablishment = "Date Of Establishment is required";
    if (!company.urlOfHP) _errors.urlOfHP = "Url Of HP is required";
    if (!company.companyNameKana) _errors.companyNameKana = "Company Name Kana is required";

    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    const requestBody = {
      ...company,
      ownerId: Id
    }

    post('/save-company', requestBody).then(response => {
      if(response && response.data && response.data.isSuccess) {
        toast(response.data.message);
        history.push('/company-list');
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
      <h1>{props.match.params.id ? "Company Details" : "Create New Company"}</h1>
    </div>
    <div className="container">
      <CompanyForm company={company} errors={errors} onChange={handleChange} update={props.match.params.id ? true: false} onSubmit={handleSubmit} />
    </div>
    </>
  );
}

export default ManageCompanyPage;