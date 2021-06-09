import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Card, CardBody, CardFooter } from '../../../../../components/cards.js';
import { useExtendClass } from "../../../../../components/hooks.js";
import { MdIcon } from '../../../../../components/icons.js';
import { Col, FluidContainer, Row } from '../../../../../components/layout';
import { BioData, Email, FullName, PhoneNumber, ProfilePhoto, 
    Username } from '../../../../../components/users';

import SubtitleBar, { SubtitleBarLink } from "../../../../home/subtitleBar";


function Title(props) {
    return (
        <Row>
            <Col>
                <h4 className="my-1 text-center text-sm-left">
                    {props.children}
                </h4>
            </Col>
        </Row>
        
    );
}


function SubTitle(props) {
    return (
        <Row>
            <Col>
                <h6 className={useExtendClass("text-center text-sm-left mb-3", props.className)}>
                    {props.children}
                </h6>
            </Col>
        </Row>
        
    );
}


function InfoRow(props) {
    return (
        <Row className="text-muted">
            <Col className="d-flex align-items-center">
                <MdIcon>{props.icon}</MdIcon>
                <p className="my-0 px-2">{props.content}</p>
            </Col>
        </Row>
    );
}


export default function Banner(props) {
    let { url } = useRouteMatch();

    return (
        <Card className="md-banner rounded">
            <CardBody className="p-2">
                <FluidContainer>
                    <Row>
                        <Col className="col-12 col-sm-auto py-2 d-flex justify-content-center">
                            <ProfilePhoto
                                className="align-self-start md-pfl-bg"
                                session={props.session}
                                user={props.user}
                            />
                        </Col>
                        <Col className="col-12 col-sm">
                            <FluidContainer>
                                <Title>
                                    <FullName user={props.user} />
                                </Title>
                                <SubTitle className="text-muted">
                                    <Username user={props.user} />
                                </SubTitle>
                                <InfoRow
                                    icon="person"
                                    content={<BioData user={props.user} />}
                                />
                                <InfoRow
                                    icon="email"
                                    content={<Email user={props.user} />}
                                />
                                <InfoRow
                                    icon="call"
                                    content={<PhoneNumber user={props.user} />}
                                />
                            </FluidContainer>
                        </Col>
                    </Row>
                </FluidContainer>
            </CardBody>
            <CardFooter className="p-2">
                <SubtitleBar>
                    <SubtitleBarLink 
                        path={`${url}`}
                        exact={true}
                        title="About"
                    />
                    {
                        (props.user.isPhysician) ?
                        <>
                            <SubtitleBarLink 
                                path={`${url}/services`}
                                title="Services"
                            />
                        </> :
                        <>
                            <SubtitleBarLink 
                                path={`${url}/medications`}
                                title="Medications"
                            />
                            <SubtitleBarLink 
                                path={`${url}/reports`}
                                title="Reports"
                            />
                        </>
                    }
                </SubtitleBar>
            </CardFooter>
        </Card>
    );
}