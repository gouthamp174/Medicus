import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Widget, TitleBar, WidgetList, WidgetListItem } from "../../../components/widget.js";


function DefaultMedicationItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No medications available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


function MedicationItem(props) {
  return(
    <WidgetListItem className="list-group-item-action">
      <Link to={`/appointments/${props.medication.appointmentId}`}>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate">{props.medication.name}</Col>
                <Col className="col-auto">{`${props.medication.dosage} mg`}</Col>
              </Row>
            </Col>
          </Row>
        </FluidContainer>
      </Link>
    </WidgetListItem>
  );
}


export default class RecentMedicationsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      limit: 5,
      medications: []
    };
  }

  async componentDidMount() {
    try {
      const username = this.props.session.username;
      const page = this.state.page;
      const limit = this.state.limit;

      const response = await fetch(`/api/users/${username}/medications?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        medications: data
      });
    } catch (err) {
      console.error(`Failed to to load recent medications widget. ${err}`);
    }
  }

  render() {
    let medicationItems = []
    if (this.state.medications && this.state.medications.length) {
      for (const [idx, medication] of this.state.medications.entries()) {
        let medicationItem = (
          <MedicationItem
            key={idx}
            session={this.props.session}
            medication={medication}
          />
        );
        medicationItems.push(medicationItem);
      }
    } else {
      let medicationItem = (
        <DefaultMedicationItem key="default" />
      );
      medicationItems.push(medicationItem);
    }

    return (
      <Widget>
        <TitleBar title="Recent Medications" />
        <WidgetList>
          {medicationItems}
        </WidgetList>
      </Widget>
    );
  }
}
