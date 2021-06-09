import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FullTime, PrettyDate } from '../../../../../../components/dates';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Loader } from '../../../../../../components/loaders';
import { BioData, FullName, ProfilePhoto } from '../../../../../../components/users';
import { TitleBar, Widget, WidgetBody } from '../../../../../../components/widgets';

import { Status } from '../../../utils';


function UserInfo(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${props.user.username}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
                });
        
                let data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                setUser(data);
                setIsLoading(false);
            } catch (err) {
                console.error(`Failed to load patient information. ${err}`);
            }
        }

        initialize();
    }, [props.user, props.session]);

    return (
        <FluidContainer>
            <Row>
                {
                    (isLoading) ?
                    <>
                        <Col>
                            <Loader isLoading={true} />
                        </Col>
                    </> :
                    <>
                        <Col className="col-auto px-0">
                            <ProfilePhoto 
                                className="md-pfl-sm md-pfl-round"
                                session={props.session}
                                user={user}
                            />
                        </Col>
                        <Col>
                            <Link to={`/users/${user.username}`} className="font-weight-bold">
                                <FullName user={user} />
                            </Link>
                            <p className="my-0 md-font-sm text-muted">
                                <BioData user={user} />
                            </p>
                        </Col>
                    </>
                }
            </Row>
        </FluidContainer>
    );
}


function InfoRow(props) {
    return (
        <Row>
            {props.children}
        </Row>
    );
}

function InfoTitle(props) {
    return (
        <Col className="col-12 col-sm-4 col-md-3 col-lg-2 font-weight-bold d-block">
            {props.children}
        </Col>
    );
}

function InfoBody(props) {
    return (
        <Col className="col-12 col-sm-8 col-md-9 col-lg-10 mb-2 ml-0 d-block text-wrap">
            {props.children}
        </Col>
    );
}


function ViewSection(props) {
    const startTime = props.appointment.startTime;
    const endTime = props.appointment.endTime;

    return (
        <FluidContainer>
            <InfoRow>
                <InfoTitle>Title</InfoTitle>
                <InfoBody>{props.appointment.title}</InfoBody>
            </InfoRow>
            <InfoRow>
                <InfoTitle>Service</InfoTitle>
                <InfoBody>{props.appointment.serviceName}</InfoBody>
            </InfoRow>
            <InfoRow>
                <InfoTitle>Patient</InfoTitle>
                <InfoBody>
                    <UserInfo session={props.session} user={props.appointment.patient} />
                </InfoBody>
            </InfoRow>
            <InfoRow>
                <InfoTitle>Physician</InfoTitle>
                <InfoBody>
                    <UserInfo session={props.session} user={props.appointment.physician} />
                </InfoBody>
            </InfoRow>
            <InfoRow>
                <InfoTitle>Status</InfoTitle>
                <InfoBody>
                    <FluidContainer>
                        <Row>
                            <Col className="col-auto px-0">
                                <Status status={props.appointment.status} />
                            </Col>
                        </Row>
                    </FluidContainer>
                </InfoBody>
            </InfoRow>
            <InfoRow>
                <InfoTitle>Start Time</InfoTitle>
                <InfoBody>
                    <FullTime date={startTime} hour12={true}/>, <PrettyDate date={startTime} />
                </InfoBody>
            </InfoRow>
            <InfoRow>
                <InfoTitle>End Time</InfoTitle>
                <InfoBody>
                    <FullTime date={endTime} hour12={true}/>, <PrettyDate date={endTime} />
                </InfoBody>
            </InfoRow>
            <InfoRow>
                <InfoTitle>Description</InfoTitle>
                <InfoBody>{props.appointment.description}</InfoBody>
            </InfoRow>
        </FluidContainer>
    );
}


export default function InformationSection(props) {
    return (
        <>
            <Widget>
                <TitleBar title="Information" />
                <WidgetBody>
                    <ViewSection  
                        session={props.session}
                        appointment={props.appointment}
                    />
                </WidgetBody>
            </Widget>
        </>
    );
}