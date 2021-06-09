import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, FluidContainer, Row } from '../../../components/layout';
import { Loader } from '../../../components/loaders';
import { TitleBar, Widget, WidgetBody, WidgetList, WidgetListItem } from '../../../components/widgets';


function DefaultMedicationItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No medications available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function ViewAllItem(props) {
    return (
        <WidgetListItem>
            <Link to={`/users/${props.session.username}/medications`}>
                <FluidContainer>
                    <Row>
                        <Col className="md-font-sm text-center text-muted">View All</Col>
                    </Row>
                </FluidContainer>
            </Link>
        </WidgetListItem>
    );
}


function MedicationItem(props) {
    return(
        <WidgetListItem className="list-group-item-action">
            <FluidContainer>
                <Row>
                    <Col className="align-self-center">
                        <Row>
                            <Col>
                                <Link to={`/medications/${props.medication.appointmentId}`}
                                    className="font-weight-bold text-truncate">
                                    {props.medication.name}
                                </Link>
                            </Col>
                            <Col className="col-auto">
                                {`${props.medication.dosage} mg`}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


export default function RecentMedicationWidget(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState({
        medications: [],
        limit: 5
    });

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const username = props.session.username;
                const page = 0;

                const response = await fetch(`/api/users/${username}/medications?page=${page}&limit=${state.limit}`, {
                  headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                  }
                });
          
                let data = await response.json();
                if (!response.ok) {
                  throw new Error(data.message);
                }

                setState(prevState => {
                    const newMedications = [...prevState.medications, ...data];

                    return {
                        ...prevState,
                        medications: newMedications
                    }
                });
            } catch (err) {
                console.error(`Failed to to load recent medications. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, [props.session, state.limit]);

    return (
        <Widget>
            <TitleBar title="Recent Medications" />
            {
                (isLoading) ?
                <>
                    <WidgetBody>
                        <Loader isLoading={true} />
                    </WidgetBody>
                </> :
                <>
                    <WidgetList>
                        {(state.medications.length !== 0) ?
                            <>
                                {state.medications.map((medication, index) => (
                                    <MedicationItem 
                                        key={index}
                                        medication={medication}
                                    />
                                ))}
                                <ViewAllItem session={props.session} />
                            </> :
                            <DefaultMedicationItem />
                        }
                    </WidgetList>
                </>
            }
        </Widget>
    );
}