import React from 'react';
import { Widget, TitleBar, TitleButtons, TitleButton, WidgetBody } from '../../../components/widget.js';


export default class DeleteUserWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validateMode: false
    }

    this.clickedDelete = this.clickedDelete.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.clickedAccept = this.clickedAccept.bind(this);
  }

  async clickedDelete(e) {
    event.preventDefault();
    this.setState({
      validateMode: true
    });
  }

  async clickedCancel(e) {
    event.preventDefault();
    this.setState({
      validateMode: false
    });
  }

  async clickedAccept(e) {
    event.preventDefault();
    try {
      const deleteResponse = await fetch(`/api/users/${this.props.session.username}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await deleteResponse.json();
      if (!deleteResponse.ok) {
        throw new Error(data.message);
      }

      const signOutResponse = await fetch(`/api/auth/signout`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      data = await signOutResponse.json();
      if (!signOutResponse.ok) {
        throw new Error(data.message);
      }

      await this.props.setSession({
        authToken: "",
				username: "",
				firstName: "",
        lastName: "",
				isPhysician: false,
        profilePhoto: null
      });
    } catch (err) {
      console.error(`Failed to delete user. ${err}`);
    }
  }

  render() {
    return (
      <Widget>
        <TitleBar title="Delete Account">
          {(this.state.validateMode) ?
            <>
              <TitleButtons>
                <li class="nav-item">
                  <TitleButton name="Accept" icon="check" handleClick={this.clickedAccept} />
                </li>
                <li class="nav-item">
                  <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} />
                </li>
              </TitleButtons>
            </> :
            <>
              <TitleButton name="Delete" icon="delete" handleClick={this.clickedDelete} />
            </>
          }
        </TitleBar>
        {this.state.validateMode &&
          <WidgetBody>
            <div class="alert alert-danger" role="alert">
              Once your account is deleted, all your information is removed from our website and it cannot be retrieved back.
              Please reconsider once before proceeding. We're sad to see you leave.
            </div>
          </WidgetBody>
        }
      </Widget>
    );
  }
}
