import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { TopBar, TopBarLinks, TopBarLink } from '../home/topbar.js';
import Appointment from "./appointment.js";


export default class AppointmentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDeleted: false,
      chatId: 0
    }

    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.updateChatId = this.updateChatId.bind(this);
  }

  async deleteAppointment(appointmentId) {
    this.setState({
      isDeleted: true
    });
  }

  async updateChatId(chatId) {
    this.setState({
      chatId: chatId
    });
  }

  render() {
    if (this.state.isDeleted) {
      return (
        <Redirect to="/appointments" />
      );
    }

    return (
      <FluidContainer className="h-100 overflow-y">
        <TopBar title="Appointment">
          <TopBarLinks>
            <TopBarLink path={`/chats/${this.state.chatId}`} icon="chat" title="Chat" />
          </TopBarLinks>
        </TopBar>
        <Row>
          <Col className="py-3">
            <Appointment
              session={this.props.session}
              id={this.props.match.params.id}
              deleteAppointment={this.deleteAppointment}
              updateChatId={this.updateChatId}
              listView={false}
            />
          </Col>
        </Row>
      </FluidContainer>
    );
  }
}
