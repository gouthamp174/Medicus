import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FullTime, PrettyDate } from '../../../components/dates';
import { Col, FluidContainer, Row } from '../../../components/layout';
import { Loader } from '../../../components/loaders';
import { FullName } from '../../../components/users';
import { TitleBar, Widget, WidgetBody, WidgetList, WidgetListItem } from '../../../components/widgets';


function DisplayName(props) {
    const currentUserFullName = FullName({ user: props.session });
    const patientFullName = FullName({ user: props.appointment.patient });
    const physicianFullName = FullName({ user: props.appointment.physician });

    if (currentUserFullName === patientFullName) {
        return physicianFullName;
    } else {
        return patientFullName;
    }
}


function AppointmentTitle(props) {
    return (props.appointment) ? props.appointment.title: "";
}


function DefaultAppointmentItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No appointments available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function ViewAllItem(props) {
    return (
        <WidgetListItem>
            <Link to='/appointments?view=waiting'>
                <FluidContainer>
                    <Row>
                        <Col className="md-font-sm text-center text-muted">View All</Col>
                    </Row>
                </FluidContainer>
            </Link>
        </WidgetListItem>
    );
}


function AppointmentItem(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [appointment, setAppointment] = useState({});

    useEffect(() => {
        async function load() {
            try {
                setIsLoading(true);

                const response = await fetch(`/api/appointments/${props.appointment.id}`, {
                    headers: {
                        'Authorization': `Bearer ${props.session.authToken}`
                    }
                });
            
                let appointment = await response.json();
                if (!response.ok) {
                    throw new Error(appointment.message);
                }

                setAppointment(appointment);
            } catch (err) {
                console.error(`Failed to load appointment- ${props.appointment.id}. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        load();
    }, [props.appointment, props.session]);

    return(
        <WidgetListItem className="list-group-item-action">
            <FluidContainer>
                <Row>
                    {
                        (isLoading) ?
                        <>
                            <Loader isLoading={true} />
                        </> :
                        <>
                            <Col className="col-auto align-self-center">
                                <p className="text-center my-0">
                                    <FullTime date={appointment.startTime} />
                                </p>
                                <p className="md-font-sm text-center text-muted my-0">
                                    <PrettyDate date={appointment.startTime} />
                                </p>
                            </Col>
                            <Col className="align-self-center">
                                <p className="my-0">
                                    <Link to={`/appointments/${appointment.id}`}
                                        className="text-truncate font-weight-bold">
                                        <DisplayName
                                            session={props.session}
                                            appointment={appointment}
                                        />
                                    </Link>
                                </p>
                                <p className="md-font-sm text-truncate text-muted my-0">
                                    <AppointmentTitle
                                        appointment={appointment}
                                    />
                                </p>
                            </Col>
                        </>
                    }
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


export default function TodayAppointmentWidget(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState({
        appointments: [],
        limit: 10
    });

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const page = 0;
                const response = await fetch(`/api/appointments?view=waiting&page=${page}&limit=${state.limit}`, {
                  headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                  }
                });
          
                let data = await response.json();
                if (!response.ok) {
                  throw new Error(data.message);
                }
          
                setState(prevState => {
                    const newAppointments = [...prevState.appointments, ...data];

                    return {
                        ...prevState,
                        appointments: newAppointments
                    }
                });
            } catch (err) {
                console.error(`Failed to to load waiting appointments. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, [props.session, state.limit]);

    return (
        <Widget>
            <TitleBar title="Today's Appointments" />
            {
                (isLoading) ?
                <>
                    <WidgetBody>
                        <Loader isLoading={true} />
                    </WidgetBody>
                </> :
                <>
                    <WidgetList>
                        {(state.appointments.length !== 0) ?
                            <>
                                {state.appointments.map((appointment, index) => (
                                    <AppointmentItem 
                                        key={index}
                                        session={props.session}
                                        appointment={appointment}
                                    />
                                ))}
                                <ViewAllItem />
                            </> :
                            <DefaultAppointmentItem />
                        }
                    </WidgetList>
                </>
            }
        </Widget>
    );
}