import React from 'react';
import { useSelector } from 'react-redux';
import { Col, FluidContainer, Row } from '../../components/layout';
import { WidgetRow } from '../../components/widgets';

import TitleBar from '../home/titleBar';
import AccountInformationWidget from './widgets/accountInformation';
import DeleteUserWidget from './widgets/deleteUser';
import PasswordWidget from './widgets/password';
import PhysicianInformationWidget from './widgets/physicianInformation';
import ProfilePhotoWidget from './widgets/profilePhoto';


export default function SettingsApp(props) {
    const session = useSelector(s => s.session);

    return (
        <>
            <TitleBar title="Settings" />
            <Row className="flex-grow-1">
                <Col className="pt-3">
                    <FluidContainer>
                        <WidgetRow>
                            <Col>
                                <AccountInformationWidget />
                            </Col>
                        </WidgetRow>
                        <WidgetRow>
                            <Col>
                                <ProfilePhotoWidget />
                            </Col>
                        </WidgetRow>
                        <WidgetRow>
                            <Col>
                                <PasswordWidget />
                            </Col>
                        </WidgetRow>
                        {session.isPhysician &&
                            <WidgetRow>
                                <Col>
                                    <PhysicianInformationWidget />
                                </Col>
                            </WidgetRow>
                        }
                        <WidgetRow>
                            <Col>
                                <DeleteUserWidget />
                            </Col>
                        </WidgetRow>
                    </FluidContainer>
                </Col>
            </Row>
        </>
    );
}