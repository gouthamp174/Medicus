import React from 'react';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Username } from '../../../../../../components/users';
import { WidgetList, WidgetListItem, WidgetDropdown, 
    WidgetDropdownItem } from '../../../../../../components/widgets';


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
    async function handleDelete(e) {
        e.preventDefault();
        if (props.handleDelete) {
            props.handleDelete(props.medication.id);
        }
    }

    const fromUsername = props.medication.fromUsername;
    const currentUsername = Username({ user: props.session });
    const fromCurrentUser = (currentUsername === fromUsername) ? true: false;

    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="align-self-center">
                        <Row>
                            <Col className="text-truncate">{props.medication.name}</Col>
                            <Col className="col-auto">{`${props.medication.dosage} mg`}</Col>
                        </Row>
                    </Col>
                    <Col className="col-auto px-2">
                        {fromCurrentUser &&
                            <WidgetDropdown>
                                <WidgetDropdownItem handleClick={handleDelete}>Delete</WidgetDropdownItem>
                            </WidgetDropdown>
                        }
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
                            session={props.session}
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