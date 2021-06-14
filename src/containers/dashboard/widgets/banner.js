import React, { useEffect, useState } from 'react';
import { BodyCard } from '../../../components/cards';
import { PrettyDate } from '../../../components/dates';
import { LgIcon } from '../../../components/icons';
import { Col, FluidContainer, Row } from '../../../components/layout';
import { FullName, Username } from '../../../components/users';


function WelcomeMessage(props) {
    const today = new Date();
    return (
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
    );
}


function ServicesAlert(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function getCount() {
            try {
                setIsLoading(true);
                const username = Username({ user: props.session });
                const page = 0;
                const limit = 10;

                const response = await fetch(`/api/users/${username}/services?page=${page}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${props.session.authToken}`
                    }
                });

                let data = await response.json();
                if (!response.ok) {
                  throw new Error(data.message);
                }

                setCount(data.length);
            } catch (err) {
                console.error(`Failed to get count of services. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        getCount();
    }, [props.session]);

    if (isLoading || count > 0) {
        return null;
    } else {
        return (
            <Row className="mt-3">
                <Col>
                    <div className="alert alert-danger d-flex p-2" role="alert">
                        <LgIcon className="mx-1">person</LgIcon>
                        <p className="my-0">
                            You have not added any services yet. Add a service to your profile 
                            to help patients schedule new appointments with you.
                        </p>
                    </div>
                </Col>
            </Row>
        );
    }
}


export default function Banner(props) {
    const isCurrentUserPhysician = Boolean(props.session.isPhysician);
    
    return (
        <BodyCard className="rounded">
            <FluidContainer>
                <WelcomeMessage 
                    session={props.session}
                />
                {(isCurrentUserPhysician) &&
                    <ServicesAlert 
                        session={props.session}
                    />
                }
            </FluidContainer>
        </BodyCard>
    );
}