import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { getUserFullName } from "../../../components/users.js";
import { getMonthInFullName, getTimeInString,
  getDateInPrettyString, getAge } from "../../../components/dates.js";
import { WidgetRow, InfoWidget } from '../../../components/widget.js';
import ManageBar from "../manageBar.js";


export function TitleRow(props) {
  return (
    <h4 className="row col mb-4">{props.title}</h4>
  );
}


export function InfoRow(props) {
  let colorClass = (props.colorClass) ? props.colorClass: "";

  return (
    <Row className="mb-1">
      <i className={`col-auto material-icons md-24 ${colorClass}`}>{props.icon}</i>
      <p className={`col my-0 pl-1 text-truncate align-self-center ${colorClass}`}>
        {props.name}
      </p>
    </Row>
  )
}


export function StatusInfoRow(props) {
  let colorClass = "btn-pending";
  if (props.status === "Accepted" || props.status === "Ongoing" || props.status === "Completed") {
    colorClass = "btn-accept";
  } else if (props.status === "Rejected") {
    colorClass = "btn-reject";
  }

  return (
    <InfoRow icon="event" name={props.status} />
  );
}


export default function OverviewWidget(props) {
  if (!props.appointment.id) {
    return null;
  }

  const startTime = new Date(props.appointment.startTime);
  const endTime = new Date(props.appointment.endTime);

  let dateString = "";
  const sameDay = (startTime.toDateString() === endTime.toDateString()) ? true: false;
  if (sameDay) {
    dateString = `${getTimeInString(startTime)} - ${getTimeInString(endTime)}, ${getDateInPrettyString(startTime)}`;
  } else {
    dateString = `${getTimeInString(startTime)}, ${getDateInPrettyString(startTime)} - ${getTimeInString(endTime)}, ${getDateInPrettyString(endTime)}`;
  }

  return (
    <InfoWidget>
      <div className="media">
        <div className="d-none d-md-inline mr-3">
          <FluidContainer>
            <Row className="justify-content-center">
              <Col>
                <h1 className="mb-0 md-appt-vw-date font-weight-bold text-center">
                  {startTime.getDate()}
                </h1>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col>
                <h3 className="font-weight-bold text-center">
                  {getMonthInFullName(startTime.getMonth())}
                </h3>
              </Col>
            </Row>
          </FluidContainer>
        </div>
        <FluidContainer className="media-body">
          <TitleRow title={props.appointment.title} />
          <Row>
            <Col className="col-12 col-md-6">
              <StatusInfoRow status={props.appointment.status} />
            </Col>
            <Col className="col-12 col-md-6">
              <InfoRow icon="timer" name={dateString} />
            </Col>
          </Row>
          <Row>
            <Col className="col-12 col-md-6">
              <InfoRow icon="person" name={getUserFullName(props.appointment.patient)} />
            </Col>
            <Col className="col-12 col-md-6">
              <InfoRow icon="local_hospital" name={getUserFullName(props.appointment.physician)} />
            </Col>
          </Row>
          <Row>
            <Col className="col-12 col-md-6">
              <InfoRow icon="medical_services" name={props.appointment.serviceName} />
            </Col>
            <Col className="col-12 col-md-6">
              <InfoRow icon="payment" name={`$${props.appointment.serviceCharge}`} />
            </Col>
          </Row>
          <Row className="my-2">
            <Col>
              <div className="border-top" />
            </Col>
          </Row>
          <ManageBar
            session={props.session}
            appointment={props.appointment}
            handleStatus={props.handleStatus}
            handleDelete={props.handleDelete}
            listView={false}
          />
        </FluidContainer>
      </div>
    </InfoWidget>
  );
}
