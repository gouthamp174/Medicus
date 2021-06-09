import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from '../../../components/layout';

import TitleBar, { TitleBarLink, TitleBarLinks, TitleBarSearch } from '../../home/titleBar';
import InfiniteAppointmentList from '../lists';


export default function AllAppointmentsView(props) {
    const session = useSelector(s => s.session);
    const [searchQuery, setSearchQuery] = useState("");

    const showNewAppointment = !Boolean(session.isPhysician);

    return (
        <>
            <TitleBar title="Appointments">
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
                        view=""
                        search={searchQuery}
                        defaultMessage="You don't have any scheduled appointments."
                    />
                </Col>
            </Row>
        </>
    );
}