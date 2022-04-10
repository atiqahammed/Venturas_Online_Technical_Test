import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext({});

const AppContextProvider = (props) => {
    const defaultState = {
        loggedIn: false,
        "Id": 0,
        "Name": "",
        "Remarks": "",
        "ZipCode": "",
        "Address": "",
        "PhoneNumber": "",
        "Department": "",
        "DateOfBirth": "",
        "CompanyId": 0,
        "UserType": ""
    };
    const storageKey = "employeeApp";
    const previousValue = sessionStorage.getItem(storageKey)
        ? JSON.parse(sessionStorage.getItem(storageKey))
        : defaultState;
    const [state, setState] = useState(previousValue);

    const setUserInfo = (user) => {
        setState({
            ...state,
            Id: user.Id,
            UserType: user.UserType,
            Name: user.Name,
            Remarks: user.Remarks,
            ZipCode: user.ZipCode,
            Address: user.Address,
            PhoneNumber: user.PhoneNumber,
            Department: user.PhoneNumber,
            DateOfBirth: user.DateOfBirth,
            CompanyId: user.CompanyId,
            loggedIn: true
        })
    }

    const logout = () => {
        setState(defaultState);
    }

    useEffect(() => {
        const currentValue = JSON.stringify(state);
        sessionStorage.setItem(storageKey, currentValue);
    }, [state]);

    return (
        <AppContext.Provider
            value={{
                loggedIn: state.loggedIn,
                Id: state.Id,
                UserType: state.UserType,
                Name: state.Name,
                Remarks: state.Remarks,
                ZipCode: state.ZipCode,
                Address: state.Address,
                PhoneNumber: state.PhoneNumber,
                Department: state.PhoneNumber,
                DateOfBirth: state.DateOfBirth,
                CompanyId: state.CompanyId,
                setUserInfo,
                logout
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;