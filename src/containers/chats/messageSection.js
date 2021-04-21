import React from 'react';
import { io } from 'socket.io-client';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { getDateInPrettyString, getTimeInString } from "../../components/dates.js";
import { getUserFullName } from "../../components/users.js";


export function DisabledMessageSection(props) {
  return (
    <Row className="flex-grow-1 overflow-y">
      <Col className="align-self-center">
        <h4 className="text-center text-muted">
          Please join the chat to view chat messages.
        </h4>
      </Col>
    </Row>
  );
}


export class MessageSection extends React.Component {
  constructor(props) {
    super(props);
    this.messageRef = React.createRef();

    this.state = {
      limit: 10,
      page: 0,
      messages: []
    };

    this.connectChannel = this.connectChannel.bind(this);
    this.receiveFromChannel = this.receiveFromChannel.bind(this);
    this.onChannelDisconnect = this.onChannelDisconnect.bind(this);
    this.appendMessages = this.appendMessages.bind(this);
    this.handleOnScrollTop = this.handleOnScrollTop.bind(this);
    this.scrollToChatBottom = this.scrollToChatBottom.bind(this);
  }

  async componentDidMount() {
    try {
      await this.connectChannel();
    } catch (err) {
      console.log(`Failed to establish chat channel. ${err}`)
    }

    try {
      this.appendMessages();
      this.handleOnScrollTop();
    } catch (err) {
      console.error(`Failed to retrieve initial chat messages.`);
    }
  }

  async componentWillUnmount() {
    try {
      if (this.props.channel) {
        await this.props.channel.emit('leave',
          {
            chatId: this.props.chatId
          },
          (response) => {
            if (response.status === "ok") {
              console.log("Left chat session.");
            } else {
              console.log("Failed to leave chat session.");
            }
          }
        );

        await this.props.channel.close();
        console.debug(`Channel connection status: ${this.props.channel.connected}`);
      }

      console.log("Closed connection to server.");
      await this.props.unsetChannel();
    } catch (err) {
      console.error(`Failed to close to server. ${err}`);
    }
  }

  async connectChannel() {
    try {
      const channel = io();

      await channel.on('connect', () => {
        console.debug(`Channel connection status: ${channel.connected}`);
        console.log("Connected to server.");
      });

      channel.on('disconnect', this.onChannelDisconnect);

      await channel.emit('join',
        {
          chatId: this.props.chatId
        },
        (response) => {
          if (response.status === "ok") {
            console.log("Joined chat session.");
          } else {
            console.log("Failed to join chat session.");
          }
        }
      );

      channel.on('chat', this.receiveFromChannel);

      await this.props.setChannel(channel);
    } catch (err) {
      console.error(`Failed to establish a connection to server. ${err}`);
    }
  }

  async receiveFromChannel(data) {
    try {
      const newMessages = this.state.messages;
      const newCount = newMessages.push(data);

      this.setState({
        page: Math.ceil(newCount/this.state.limit),
        messages: newMessages
      });

      this.scrollToChatBottom();
    } catch (err) {
      console.error(`Failed to receive chat message from server. ${err}`);
    }
  }

  async onChannelDisconnect() {
    try {
      if (this.state.channel && !this.state.channel.connected) {
        this.connectChannel();
      }
    } catch (err) {
      console.error(`Failed to disconnect and reconnect to server. ${err}`);
    }
  }

  async appendMessages() {
    try {
      const messagesResponse = await fetch(`/api/chats/${this.props.chatId}/messages?page=${this.state.page}&limit=${this.state.limit}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await messagesResponse.json();
      if (!messagesResponse.ok) {
        throw new Error(data.message);
      }

      const newMessages = data.reverse();
      const prevMessages = this.state.messages;
      const newCount = newMessages.push.apply(newMessages, prevMessages);

      this.setState({
        page: Math.ceil(newCount / this.state.limit),
        messages: newMessages
      });

    } catch (err) {
      console.error(`Failed to append chat messages. ${err}`);
    }
  }

  async handleOnScrollTop() {
    try {
      this.messageRef.current.addEventListener("scroll", () => {
        if (this.messageRef.current.scrollTop <= 0) {
          setTimeout(() => {
            this.appendMessages()
          }, 2000);
        }
      });

    } catch (err) {
      console.error(`Failed to append more messages. ${err}`);
    }
  }

  async scrollToChatBottom() {
    try {
      if (this.messageRef.current.scrollHeight - this.messageRef.current.clientHeight > 0) {
        let height = this.messageRef.current.scrollHeight - this.messageRef.current.clientHeight;
        this.messageRef.current.scrollTo({
          top: height,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        this.messageRef.current.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      console.error(`Failed to scroll to the bottom of chat. ${err}`);
    }
  }

  render() {
    let lastTimestamp = null;
    let lastUsername = "";
    const messageItems = [];
    for (const [idx, message] of this.state.messages.entries()) {

      let timestamp = new Date(message.timestamp);
      if (!lastTimestamp || lastTimestamp.toDateString() !== timestamp.toDateString()) {

        let dateItem = (
          <Row key={`date-${idx}`} className="justify-content-center mt-3">
            <Col className="col-auto md-chat-sys">
              <p className="md-font-sm my-0">{getDateInPrettyString(timestamp)}</p>
            </Col>
          </Row>
        );

        messageItems.push(dateItem);
        lastTimestamp = timestamp;
        lastUsername = "";
      }

      let username = message.sender;
      let isCurrentUser = (this.props.session.username === username) ? true: false

      let chatAlign = (isCurrentUser) ? "justify-content-end": "justify-content-start";
      let chatColor = (isCurrentUser) ? "md-chat-out": "md-chat-in";
      let chatSpacing = (lastUsername === username) ? "mt-1": "mt-3";

      let messageItem = (
        <Row key={idx} className={`${chatAlign} ${chatSpacing}`}>
          <Col className="col-10">
            <Row className={chatAlign}>
              <FluidContainer className={`md-chat-msg ${chatColor} mx-2 p-2`}>
                <p className="my-0">{message.content}</p>
                <footer className="d-flex justify-content-end">
                  <p className="my-0 md-font-xs text-muted">{getTimeInString(timestamp)}</p>
                </footer>
              </FluidContainer>
            </Row>
          </Col>
        </Row>
      );

      messageItems.push(messageItem);
      lastUsername = message.sender;
    }

    return (
      <div ref={this.messageRef} className="row md-chat flex-grow-1 overflow-y">
        <Col>
          {messageItems}
        </Col>
      </div>
    );
  }
}
