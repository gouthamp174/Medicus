import React from 'react';
import { Form, FormRow, FormGroup, FormSubmit } from "../../components/form.js";
import { LgIcon } from "../../components/icons.js";


export default class SendMessageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
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
    if (this.props.disable) {
      return false;
    }

    try {
      const timestamp = new Date();

      const response = await this.props.channel.emit('chat', {
        chatId: this.props.chatId,
        sender: this.props.sender,
        timestamp: timestamp,
        content: this.state.content
      });

      this.setState({
        content: ""
      });
    } catch (err) {
      console.error(`Failed to send chat message. ${err}`);
    }
  }

  render() {
    const isDisabled = this.props.disable;

    return (
      <Form className="w-100 md-send-form" autoComplete="off" handleSubmit={this.handleSubmit}>
        <FormRow>
          <FormGroup className="col my-2">
            <input type="text" name="content" className="form-control" placeholder=""
              aria-label="Input chat message" value={this.state.content} onChange={this.handleChange}
                disabled={isDisabled}>
            </input>
          </FormGroup>
          <FormGroup className="col-auto my-2 d-flex align-items-center">
            <FormSubmit className="btn-round md-btn-send px-2 d-flex align-items-center"
              disabled={isDisabled}>
              <LgIcon>send</LgIcon>
            </FormSubmit>
          </FormGroup>
        </FormRow>
      </Form>
    );
  }
}
