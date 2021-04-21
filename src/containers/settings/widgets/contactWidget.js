import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormLabel, FormSubmit, FormText } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody } from '../../../components/widget.js';


class EditSection extends React.Component {
  constructor(props) {
    super(props);
    const user = this.props.user;

    this.state = {
      errorMessage: "",
      emailId: (user.emailId) ? user.emailId : "",
      phoneNumber: (user.phoneNumber) ? user.phoneNumber: ""
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
        emailId: this.state.emailId,
        phoneNumber: this.state.phoneNumber
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
      console.error(`Failed to update contact information widget. ${err}`);
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
          <FormLabel for="contanctInput01" className="col-12 col-sm-4">Email ID</FormLabel>
          <FormGroup className="col-12 col-sm-auto">
            <input type="text" id="contanctInput01" name="emailId" className="form-control"
                placeholder="Email ID" value={this.state.emailId} onChange={this.handleChange}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="contanctInput02" className="col-12 col-sm-4">Phone Number</FormLabel>
          <FormGroup className="col-12 col-sm-auto">
            <input type="text" id="contanctInput02" name="phoneNumber" className="form-control"
                placeholder="Phone Number" value={this.state.phoneNumber} onChange={this.handleChange}
            />
          </FormGroup>
        </FormRow>
        <FormRow className="my-2 justify-content-center">
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
        <Col className="col-12 col-sm-4">Email ID</Col>
        <Col className="col-12 col-sm-auto">{props.user.emailId}</Col>
      </Row>
      <Row className="my-3">
        <Col className="col-12 col-sm-4">Phone Number</Col>
        <Col className="col-12 col-sm-auto">{props.user.phoneNumber}</Col>
      </Row>
    </FluidContainer>
  );
}


export default class ContactWidget extends React.Component {
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
      console.error(`Failed to load contact information widget. ${err}`);
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
        <TitleBar title="Contact Information">
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
