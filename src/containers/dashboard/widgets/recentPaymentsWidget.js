import React from 'react';
import { Link } from "react-router-dom";
import { FluidContainer, Row, Col } from "../../../components/layout.js";
import { Widget, TitleBar, WidgetList, WidgetListItem } from "../../../components/widget.js";
import { getDateTillMonth } from "../../../components/dates.js";


function DefaultPaymentItem(props) {
  return (
    <WidgetListItem>
      <FluidContainer>
        <Row>
          <Col className="md-font-sm text-center text-muted">No payments available</Col>
        </Row>
      </FluidContainer>
    </WidgetListItem>
  );
}


function PaymentItem(props) {
  const date = new Date(props.payment.date);
  return(
    <WidgetListItem className="list-group-item-action">
      <Link to={`/appointments/${props.payment.appointmentId}`}>
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
      </Link>
    </WidgetListItem>
  );
}


export default class RecentPaymentsWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      limit: 5,
      payments: []
    };
  }

  async componentDidMount() {
    try {
      const username = this.props.session.username;
      const page = this.state.page;
      const limit = this.state.limit;

      const response = await fetch(`/api/users/${username}/payments?page=${page}&limit=${limit}`, {
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
      console.error(`Failed to to load recent payments widget. ${err}`);
    }
  }

  render() {
    let paymentItems = []
    if (this.state.payments && this.state.payments.length) {
      for (const [idx, payment] of this.state.payments.entries()) {
        let paymentItem = (
          <PaymentItem
            key={idx}
            session={this.props.session}
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
        <TitleBar title="Recent Payments" />
        <WidgetList>
          {paymentItems}
        </WidgetList>
      </Widget>
    );
  }
}
