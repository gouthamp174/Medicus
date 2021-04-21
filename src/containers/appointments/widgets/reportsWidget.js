import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel } from "../../../components/form.js";
import { getDateTillMonth } from '../../../components/dates.js';
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem,
  WidgetDropdown, WidgetDropdownItem } from '../../../components/widget.js';


function DefaultReportItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">Add a new lab report</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


export class ReportItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      await this.props.handleDelete(this.props.report.id);
    } catch (err) {
      console.error(`Failed to delete report- ${this.props.report.id}. ${err}`);
    }
  }

  render() {
    const date = new Date(this.props.report.date);
    return(
      <WidgetListItem>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate">{this.props.report.name}</Col>
                <Col className="col-auto">{`${getDateTillMonth(date)}`}</Col>
              </Row>
            </Col>
            <Col className="col-auto px-2">
              <WidgetDropdown>
                <WidgetDropdownItem name="Delete" handleClick={this.handleDelete} />
              </WidgetDropdown>
            </Col>
          </Row>
        </FluidContainer>
      </WidgetListItem>
    );
  }
}


export default class ReportsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      errorMessage: "",
      name: "",
      reports: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}/labReports`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        reports: data
      });
    } catch (err) {
      console.error(`Failed to load reports. ${err}`);
    }
  }

  async handleChange(e) {
    event.preventDefault();
    this.setState({
      name: e.target.value
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
      name: ""
    });
  }

  async handleDelete(reportId) {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}/labReports/${reportId}`, {
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

      const newReports = this.state.reports.filter(report => {
        return report.id !== reportId;
      });

      this.setState({
        reports: newReports
      });
    } catch (err) {
      console.error(`Failed to delete report ${reportId}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const newReport = {
        username: this.props.patient.username,
        name: this.state.name.replace(/^.*[\\\/]/, ''),
        date: new Date()
      };

      const response = await fetch(`/api/appointments/${this.props.id}/labReports`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newReport)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newReport.id = data.id
      const newReports = this.state.reports;
      newReports.push(newReport);

      this.setState({
        editMode: false,
        name: "",
        reports: newReports
      });
    } catch (err) {
      console.error(`Failed to update reports. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    let reportItems = []
    if (this.state.reports && this.state.reports.length) {

      for (const [idx, report] of this.state.reports.entries()) {
        const date = new Date(report.date);

        let reportItem = (
          <ReportItem
            key={idx}
            session={this.props.session}
            report={report}
            handleDelete={this.handleDelete}
          />
        );
        reportItems.push(reportItem);
      }
    } else {
      let reportItem = (
        <DefaultReportItem key="default" />
      );
      reportItems.push(reportItem);
    }

    return (
      <Widget>
        <TitleBar title="Reports">
          {(this.state.editMode) ?
            <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
            <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
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
              <FormRow className="my-2">
                <FormGroup className="custom-file">
                  <input id="reportsForm01" type="file" className="custom-file-input"
                    value={this.state.name} onChange={this.handleChange}/>
                  <label className="custom-file-label" for="reportsForm01">
                    {
                      (this.state.name) ? this.state.name.replace(/^.*[\\\/]/, '') : "Choose a file..."
                    }
                  </label>
                </FormGroup>
              </FormRow>
              <FormRow className="my-2 justify-content-center">
                <FormSubmit className="col-auto col-md-4">Upload</FormSubmit>
              </FormRow>
            </Form>
          </WidgetBody>
        }
        <WidgetList>
          {reportItems}
        </WidgetList>
      </Widget>
    );
  }
}
