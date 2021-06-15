import React from 'react';
import { Col, DescriptionDetails, DescriptionList, 
    DescriptionTerm, 
    Row} from '../../../../../../components/layout';
import { Currency } from '../../../../../../components/users';


export default function InfoSection(props) {
    return (
        <DescriptionList>
            <Col className="col-12 col-md-6">
                <Row>
                    <DescriptionTerm className="col-12 col-md-auto">Service Charge</DescriptionTerm>
                    <DescriptionDetails className="col-12 col-md">
                        <Currency value={props.appointment.serviceCharge} />
                    </DescriptionDetails>
                </Row>
            </Col>
            <Col className="col-12 col-md-6">
                <Row>
                    <DescriptionTerm className="col-12 col-md-auto">Payment Balance</DescriptionTerm>
                    <DescriptionDetails className="col-12 col-md">
                        <Currency value={props.appointment.paymentBalance} />
                    </DescriptionDetails>
                </Row>
            </Col>
        </DescriptionList>
    );
}