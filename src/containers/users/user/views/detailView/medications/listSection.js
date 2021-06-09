import React from 'react';
import { Link } from 'react-router-dom';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { WidgetList, WidgetListItem } from '../../../../../../components/widgets';


function DefaultMedicationItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No medication available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function MedicationItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="text-truncate font-weight-bold">
                        <Link to={`/appointments/${props.medication.appointmentId}`}>
                            {props.medication.name}
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col className="md-font-sm text-muted text-truncate">
                        {`${props.medication.dosage} mg`}
                    </Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


export default function ListSection(props) {
    return (
        <WidgetList>
            {(props.medications.length !== 0) ?
                <>
                    {props.medications.map((medication, index) => (
                        <MedicationItem 
                            key={index}
                            medication={medication}
                            handleDelete={props.deleteMedication}
                        />
                    ))}
                </> :
                <DefaultMedicationItem />
            }
        </WidgetList>
    );
}