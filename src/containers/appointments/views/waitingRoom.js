import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from '../../../components/layout';

import TitleBar, { TitleBarLink, TitleBarLinks, TitleBarSearch } from '../../home/titleBar';
import InfiniteAppointmentList from '../lists';


export default function WaitingRoomView(props) {
    const session = useSelector(s => s.session);
    const [searchQuery, setSearchQuery] = useState("");

    const showNewAppointment = !Boolean(session.isPhysician);

    return (
        <>
            <TitleBar title="Waiting Room">
                <TitleBarSearch
                    handleSearch={setSearchQuery}
                    placeholder="Search appointments..."
                />
                <TitleBarLinks>
                    {showNewAppointment &&
                        <TitleBarLink
                            path="/appointments?view=new"
                            title="New Appointment"
                            icon="add"
                        />
                    }
                </TitleBarLinks>
            </TitleBar>
            <Row className="flex-grow-1">
                <Col>
                    <InfiniteAppointmentList 
                        view="waiting"
                        search={searchQuery}
                        defaultMessage="Hurray! You've caught up with all your appointments."
                    />
                </Col>
            </Row>
        </>
    );
}