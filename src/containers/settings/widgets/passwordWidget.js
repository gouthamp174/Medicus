import React from 'react';
import { Form, FormRow, FormGroup, FormSubmit, FormLabel } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody } from '../../../components/widget.js';


export default class PasswordWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      errorMessage: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleChange(e) {
    event.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
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
      editMode: false,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      if (this.state.confirmPassword !== this.state.newPassword) {
        throw new Error("New Password and Comfirm Password do not match.");
      }

      const response = await fetch(`/api/auth/password`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify({
          currentPassword: this.state.currentPassword,
          newPassword: this.state.newPassword
        })
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        editMode: false,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error(`Failed to update user password. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    return (
      <Widget>
        <TitleBar title="Change Password">
          {(this.state.editMode) ?
            <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
            <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
          }
        </TitleBar>
        {this.state.editMode &&
          <WidgetBody>
            <Form className="container-fluid" handleSubmit={this.handleSubmit}>
              {(this.state.errorMessage) &&
                <FormRow className="justify-content-center">
                  <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
                </FormRow>
              }
              <FormRow>
                <FormLabel for="passwordInput01" className="col-12 col-sm-4">Current Password</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                  <input type="password" id="passwordInput01" name="currentPassword"
                    className="form-control" placeholder="" value={this.state.currentPassword}
                      onChange={this.handleChange} minlength="8" maxlength="20" required
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="passwordInput02" className="col-12 col-sm-4">New Password</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                  <input type="password" id="passwordInput02" name="newPassword"
                    className="form-control" placeholder="" value={this.state.newPassword}
                      onChange={this.handleChange} minlength="8" maxlength="20" required
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="passwordInput03" className="col-12 col-sm-4">Confirm Password</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                  <input type="password" id="passwordInput03" name="confirmPassword"
                    className="form-control" placeholder="" value={this.state.confirmPassword}
                      onChange={this.handleChange} minlength="8" maxlength="20" required
                  />
                </FormGroup>
              </FormRow>
              <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-sm-4">Save</FormSubmit>
              </FormRow>
            </Form>
          </WidgetBody>
        }
      </Widget>
    );
  }
}
