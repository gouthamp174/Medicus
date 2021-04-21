import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormText } from "../../../components/form.js";
import { getDateTillMonth } from '../../../components/dates.js';
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem,
  WidgetDropdown, WidgetDropdownItem } from '../../../components/widget.js';


function DefaultJobItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">Add a new experience</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


class JobItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      await this.props.handleDelete(this.props.job.id);
    } catch (err) {
      console.error(`Failed to delete job experience- ${this.props.job.id}. ${err}`);
    }
  }

  render() {
    const fromDate = new Date(this.props.job.fromDate);
    const toDate = new Date(this.props.job.toDate);
    const dateSpan = `${getDateTillMonth(fromDate)} - ${getDateTillMonth(toDate)}`;

    return (
      <WidgetListItem>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate font-weight-bold">{this.props.job.title}</Col>
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
            <Col className="text-truncate">{this.props.job.company}</Col>
          </Row>
        </FluidContainer>
      </WidgetListItem>
    );
  }
}


export default class ExperienceWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      errorMessage: "",
      title: "",
      fromMonth: "",
      fromYear: "",
      toMonth: "",
      toYear: "",
      company: "",
      jobs: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.username}/jobs`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        jobs: data
      });
    } catch (err) {
      console.error(`Failed to load experience widget. ${err}`);
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
      title: "",
      fromMonth: "",
      fromYear: "",
      toMonth: "",
      toYear: "",
      company: ""
    });
  }

  async handleDelete(jobId) {
    try {
      const response = await fetch(`/api/users/${this.props.username}/jobs/${jobId}`, {
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

      const newJobs = this.state.jobs.filter(job => {
        return job.id !== jobId;
      });

      this.setState({
        jobs: newJobs
      });
    } catch (err) {
      console.error(`Failed to delete job experience- ${jobId}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const fromDate = new Date(this.state.fromYear, this.state.fromMonth-1);
      const toDate = new Date(this.state.toYear, this.state.toMonth-1);

      const newJob = {
        title: this.state.title,
        fromDate: fromDate,
        toDate: toDate,
        company: this.state.company,
      };

      const response = await fetch(`/api/users/${this.props.username}/jobs`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newJob)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newJob.id = data.id
      const newJobs = this.state.jobs;
      newJobs.push(newJob);

      this.setState({
        editMode: false,
        title: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        company: "",
        jobs: newJobs
      });
    } catch (err) {
      console.error(`Failed to update experience widget. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    let jobItems = []
    if (this.state.jobs && this.state.jobs.length) {
      for (const [idx, job] of this.state.jobs.entries()) {
        let jobItem = (
          <JobItem
            key={idx}
            canEdit={this.props.canEdit}
            session={this.props.session}
            job={job}
            handleDelete={this.handleDelete}
          />
        );
        jobItems.push(jobItem);
      }
    } else {
      let jobItem = (
        <DefaultJobItem key="default" />
      );
      jobItems.push(jobItem);
    }

    return (
      <Widget>
        <TitleBar title="Experience">
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
                <FormLabel for="experienceForm01" className="col-sm-4">Job Title</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="experienceForm01" name="title" type="text" className="form-control"
                    placeholder="Title" value={this.state.title}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="experienceForm02" className="col-sm-4">From Date</FormLabel>
                <FormGroup className="col-sm-8">
                  <Row>
                    <Col className="col-4">
                      <input id="experienceForm02" name="fromMonth" type="text" className="form-control"
                        placeholder="MM" value={this.state.fromMonth}
                          onChange={this.handleChange} minlength="1" maxlength="2"
                      />
                    </Col>
                    <Col className="col-8">
                      <input id="experienceForm03" name="fromYear" type="text" className="form-control"
                        placeholder="YYYY" value={this.state.fromYear}
                          onChange={this.handleChange} minlength="4" maxlength="4"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="experienceForm04" className="col-sm-4">To Date</FormLabel>
                <FormGroup className="col-sm-8">
                  <Row className="row">
                    <Col className="col-4">
                      <input id="experienceForm04" name="toMonth" type="text" className="form-control"
                        placeholder="MM" value={this.state.toMonth}
                          onChange={this.handleChange} minlength="1" maxlength="2"
                      />
                    </Col>
                    <Col className="col-8">
                      <input id="experienceForm05" name="toYear" type="text" className="form-control"
                        placeholder="YYYY" value={this.state.toYear}
                          onChange={this.handleChange} minlength="4" maxlength="4"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="experienceForm06" className="col-sm-4">Company</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="experienceForm06" name="company" type="text" className="form-control"
                    placeholder="Name of Company" value={this.state.company}
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
          {jobItems}
        </WidgetList>
      </Widget>
    );
  }
}
