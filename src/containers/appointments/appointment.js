import React from 'react';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { ListItem, ListLink } from "../../components/list.js";
import { getUserFullName } from '../../components/users.js';
import { getMonthInName, getTimeInString, getDateInPrettyString } from '../../components/dates.js';
import { MdIcon } from "../../components/icons.js";
import { WidgetRow } from "../../components/widget.js";

import ManageBar from "./manageBar.js";
import OverviewWidget from "./widgets/overviewWidget.js";
import { PatientWidget, PhysicianWidget } from './widgets/usersWidget.js';
import DescriptionWidget from './widgets/descriptionWidget.js';
import PaymentsWidget from './widgets/paymentsWidget.js';
import NotesWidget from './widgets/notesWidget.js';
import MedicationsWidget from './widgets/medicationsWidget.js';
import ReportsWidget from './widgets/reportsWidget.js';


function StatusIndicator(props) {
  let colorClass;
  switch (props.status) {
    case "Accepted":
    case "Completed":
      colorClass = "st-accept";
      break;
    case "Rejected":
      colorClass = "st-reject";
      break;
    default:
      colorClass = "st-pending";
  }

  return (
    <div className={`md-appt-st ${colorClass} d-flex justify-content-center align-items-center p-1`}>
      <MdIcon>event</MdIcon>
      <p className="ml-1 md-font-sm font-weight-bold my-0">{props.status}</p>
    </div>
  );
}


function PaymentIndicator(props) {
  let colorClass;
  if (props.paymentBalance === 0) {
    colorClass = "st-accept";
  } else {
    colorClass = "st-pending";
  }

  return (
    <div className={`md-appt-pmt ${colorClass} d-flex justify-content-center align-items-center p-1`}>
      <MdIcon>paid</MdIcon>
      <p className="ml-1 md-font-sm font-weight-bold my-0">{props.paymentBalance}</p>
    </div>
  );
}


export function AppointmentListItem(props) {
  if (!Object.keys(props.appointment).length) {
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
    const startTime = new Date(props.appointment.startTime);
    const endTime = new Date(props.appointment.endTime);

    // End Date
    let endDate = "";
    if (startTime.toDateString() !== endTime.toDateString()) {
      endDate = getDateInPrettyString(endTime);
    }

    //Display Name
    const currentUserFullName = getUserFullName(props.session);
    const patientFullName = getUserFullName(props.appointment.patient);
    const physicianFullName = getUserFullName(props.appointment.physician);
    const displayName = (currentUserFullName === patientFullName) ? physicianFullName : patientFullName;

    return (
      <ListLink url={`/appointments/${props.appointment.id}`}
        className="md-appt md-appt-li px-3 my-1">
        <FluidContainer>
          <Row>
            <Col className="col-2 col-md-2 col-lg-2 col-xl-1 p-0 align-self-center">
              <h6 className="text-center my-0">{getTimeInString(startTime)}</h6>
            </Col>
            <Col className="col-md-2 col-lg-2 col-xl-2 p-0 d-none d-md-inline align-self-center">
              <h6 className="text-center my-0">{getTimeInString(endTime)}</h6>
              {endDate &&
                <p className="md-font-sm text-center text-muted my-0">{endDate}</p>
              }
            </Col>
            <Col className="col-6 col-md-5 col-lg-4 col-xl-4">
              <h6 className="text-truncate my-0">{displayName}</h6>
              <p className="md-font-sm text-truncate text-muted my-0">{props.appointment.title}</p>
            </Col>
            <Col className="col-4 col-md-3 col-lg-4 col-xl-3 align-self-center">
              <Row>
                <Col className="align-self-center">
                  <StatusIndicator status={props.appointment.status} />
                </Col>
                <Col className="align-self-center d-none d-lg-inline">
                  <PaymentIndicator paymentBalance={props.appointment.paymentBalance} />
                </Col>
              </Row>
            </Col>
            <Col className="col-xl-2 d-none d-xl-inline align-self-center">
              <ManageBar
                session={props.session}
                appointment={props.appointment}
                handleStatus={props.handleStatus}
                handleDelete={props.handleDelete}
                listView={true}
              />
            </Col>
          </Row>
        </FluidContainer>
      </ListLink>
    );
  }
}

export function AppointmentDetailItem(props) {
  const loadAdditionalInfo = (props.appointment && Object.keys(props.appointment).length !== 0);

  return (
    <FluidContainer>
      <WidgetRow>
        <Col>
          <OverviewWidget
            session={props.session}
            appointment={props.appointment}
            handleStatus={props.handleStatus}
            handleDelete={props.handleDelete}
          />
        </Col>
      </WidgetRow>
      {loadAdditionalInfo &&
        <WidgetRow>
          <Col className="col-12 col-md-6">
            <PatientWidget
              session={props.session}
              info={props.appointment.patient}
            />
            <PhysicianWidget
              session={props.session}
              info={props.appointment.physician}
            />
            <DescriptionWidget
              session={props.session}
              id={props.appointment.id}
            />
            <PaymentsWidget
              session={props.session}
              id={props.appointment.id}
              patient={props.appointment.patient}
              serviceCharge={props.appointment.serviceCharge}
              paymentBalance={props.appointment.paymentBalance}
              handleBalance={props.updatePaymentBalance}
            />
          </Col>
          <Col className="col-12 col-md-6">
            <NotesWidget
              session={props.session}
              id={props.appointment.id}
            />
            <MedicationsWidget
              session={props.session}
              id={props.appointment.id}
              patient={props.appointment.patient}
            />
            <ReportsWidget
              session={props.session}
              id={props.appointment.id}
              patient={props.appointment.patient}
            />
          </Col>
        </WidgetRow>
      }
    </FluidContainer>
  );
}


export default class Appointment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointment: {}
    };

    this.handleStatus = this.handleStatus.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.updatePaymentBalance = this.updatePaymentBalance.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        appointment: data
      });

      if (this.props.updateChatId) {
        await this.props.updateChatId(data.chatId);
      }
    } catch (err) {
      console.log(`Failed to get appointment information. ${err.message}`)
    }
  }

  async handleStatus(e) {
    event.preventDefault();
    try {
      const newStatus = e.currentTarget.name;

      const response = await fetch(`/api/appointments/${this.props.id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const updatedAppointment = this.state.appointment;
      updatedAppointment.status = newStatus;

      this.setState({
        appointment: updatedAppointment
      });
    } catch (err) {
      console.log(`Failed to handle status change for appointment- ${this.props.id}. ${err}`)
    }
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      const response = await fetch(`/api/appointments/${this.props.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.props.deleteAppointment(this.props.id);
    } catch (err) {
      console.log(`Failed to delete appointment- ${this.props.id}. ${err}`)
    }
  }

  async updatePaymentBalance(newBalance) {
    const newAppointment = this.state.appointment;
    newAppointment.paymentBalance = newBalance;

    this.setState({
      appointment: newAppointment
    });
  }

  render() {
    if (this.props.listView) {
      return (
        <AppointmentListItem
          session={this.props.session}
          appointment={this.state.appointment}
          handleStatus={this.handleStatus}
          handleDelete={this.handleDelete}
        />
      );

    } else {
      return (
        <AppointmentDetailItem
          session={this.props.session}
          appointment={this.state.appointment}
          handleStatus={this.handleStatus}
          handleDelete={this.handleDelete}
          updatePaymentBalance={this.updatePaymentBalance}
        />
      );
    }
  }
}
