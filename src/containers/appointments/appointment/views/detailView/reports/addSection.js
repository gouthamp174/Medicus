import React, { useState } from 'react';
import { Form, FormGroup, FormRow, 
    FormSubmit } from '../../../../../../components/form';
import { Username } from '../../../../../../components/users';


export default function AddSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        name: ""
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
            const newReport = {
                fromUsername: Username({ user: props.session }),
                name: fields.name.replace(/^.*[\\\/]/, ''),
                date: new Date()
            };

            const response = await fetch(`/api/appointments/${props.appointment.id}/labReports`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newReport)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            newReport.id = data.id;
            if (props.appendReport) {
                props.appendReport(newReport);
            }

            setFields({
                ...fields,
                name: ""
            });
        } catch (err) {
            console.error(`Failed to add new report. ${err}`);
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
                <FormGroup className="custom-file">
                  <input id="reportsForm01" type="file" name="name" className="custom-file-input"
                    value={fields.name} onChange={handleChange} required />
                  <label className="custom-file-label" for="reportsForm01">
                    {
                      (fields.name) ? fields.name.replace(/^.*[\\\/]/, '') : "Choose a file..."
                    }
                  </label>
                </FormGroup>
            </FormRow>
            <FormRow className="my-2 justify-content-center">
                <FormSubmit className="col-auto col-md-4">Upload</FormSubmit>
            </FormRow>
        </Form>
    );
}