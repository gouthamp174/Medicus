import React from 'react';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { TopBar } from '../home/topbar.js';
import User from "./user.js";


export default class UserView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: ""
    };

    this.updateTitle = this.updateTitle.bind(this);
  }

  async updateTitle(newTitle) {
    this.setState({
      title: newTitle
    });
  }

  render() {
    return (
      <FluidContainer className="h-100 overflow-y">
        <TopBar title={this.state.title} />
        <Row>
          <Col className="py-3">
            <User
              session={this.props.session}
              username={this.props.username}
              updateTitle={this.updateTitle}
              listView={false}
            />
          </Col>
        </Row>
      </FluidContainer>
    );
  }
}
