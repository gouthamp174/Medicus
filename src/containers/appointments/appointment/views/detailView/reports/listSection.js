import React from 'react';
import { NumericDate } from '../../../../../../components/dates';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Username } from '../../../../../../components/users';
import { WidgetList, WidgetListItem, WidgetDropdown, 
    WidgetDropdownItem } from '../../../../../../components/widgets';


function DefaultReportItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No report available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function ReportItem(props) {
    async function handleDelete(e) {
        e.preventDefault();
        if (props.handleDelete) {
            props.handleDelete(props.report.id);
        }
    }

    const fromUsername = props.report.fromUsername;
    const currentUsername = Username({ user: props.session });
    const fromCurrentUser = (currentUsername === fromUsername) ? true: false;

    const date = new Date(props.report.date);
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="align-self-center">
                        <Row>
                            <Col className="text-truncate">{props.report.name}</Col>
                            <Col className="col-auto">
                                <NumericDate date={date} />
                            </Col>
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
            {(props.reports.length !== 0) ?
                <>
                    {props.reports.map((report, index) => (
                        <ReportItem 
                            key={index}
                            session={props.session}
                            report={report}
                            handleDelete={props.deleteReport}
                        />
                    ))}
                </> :
                <DefaultReportItem />
            }
        </WidgetList>
    );
}