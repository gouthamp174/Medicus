import React from 'react';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { TopBar, TopBarLinks, TopBarLink, TopBarButton } from '../home/topbar.js';
import { MessageSection, DisabledMessageSection } from './messageSection.js';
import SendMessageForm from './sendChat.js';


export default class ChatView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: null,
      isCurrentUserActive: false,
      id: "",
      title: "",
      host: "",
      members: [],
      activeMembers: [],
      startTime: "",
      appointmentId: ""
    };

    this.setChannel = this.setChannel.bind(this);
    this.unsetChannel = this.unsetChannel.bind(this);
    this.joinChat = this.joinChat.bind(this);
    this.leaveChat = this.leaveChat.bind(this);
  }

  async componentDidMount() {
    try {
      const currentUser = this.props.session.username;

      const response = await fetch(`/api/chats/${this.props.match.params.id}`, {
        credentials: 'same-origin',
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        isCurrentUserActive: (data.activeMembers && data.activeMembers.includes(currentUser)) ? true: false,
        id: data.id,
        title: data.title,
        host: data.host,
        members: data.members,
        activeMembers: data.activeMembers,
        startTime: data.startTime,
        appointmentId: data.appointmentId
      });
    } catch (err) {
      console.log(`Failed to get chat information. ${err}`);
    }
  }

  async setChannel(channel) {
    this.setState({
      channel: channel
    });
  }

  async unsetChannel(channel) {
    this.setState({
      channel: null
    });
  }

  async joinChat(e) {
    event.preventDefault();
    try {
      const chatId = this.props.match.params.id;
      const currentUser = this.props.session;

      const response = await fetch(`/api/chats/${chatId}/activeMembers`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify({
          username: currentUser.username
        })
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        isCurrentUserActive: true
      });
    } catch (err) {
      console.error(`Failed to join chat. ${err}`);
    }
  }

  async leaveChat(e) {
    event.preventDefault();
    try {
      const chatId = this.props.match.params.id;
      const currentUser = this.props.session;

      const response = await fetch(`/api/chats/${chatId}/activeMembers/${currentUser.username}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        isCurrentUserActive: false
      });
    } catch (err) {
      console.error(`Failed to leave chat. ${err}`);
    }
  }

  render() {
    return (
      <FluidContainer className="h-100 overflow-y d-flex flex-column">
        <TopBar title={this.state.title} >
          <TopBarLinks>
            <TopBarLink title="Go to Appointment" icon="event"
              path={`/appointments/${this.state.appointmentId}`}
            />
            {(!this.state.isCurrentUserActive) ?
              <TopBarLink title="Join Chat" icon="arrow_circle_up" handleClick={this.joinChat} /> :
              <TopBarLink title="Leave Chat" icon="arrow_circle_down" handleClick={this.leaveChat} />
            }
          </TopBarLinks>
        </TopBar>
        {(this.state.isCurrentUserActive) ?
          <>
            <MessageSection
              chatId={this.props.match.params.id}
              session={this.props.session}
              channel={this.state.channel}
              setChannel={this.setChannel}
              unsetChannel={this.unsetChannel}
            />
          </> :
          <>
            <DisabledMessageSection />
          </>
        }
        <footer className="row md-chat-inpbar p-2 justify-content-center">
          <SendMessageForm
            channel={this.state.channel}
            chatId={this.props.match.params.id}
            sender={this.props.session.username}
            disable={(!this.state.isCurrentUserActive) ? true: false}
          />
        </footer>
      </FluidContainer>
    );
  }
}
