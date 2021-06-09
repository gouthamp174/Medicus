import React from 'react';
import { Col, Row } from '../../components/layout';

import TitleBar from '../home/titleBar';


export default function ContactApp(props) {
    return (
        <>
            <TitleBar title="Contact Us">
            </TitleBar>
            <Row className="flex-grow-1 justify-content-center">
                <Col className="col-auto align-self-center">
                    <p className="my-0 text-muted">
                        Coming Soon!
                    </p>
                </Col>
            </Row>
        </>
    );
}