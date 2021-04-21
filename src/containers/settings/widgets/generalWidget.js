import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormText, FormLabel } from "../../../components/form.js";
import { getMonthInName, DateInput, MonthNameInput, YearInput } from "../../../components/dates.js";
import { getUserFullName, GenderInput } from "../../../components/users.js";
import { Widget, TitleBar, TitleButton, WidgetBody } from '../../../components/widget.js';


class EditSection extends React.Component {
  constructor(props) {
    super(props);
    const user = this.props.user;
    const dob = new Date(user.dob);

    this.state = {
      errorMessage: "",
      firstName: (user.firstName) ? user.firstName: "",
      lastName: (user.lastName) ? user.lastName: "",
      dobDay: (dob) ? dob.getDate(): "",
      dobMonth: (dob) ? dob.getMonth()+1: "",
      dobYear: (dob) ? dob.getFullYear(): "",
      gender: (user.gender) ? user.gender: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleChange(e) {
     event.preventDefault();
     this.setState({
       [e.target.name]: e.target.value
     });
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const dob = new Date(this.state.dobYear, this.state.dobMonth-1, this.state.dobDay);

      const newUserInfo = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        dob: dob,
        gender: this.state.gender
      };

      const response = await fetch(`/api/users/${this.props.session.username}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newUserInfo)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      if (this.props.updateUser) {
        await this.props.updateUser(newUserInfo);
      }
    } catch (err) {
      console.error(`Failed to update general widget. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    const today = new Date();
    return (
      <Form className="container-fluid" handleSubmit={this.handleSubmit}>
        {(this.state.errorMessage) &&
          <FormRow className="justify-content-center">
            <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
          </FormRow>
        }
        <FormRow>
          <FormLabel for="generalInput01" className="col-12 col-sm-4">Full name</FormLabel>
          <FormGroup className="col-12 col-sm-8">
            <Row>
              <Col>
                <input type="text" id="generalInput01" name="firstName" className="form-control"
                    placeholder="First name" value={this.state.firstName} onChange={this.handleChange}
                />
              </Col>
              <Col>
                <input type="text" id="generalInput02" name="lastName" className="form-control"
                    placeholder="Last name" value={this.state.lastName} onChange={this.handleChange}
                />
              </Col>
            </Row>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="generalInput03" className="col-12 col-sm-4">Date of Birth</FormLabel>
          <FormGroup className="col-12 col-sm-8">
            <Row>
              <Col>
                <MonthNameInput
                  id="generalInput03"
                  className="form-control"
                  name="dobMonth"
                  label="Month"
                  shortForm={true}
                  value={this.state.dobMonth}
                  handleChange={this.handleChange}
                  required={true}
                />
              </Col>
              <Col>
                <DateInput
                  id="generalInput04"
                  className="form-control"
                  name="dobDay"
                  label="Day"
                  value={this.state.dobDay}
                  handleChange={this.handleChange}
                  required={true}
                />
              </Col>
              <Col>
                <YearInput
                  id="generalInput05"
                  className="form-control"
                  name="dobYear"
                  label="Year"
                  startYear={today.getFullYear()-100}
                  endYear={today.getFullYear()}
                  value={this.state.dobYear}
                  handleChange={this.handleChange}
                  required={true}
                />
              </Col>
            </Row>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="generalInput06" className="col-12 col-sm-4">Gender</FormLabel>
          <FormGroup className="col-12 col-sm-auto">
            <GenderInput
              id="generalInput06"
              className="form-control"
              name="gender"
              label="Gender"
              value={this.state.gender}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
        </FormRow>
        <FormRow className="justify-content-center">
          <FormSubmit type="submit" className="col-auto col-sm-4">Save</FormSubmit>
        </FormRow>
      </Form>
    );
  }
}

function ShowSection(props) {
  const dob = new Date(props.user.dob);
  return (
    <FluidContainer>
      <Row className="my-3">
        <Col className="col-12 col-sm-4">Full Name</Col>
        <Col className="col-12 col-sm-auto">{`${getUserFullName(props.user)}`}</Col>
      </Row>
      <Row className="my-3">
        <Col className="col-12 col-sm-4">Date of Birth</Col>
        <Col className="col-12 col-sm-auto">{`${getMonthInName(dob.getMonth())} ${dob.getDate()} ${dob.getFullYear()}`}</Col>
      </Row>
      <Row className="my-3">
        <Col className="col-12 col-sm-4">Gender</Col>
        <Col className="col-12 col-sm-auto">{props.user.gender}</Col>
      </Row>
    </FluidContainer>
  );
}


export default class GeneralWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      user: {}
    }

    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.session.username}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        user: data
      });
    } catch (err) {
      console.error(`Failed to load general information widget. ${err}`);
    }
  }

  async clickedEdit(e) {
    event.preventDefault();
    this.setState({
      editMode: true
    });
  }

  async clickedCancel(e) {
    event.preventDefault();
    this.setState({
      editMode: false
    });
  }

  async updateUser(newUserInfo) {
    let updatedUser = this.state.user;
    updatedUser = Object.assign(updatedUser, newUserInfo);

    this.setState({
      editMode: false,
      user: updatedUser
    });
  }

  render() {
    const today = new Date();
    return (
      <Widget>
        <TitleBar title="General Information">
          {(this.state.editMode) ?
            <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
            <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
          }
        </TitleBar>
        <WidgetBody>
          {(this.state.editMode) ?
            <EditSection
              session={this.props.session}
              user={this.state.user}
              updateUser={this.updateUser}
            /> :
            <ShowSection
              user={this.state.user}
            />
          }
        </WidgetBody>
      </Widget>
    );
  }
}
