import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormText } from "../../../components/form.js";
import { getDateTillMonth } from '../../../components/dates.js';
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem,
  WidgetDropdown, WidgetDropdownItem } from '../../../components/widget.js';


function DefaultDegreeItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">Add a new education</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


class DegreeItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      await this.props.handleDelete(this.props.degree.id);
    } catch (err) {
      console.error(`Failed to delete education degree- ${this.props.degree.id}. ${err}`);
    }
  }

  render() {
    const fromDate = new Date(this.props.degree.fromDate);
    const toDate = new Date(this.props.degree.toDate);
    const dateSpan = `${getDateTillMonth(fromDate)} - ${getDateTillMonth(toDate)}`;

    return (
      <WidgetListItem>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate font-weight-bold">{this.props.degree.degree}</Col>
                <Col className="col-auto">{dateSpan}</Col>
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
          <Row>
            <Col className="text-truncate">{this.props.degree.university}</Col>
          </Row>
        </FluidContainer>
      </WidgetListItem>
    );
  }
}


export default class EducationWidget extends React.Component {
  constructor(props) {
    super(props);

    this.degreeNames = [
      "MBBS", "MD", "MS", "Intern"
    ]

    this.state = {
      editMode: false,
      errorMessage: "",
      degree: (this.degreeNames.length) ? this.degreeNames[0]: "",
      fromMonth: "",
      fromYear: "",
      toMonth: "",
      toYear: "",
      university: "",
      degrees: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.username}/degrees`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        degrees: data
      });
    } catch (err) {
      console.error(`Failed to load education widget. ${err}`);
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
      degree: (this.degreeNames.length) ? this.degreeNames[0]: "",
      fromMonth: "",
      fromYear: "",
      toMonth: "",
      toYear: "",
      university: ""
    });
  }

  async handleDelete(degreeId) {
    try {
      const response = await fetch(`/api/users/${this.props.username}/degrees/${degreeId}`, {
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

      const newDegrees = this.state.degrees.filter(degree => {
        return degree.id !== degreeId;
      });

      this.setState({
        degrees: newDegrees
      });
    } catch (err) {
      console.error(`Failed to delete education degree- ${degreeId}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const fromDate = new Date(this.state.fromYear, this.state.fromMonth-1);
      const toDate = new Date(this.state.toYear, this.state.toMonth-1);

      const newDegree = {
        degree: this.state.degree,
        fromDate: fromDate,
        toDate: toDate,
        university: this.state.university,
      };

      const response = await fetch(`/api/users/${this.props.username}/degrees`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newDegree)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newDegree.id = data.id
      const newDegrees = this.state.degrees;
      newDegrees.push(newDegree);

      this.setState({
        editMode: false,
        degree: (this.degreeNames.length) ? this.degreeNames[0]: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        university: "",
        degrees: newDegrees
      });
    } catch (err) {
      console.error(`Failed to update education widget. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    let degreeNameItems = []
    for (const [idx, degree] of this.degreeNames.entries()) {
      let degreeNameItem = (
        <option key={idx}>{degree}</option>
      );
      degreeNameItems.push(degreeNameItem);
    }

    let degreeItems = []
    if (this.state.degrees && this.state.degrees.length) {
      for (const [idx, degree] of this.state.degrees.entries()) {
        let degreeItem = (
          <DegreeItem
            key={idx}
            canEdit={this.props.canEdit}
            session={this.props.session}
            degree={degree}
            handleDelete={this.handleDelete}
          />
        );
        degreeItems.push(degreeItem);
      }
    } else {
      let degreeItem = (
        <DefaultDegreeItem key="default" />
      );
      degreeItems.push(degreeItem);
    }

    return (
      <Widget>
        <TitleBar title="Education">
          {this.props.canEdit &&
            (
              (this.state.editMode) ?
              <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
              <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
            )
          }
        </TitleBar>
        {this.state.editMode &&
          <WidgetBody>
            <Form className="container-fluid" handleSubmit={this.handleSubmit}>
              {(this.state.errorMessage) &&
                <FormRow className="justify-content-center">
                  <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
                </FormRow>
              }
              <FormRow>
                <FormLabel for="educationForm01" className="col-sm-4">Degree</FormLabel>
                <FormGroup className="col-sm-8">
                  <select id="educationForm01" name="degree" className="form-control"
                    value={this.state.degree} onChange={this.handleChange}>
                    {degreeNameItems}
                  </select>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="educationForm02" className="col-sm-4">From Date</FormLabel>
                <FormGroup className="col-sm-8">
                  <Row>
                    <Col className="col-4">
                      <input id="educationForm02" name="fromMonth" type="text" className="form-control"
                        placeholder="MM" value={this.state.fromMonth}
                          onChange={this.handleChange} minlength="1" maxlength="2"
                      />
                    </Col>
                    <Col className="col-8">
                      <input id="educationForm03" name="fromYear" type="text" className="form-control"
                        placeholder="YYYY" value={this.state.fromYear}
                          onChange={this.handleChange} minlength="4" maxlength="4"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="educationForm04" className="col-sm-4">To Date</FormLabel>
                <FormGroup className="col-sm-8">
                  <Row>
                    <Col className="col-4">
                      <input id="educationForm04" name="toMonth" type="text" className="form-control"
                        placeholder="MM" value={this.state.toMonth}
                          onChange={this.handleChange} minlength="1" maxlength="2"
                      />
                    </Col>
                    <Col className="col-8">
                      <input id="educationForm05" name="toYear" type="text" className="form-control"
                        placeholder="YYYY" value={this.state.toYear}
                          onChange={this.handleChange} minlength="4" maxlength="4"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="educationForm06" className="col-sm-4">University</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="educationForm06" name="university" type="text" className="form-control"
                    placeholder="Name of University" value={this.state.university}
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
          {degreeItems}
        </WidgetList>
      </Widget>
    );
  }
}
