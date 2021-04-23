import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col, RowDivider } from "../../../components/layout.js";
import { getUserFullName, ProfilePhoto } from '../../../components/users.js';
import { getAge } from '../../../components/dates.js';
import { Button } from "../../../components/buttons.js";
import { MdIcon } from "../../../components/icons.js";
import { InfoWidget } from '../../../components/widget.js';


function Title(props) {
  return (
    <Row>
      <Col>
        <h4 className="my-0 text-center text-sm-left">{props.children}</h4>
      </Col>
    </Row>
  );
}

function SubTitle(props) {
  return (
    <Row>
      <Col>
        <h6 className={props.className}>{props.children}</h6>
      </Col>
    </Row>
  );
}

function InfoRow(props) {
  return (
    <Row className="text-muted">
      <Col className="d-flex align-items-center">
        <MdIcon>{props.icon}</MdIcon>
        <p className="my-0 px-2">{props.content}</p>
      </Col>
    </Row>
  );
}


function Username(props) {
  return (props.user.username) ? `@${props.user.username}` : ""
}

function BioData(props) {
  let content = [];

  if (props.user) {
    if (props.user.isPhysician) {
      if (props.user.qualification) {
        content.push(props.user.qualification);
      }
      if (props.user.specialization) {
        content.push(props.user.specialization);
      }
    } else {
      if (props.user.dob) {
        content.push(getAge(props.user.dob));
      }
      if (props.user.gender) {
        content.push(props.user.gender);
      }
    }
  }

  return `${content.join(', ')}`;
}

function Email(props) {
  return (props.user.emailId) ? props.user.emailId: "";
}

function PhoneNumber(props) {
  return (props.user.phoneNumber) ? props.user.phoneNumber: "";
}

function OptionButton(props) {
  return (
    <Button name={props.name} title={props.title}
      className="md-pfl-ovw-btn d-flex align-self-center"
        handleClick={props.handleClick} disabled={props.disabled}>
      {props.title}
    </Button>
  );
}

function OptionLink(props) {
  return (
    <Link to={props.url} role="button" className="btn md-pfl-ovw-btn d-flex align-self-center"
      data-toggle="tooltip" title={props.title}>
      {props.title}
    </Link>
  );
}


function OptionsBar(props) {
  const optionLinks = [];
  if (!props.session.isPhysician && props.user.isPhysician) {
    optionLinks.push({
      url: `/appointments?view=new&physician=${props.user.username}`,
      title: "Request Appointment"
    });
  }

  return (
    <Row className="justify-content-between">
      {(!props.session.isPhysician && props.user.isPhysician) &&
        <Col className="col-auto align-self-center">
          {optionLinks.map((link, index) => (
            <OptionLink url={link.url} title={link.title} />
          ))}
        </Col>
      }
    </Row>
  );
}


export default function OverviewWidget(props) {
  return (
    <InfoWidget>
      <FluidContainer>
        <Row>
          <Col className="col-12 col-sm-auto py-2 d-flex justify-content-center">
            {(Object.keys(props.user).length) ?
              <ProfilePhoto
                className="align-self-start md-pfl-bg"
                session={props.session}
                user={props.user}
              /> :
              <div className="d-none d-md-inline align-self-start mx-3">
                Loading...
              </div>
            }
          </Col>
          <Col className="col-12 col-sm">
            <FluidContainer>
              <Title>{getUserFullName(props.user)}</Title>
              <SubTitle className="text-muted text-center text-sm-left mb-3">
                <Username user={props.user} />
              </SubTitle>
              <InfoRow
                icon="person"
                content={<BioData user={props.user} />}
              />
              <InfoRow
                icon="email"
                content={<Email user={props.user} />}
              />
              <InfoRow
                icon="call"
                content={<PhoneNumber user={props.user} />}
              />
              <RowDivider className="my-2" />
              <OptionsBar
                session={props.session}
                user={props.user}
              />
            </FluidContainer>
          </Col>
        </Row>
      </FluidContainer>
    </InfoWidget>
  );
}
