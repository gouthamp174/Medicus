import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useExtendClass } from '../../../../../components/hooks';
import { Day, PrettyDate, FullTime, Month } from '../../../../../components/dates';
import { Col, FluidContainer, Row } from '../../../../../components/layout';

import SubtitleBar, { SubtitleBarLink } from '../../../../home/subtitleBar';
import ManageBar from '../../manageBar';
import { AppointmentTitle, DisplayName, Status } from '../../utils';
import { Card, CardBody, CardFooter, CardHeader } from '../../../../../components/cards';


function Title(props) {
    return (
        <h5 className="card-title my-2">
            {props.children}
        </h5>
    );
}


function SubTitle(props) {
    return (
        <Row>
            <Col>
                <p className={useExtendClass("card-subtitle mb-1 text-wrap text-muted", props.className)}>
                    {props.children}
                </p>
            </Col>
        </Row>
    );
}


export default function Banner(props) {
    let { url } = useRouteMatch();

    const startTime = new Date(props.appointment.startTime);
    const endTime = new Date(props.appointment.endTime);

    return (
        <Card className="md-banner rounded">
            <FluidContainer>
                <Row>
                    <Col className="col-auto d-none d-md-inline m-3 pr-0">
                        <FluidContainer>
                            <Row className="justify-content-center">
                                <Col>
                                    <h1 className="my-0 display-5 font-weight-bold text-center">
                                        <Day date={startTime} />
                                    </h1>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col>
                                    <h4 className="my-0 font-weight-bold text-center">
                                        <Month date={startTime} format="short" />
                                    </h4>
                                </Col>
                            </Row>
                        </FluidContainer>
                    </Col>
                    <Col className="px-0">
                        <CardHeader className="d-flex flex-row flex-nowrap py-1 justify-content-between">
                            <Title>
                                <DisplayName session={props.session} appointment={props.appointment} />
                            </Title>
                            <ManageBar
                                session={props.session}
                                appointment={props.appointment}
                                handleStatus={props.handleStatus}
                                handleDelete={props.handleDelete}
                            />
                        </CardHeader>
                        <CardBody className="pt-0">
                            <SubTitle>
                                <AppointmentTitle appointment={props.appointment} />
                            </SubTitle>
                            <SubTitle>
                                <FullTime date={startTime} hour12={true} />, <PrettyDate date={startTime} /> - <FullTime date={endTime} hour12={true} />, <PrettyDate date={endTime} />
                            </SubTitle>
                            <Row>
                                <Col className="mb-1">
                                    <Status status={props.appointment.status} />
                                </Col>
                            </Row>
                        </CardBody>
                    </Col>
                </Row>
            </FluidContainer>
            <CardFooter className="p-2">
                <SubtitleBar>
                    <SubtitleBarLink
                        path={`${url}`}
                        exact={true}
                        title="Information"
                    />
                    <SubtitleBarLink
                        path={`${url}/medications`}
                        title="Medications"
                    />
                    <SubtitleBarLink
                        path={`${url}/notes`}
                        title="Notes"
                    />
                    <SubtitleBarLink
                        path={`${url}/reports`}
                        title="Reports"
                    />
                    <SubtitleBarLink
                        path={`${url}/payments`}
                        title="Payments"
                    />
                </SubtitleBar>
            </CardFooter>
        </Card>
    );
}