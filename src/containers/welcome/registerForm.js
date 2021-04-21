import React from 'react';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { Form, FormRow, FormGroup, FormLabel, FormLegend } from "../../components/form.js";
import { DateInput, MonthNameInput, YearInput } from "../../components/dates.js";
import { Genders, GenderInput, Qualifications, QualificationInput,
  Specializations, SpecializationInput } from "../../components/users.js";


export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    const today = new Date();

    this.state = {
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
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async handleSubmit(e) {
    event.preventDefault();

    try {
      if (this.state.password !== this.state.confirmPassword) {
        throw new Error("Password and Confirm Password do not match.");
      }

      // Generate DoB in 'YYYY-MM-DD' Format.
      const dob = new Date(this.state.dobYear, this.state.dobMonth-1, this.state.dobDay);

      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          firstName: this.state.firstName.trim(),
          lastName: this.state.lastName.trim(),
          isPhysician: (this.state.isPhysician === "Yes") ? true : false,
          dob: dob,
          gender: this.state.gender,
          qualification: (this.state.isPhysician === "Yes") ? this.state.qualification: "",
          specialization: (this.state.isPhysician === "Yes") ? this.state.specialization: ""
        })
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await this.props.signIn(this.state.username, this.state.password);
    } catch (err) {
      console.error(`Failed to register new user. ${err}`);
      this.setState({
        errorMessage: err.message
      });
    }
  }

  render() {
    // Add date of birth attributes.
    const today = new Date();

    return (
      <FluidContainer>
        <Row>
          <button type="button" class="btn btn-success col" data-toggle="modal" data-target="#registerModal01">
            Create a new Account
          </button>
        </Row>
        <div class="modal fade" id="registerModal01" tabindex="-1" role="dialog"
          aria-labelledby="registerModalTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title font-weight-bold" id="registerModalTitle">Register today.</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <Form handleSubmit={this.handleSubmit}>
                  {(this.state.errorMessage) &&
                    <FormRow className="justify-content-center">
                      <div className="alert alert-danger p-2" role="alert">{this.state.errorMessage}</div>
                    </FormRow>
                  }
                  <FormRow>
                    <FormGroup className="col-sm-6">
                      <input id="registerInput1" type="text" name="firstName" className="form-control" placeholder="First name"
                        value={this.state.firstName} onChange={this.handleChange} aria-label="First name" required>
                      </input>
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                      <input id="registerInput2" type="text" name="lastName" className="form-control" placeholder="Last name"
                        value={this.state.lastName} onChange={this.handleChange} aria-label="Last name" required>
                      </input>
                    </FormGroup>
                  </FormRow>
                  <FormGroup>
                    <input id="registerInput3" type="text" name="username" className="form-control" placeholder="Username"
                      value={this.state.username} onChange={this.handleChange} aria-label="Username"
                      aria-describedby="usernameHelpBlock" autocomplete="off" required>
                    </input>
                    <small id="usernameHelpBlock" className="Form-text text-muted help-text">
                      Username must contain only letters, numbers and periods.
                    </small>
                  </FormGroup>
                  <FormRow className="my-sm-3">
                    <FormGroup className="col-sm-6 my-sm-0">
                      <input id="registerInput4" type="password" name="password" className="form-control"
                        placeholder="Password" value={this.state.password} onChange={this.handleChange}
                          aria-label="Password" aria-describedby="passwordHelpBlock" minlength="8" maxlength="20"
                            required>
                      </input>
                    </FormGroup>
                    <FormGroup className="col-sm-6 my-0">
                      <input id="registerInput5" type="password" name="confirmPassword" className="form-control"
                        placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange}
                          aria-label="Confirm Password" aria-describedby="passwordHelpBlock" minlength="8" maxlength="20"
                            required>
                      </input>
                    </FormGroup>
                    <FormGroup className="col-12 my-0">
                      <small id="passwordHelpBlock" className="form-text text-muted help-text">
                        Password must be 8-20 characters long and contain only letters, numbers and periods.
                      </small>
                    </FormGroup>
                  </FormRow>
                  <FormGroup className="my-0">
                    <FormLabel for="registerInput6" className="md-font-sm text-muted">Birthday</FormLabel>
                    <FormRow>
                      <FormGroup className="col-sm-4">
                        <MonthNameInput
                          id="registerInput6"
                          className="form-control"
                          name="dobMonth"
                          label="Month"
                          shortForm={true}
                          value={this.state.dobMonth}
                          handleChange={this.handleChange}
                          required={true}
                        />
                      </FormGroup>
                      <FormGroup className="col-sm-4">
                        <DateInput
                          id="registerInput7"
                          className="form-control"
                          name="dobDay"
                          label="Day"
                          shortForm={true}
                          value={this.state.dobDay}
                          handleChange={this.handleChange}
                          required={true}
                        />
                      </FormGroup>
                      <FormGroup className="col-sm-4">
                        <YearInput
                          id="registerInput8"
                          className="form-control"
                          name="dobYear"
                          label="Year"
                          startYear={today.getFullYear()-100}
                          endYear={today.getFullYear()}
                          value={this.state.dobYear}
                          handleChange={this.handleChange}
                          required={true}
                        />
                      </FormGroup>
                    </FormRow>
                  </FormGroup>
                  <FormRow>
                    <FormGroup className="col-sm-6">
                      <FormLabel for="registerInput9" className="md-font-sm text-muted">Gender</FormLabel>
                      <GenderInput
                        id="registerInput9"
                        className="form-control"
                        name="gender"
                        label="Gender"
                        value={this.state.gender}
                        handleChange={this.handleChange}
                        required={true}
                      />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                      <FormLabel for="registerInput10" className="md-font-sm text-muted">Are you a physician?</FormLabel>
                      <FormRow className="px-1 py-2">
                        <Col>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="registerInput10" name="isPhysician" className="custom-control-input"
                              value="Yes" checked={this.state.isPhysician === "Yes"} onChange={this.handleChange} />
                            <label className="custom-control-label" for="registerInput10">Yes</label>
                          </div>
                        </Col>
                        <Col>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input type="radio" id="registerInput11" name="isPhysician" className="custom-control-input"
                              value="No" checked={this.state.isPhysician === "No"} onChange={this.handleChange} />
                            <label className="custom-control-label" for="registerInput11">No</label>
                          </div>
                        </Col>
                      </FormRow>
                    </FormGroup>
                  </FormRow>
                  {(this.state.isPhysician === "Yes") &&
                    <FormRow>
                      <FormGroup className="col">
                        <FormLabel for="registerInput11" className="md-font-sm text-muted">Qualification</FormLabel>
                        <QualificationInput
                          id="registerInput11"
                          className="form-control"
                          name="qualification"
                          label="Qualification"
                          value={this.state.qualification}
                          handleChange={this.handleChange}
                          required={true}
                        />
                      </FormGroup>
                      <FormGroup className="col">
                        <FormLabel for="registerInput12" className="md-font-sm text-muted">Specialization</FormLabel>
                        <SpecializationInput
                          id="registerInput12"
                          className="form-control"
                          name="specialization"
                          label="Specialization"
                          value={this.state.specialization}
                          handleChange={this.handleChange}
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
              </div>
            </div>
          </div>
        </div>
      </FluidContainer>
    );
  }
}
