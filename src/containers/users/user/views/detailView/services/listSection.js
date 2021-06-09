import React from 'react';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Currency, Username } from '../../../../../../components/users';
import { WidgetList, WidgetListItem, WidgetDropdown, 
    WidgetDropdownItem } from '../../../../../../components/widgets';


function DefaultServiceItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No service available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function ServiceItem(props) {
    async function handleDelete(e) {
        e.preventDefault();
        
        if (props.handleDelete) {
            props.handleDelete(props.service.id);
        }
    }

    const username = props.service.username;
    const currentUsername = Username({ user: props.session });
    const fromCurrentUser = (currentUsername === username) ? true : false;

    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="align-self-center">
                        <Row>
                            <Col className="align-self-center">
                                {props.service.name}
                            </Col>
                            <Col className="col-auto">
                                <Currency value={props.service.rate} />
                            </Col>
                        </Row>
                    </Col>
                    <Col className="col-auto">
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
            {(props.services.length !== 0) ?
                <>
                    {props.services.map((service, index) => (
                        <ServiceItem 
                            key={index}
                            session={props.session}
                            service={service}
                            handleDelete={props.deleteService}
                        />
                    ))}
                </> :
                <DefaultServiceItem />
            }
        </WidgetList>
    );
}