import React from 'react';
import { Link } from 'react-router-dom';
import { NumericDate } from '../../../../../../components/dates';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { WidgetList, WidgetListItem } from '../../../../../../components/widgets';


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
    const date = new Date(props.report.date);
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="text-truncate font-weight-bold">
                        <Link to={`/appointments/${props.report.appointmentId}`}>
                            {props.report.name}
                        </Link>
                    </Col>
                    <Col className="col-auto text-truncate">
                        <NumericDate date={date} />
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