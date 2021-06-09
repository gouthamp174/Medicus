import React from 'react';
import { useSelector } from 'react-redux';
import { Col, FluidContainer, Row } from '../../components/layout.js';
import { WidgetColumns, WidgetDeck, WidgetRow } from '../../components/widgets.js';

import TitleBar from '../home/titleBar';
import Banner from './widgets/banner';
import RecentMedicationWidget from './widgets/recentMedications';
import RecentPaymentWidget from './widgets/recentPayments';
import TodayAppointmentWidget from './widgets/todaysAppointment';


export default function DashBoardApp(props) {
    const session = useSelector(s => s.session);

    return (
        <>
            <TitleBar title="Dashboard" />
            <Row className="flex-grow-1">
                <Col className="pt-3">
                    <FluidContainer>
                        <WidgetRow>
                            <Col>
                                <Banner 
                                    session={session}
                                />
                            </Col>
                        </WidgetRow>
                        <WidgetColumns>
                            <TodayAppointmentWidget 
                                session={session}
                            />
                            {!session.isPhysician &&
                                <RecentMedicationWidget 
                                    session={session}
                                />
                            }
                            <RecentPaymentWidget 
                                session={session}
                            />
                        </WidgetColumns>
                    </FluidContainer>
                </Col>
            </Row>
        </>
    );
}
