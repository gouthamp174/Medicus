import React from 'react';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel, FormText } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem,
  WidgetDropdown, WidgetDropdownItem } from '../../../components/widget.js';
import { getDateTillMonth } from '../../../components/dates.js';


function DefaultInsuranceItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No insurance available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


class InsuranceItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(e) {
    event.preventDefault();
    try {
      await this.props.handleDelete(this.props.insurance.id);
    } catch (err) {
      console.error(`Failed to delete insurance- ${this.props.insurance.id}. ${err}`);
    }
  }

  render() {
    const date = new Date(this.props.insurance.expiryDate);
    return (
      <WidgetListItem>
        <FluidContainer>
          <Row>
            <Col className="align-self-center">
              <Row>
              <Col className="text-truncate">{this.props.insurance.insuranceId}</Col>
              <Col className="col-auto">{`${getDateTillMonth(date)}`}</Col>
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
            <Col className="text-truncate">{this.props.insurance.providerName}</Col>
          </Row>
        </FluidContainer>
      </WidgetListItem>
    );
  }
}


export default class InsurancesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      errorMessage: "",
      insuranceId: "",
      providerName: "",
      expiryMonth: "",
      expiryYear: "",
      insurances: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/users/${this.props.username}/insurances`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        insurances: data
      });
    } catch (err) {
      console.error(`Failed to load insurances widget. ${err}`);
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
      insuranceId: "",
      providerName: "",
      expiryMonth: "",
      expiryYear: ""
    });
  }

  async handleDelete(insuranceId) {
    try {
      const response = await fetch(`/api/users/${this.props.username}/insurances/${insuranceId}`, {
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

      const newInsurances = this.state.insurances.filter(insurance => {
        return insurance.id !== insuranceId;
      });

      this.setState({
        insurances: newInsurances
      });
    } catch (err) {
      console.error(`Failed to delete insurance- ${jobId}. ${err}`);
    }
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      const expiryDate = new Date(this.state.expiryYear, this.state.expiryMonth-1);

      const newInsurance = {
        insuranceId: this.state.insuranceId,
        providerName: this.state.providerName,
        expiryDate: expiryDate
      };

      const response = await fetch(`/api/users/${this.props.username}/insurances`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newInsurance)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newInsurance.id = data.id
      const newInsurances = this.state.insurances;
      newInsurances.push(newInsurance);

      this.setState({
        editMode: false,
        insuranceId: "",
        providerName: "",
        expiryMonth: "",
        expiryYear: "",
        insurances: newInsurances
      });
    } catch (err) {
      console.error(`Failed to update insurances widget. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    let insuranceItems = []
    if (this.state.insurances && this.state.insurances.length) {
      for (const [idx, insurance] of this.state.insurances.entries()) {
        let insuranceItem = (
          <InsuranceItem
            key={idx}
            canEdit={this.props.canEdit}
            session={this.props.session}
            insurance={insurance}
            handleDelete={this.handleDelete}
          />
        );
        insuranceItems.push(insuranceItem);
      }
    } else {
      let insuranceItem = (
        <DefaultInsuranceItem key="default" />
      );
      insuranceItems.push(insuranceItem);
    }

    return (
      <Widget>
        <TitleBar title="Insurances">
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
                <FormLabel for="insuranceForm01" className="col-sm-4">Insurance ID</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="insuranceForm01" name="insuranceId" type="text" className="form-control"
                    placeholder="Insurance ID" value={this.state.insuranceId}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="insuranceForm02" className="col-sm-4">Provider Name</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="insuranceForm02" name="providerName" type="text" className="form-control"
                    placeholder="Provider Name" value={this.state.providerName}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormLabel for="insuranceForm03" className="col-sm-4">Expiry Date</FormLabel>
                <FormGroup className="col-sm-8">
                  <Row>
                    <Col className="col-4">
                      <input id="insuranceForm03" name="expiryMonth" type="text" className="form-control"
                        placeholder="MM" value={this.state.expiryMonth}
                          onChange={this.handleChange} minlength="1" maxlength="2"
                      />
                    </Col>
                    <Col className="col-8">
                      <input id="insuranceForm04" name="expiryYear" type="text" className="form-control"
                        placeholder="YYYY" value={this.state.expiryYear}
                          onChange={this.handleChange} minlength="4" maxlength="4"
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </FormRow>
              <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
              </FormRow>
            </Form>
          </WidgetBody>
        }
        <WidgetList>
          {insuranceItems}
        </WidgetList>
      </Widget>
    );
  }
}
