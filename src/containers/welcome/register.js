import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Col } from "../../components/layout.js";
import { Form, FormRow, FormGroup, FormLabel } from "../../components/form.js";
import { SelectDate, SelectMonthByName, SelectYear } from "../../components/dates.js";
import { Genders, GenderInput, Qualifications, QualificationInput,
    Specializations, SpecializationInput } from "../../components/users.js";


export default function RegisterForm(props) {
    const today = new Date();
    const dispatch = useDispatch();

    const [fields, setfields] = useState({
        errorMessage: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        dobDay: today.getDate(),
        dobMonth: today.getMonth()+1,
        dobYear: today.getFullYear(),
        gender: (Genders) ? Genders[0] : "",
        isPhysician: "No",
        qualification: (Qualifications) ? Qualifications[0]: "",
        specialization: (Specializations) ? Specializations[0]: ""
    });

    function handleChange(e) {
        setfields({
            ...fields,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            // Generate DoB in 'YYYY-MM-DD' Format.
            const dob = new Date(fields.dobYear, fields.dobMonth-1, fields.dobDay);

            const registerResponse = await fetch(`/api/auth/register`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: fields.username,
                  password: fields.password,
                  firstName: fields.firstName.trim(),
                  lastName: fields.lastName.trim(),
                  isPhysician: (fields.isPhysician === "Yes") ? true : false,
                  dob: dob,
                  gender: fields.gender,
                  qualification: (fields.isPhysician === "Yes") ? fields.qualification: "",
                  specialization: (fields.isPhysician === "Yes") ? fields.specialization: ""
                })
            });

            let registerData = await registerResponse.json();
            if (!registerResponse.ok) {
                throw new Error(registerData.message);
            }

            const signInResponse = await fetch(`/api/auth/signin`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: fields.username,
                    password: fields.password
                })
            });

            let signInData = await signInResponse.json();
            if (!signInResponse.ok) {
                throw new Error(signInData.message);
            }

            dispatch({
                type: "session/set",
                payload: {
                    ...signInData
                }
            });
        } catch (err) {
            console.error(`Failed to register new user. ${err}`);
            setfields({
                ...fields,
                errorMessage: err.message
            });
        }
    }
    
    return (
        <Form handleSubmit={handleSubmit}>
            {(fields.errorMessage) &&
                <FormRow className="justify-content-center">
                    <div className="alert alert-danger p-2" role="alert">
                        {fields.errorMessage}
                    </div>
                </FormRow>
            }
            <FormRow>
                <FormGroup className="col-sm-6">
                    <input id="registerInput1" type="text" name="firstName" className="form-control" 
                        placeholder="First name" value={fields.firstName} onChange={handleChange} 
                            aria-label="First name" required />
                </FormGroup>
                <FormGroup className="col-sm-6">
                    <input id="registerInput2" type="text" name="lastName" className="form-control" 
                        placeholder="Last name" value={fields.lastName} onChange={handleChange} 
                            aria-label="Last name" required />
                </FormGroup>
            </FormRow>
            <FormGroup>
                <input id="registerInput3" type="text" name="username" className="form-control" 
                    placeholder="Username" value={fields.username} onChange={handleChange} 
                        aria-label="Username" aria-describedby="usernameHelpBlock" autocomplete="off" 
                            required />
                <small id="usernameHelpBlock" className="Form-text text-muted help-text">
                    Username must contain only letters, numbers and periods.
                </small>
            </FormGroup>
            <FormRow className="my-sm-3">
                <FormGroup className="col-sm-6 my-sm-0">
                    <input id="registerInput4" type="password" name="password" className="form-control"
                        placeholder="Password" value={fields.password} onChange={handleChange}
                            aria-label="Password" aria-describedby="passwordHelpBlock" 
                                minlength="8" maxlength="20" required />
                </FormGroup>
                <FormGroup className="col-sm-6 my-0">
                    <input id="registerInput5" type="password" name="confirmPassword" className="form-control"
                        placeholder="Confirm Password" value={fields.confirmPassword} onChange={handleChange}
                            aria-label="Confirm Password" aria-describedby="passwordHelpBlock" 
                                minlength="8" maxlength="20" required />
                </FormGroup>
                <FormGroup className="col-12 my-0">
                    <small id="passwordHelpBlock" className="form-text text-muted help-text">
                        Password must be 8-20 characters long and contain only letters, numbers and periods.
                    </small>
                </FormGroup>
            </FormRow>
            <FormGroup className="my-0">
                <FormLabel for="registerInput6" className="md-font-sm text-muted">
                    Birthday
                </FormLabel>
                <FormRow>
                    <FormGroup className="col-sm-4">
                        <SelectMonthByName
                            id="registerInput6"
                            className="form-control"
                            name="dobMonth"
                            label="Month"
                            shortForm={true}
                            value={fields.dobMonth}
                            handleChange={handleChange}
                            required={true}
                        />
                    </FormGroup>
                    <FormGroup className="col-sm-4">
                        <SelectDate
                            id="registerInput7"
                            className="form-control"
                            name="dobDay"
                            label="Day"
                            shortForm={true}
                            value={fields.dobDay}
                            handleChange={handleChange}
                            required={true}
                        />
                    </FormGroup>
                    <FormGroup className="col-sm-4">
                        <SelectYear
                            id="registerInput8"
                            className="form-control"
                            name="dobYear"
                            label="Year"
                            startYear={today.getFullYear()-100}
                            endYear={today.getFullYear()}
                            value={fields.dobYear}
                            handleChange={handleChange}
                            required={true}
                        />
                    </FormGroup>
                </FormRow>
            </FormGroup>
            <FormRow>
                <FormGroup className="col-sm-6">
                    <FormLabel for="registerInput9" className="md-font-sm text-muted">
                        Gender
                    </FormLabel>
                    <GenderInput
                        id="registerInput9"
                        className="form-control"
                        name="gender"
                        label="Gender"
                        value={fields.gender}
                        handleChange={handleChange}
                        required={true}
                    />
                </FormGroup>
                <FormGroup className="col-sm-6">
                    <FormLabel for="registerInput10" className="md-font-sm text-muted">
                        Are you a physician?
                    </FormLabel>
                    <FormRow className="px-1 py-2">
                        <Col>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="registerInput10" name="isPhysician" 
                                    className="custom-control-input" value="Yes" 
                                        checked={fields.isPhysician === "Yes"} 
                                            onChange={handleChange} />
                                <label className="custom-control-label" for="registerInput10">Yes</label>
                            </div>
                        </Col>
                        <Col>
                            <div className="custom-control custom-radio custom-control-inline">
                                <input type="radio" id="registerInput11" name="isPhysician" 
                                    className="custom-control-input" value="No" 
                                        checked={fields.isPhysician === "No"} 
                                            onChange={handleChange} />
                                <label className="custom-control-label" for="registerInput11">No</label>
                            </div>
                        </Col>
                    </FormRow>
                </FormGroup>
            </FormRow>
            {(fields.isPhysician === "Yes") &&
                <FormRow>
                    <FormGroup className="col-sm-6">
                        <FormLabel for="registerInput11" className="md-font-sm text-muted">
                            Qualification
                        </FormLabel>
                        <QualificationInput
                            id="registerInput11"
                            className="form-control"
                            name="qualification"
                            label="Qualification"
                            value={fields.qualification}
                            handleChange={handleChange}
                            required={true}
                        />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                        <FormLabel for="registerInput12" className="md-font-sm text-muted">
                            Specialization
                        </FormLabel>
                        <SpecializationInput
                            id="registerInput12"
                            className="form-control"
                            name="specialization"
                            label="Specialization"
                            value={fields.specialization}
                            handleChange={handleChange}
                            required={true}
                        />
                    </FormGroup>
                </FormRow>
            }
            <FormGroup>
                <p className="my-2 md-font-xs text-muted">
                    By clicking on Register, you agree to our Terms and Conditions.
                </p>
            </FormGroup>
            <FormRow className="justify-content-center">
                <button id="registerButton1" type="submit" className="btn btn-success col-6">
                    Register
                </button>
            </FormRow>
        </Form>
    );
}