import React from 'react';
import { Link } from 'react-router-dom';
import { FluidContainer, Row, Col } from '../../../../components/layout';
import { FullTime, PrettyDate } from "../../../../components/dates";
import { Loader } from '../../../../components/loaders';

import ManageBar from '../manageBar';
import { AppointmentTitle, DisplayName, Status, StatusIndicator } from "../utils";


export default function AppointmentListView(props) {
    if (props.isLoading) {
        return (
            <Loader isLoading={props.isLoading} />
        );
    }

    const appointmentStartTime = new Date(props.appointment.startTime);
    const appointmentEndTime = new Date(props.appointment.endTime);

    return (
        <FluidContainer className="md-appt">
            <Row>
                <Col className="col-auto px-0 d-xl-none">
                    <StatusIndicator status={props.appointment.status} />
                </Col>
                <Col className="py-3">
                    <Row>
                        <Col className="col-3 col-sm-3 col-md-5 col-lg-5 col-xl-3">
                            <Row>
                                <Col className="p-0 align-self-center">
                                    <h6 className="text-center my-0">
                                        <FullTime date={appointmentStartTime} hour12={true} />
                                    </h6>
                                    <p className="md-font-sm text-center text-muted my-0">
                                        <PrettyDate date={appointmentStartTime} />
                                    </p>
                                </Col>
                                <Col className="p-0 d-none d-md-inline align-self-center">
                                    <h6 className="text-center my-0">
                                        <FullTime date={appointmentEndTime} hour12={true} />
                                    </h6>
                                    <p className="md-font-sm text-center text-muted my-0">
                                        <PrettyDate date={appointmentEndTime} />
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="col-9 col-sm-9 col-md-7 col-lg-7 col-xl-7">
                            <h6 className="my-0">
                                <Link to={`/appointments/${props.appointment.id}`}
                                    className="text-truncate font-weight-bold">
                                    <DisplayName 
                                        session={props.session}
                                        appointment={props.appointment}
                                    />
                                </Link>
                            </h6>
                            <p className="md-font-sm text-truncate text-muted my-0">
                                <AppointmentTitle
                                    appointment={props.appointment}
                                />
                            </p>
                        </Col>
                        <Col className="col-xl-2 d-none d-xl-inline align-self-center">
                            <Row className="justify-content-center">
                                <Col className="col-auto">
                                    <Status 
                                        status={props.appointment.status} 
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col className="col-auto align-self-center">
                    <ManageBar
                        session={props.session}
                        appointment={props.appointment}
                        handleStatus={props.handleStatus}
                        handleDelete={props.handleDelete}
                    />
                </Col>
            </Row>
        </FluidContainer>
    );
}