import React from 'react';
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { List, ListItem } from "../../components/list.js";
import { TopBar, TopBarLinks, TopBarLink, SearchForm as TopBarSearch } from '../home/topbar.js';
import { getDateInPrettyString } from '../../components/dates.js';
import Appointment from "./appointment.js";


function AppointmentDateItem(props) {
  return (
    <ListItem className="mt-3 border-0 md-date-li">
      <FluidContainer>
        <Row className="justify-content-center">
          <Col className="col-auto md-date-item">
            <p className="md-font-sm my-0">{getDateInPrettyString(props.date)}</p>
          </Col>
        </Row>
      </FluidContainer>
    </ListItem>
  );
}


function AppointmentList(props) {
  let lastDate = null
  let appointmentItems = []

  for (const [idx, appointment] of props.appointments.entries()) {
    const startTime = new Date(appointment.startTime)
    const startDate = startTime.toDateString()

    if (lastDate === null || lastDate !== startDate) {
      let dateItem = (
        <AppointmentDateItem
          key={`date-${idx}`}
          date={startTime}
        />
      );

      appointmentItems.push(dateItem);
      lastDate = startDate;
    }

    let appointmentItem = (
      <Appointment
        key={idx}
        session={props.session}
        id={appointment.id}
        deleteAppointment={props.deleteAppointment}
        listView={true}
      />
    );

    appointmentItems.push(appointmentItem);
  }

  return (
    <List className="md-list">
      {appointmentItems}
    </List>
  );
}


export class AppointmentsView extends React.Component {
  constructor(props) {
    super(props);
    this.appointmentsRef = React.createRef();

    this.topbarLinks = [];
    if (!this.props.session.isPhysician) {
      this.topbarLinks.push({title: "New Appointment", icon: "add", path: "/appointments?view=new"});
    }

    this.state = {
      search: "",
      page: 0,
      limit: 10,
      appointments: []
    }

    this.getAppointments = this.getAppointments.bind(this);
    this.appendAppointments = this.appendAppointments.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
  }

  async componentDidMount() {
    try {
      await this.appendAppointments();

      this.appointmentsRef.current.addEventListener("scroll", () => {
        if (this.appointmentsRef.current.scrollTop +
            this.appointmentsRef.current.clientHeight >=
              this.appointmentsRef.current.scrollHeight) {
          this.timeoutId = setTimeout(() => {
            this.appendAppointments()
          }, 2000);
        }
      });
    } catch (err) {
      console.error(`Failed to get all appointments: ${err.message}`);
    }
  }

  async getAppointments({search, page, limit}) {
    try {
      const view = (this.props.view) ? `view=${this.props.view}&` : '';

      const response = await fetch(`/api/appointments?${view}search=${search}&page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let appointments = await response.json();
      if (!response.ok) {
        throw new Error(appointments.message);
      }

      return appointments
    } catch (err) {
      throw(err)
    }
  }

  async appendAppointments() {
    try {
      const appointments = await this.getAppointments({
        search: this.state.search,
        page: this.state.page,
        limit: this.state.limit
      });

      const newAppointments = this.state.appointments;
      const newCount = newAppointments.push.apply(newAppointments, appointments);

      this.setState({
        page: Math.ceil(newCount / this.state.limit),
        appointments: newAppointments
      });

    } catch (err) {
      console.error(`Failed to add appointments. ${err}`);
    }
  }

  async handleSearch(search) {
    try {
      const appointments = await this.getAppointments({
        search: search,
        page: 0,
        limit: this.state.limit
      });

      this.setState({
        search: search,
        page: Math.ceil(appointments.length / this.state.limit),
        appointments: appointments
      });
    } catch (err) {

    }
  }

  async deleteAppointment(id) {
    let newAppointments = this.state.appointments;
    newAppointments = newAppointments.filter(appointment => {
      return appointment.id !== id;
    });

    this.setState({
      appointments: newAppointments
    });
  }

  render() {
    return (
      <div ref={this.appointmentsRef} className="container-fluid h-100 overflow-y d-flex flex-column">
        <TopBar title={this.props.title}>
          <TopBarSearch handleSearch={this.handleSearch} />
          <TopBarLinks>
            {this.topbarLinks.map((link, index) => (
              <TopBarLink title={link.title} icon={link.icon} path={link.path} />
            ))}
          </TopBarLinks>
        </TopBar>
        <Row className="flex-grow-1">
          {(this.state.appointments.length) ?
            <Col>
              <AppointmentList
                session={this.props.session}
                appointments={this.state.appointments}
                deleteAppointment={this.deleteAppointment}
              />
            </Col> :
            <Col className="py-3 align-self-center">
              <h4 className="text-center text-muted">{this.props.defaultMessage}</h4>
            </Col>
          }
        </Row>
      </div>
    );
  }
}


export function AllAppointmentsView(props) {
  return (
    <AppointmentsView
      session={props.session}
      title="Appointments"
      defaultMessage="You don't have any appointments scheduled yet."
    />
  );
}

export function WaitingRoomView(props) {
  return (
    <AppointmentsView
      session={props.session}
      title="Waiting Room"
      view="waiting"
      defaultMessage="Hurray! You've caught up with all your appointments."
    />
  );
}

export function PaymentsView(props) {
  return (
    <AppointmentsView
      session={props.session}
      title="Payments"
      view="payments"
      defaultMessage="Way to go! You've completed payment for all your appointments."
    />
  );
}
