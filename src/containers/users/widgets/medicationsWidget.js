import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormText } from "../../../components/form.js";
import { Widget, TitleBar, WidgetList, WidgetListItem } from '../../../components/widget.js';


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
                <Col>{props.medication.name}</Col>
                <Col className="col-auto">{`${props.medication.dosage} mg`}</Col>
              </Row>
            </Col>
          </Row>
        </FluidContainer>
      </Link>
    </WidgetListItem>
  );
}


export default class MedicationsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      medications: []
    }
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.username}/medications`, {
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
      console.error(`Failed to load medications widget. ${err}`);
    }
  }

  render() {
    let medicationItems = []
    if (this.state.medications && this.state.medications.length) {
      for (const [idx, medication] of this.state.medications.entries()) {
        let medicationItem = (
          <MedicationItem
            key={idx}
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
        <TitleBar title="Medications" />
        <WidgetList>
          {medicationItems}
        </WidgetList>
      </Widget>
    );
  }
}
