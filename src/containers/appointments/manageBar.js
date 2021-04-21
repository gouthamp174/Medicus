import React from 'react';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { Button, CircularButton } from "../../components/buttons.js";
import { LgIcon } from "../../components/icons.js";


export class AppointmentButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(e) {
    e.stopPropagation();
    this.props.handleClick(e);
  }

  render() {
    if (this.props.listView) {
      return (
        <CircularButton name={this.props.name} title={this.props.title}
          className="btn-sm md-appt-ovw-lv-btn" handleClick={this.handleClick}
            disabled={this.props.disabled}>
          <LgIcon>{this.props.icon}</LgIcon>
        </CircularButton>
      );
    } else {
      return (
        <Button name={this.props.name} title={this.props.title}
          className="md-appt-ovw-btn d-flex align-self-center"
            handleClick={this.handleClick} disabled={this.props.disabled}>
          {this.props.title}
        </Button>
      );
    }
  }
}


export function DeleteButton(props) {
  var disabled = false;
  if (props.status === "Accepted" ||
    (props.status === "Completed" && props.paymentBalance !== 0)) {
    disabled = true;
  }

  return (
    <AppointmentButton
      title="Delete"
      icon="delete_outline"
      handleClick={props.handleClick}
      disabled={disabled}
      listView={props.listView}
    />
  );
}


export function StatusButtonGroup(props) {
  const statusButtons = [];
  if (props.status === "Pending" && props.isCurrentUserAPhysician) {
    statusButtons.push(
      { title:"Accept", icon:"check", name:"Accepted" },
      { title: "Reject", icon: "clear", name: "Rejected" }
    );
  } else if (props.status === "Accepted") {
    statusButtons.push({ title: "End", icon: "stop", name: "Completed" });
  }

  const statusButtonItems = []
  statusButtons.forEach((statusButton, idx) => {
    let statusButtonItem = (
      <Col className="mx-1 p-0 align-self-center">
        <AppointmentButton
          key={idx}
          title={statusButton.title}
          icon={statusButton.icon}
          name={statusButton.name}
          handleClick={props.handleClick}
          listView={props.listView}
        />
      </Col>
    );

    statusButtonItems.push(statusButtonItem);
  });

  return (
    <FluidContainer>
      <Row className="justify-content-center" aria-label="Status Options">
        {statusButtonItems}
      </Row>
    </FluidContainer>
  );
}


export default function ManageBar(props) {
  let isCurrentUserAPhysician = false;
  if (props.session && props.appointment) {
    const currentUsername = props.session.username;
    const physicianUseranme = props.appointment.physician.username;
    isCurrentUserAPhysician = (currentUsername === physicianUseranme) ? true: false;
  }

  return (
    <Row className="justify-content-between">
      <Col className="col-auto align-self-center">
        <StatusButtonGroup
          status={props.appointment.status}
          isCurrentUserAPhysician={isCurrentUserAPhysician}
          handleClick={props.handleStatus}
          listView={props.listView}
        />
      </Col>
      <Col className="col-auto align-self-center">
        <DeleteButton
          key="0"
          status={props.appointment.status}
          paymentBalance={props.appointment.paymentBalance}
          handleClick={props.handleDelete}
          listView={props.listView}
        />
      </Col>
    </Row>
  );
}
