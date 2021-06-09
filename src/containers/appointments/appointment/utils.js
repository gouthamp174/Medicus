import React from 'react';
import { FluidContainer } from '../../../components/layout';
import { FullName } from '../../../components/users';


export function StatusIndicator(props) {
    let colorClass;
    switch (props.status) {
        case "Accepted":
            colorClass = "st-accept";
            break;
        case "Rejected":
            colorClass = "st-reject";
            break;
        case "Done":
            colorClass = "st-done";
            break;
        default:
            colorClass = "st-pending";
    }

    return (
        <FluidContainer className={`h-100 md-appt-st md-appt-st-ind ${colorClass} p-1`}>
        </FluidContainer>
    );
}


export function Status(props) {
    let colorClass;
    switch (props.status) {
        case "Accepted":
            colorClass = "st-accept";
            break;
        case "Rejected":
            colorClass = "st-reject";
            break;
        case "Done":
            colorClass = "st-done";
            break;
        default:
            colorClass = "st-pending";
    }

    return (
        <p className={`md-appt-st ${colorClass} my-0 text-center`}>
            {props.status}
        </p>
    );
}

export function DisplayName(props) {
    const currentUserFullName = <FullName user={props.session} />;
    const patientFullName = <FullName user={props.appointment.patient} />;
    const physicianFullName = <FullName user={props.appointment.physician} />;

    if (currentUserFullName === patientFullName) {
        return physicianFullName;
    } else {
        return patientFullName;
    }
}


export function AppointmentTitle(props) {
    return (props.appointment) ? props.appointment.title: "";
}