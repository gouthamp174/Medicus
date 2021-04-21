import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../components/layout.js";
import { Widget, WidgetBody } from "../../components/widget.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormLegend } from "../../components/form.js";
import { YearInput, MonthNameInput, DateInput, TimeInput } from "../../components/dates.js";

import { TopBar } from '../home/topbar.js';


class NewAppointmentForm extends React.Component {
  constructor(props) {
    super(props);
    this.physicianRef = React.createRef();
    this.serviceRef = React.createRef();
    const today = new Date();

    this.state = {
      errorMessage: "",
      title: "",
      physician: (this.props.physician) ? this.props.physician: "",
      serviceId: 0,
      startDay: today.getDate(),
      startMonth: today.getMonth()+1,
      startYear: today.getFullYear(),
      startTime: "00:00",
      endDay: today.getDate(),
      endMonth: today.getMonth()+1,
      endYear: today.getFullYear(),
      endTime: "00:00",
      description: "",
      physicians: [],
      physicianPage: 0,
      physicianLimit: 10,
      services: [],
      servicesPage: 0,
      servicesLimit: 10,
      navigateToAppointments: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.appendToPhysicians = this.appendToPhysicians.bind(this);
    this.clickedPhysician = this.clickedPhysician.bind(this);
    this.appendToServices = this.appendToServices.bind(this);
  }

  async componentDidMount() {
    this.physicianRef.current.addEventListener("scroll", () => {
      if (this.physicianRef.current.scrollTop +
          this.physicianRef.current.clientHeight >=
            this.physicianRef.current.scrollHeight) {

        setTimeout(this.appendToPhysicians(this.state.physician,
          this.state.physicianPage, this.state.physicianLimit), 2000);
      }
    });

    if (this.props.physician) {
      this.appendToServices(this.state.physician,
        this.state.servicesPage, this.state.servicesLimit);
    }
  }

  async handleChange(e) {
    event.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });

    if (e.target.name === "physician") {
      this.appendToPhysicians(e.target.value, 0, this.state.physicianLimit);
    }
  }

  async appendToPhysicians(query, page, limit) {
    try {
      const response = await fetch(`/api/users?search=${query}&page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let physicians = await response.json();
      if (!response.ok) {
        throw new Error(physicians.message);
      }

      if (page === 0) {
        this.setState({
          physicians: physicians,
          physicianPage: Math.ceil(physicians.length / limit),
          serviceId: 0,
          services: [],
          servicesPage: 0
        });

      } else {
        const newPhysicians = this.state.physicians;
        const newCount = newPhysicians.push.apply(newPhysicians, physicians);

        this.setState({
          physicians: newPhysicians,
          physicianPage: Math.ceil(newCount / limit)
        });
      }
    } catch (err) {
      console.error(`Failed to append to physicians based on search. ${err}`);
    }
  }

  async clickedPhysician(e) {
    event.preventDefault();
    try {
      const username = e.target.name;
      await this.appendToServices(username, 0, this.state.servicesLimit);

      this.setState({
        physician: username,
        physicians: [],
        physicianPage: 0
      });
    } catch (err) {
      console.error(`Failed to accept selected physician. ${err}`);
    }
  }

  async appendToServices(query, page, limit) {
    try {
      const url = `/api/users/${query}/services?page=${page}&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let services = await response.json();
      if (!response.ok) {
        throw new Error(services.message);
      }

      let firstServiceId = 0
      if (services && services.length) {
        firstServiceId = services[0].id
      }

      if (page === 0) {
        this.setState({
          serviceId: firstServiceId,
          services: services,
          servicesPage: Math.ceil(services.length / limit)
        });

      } else {
        const newServices = this.state.services;
        const newCount = newServices.push.apply(newServices, services);

        this.setState({
          serviceId: firstServiceId,
          services: newServices,
          servicesPage: Math.ceil(newCount / limit)
        });
      }
    } catch (err) {
      console.error(`Failed to append to services for physician- ${query}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();

    try {
      const [ startHour, startMinutes ] = this.state.startTime.split(':').map(t => {return parseInt(t)});
      const [ endHour, endMinutes ] = this.state.endTime.split(':').map(t => {return parseInt(t)});

      const startTime = new Date(this.state.startYear, this.state.startMonth-1, this.state.startDay, startHour, startMinutes);
      const endTime = new Date(this.state.endYear, this.state.endMonth-1, this.state.endDay, endHour, endMinutes);

      if (endTime <= startTime) {
        throw new Error("End time must be greater that the Start time.");
      }

      const response = await fetch(`/api/appointments`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify({
          title: this.state.title,
          patient: this.props.session.username,
          physician: this.state.physician,
          serviceId: this.state.serviceId,
          startTime: startTime,
          endTime: endTime,
          description: this.state.description
        })
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        navigateToAppointments: true
      });
    } catch (err) {
      console.error(`Failed to add a new appointment: ${err.message}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    if (this.state.navigateToAppointments === true) {
      return <Redirect to="/appointments" />
    }

    const today = new Date();

    const physicianItems = [];
    for (const [idx, physician] of this.state.physicians.entries()) {
      let physicianItem = (
        <button key={idx} type="button"
          className="list-group-item list-group-item-action list-group-item-light"
            name={physician.username} onClick={this.clickedPhysician}>
          {`${physician.username} (${physician.firstName} ${physician.lastName})`}
        </button>
      );
      physicianItems.push(physicianItem);
    }

    const serviceItems = [];
    for (const [idx, service] of this.state.services.entries()) {
      let serviceItem = (
        <option key={idx} value={service.id}>{`${service.name} ($${service.rate})`}</option>
      );
      serviceItems.push(serviceItem);
    }

    return (
      <Form autoComplete="off" className="container-fluid py-2" handleSubmit={this.handleSubmit}>
        {(this.state.errorMessage) &&
          <FormRow className="justify-content-center">
            <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
          </FormRow>
        }
        <FormRow>
          <FormLabel for="newApptInput1" className="col-sm-2">Title</FormLabel>
          <FormGroup className="col-sm-10">
            <input id="newApptInput1" type="text" name="title" className="form-control" maxlength="75"
              placeholder="New Title" value={this.state.title} onChange={this.handleChange}
              aria-describedby="titleHelpBlock" aria-label="Title" required>
            </input>
            <small id="titleHelpBlock" className="form-text text-muted help-text">
              Your title must not exceed a maximum of 75 characters.
            </small>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="newApptInput2" className="col-sm-2">Physician</FormLabel>
          <FormGroup className="col-sm-10">
            <input id="newApptInput2" type="text" name="physician" className="form-control"
              placeholder="Full Name or Username" value={this.state.physician}
                onChange={this.handleChange} aria-label="Physician" required>
            </input>
            <div ref={this.physicianRef} className="list-group vd-nw-apt-pl overflow-y">
              {physicianItems}
            </div>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="newApptInput3" className="col-sm-2">Service</FormLabel>
          <FormGroup className="col-sm-10">
            <select id="newApptInput3" name="serviceId" className="form-control"
              value={this.state.serviceId} onChange={this.handleChange} required>
              {serviceItems}
            </select>
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLegend for="newApptInput4" className="col-sm-2">Start time</FormLegend>
          <FormGroup className="col-sm-2">
            <MonthNameInput
              id="newApptInput4"
              className="form-control"
              name="startMonth"
              label="Start Month"
              shortForm={true}
              value={this.state.startMonth}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
          <FormGroup className="col-sm-2">
            <DateInput
              id="newApptInput5"
              className="form-control"
              name="startDay"
              label="Start Day"
              shortForm={true}
              value={this.state.startDay}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
          <FormGroup className="col-sm-2">
            <YearInput
              id="newApptInput6"
              className="form-control"
              name="startYear"
              label="Start Year"
              startYear={today.getFullYear()-100}
              endYear={today.getFullYear()}
              value={this.state.startYear}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
          <FormGroup className="col-sm-2">
            <TimeInput
              id="newApptInput7"
              className="form-control"
              name="startTime"
              label="Start Time"
              value={this.state.startTime}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLegend for="newApptInput8" className="col-sm-2">End time</FormLegend>
          <FormGroup className="col-sm-2">
            <MonthNameInput
              id="newApptInput8"
              className="form-control"
              name="endMonth"
              label="End Month"
              shortForm={true}
              value={this.state.endMonth}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
          <FormGroup className="col-sm-2">
            <DateInput
              id="newApptInput9"
              className="form-control"
              name="endDay"
              label="End Day"
              shortForm={true}
              value={this.state.endDay}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
          <FormGroup className="col-sm-2">
            <YearInput
              id="newApptInput10"
              className="form-control"
              name="endYear"
              label="End Year"
              startYear={today.getFullYear()-100}
              endYear={today.getFullYear()}
              value={this.state.endYear}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
          <FormGroup className="col-sm-2">
            <TimeInput
              id="newApptInput11"
              className="form-control"
              name="endTime"
              label="End Time"
              value={this.state.endTime}
              handleChange={this.handleChange}
              required={true}
            />
          </FormGroup>
        </FormRow>
        <FormRow>
          <FormLabel for="newApptInput12" className="col-sm-2">Description</FormLabel>
          <FormGroup className="col-sm-10">
            <textarea id="newApptInput11" type="text" name="description" className="form-control" rows="3" maxlength="300"
              placeholder="Add a description" value={this.state.description} onChange={this.handleChange}
              aria-describedby="descriptionHelpBlock" aria-label="Physician" required>
            </textarea>
            <small id="descriptionHelpBlock" className="form-text text-muted help-text">
              Your description must not exceed a maximum of 300 characters.
            </small>
          </FormGroup>
        </FormRow>
        <FormRow>
          <Col className="d-flex justify-content-center m-2">
            <FormSubmit>Request Appointment</FormSubmit>
          </Col>
          <Col className="d-flex justify-content-center m-2">
            <Link to="/appointments" role="button" className="btn btn-danger">Cancel Appointment</Link>
          </Col>
        </FormRow>
      </Form>
    );
  }
}


export default function NewAppointmentView(props) {
  return (
    <FluidContainer className="h-100 overflow-y">
      <TopBar
        title="New Appointment"
      />
      <Row>
        <Col className="py-3">
          <Widget>
            <WidgetBody>
              <NewAppointmentForm
                session={props.session}
                physician={props.physician}
              />
            </WidgetBody>
          </Widget>
        </Col>
      </Row>
    </FluidContainer>
  );
}
