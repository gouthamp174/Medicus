import React, { useEffect, useState } from 'react';

import AppointmentListView from "./views/listView";
import AppointmentDetailView from "./views/detailView";


export default function Appointment(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [appointment, setAppointment] = useState({});

    // Initialize appointment by fetching appointment information.
    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/appointments/${props.id}`, {
                    headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                    }
                });
            
                let data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                setAppointment(data);
            } catch (err) {
                console.error(`Failed to get appointment information- ${props.id}. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, [props.id, props.session]);

    async function handleStatus(e) {
        e.preventDefault();
        try {
            const newStatus = e.currentTarget.value;

            const response = await fetch(`/api/appointments/${props.id}`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify({
                  status: newStatus
                })
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setAppointment(prevState => {
                return {
                    ...prevState,
                    status: newStatus
                }
            });
        } catch (err) {
            console.error(`Failed to update status for appointment- ${props.id}. ${err}`);
        }
    }

    async function handleDelete(e) {
        e.preventDefault();
        try {
            const response = await fetch(`/api/appointments/${props.id}`, {
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

            if (props.deleteAppointment) {
                await props.deleteAppointment(props.id);
            }
        } catch (err) {
            console.log(`Failed to delete appointment- ${props.id}. ${err}`);
        }
    }

    async function updatePaymentBalance(newPaymentBalance) {
        setAppointment({
            ...appointment,
            paymentBalance: newPaymentBalance
        });
    }

    if (props.listView) {
        return (
            <AppointmentListView
                isLoading={isLoading}
                session={props.session}
                appointment={appointment}
                handleStatus={handleStatus}
                handleDelete={handleDelete}
            />
        );
    } else {
        return (
            <AppointmentDetailView 
                isLoading={isLoading}
                session={props.session}
                appointment={appointment}
                handleStatus={handleStatus}
                handleDelete={handleDelete}
                updatePayment={updatePaymentBalance}
            />
        );
    }
}