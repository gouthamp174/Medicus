import React from 'react';
import { BodyCard } from '../../../components/cards';
import { PrettyDate } from '../../../components/dates';
import { Col, FluidContainer, Row } from '../../../components/layout';
import { FullName } from '../../../components/users';


export default function Banner(props) {
    const today = new Date();
    return (
        <BodyCard className="rounded">
            <FluidContainer>
                <Row className="justify-content-between">
                    <Col className="align-items-center">
                        <h6 className="text-muted my-1 py-0">
                            {`Welcome ${FullName({user: props.session})}.`}
                        </h6>
                    </Col>
                    <Col className="text-muted col-auto">
                        <PrettyDate date={today} />
                    </Col>
                </Row>
            </FluidContainer>
        </BodyCard>
    );
}