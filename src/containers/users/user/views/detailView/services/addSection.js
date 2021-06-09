import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormRow, 
    FormSubmit } from "../../../../../../components/form";


export default function AddSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        name: "",
        rate: 0
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
            const newService = {
                name: fields.name,
                rate: fields.rate
            };

            const response = await fetch(`/api/users/${props.user.username}/services`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newService)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            newService.id = data.id;
            if (props.appendService) {
                props.appendService(newService);
            }

            setFields({
                ...fields,
                title: "",
                content: ""
            });
        } catch (err) {
            console.error(`Failed to add new service. ${err}`);
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
            <FormRow>
                <FormLabel for="servicesForm01" className="col-sm-4">Name</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="servicesForm01" name="name" type="text" 
                    className="form-control" value={fields.name} onChange={handleChange}
                        placeholder="Name of Service"
                  />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="servicesForm02" className="col-sm-4">Rate</FormLabel>
                <FormGroup className="col-sm-8">
                  <input id="servicesForm02" name="rate" type="number" 
                    className="form-control" value={fields.rate} onChange={handleChange}
                        placeholder="Rate" min="0" step="0.01" 
                  />
                </FormGroup>
            </FormRow>
            <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
            </FormRow>
        </Form>
    );
}