import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Form } from '../../../../components/form';
import { isValidDate } from '../../../../components/dates';

import ProgressBar from './progress';
import PhysicianSection from './physicianSection';
import ServiceSection from './serviceSection';
import InfoSection from './infoSection';


export default function NewAppointmentForm(props) {
    const minSteps = 1;
    const maxSteps = 3;

    const [fields, setFields] = useState({
        currentStep: minSteps,
        navigateToAppointments: false,
        errorMessage: '',
        physician: '',
        service: '',
        startDate: '',
        startTime: "00:00",
        endDate: '',
        endTime: "00:00",
        description: ''
    });

    useEffect(() => {
        if (fields.service || fields.physician) {
            setFields(prevFields => {
                return {
                    ...fields,
                    currentStep: prevFields.currentStep + 1
                }
            });
        }
    }, [fields.physician, fields.service]);

    async function handleChange(e) {
        setFields({
            ...fields,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (fields.currentStep === maxSteps) {
            try {
                const [ startHour, startMinutes ] = fields.startTime.split(':').map(t => parseInt(t));
                const [ endHour, endMinutes ] = fields.endTime.split(':').map(t => parseInt(t));
    
                const appointmentStartTime = new Date(fields.startDate);
                appointmentStartTime.setHours(startHour);
                appointmentStartTime.setMinutes(startMinutes);

                if (!isValidDate(appointmentStartTime)) {
                    throw new Error("Invalid Start time. Must be a valid date.");
                }

                const appointmentEndTime = new Date(fields.endDate);
                appointmentEndTime.setHours(endHour);
                appointmentEndTime.setMinutes(endMinutes);

                if (!isValidDate(appointmentEndTime)) {
                    throw new Error("Invalid End time. Must be a valid date.");
                }

                if (appointmentEndTime <= appointmentStartTime) {
                    throw new Error("Appointment End time cannot be before its Start time.");
                }
    
                const response = await fetch(`/api/appointments`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${props.session.authToken}`
                    },
                    body: JSON.stringify({
                      title: fields.title,
                      patient: props.session.username,
                      physician: fields.physician,
                      serviceId: fields.service,
                      startTime: appointmentStartTime,
                      endTime: appointmentEndTime,
                      description: fields.description
                    })
                });
    
                let data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
    
                setFields({
                    ...fields,
                    navigateToAppointments: true
                });
            } catch (err) {
                console.error(`Failed to add a new appointment: ${err.message}`);
                setFields({
                    ...fields,
                    errorMessage: err.message
                });
            }
        }
    }

    if (fields.navigateToAppointments === true) {
        return <Redirect to="/appointments" />
      }

    return (
        <Form className="md-nw-appt" handleSubmit={handleSubmit}>
            <ProgressBar 
                className="mb-3"
                value={fields.currentStep}
                minValue={minSteps}
                maxValue={maxSteps}
            />
            <PhysicianSection
                currentStep={fields.currentStep}
                id="newAppt01"
                session={props.session}
                name="physician"
                handleClick={handleChange}
                physician={fields.physician}
            />
            <ServiceSection 
                currentStep={fields.currentStep}
                id="newAppt02"
                session={props.session}
                name="service"
                handleClick={handleChange}
                physician={fields.physician}
            />
            <InfoSection
                currentStep={fields.currentStep}
                session={props.session}
                handleChange={handleChange}
                title={fields.title}
                startDate={fields.startDate}
                startTime={fields.startTime}
                endDate={fields.endDate}
                endTime={fields.endTime}
                description={fields.description}
                errorMessage={fields.errorMessage}
            />
        </Form>
    );
}