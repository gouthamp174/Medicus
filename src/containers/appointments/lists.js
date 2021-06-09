import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PrettyDate } from '../../components/dates';
import { Col, FluidContainer, Row } from '../../components/layout';
import { List, ListItem } from '../../components/lists';
import { AutoLoader } from '../../components/loaders';

import Appointment from './appointment';


function DateItem(props) {
    return (
        <FluidContainer className="md-appt-date p-3">
            <Row className="justify-content-center">
                <Col className="col-auto align-items-center">
                    <h6 className="my-0">
                        <PrettyDate date={props.date} long={true}/>
                    </h6>
                </Col>
            </Row>
        </FluidContainer>
    );
}


function DefaultItem(props) {
    return (
        <Row className="justify-content-center">
            <Col className="col-auto align-items-center">
                <h6 className="my-0 py-3 text-muted">
                    {props.message}
                </h6>
            </Col>
        </Row>
    );
}


function ListView(props) {
    const groupByStartTimeMap = new Map();
    for (const appointment of props.appointments) {
        const appointmentStartTime = new Date(appointment.startTime);
        const startDate = appointmentStartTime.toDateString();

        if (!groupByStartTimeMap.has(startDate)) {
            groupByStartTimeMap.set(startDate, []);
        }
        groupByStartTimeMap.get(startDate).push(appointment);
    }

    const appointmentGroupItems = [];
    if (groupByStartTimeMap.size > 0) {
        for (const [startDate, appointments] of groupByStartTimeMap.entries()) {
            let groupDate = new Date(startDate);

            let groupItem = (
                <Row>
                    <Col className="px-0">
                        <DateItem
                            date={groupDate}
                        />
                        <List className="md-list">
                            {appointments.map((appointment, index) => (
                                <ListItem key={index} className="p-0 my-1">
                                    <Appointment
                                        session={props.session}
                                        id={appointment.id}
                                        deleteAppointment={props.deleteAppointment}
                                        listView={true}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Col>
                </Row>
            );

            appointmentGroupItems.push(groupItem);
        }
        
    } else {
        appointmentGroupItems.push(
            <DefaultItem message={props.defaultMessage} />
        );
    }

    return (
        <FluidContainer>
            {appointmentGroupItems}
        </FluidContainer>
    );
}


export default function InfiniteAppointmentList(props) {
    const session = useSelector(s => s.session);

    const getAppointments = useCallback(async ({view='', search='', page=0, limit=10}) => {
        try {
            const searchParams = new URLSearchParams();
            (view) && searchParams.append('view', view);
            (search) && searchParams.append('search', search);
            searchParams.append('page', page);
            searchParams.append('limit', limit);

            const response = await fetch(`/api/appointments?${searchParams.toString()}`, {
                headers: {
                  'Authorization': `Bearer ${session.authToken}`
                }
            });

            const appointments = await response.json();
            if (!response.ok) {
                throw new Error(appointments.message);
            }

            return appointments;
        } catch (err) {
            throw(err);
        }
    }, [session.authToken]);

    const [state, setState] = useState({
        appointments: [],
        limit: 10
    });

    // If props change, initialize appointments.
    useEffect(() => {
        async function load() {
            try {
                const newAppointments = await getAppointments({
                    view: props.view,
                    search: props.search,
                    page: 0,
                    limit: state.limit
                });

                setState(prevState => {
                    return {
                        ...prevState,
                        appointments: newAppointments
                    }
                });
            } catch (err) {
                console.error(`Failed to load appointments. ${err}`);
            }
        }

        load();
    }, [props.view, props.search, getAppointments, state.limit]);

    async function appendAppointments() {
        try {
            const newAppointments = await getAppointments({
                view: props.view,
                search: props.search,
                page: Math.ceil(state.appointments.length / state.limit),
                limit: state.limit
            });

            setState(prevState => {
                const updatedAppointments = [...prevState.appointments, ...newAppointments];

                return {
                    ...prevState,
                    appointments: updatedAppointments
                }
            });
        } catch (err) {
            console.error(`Failed to append more appointments. ${err}`);
        }
    }

    async function deleteAppointment(id) {
        try {
            setState(prevState => {
                const updatedAppointments = prevState.appointments.filter(appointment => {
                    return appointment.id !== id;
                });

                return {
                    ...prevState,
                    appointments: updatedAppointments
                }
            });
        } catch (err) {
            console.error(`Failed to delete appointment- ${id}. ${err}`);
        }
    }

    // Now render view.
    return (
        <FluidContainer>
            <Row>
                <Col className="px-0">
                    <ListView
                        session={session}
                        appointments={state.appointments}
                        deleteAppointment={deleteAppointment}
                        defaultMessage={props.defaultMessage}
                    />
                    {(state.appointments.length > 0) &&
                        <AutoLoader callback={appendAppointments} />
                    }
                </Col>
            </Row>
        </FluidContainer>
    );
}