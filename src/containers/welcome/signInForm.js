import React from 'react';
import { Form, FormRow, FormGroup, FormSubmit } from "../../components/form.js";


export default class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: "",
      username: "",
      password: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    event.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      await this.props.signIn(this.state.username, this.state.password);
    } catch (err) {
      console.error(err);
      this.setState({
        errorMessage: err.message
      });
    }
  }

  render() {
    return (
      <Form handleSubmit={this.handleSubmit}>
        <h5 className="font-weight-bold mb-3">Sign In.</h5>
        {this.state.errorMessage &&
          <FormRow className="justify-content-center">
            <div className="alert alert-danger p-2" role="alert">{this.state.errorMessage}</div>
          </FormRow>
        }
        <FormGroup>
          <input id="signInForm1" type="text" name="username" className="form-control"
            placeholder="Username" value={this.state.username} onChange={this.handleChange}
              aria-label="Username" required>
          </input>
        </FormGroup>
        <FormGroup>
          <input id="signInForm2" type="password" name="password" className="form-control"
            placeholder="Password" value={this.state.password} onChange={this.handleChange}
              aria-label="Password" required>
          </input>
        </FormGroup>
        <FormGroup className="mb-2">
          <FormSubmit className="w-100">Sign In</FormSubmit>
        </FormGroup>
      </Form>
    );
  }
}
