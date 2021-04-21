import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormText } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody } from '../../../components/widget.js';
import { QualificationInput, SpecializationInput } from "../../../components/users.js";


class EditSection extends React.Component {
  constructor(props) {
    super(props);
    const user = this.props.user;

    this.state = {
      errorMessage: "",
      qualification: (user.qualification) ? user.qualification: "",
      specialization: (user.specialization) ? user.specialization: ""
    };

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
      const newUserInfo = {
        qualification: this.state.qualification,
        specialization: this.state.specialization
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
      console.error(`Failed to update physician information widget. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    return (
      <Form className="container-fluid" handleSubmit={this.handleSubmit}>
        {(this.state.errorMessage) &&
          <FormRow className="justify-content-center">
            <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
          </FormRow>
        }
        <FormRow>
          <FormLabel for="physicianInput01" className="col-12 col-sm-4">Qualification</FormLabel>
          <FormGroup className="col-12 col-sm-auto">
            <QualificationInput
              id="physicianInput01"
              className="form-control"
              name="qualification"
              value={this.state.qualification}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="physicianInput02" className="col-12 col-sm-4">Phone Number</FormLabel>
          <FormGroup className="col-12 col-sm-auto">
            <SpecializationInput
              id="physicianInput02"
              className="form-control"
              name="specialization"
              value={this.state.specialization}
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
  return (
    <FluidContainer>
      <Row className="my-3">
        <Col className="col-12 col-sm-4">Qualification</Col>
        <Col className="col-12 col-sm-auto">{props.user.qualification}</Col>
      </Row>
      <Row className="my-3">
        <Col className="col-12 col-sm-4">Specialization</Col>
        <Col className="col-12 col-sm-auto">{props.user.specialization}</Col>
      </Row>
    </FluidContainer>
  );
}


export default class PhysicianWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      user: {}
    };

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
      console.error(`Failed to load physician information widget. ${err}`);
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
    return (
      <Widget>
        <TitleBar title="Physician Information">
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
