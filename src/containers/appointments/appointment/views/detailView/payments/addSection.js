import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormRow, 
    FormSubmit } from '../../../../../../components/form';
import { Username } from '../../../../../../components/users';


export default function AddSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        amount: ""
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
            if (fields.amount > props.appointment.paymentBalance) {
                throw new Error("Payment amount cannot be more than balance.")
            }

            const newPayment = {
                fromUsername: Username({ user: props.session }),
                toUsername: Username({ user: props.appointment.physician}),
                amount: fields.amount,
                date: new Date()
            };

            const response = await fetch(`/api/appointments/${props.appointment.id}/payments`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newPayment)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            newPayment.id = data.id;
            if (props.appendPayment) {
                props.appendPayment(newPayment);
            }

            setFields({
                ...fields,
                amount: ""
            });
        } catch (err) {
            console.error(`Failed to add new payment. ${err}`);
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
                <FormLabel for="paymentWidget1" className="col-sm-4">Amount</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="paymentWidget1" type="number" name="amount" 
                        className="form-control" value={fields.amount} onChange={handleChange} 
                            placeholder="Add payment amount" min="0" step="0.01">
                    </input>
                </FormGroup>
            </FormRow>
            <FormRow className="my-2 justify-content-center">
                <FormSubmit className="col-auto col-md-4">Pay</FormSubmit>
            </FormRow>
        </Form>
    );
}