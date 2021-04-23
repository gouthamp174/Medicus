import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormText } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem,
  WidgetDropdown, WidgetDropdownItem } from '../../../components/widget.js';


function DefaultServiceItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No medical service available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


class ServiceItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      await this.props.handleDelete(this.props.service.id);
    } catch (err) {
      console.error(`Failed to delete medical service- ${this.props.service.id}. ${err}`);
    }
  }

  render() {
    return (
      <WidgetListItem>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate">{this.props.service.name}</Col>
                <Col className="col-auto">
                  {`\$${Number.parseFloat(this.props.service.rate).toFixed(2)}`}
                </Col>
              </Row>
            </Col>
            {this.props.canEdit &&
              <Col className="col-auto px-2">
                <WidgetDropdown>
                  <WidgetDropdownItem name="Delete" handleClick={this.handleDelete} />
                </WidgetDropdown>
              </Col>
            }
          </Row>
        </FluidContainer>
      </WidgetListItem>
    );
  }
}


export default class ServicesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      errorMessage: "",
      name: "",
      rate: 0,
      services: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.username}/services`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        services: data
      });
    } catch (err) {
      console.error(`Failed to load services widget. ${err}`);
    }
  }

  async handleChange(e) {
    event.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async clickedEdit(e) {
    event.preventDefault();
    this.setState({
      editMode: true
    });
  }

  async clickedCancel(e) {
    event.preventDefault();
    this.setState({
      editMode: false,
      name: "",
      rate: 0
    });
  }

  async handleDelete(serviceId) {
    try {
      const response = await fetch(`/api/users/${this.props.username}/services/${serviceId}`, {
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

      const newServices = this.state.services.filter(service => {
        return service.id !== serviceId;
      });

      this.setState({
        services: newServices
      });
    } catch (err) {
      console.error(`Failed to delete medical service- ${serviceId}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const newService = {
        name: this.state.name,
        rate: this.state.rate
      };

      const response = await fetch(`/api/users/${this.props.username}/services`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newService)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newService.id = data.id
      const newServices = this.state.services;
      newServices.push(newService);

      this.setState({
        editMode: false,
        name: "",
        rate: 0,
        services: newServices
      });
    } catch (err) {
      console.error(`Failed to update services widget. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    let serviceItems = []
    if (this.state.services && this.state.services.length) {
      for (const [idx, service] of this.state.services.entries()) {
        let serviceItem = (
          <ServiceItem
            key={idx}
            canEdit={this.props.canEdit}
            session={this.props.session}
            service={service}
            handleDelete={this.handleDelete}
          />
        );
        serviceItems.push(serviceItem);
      }
    } else {
      let serviceItem = (
        <DefaultServiceItem key="default" />
      );
      serviceItems.push(serviceItem);
    }

    return (
      <Widget>
        <TitleBar title="Provided Services">
          {this.props.canEdit &&
            (
              (this.state.editMode) ?
              <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
              <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
            )
          }
        </TitleBar>
        {this.state.editMode &&
          <WidgetBody className="p-3">
            <Form className="container-fluid" handleSubmit={this.handleSubmit}>
              {(this.state.errorMessage) &&
                <FormRow className="justify-content-center">
                  <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
                </FormRow>
              }
              <FormRow>
                <FormLabel for="servicesForm01" className="col-sm-4">Name</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="servicesForm01" name="name" type="text" className="form-control"
                    placeholder="Name of Service" value={this.state.name}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="servicesForm02" className="col-sm-4">Rate</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="servicesForm02" name="rate" type="number" className="form-control"
                    placeholder="Rate" value={this.state.rate} min="0" step="0.01"
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </FormRow>
              <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
              </FormRow>
            </Form>
          </WidgetBody>
        }
        <WidgetList>
          {serviceItems}
        </WidgetList>
      </Widget>
    );
  }
}
