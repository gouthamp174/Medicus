import React from 'react';
import { Col, Row } from '../../../../components/layout';

import TitleBar from '../../../home/titleBar';
import NewAppointmentForm from './newAppointmentForm';


export default function NewAppointmentView(props) {
    return (
        <>
            <TitleBar title="New Appointment" />
            <Row>
                <Col>
                    <NewAppointmentForm
                        session={props.session}
                        physician={props.physician}
                    />
                </Col>
            </Row>
        </>
    );
}