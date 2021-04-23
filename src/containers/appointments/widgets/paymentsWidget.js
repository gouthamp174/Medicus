import React from 'react';
import { getDateTillMonth } from '../../../components/dates.js';
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Form, FormRow, FormGroup, FormSubmit, FormLabel } from "../../../components/form.js";
import { Widget, TitleBar, TitleButton, WidgetBody, WidgetList, WidgetListItem } from '../../../components/widget.js';


function DefaultPaymentItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No payment available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


function PaymentItem(props) {
  const date = new Date(props.payment.date);
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="align-self-center">
            <Row>
              <Col className="text-truncate">{`$${props.payment.amount}`}</Col>
              <Col className="col-auto">{`${getDateTillMonth(date)}`}</Col>
            </Row>
          </Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


export default class PaymentsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      errorMessage: "",
      amount: 0,
      payments: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickedEdit = this.clickedEdit.bind(this);
    this.clickedCancel = this.clickedCancel.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`/api/appointments/${this.props.id}/payments`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      this.setState({
        payments: data
      });
    } catch (err) {
      console.error(`Failed to load payments widget. ${err}`);
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
      amount: 0
    });
  }

  async handleSubmit(e) {
    event.preventDefault();
    try {
      if (this.state.amount > this.state.balance) {
        throw new Error("Payment amount cannot be more than balance.")
      }

      const newPayment = {
        username: this.props.patient.username,
        amount: this.state.amount,
        date: new Date()
      };

      const response = await fetch(`/api/appointments/${this.props.id}/payments`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.session.authToken}`
        },
        body: JSON.stringify(newPayment)
      });

      let data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      newPayment.id = data.id
      const newPayments = this.state.payments;
      newPayments.push(newPayment);

      if (this.props.handleBalance) {
        const newBalance = this.props.paymentBalance - this.state.amount;
        const updateResponse = await this.props.handleBalance(newBalance);
      }

      this.setState({
        editMode: false,
        amount: 0,
        payments: newPayments
      });
    } catch (err) {
      console.error(`Failed to update payments widget. ${err}`);
      this.setState({
        errorMessage: `${err}`
      });
    }
  }

  render() {
    const paymentItems = []
    if (this.state.payments && this.state.payments.length) {
      for (const [idx, payment] of this.state.payments.entries()) {
        let paymentItem = (
          <PaymentItem
            key={idx}
            payment={payment}
          />
        );

        paymentItems.push(paymentItem);
      }
    } else {
      let paymentItem = (
        <DefaultPaymentItem key="default" />
      );
      paymentItems.push(paymentItem);
    }

    return (
      <Widget>
        <TitleBar title="Payments">
          {(this.state.editMode) ?
            <TitleButton name="Cancel" icon="clear" handleClick={this.clickedCancel} /> :
            <TitleButton name="Edit" icon="edit" handleClick={this.clickedEdit} />
          }
        </TitleBar>
        <WidgetBody>
          <FluidContainer>
            <Row>
              <Col className="col-sm-3 md-font-sm font-weight-bold">Charges</Col>
              <Col className="col-sm-3 md-font-sm">
                {`$${Number.parseFloat(this.props.serviceCharge).toFixed(2)}`}
              </Col>
              <Col className="col-sm-3 md-font-sm font-weight-bold">Balance</Col>
              <Col className="col-sm-3 md-font-sm">
                {`$${Number.parseFloat(this.props.paymentBalance).toFixed(2)}`}
              </Col>
            </Row>
          </FluidContainer>
        </WidgetBody>
        {this.state.editMode &&
          <WidgetBody>
            <Form className="container-fluid" handleSubmit={this.handleSubmit}>
              {(this.state.errorMessage) &&
                <FormRow className="justify-content-center">
                  <div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>
                </FormRow>
              }
              <FormRow className="my-2">
                <FormLabel for="paymentWidget1" className="col-sm-4">Amount</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="paymentWidget1" type="number" name="amount" className="form-control"
                    value={this.state.amount} onChange={this.handleChange} min="0" step="0.01"
                      placeholder="Add payment amount">
                  </input>
                </FormGroup>
              </FormRow>
              <FormRow className="my-2 justify-content-center">
                <FormSubmit className="col-auto col-md-4">Pay</FormSubmit>
              </FormRow>
            </Form>
          </WidgetBody>
        }
        <WidgetList>
          {paymentItems}
        </WidgetList>
      </Widget>
    );
  }
}
