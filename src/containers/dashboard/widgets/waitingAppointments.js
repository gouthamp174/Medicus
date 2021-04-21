import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Widget, TitleBar, WidgetList, WidgetListItem } from "../../../components/widget.js";
import { getTimeInString } from "../../../components/dates.js";


function DefaultAppointmentItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No appointments available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


function AppointmentItem(props) {
  const date = new Date(props.appointment.startTime);
  return(
    <WidgetListItem className="list-group-item-action">
      <Link to={`/appointments/${props.appointment.id}`}>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate">{props.appointment.title}</Col>
                <Col className="col-auto">{`${getTimeInString(date)}`}</Col>
              </Row>
            </Col>
          </Row>
        </FluidContainer>
      </Link>
    </WidgetListItem>
  );
}


export default class RecentAppointmentsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      limit: 5,
      appointments: []
    };
  }

  async componentDidMount() {
    try {
      const username = this.props.session.username;
      const page = this.state.page;
      const limit = this.state.limit;

      const response = await fetch(`/api/appointments?view=waiting&page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        appointments: data
      });
    } catch (err) {
      console.error(`Failed to to load recent appointments widget. ${err}`);
    }
  }

  render() {
    let appointmentItems = []
    if (this.state.appointments && this.state.appointments.length) {
      for (const [idx, appointment] of this.state.appointments.entries()) {
        let appointmentItem = (
          <AppointmentItem
            key={idx}
            session={this.props.session}
            appointment={appointment}
          />
        );
        appointmentItems.push(appointmentItem);
      }
    } else {
      let appointmentItem = (
        <DefaultAppointmentItem key="default" />
      );
      appointmentItems.push(appointmentItem);
    }

    return (
      <Widget>
        <TitleBar title="Waiting Appointments" />
        <WidgetList>
          {appointmentItems}
        </WidgetList>
      </Widget>
    );
  }
}
