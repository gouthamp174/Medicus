import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem,
  WidgetDropdown, WidgetDropdownItem } from '../../../components/widget.js';


function DefaultMedicationItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No medication available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


export class MedicationItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      await this.props.handleDelete(this.props.medication.id);
    } catch (err) {
      console.error(`Failed to delete medication- ${this.props.medication.id}. ${err}`);
    }
  }

  render() {
    return(
      <WidgetListItem>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
                <Col className="text-truncate">{this.props.medication.name}</Col>
                <Col className="col-auto">{`${this.props.medication.dosage} mg`}</Col>
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


export default class MedicationsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      errorMessage: "",
      name: "",
      dosage: "",
      medications: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}/medications`, {
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
      console.error(`Failed to load medications. ${err}`);
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
      dosage: ""
    });
  }

  async handleDelete(medicationId) {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}/medications/${medicationId}`, {
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

      const newMedications = this.state.medications.filter(medication => {
        return medication.id !== medicationId;
      });

      this.setState({
        medications: newMedications
      });
    } catch (err) {
      console.error(`Failed to delete medication ${medicationId}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const newMedication = {
        username: this.props.patient.username,
        name: this.state.name,
        dosage: this.state.dosage
      };

      const response = await fetch(`/api/appointments/${this.props.id}/medications`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newMedication)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newMedication.id = data.id;
      const newMedications = this.state.medications;
      newMedications.push(newMedication);

      this.setState({
        editMode: false,
        name: "",
        dosage: "",
        medications: newMedications
      });
    } catch (err) {
      console.error(`Failed to update medications. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
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
            handleDelete={this.handleDelete}
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
        <TitleBar title="Medications">
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
                <FormLabel for="medicationsForm01" className="col-sm-4">Name</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="medicationsForm01" name="name" type="text" className="form-control"
                    placeholder="Name of Medication" value={this.state.name}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </FormRow>
              <FormRow className="my-2">
                <FormLabel for="medicationsForm02" className="col-sm-4">Dosage (in mg)</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="medicationsForm02" name="dosage" type="text" className="form-control"
                    placeholder="Dosage (in mg)" value={this.state.dosage}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </FormRow>
              <FormRow className="my-2 justify-content-center">
                <FormSubmit className="btn-primary col-auto col-md-4">Add</FormSubmit>
              </FormRow>
            </Form>
          </WidgetBody>
        }
        <WidgetList>
          {medicationItems}
        </WidgetList>
      </Widget>
    );
  }
}
