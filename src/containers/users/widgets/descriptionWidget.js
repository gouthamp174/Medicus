import React from 'react';
import { FluidContainer, Row } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody } from '../../../components/widget.js';


export default class DescriptionWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      errorMessage: "",
      inputDescription: ""
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
      editMode: true,
      inputDescription: this.props.user.description
    });
  }

  async clickedCancel(e) {
    event.preventDefault();
    this.setState({
      editMode: false,
      inputDescription: ""
    });
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const response = await fetch(`/api/users/${this.props.user.username}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify({
          description: this.state.inputDescription
        })
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      await this.props.updateUser({ description: this.state.inputDescription });

      this.setState({
        editMode: false,
        inputDescription: ""
      });
    } catch (err) {
      console.error(`Failed to update 'about me' information. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    let content
    if (this.state.editMode) {
      content = (
        <Form className="container-fluid" handleSubmit={this.handleSubmit}>
          {(this.state.errorMessage) &&
            <FormRow className="justify-content-center">
              <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
            </FormRow>
          }
          <FormGroup>
            <textarea id="descriptionInput01" type="text" name="inputDescription"
              className="form-control"  rows="3" value={this.state.inputDescription}
                onChange={this.handleChange} placeholder="Add a brief description about yourself.">
            </textarea>
          </FormGroup>
          <FormRow className="justify-content-center">
            <FormSubmit className="col-auto col-md-4">Save</FormSubmit>
          </FormRow>
        </Form>
      );
    } else {
      content = (
        <FluidContainer>
          <Row>
            {this.props.user.description}
          </Row>
        </FluidContainer>
      )
    }

    return (
      <Widget>
        <TitleBar title="About Me">
          {this.props.canEdit &&
            (
              (this.state.editMode) ?
              <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
              <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
            )
          }
        </TitleBar>
        <WidgetBody>
          {content}
        </WidgetBody>
      </Widget>
    );
  }
}
