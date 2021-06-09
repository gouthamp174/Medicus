import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NumericDate } from '../../../components/dates';
import { Col, FluidContainer, Row } from '../../../components/layout';
import { Loader } from '../../../components/loaders';
import { Currency } from '../../../components/users';
import { TitleBar, Widget, WidgetBody, WidgetList, WidgetListItem } from '../../../components/widgets';


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


function ViewAllItem(props) {
    return (
        <WidgetListItem>
            <Link to={`/users/${props.session.username}/payments`}>
                <FluidContainer>
                    <Row>
                        <Col className="md-font-sm text-center text-muted">View All</Col>
                    </Row>
                </FluidContainer>
            </Link>
        </WidgetListItem>
    );
}


function PaymentItem(props) {
    const date = new Date(props.payment.date);
    return(
        <WidgetListItem className="list-group-item-action">
            <FluidContainer>
                <Row>
                    <Col className="align-self-center">
                        <Row>
                            <Col>
                                <Link to={`/appointments/${props.payment.appointmentId}/payments`}
                                    className="font-weight-bold text-truncate">
                                    <Currency value={props.payment.amount} />
                                </Link>
                            </Col>
                            <Col className="col-auto">
                                <NumericDate date={date} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


export default function RecentPaymentWidget(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState({
        payments: [],
        limit: 5
    });

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const username = props.session.username;
                const page = 0;

                const response = await fetch(`/api/users/${username}/payments?page=${page}&limit=${state.limit}`, {
                  headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                  }
                });
          
                let data = await response.json();
                if (!response.ok) {
                  throw new Error(data.message);
                }

                setState(prevState => {
                    const newPayments = [...prevState.payments, ...data];

                    return {
                        ...prevState,
                        payments: newPayments
                    }
                });
            } catch (err) {
                console.error(`Failed to to load recent payments. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, [props.session, state.limit]);

    return (
        <Widget>
            <TitleBar title="Recent Payments" />
            {
                (isLoading) ?
                <>
                    <WidgetBody>
                        <Loader isLoading={true} />
                    </WidgetBody>
                </> :
                <>
                    <WidgetList>
                        {(state.payments.length !== 0) ?
                            <>
                                {state.payments.map((payment, index) => (
                                    <PaymentItem 
                                        key={index}
                                        payment={payment}
                                    />
                                ))}
                                <ViewAllItem session={props.session} />
                            </> :
                            <DefaultPaymentItem />
                        }
                    </WidgetList>
                </>
            }
        </Widget>
    );
}