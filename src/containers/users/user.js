import React from 'react';
import { FluidContainer, Row, Col} from "../../components/layout.js";
import { ListItem, ListLink } from "../../components/list.js";
import { BodyCard } from "../../components/card.js";
import { WidgetRow } from "../../components/widget.js";
import { getUserFullName, ProfilePhoto } from '../../components/users.js';
import { getAge } from "../../components/dates.js";

import OverviewWidget from './widgets/overviewWidget.js';
import DescriptionWidget from './widgets/descriptionWidget.js';
import InsurancesWidget from './widgets/insurancesWidget.js';
import ReportsWidget from './widgets/reportsWidget.js';
import MedicationsWidget from './widgets/medicationsWidget.js';
import EducationWidget from './widgets/educationWidget.js';
import ExperienceWidget from './widgets/experienceWidget.js';
import ServicesWidget from './widgets/servicesWidget.js';


export function UserListItem(props) {
  if (!Object.keys(props.user).length) {
    return (
      <ListItem className="md-appt-li my-1">
        <FluidContainer>
          <Row>
            <Col className="text-center text-muted">Loading...</Col>
          </Row>
        </FluidContainer>
      </ListItem>
    );

  } else {
    let subTitle1 = []
    if (props.user.isPhysician) {
      if (props.user.qualification) {
        subTitle1.push(props.user.qualification);
      }

      if (props.user.specialization) {
        subTitle1.push(props.user.specialization);
      }
    } else {
      if (props.user.dob) {
        subTitle1.push(getAge(props.user.dob));
      }

      if (props.user.gender) {
        subTitle1.push(props.user.gender);
      }
    }

    return (
      <ListLink url={`/users/${props.user.username}`}
        className="md-appt-li my-1">
        <FluidContainer>
          <Row>
            <ProfilePhoto
              session={props.session}
              user={props.user}
              className="md-pfl-sm"
            />
            <Col>
              <div className="img float-left"></div>
              <h6 className="my-0">{getUserFullName(props.user)}</h6>
              <p className="md-font-sm text-muted my-1">{subTitle1.join(", ")}</p>
            </Col>
          </Row>
        </FluidContainer>
      </ListLink>
    );
  }
}


export function UserDetailItem(props) {
  const canEdit = (props.user.username === props.session.username) ? true: false;

  return (
    <FluidContainer>
      <WidgetRow>
        <Col>
          <OverviewWidget
            session={props.session}
            user={props.user}
          />
        </Col>
      </WidgetRow>
      {(props.user && props.user.hasOwnProperty('isPhysician')) &&
        <WidgetRow>
          <Col className="col-12 col-md-6">
            <DescriptionWidget
              canEdit={canEdit}
              session={props.session}
              user={props.user}
              updateUser={props.updateUser}
            />
            {(props.user.isPhysician) ?
              <>
                <ServicesWidget
                  canEdit={canEdit}
                  session={props.session}
                  username={props.user.username}
                />
              </> :
              <>
                <InsurancesWidget
                  canEdit={canEdit}
                  session={props.session}
                  username={props.user.username}
                />
              </>
            }
          </Col>
          <Col className="col-12 col-md-6">
            {(props.user.isPhysician) ?
              <>
                <EducationWidget
                  canEdit={canEdit}
                  session={props.session}
                  username={props.user.username}
                />
                <ExperienceWidget
                  canEdit={canEdit}
                  session={props.session}
                  username={props.user.username}
                />
              </> :
              <>
                <MedicationsWidget
                  canEdit={canEdit}
                  session={props.session}
                  username={props.user.username}
                />
                <ReportsWidget
                  canEdit={canEdit}
                  session={props.session}
                  username={props.user.username}
                />
              </>
            }
          </Col>
        </WidgetRow>
      }
    </FluidContainer>
  );
}


export default class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {}
    };

    this.updateUser = this.updateUser.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.username}`, {
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

      if (!this.props.listView) {
        if (this.props.updateTitle) {
          await this.props.updateTitle(getUserFullName(data));
        }
      }
    } catch (err) {
      console.error(`Failed to load user information. ${err}`);
    }
  }

  async updateUser(updateInfo) {
    let updatedUser = this.state.user;
    updatedUser = Object.assign(updatedUser, updateInfo);

    this.setState({
      user: updatedUser
    });
  }

  render() {
    if (this.props.listView) {
      return (
        <UserListItem
          session={this.props.session}
          user={this.state.user}
        />
      );
    } else {
      return (
        <UserDetailItem
          session={this.props.session}
          user={this.state.user}
          updateUser={this.updateUser}
        />
      );
    }
  }
}
