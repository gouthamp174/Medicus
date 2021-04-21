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
      inputDescription: "",
      appointmentDescription: ""
    }

    this.handleChange = this.handleChange.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        appointmentDescription: data.description
      });
    } catch (err) {
      console.error(`Failed to load description. ${err}`);
    }
  }

  async handleChange(e) {
    event.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async clickedEdit(e) {
    event.preventDefault();
    const appointmentDescription = this.state.appointmentDescription;
    this.setState({
      editMode: true,
      inputDescription: appointmentDescription
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
      const response = await fetch(`/api/appointments/${this.props.id}`, {
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

      this.setState({
        editMode: false,
        appointmentDescription: this.state.inputDescription
      });
    } catch (err) {
      console.error(`Failed to update description. ${err}`);
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
          <FormRow className="my-2">
            <textarea id="descriptionInput01" type="text" name="inputDescription" className="form-control"
              rows="3" value={this.state.inputDescription} onChange={this.handleChange}
                placeholder="Add a description about the appointment.">
            </textarea>
          </FormRow>
          <FormRow className="my-2 justify-content-center">
            <FormSubmit className="btn-primary col-auto col-md-4">Save</FormSubmit>
          </FormRow>
        </Form>
      );
    } else {
      content = (
        <FluidContainer>
          <Row>
            {this.state.appointmentDescription}
          </Row>
        </FluidContainer>
      )
    }

    return (
      <Widget>
        <TitleBar title="Description">
          {(this.state.editMode) ?
            <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
            <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
          }
        </TitleBar>
        <WidgetBody>
          {content}
        </WidgetBody>
      </Widget>
    );
  }
}
