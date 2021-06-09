import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import Appointment from '../appointment';


export default function AppointmentView(props) {
    const [isDeleted, setIsDeleted] = useState(false);

    async function deleteAppointment(e) {
        setIsDeleted(true);
    }

    // Now render view.
    if (isDeleted) {
        return (
            <Redirect to="/" />
        );
    }

    return (
        <>
            <Appointment
                session={props.session}
                id={props.id}
                deleteAppointment={deleteAppointment}
                listView={false}
            />
        </>
    );
}