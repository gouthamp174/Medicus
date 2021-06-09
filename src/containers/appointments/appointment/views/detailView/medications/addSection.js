import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormRow, 
    FormSubmit } from '../../../../../../components/form';
import { Username } from '../../../../../../components/users';


export default function AddSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        name: "",
        dosage: ""
    });

    async function handleChange(e) {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const newMedication = {
                fromUsername: Username({ user: props.session}),
                toUsername: Username({ user: props.appointment.patient}),
                name: fields.name,
                dosage: fields.dosage
            };

            const response = await fetch(`/api/appointments/${props.appointment.id}/medications`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newMedication)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            newMedication.id = data.id;
            if (props.appendMedication) {
                props.appendMedication(newMedication);
            }

            setFields({
                ...fields,
                name: "",
                dosage: ""
            });
        } catch (err) {
            console.error(`Failed to add new medication. ${err}`);
            setErrorMessage(err.message);
        }
    }

    return (
        <Form className="container-fluid" handleSubmit={handleSubmit}>
            {(errorMessage) &&
                <FormRow className="justify-content-center">
                    <div className="alert alert-danger" role="alert">{errorMessage}</div>
                </FormRow>
            }
            <FormRow className="my-2">
                <FormLabel for="medicationsForm01" className="col-sm-4">Name</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="medicationsForm01" name="name" type="text" 
                        className="form-control" value={fields.name} onChange={handleChange} 
                            placeholder="Name of Medication" 
                    />
                </FormGroup>
            </FormRow>
            <FormRow className="my-2">
                <FormLabel for="medicationsForm02" className="col-sm-4">Dosage (in mg)</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="medicationsForm02" name="dosage" type="text" 
                        className="form-control" value={fields.dosage} onChange={handleChange}
                            placeholder="Dosage (in mg)" 
                    />
                </FormGroup>
            </FormRow>
            <FormRow className="my-2 justify-content-center">
                <FormSubmit className="btn-primary col-auto col-md-4">Add</FormSubmit>
            </FormRow>
        </Form>
    );
}