import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormText } from "../../../components/form.js";
import { getDateTillMonth } from '../../../components/dates.js';
import { Widget, TitleBar, WidgetList, WidgetListItem } from '../../../components/widget.js';


function DefaultReportItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No reports available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


function ReportItem(props) {
  const date = new Date(props.report.date);
  return(
    <WidgetListItem className="list-group-item-action">
      <Link to={`/appointments/${props.report.appointmentId}`}>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col>{props.report.name}</Col>
                <Col className="col-auto">{`${getDateTillMonth(date)}`}</Col>
              </Row>
            </Col>
          </Row>
        </FluidContainer>
      </Link>
    </WidgetListItem>
  );
}


export default class ReportsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: []
    }
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.username}/labReports`, {
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
      console.error(`Failed to load reports widget. ${err}`);
    }
  }

  render() {
    let reportItems = []
    if (this.state.reports && this.state.reports.length) {
      for (const [idx, report] of this.state.reports.entries()) {
        let reportItem = (
          <ReportItem
            key={idx}
            report={report}
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
        <TitleBar title="Reports" />
        <WidgetList>
          {reportItems}
        </WidgetList>
      </Widget>
    );
  }
}
