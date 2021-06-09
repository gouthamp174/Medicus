import React, { useState } from 'react';
import { AutoLoader } from '../../../../../../components/loaders';
import { TitleBar, TitleToggler, Widget, 
    WidgetCollapsible } from '../../../../../../components/widgets';

import AddSection from './addSection';
import ListSection from './listSection';


export default function ReportSection(props) {
    const [state, setState] = useState({
        reports: [],
        limit: 10
    });

    async function appendReports() {
        try {
            const url = `/api/appointments/${props.appointment.id}/labReports`;

            const searchParams = new URLSearchParams();
            searchParams.append('page', Math.ceil(state.reports.length / state.limit));
            searchParams.append('limit', state.limit);

            const response = await fetch(`${url}?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let newReports = await response.json();
            if (!response.ok) {
                throw new Error(newReports.message);
            }

            setState(prevState => {
                const updatedReports = [...prevState.reports, ...newReports];

                return {
                    ...prevState,
                    reports: updatedReports
                }
            })
        } catch (err) {
            console.error(`Failed to append more reports. ${err}`);
        }
    }

    async function appendReport(newReport) {
        setState(prevState => {
            const newReports = [newReport, ...prevState.reports];

            return {
                ...prevState,
                reports: newReports
            }
        });
    }

    async function deleteReport(id) {
        try {
            const response = await fetch(`/api/appointments/${props.appointment.id}/labReports/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setState(prevState => {
                const newReports = state.reports.filter(report => {
                    return report.id !== id;
                });

                return {
                    ...prevState,
                    reports: newReports
                }
            });
        } catch (err) {
            console.error(`Failed to delete report- ${id}. ${err}`);
        }
    }
    return (
        <>
            <Widget>
                <TitleBar title="Reports">
                    <TitleToggler 
                        target="apptReportAdd01"
                        expandIcon="add"
                        collapseIcon="clear"
                    />
                </TitleBar>
                <WidgetCollapsible id="apptReportAdd01">
                    <AddSection
                        session={props.session}
                        appointment={props.appointment}
                        appendReport={appendReport}
                    />
                </WidgetCollapsible>
                <ListSection
                    session={props.session}
                    reports={state.reports}
                    deleteReport={deleteReport}
                />
            </Widget>
            <AutoLoader callback={appendReports} />
        </>
    );
}