import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { getUserFullName, ProfilePhoto } from "../../../components/users.js";
import { getAge } from "../../../components/dates.js";
import { Widget, TitleBar, WidgetBody } from '../../../components/widget.js';


function InfoRow(props){
  return (
    <p className="my-0 md-font-sm text-muted">{props.children}</p>
  );
}


function UserWidgetLayout(props) {
  return (
    <Widget>
      <TitleBar title={props.title} />
      <WidgetBody className="px-3 py-2">
        <FluidContainer>
          <Row>
            {(Object.keys(props.user).length) ?
              <ProfilePhoto
                className="float-left my-1"
                session={props.session}
                user={props.user}
                className="md-pfl-sm"
              /> :
              <div>Loading...</div>
            }
            <Col>
              <Link to={`/users/${props.user.username}`} className="my-0">
                {getUserFullName(props.user)}
              </Link>
              {props.children}
            </Col>
          </Row>
        </FluidContainer>
      </WidgetBody>
    </Widget>
  );
}


export class PatientWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    }
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.info.username}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        user: data
      });
    } catch (err) {
      console.error(`Failed to load patient information. ${err}`);
    }
  }

  render() {
    return (
      <UserWidgetLayout
        title="Patient Information"
        session={this.props.session}
        user={this.state.user}
      >
        <InfoRow>{`${getAge(this.state.user.dob)}, ${this.state.user.gender}`}</InfoRow>
      </UserWidgetLayout>
    );
  }
}


export class PhysicianWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    }
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.info.username}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        user: data
      });
    } catch (err) {
      console.error(`Failed to load physician information. ${err}`);
    }
  }

  render() {
    return (
      <UserWidgetLayout
        title="Physician Information"
        session={this.props.session}
        user={this.state.user}
      >
        <InfoRow>{this.state.user.qualification}, {this.state.user.specialization}</InfoRow>
      </UserWidgetLayout>
    );
  }
}
