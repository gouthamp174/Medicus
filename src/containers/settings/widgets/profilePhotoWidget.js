import React, { Suspense } from 'react';
import { SessionContext } from '../../../context/context.js';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody } from '../../../components/widget.js';
import { Photo } from "../../../components/users.js";


class SelectSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: "",
      name: "",
      data: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickedDelete = this.clickedDelete.bind(this);
  }

  async handleChange(e) {
     event.preventDefault();
     this.setState({
       name: e.target.value,
       data: e.target.files[0]
     });
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const username = this.props.session.username;

      let formData = new FormData();
      formData.append('data', this.state.data);
      formData.append('isProfilePhoto', true);

      const response = await fetch(`/api/users/${username}/photos`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: formData
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      await this.props.setSession({
        profilePhotoId: data.id
      });

      this.props.toggleEditMode();
    } catch (err) {
      console.error(`Failed to set new profile photo. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  async clickedDelete(e) {
    event.preventDefault();
    try {
      const username = this.props.session.username;
      const profilePhotoId = this.props.session.profilePhotoId;

      const response = await fetch(`/api/users/${username}/photos/${profilePhotoId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      await this.props.setSession({
        profilePhotoId: null
      });

      this.props.toggleEditMode();
    } catch (err) {
      console.error(`Failed to delete profile photo. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    return (
      <Form className="container-fluid" handleSubmit={this.handleSubmit} enctype="multipart/form-data">
        {(this.state.errorMessage) &&
          <FormRow className="justify-content-center">
            <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
          </FormRow>
        }
        <FormRow>
          <FormLabel for="profilePhoto01" className="col-12 col-sm-4">Select new photo</FormLabel>
          <FormGroup className="col-12 col-sm-auto">
            <FormRow>
              <input id="profilePhoto01" type="file" name="name" className="custom-file-input"
                value={this.state.name} onChange={this.handleChange}/>
              <label className="custom-file-label" for="generalInput07">
                {(this.state.name) ?
                  this.state.name.replace(/^.*[\\\/]/, '') :
                  "Choose a file..."
                }
              </label>
            </FormRow>
            {this.state.data &&
              <FormRow>
                <FluidContainer className="m-2">
                  <Row for="profilePhoto02">
                    <Col>Preview</Col>
                  </Row>
                  <Row>
                    <Col>
                      <Photo
                        id="profilePhoto02"
                        className="md-pfl-bg"
                        alt="Preview Photo"
                        src={this.state.data}
                      />
                    </Col>
                  </Row>
                </FluidContainer>
              </FormRow>
            }
            <FormRow className="mt-3">
              <FormSubmit>Set as Profile photo</FormSubmit>
            </FormRow>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="profilePhoto03" className="col-12 col-sm-4">Remove photo</FormLabel>
          <FormGroup className="col-12 col-sm-8">
            <FormRow>
              <button id="profilePhoto03" type="button" className="btn btn-danger"
                onClick={this.clickedDelete}>Remove</button>
            </FormRow>
          </FormGroup>
        </FormRow>
      </Form>
    );
  }
}


export default class ProfilePhotoWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false
    }

    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
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

  async toggleEditMode(e) {
    this.setState(prevState => ({
      editMode: !prevState.editMode
    }));
  }

  render() {
    const today = new Date();
    return (
      <Widget>
        <TitleBar title="Profile Photo">
          {(this.state.editMode) ?
            <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
            <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
          }
        </TitleBar>
        {this.state.editMode &&
          <WidgetBody>
            <SessionContext.Consumer>
              {sessionCtx => (
                <SelectSection
                  session={sessionCtx.session}
                  setSession={sessionCtx.setSession}
                  toggleEditMode={this.toggleEditMode}
                />
              )}
            </SessionContext.Consumer>
          </WidgetBody>
        }
      </Widget>
    );
  }
}
