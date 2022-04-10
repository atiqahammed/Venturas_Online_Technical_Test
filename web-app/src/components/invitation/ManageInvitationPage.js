import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { post } from "../../util/httpClient";
import { useHistory } from "react-router-dom";
import TextInput from "../common/TextInput";
import { Link } from "react-router-dom";
import { USER_TYPE } from "./../../util/const";

function ManageInvitationPage(props) {
  let history = useHistory();
  const { Id, CompanyId } = useContext(AppContext);
  const [companyList, setCompanyList] = useState([]);

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    email: "",
    userType: "administrative authority",
    companyId: CompanyId,
  });

  useEffect(() => {
    if (CompanyId == 0) {
      const requestBody = {
        id: Id,
      };
      post("/get-company-list", requestBody)
        .then((response) => {
          if (response && response.data && response.data.isSuccess) {
            setCompanyList(response.data.companyList);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function handleChange({ target }) {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  }

  function formIsValid() {
    const _errors = {};
    if (!user.email) _errors.email = "Email is required";
    setErrors(_errors);

    return Object.keys(_errors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formIsValid()) return;
    
    const requestBody = {
      email: user.email,
      invitedBy: Id,
      companyId: user.companyId,
      userType: user.userType
    }
    post('/invite-user', requestBody).then(response => {
      console.log(response);
      if(response && response.data && response.data.isSuccess) {
        toast("Invittion has been sent");
        history.push('/invitation-list');
      } else {
        toast("Something went wrong. Please check again.");
      }
    }).catch(error => {
        console.log(error);
    });
  }

  return (
    <>
      <div className="jumbotron">
        <h1>
          {"Invite new user"}
        </h1>
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
          <div className="form-group">
            <label htmlFor={"userTyoe"}>{"User Type"}</label>
            <div className="field">
              <select
                value={user.type}
                className="form-control"
                name="userType"
                onChange={handleChange}
              >
                <option value={USER_TYPE.ADMIN_AUTHORITY}>
                {USER_TYPE.ADMIN_AUTHORITY}
                </option>
                <option value={USER_TYPE.GENERAL_AUTHORITY}>{USER_TYPE.GENERAL_AUTHORITY}</option>
              </select>
            </div>
          </div>
          {CompanyId == 0 && (
            <>
              <div className="form-group">
                <label htmlFor={"company"}>{"Company"}</label>
                <div className="field">
                  <select
                    value={user.companyId}
                    className="form-control"
                    name="companyId"
                    onChange={handleChange}
                  >
                    {companyList.map((item) => {
                      return (
                        <option key={item.Id} value={item.Id}>
                          {item.Name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </>
          )}
          <input type="submit" value="Continue" className="btn btn-dark" />{" "}
          {"   "}
          <Link to="/invitation-list" className="btn btn-dark">
            Cancel
          </Link>
        </form>
      </div>
    </>
  );
}

export default ManageInvitationPage;
