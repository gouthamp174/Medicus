import React from 'react';
import { NumericDate } from '../../../../../../components/dates';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Currency } from '../../../../../../components/users';
import { WidgetList, WidgetListItem, } from '../../../../../../components/widgets';


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
                            <Col className="text-truncate">
                                <Currency value={props.payment.amount} />
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


export default function ListSection(props) {
    return (
        <WidgetList>
            {(props.payments.length !== 0) ?
                <>
                    {props.payments.map((payment, index) => (
                        <PaymentItem 
                            key={index}
                            session={props.session}
                            payment={payment}
                            handleDelete={props.deletePayment}
                        />
                    ))}
                </> :
                <DefaultPaymentItem />
            }
        </WidgetList>
    );
}