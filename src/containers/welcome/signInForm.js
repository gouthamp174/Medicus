import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormRow, FormGroup, FormSubmit } from "../../components/form.js";


export default function SignInForm(props) {
    const dispatch = useDispatch();

    const [fields, setfields] = useState({
        errorMessage: "",
        username: "",
        password: ""
    });

    function handleChange(e) {
        setfields({
            ...fields,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`/api/auth/signin`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: fields.username,
                    password: fields.password
                })
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            dispatch({
                type: "session/set",
                payload: {
                    ...data
                }
            });
        } catch (err) {
            console.error(`Failed to sign in. ${err}`);
            setfields({
                ...fields,
                errorMessage: err.message
            });
        }
    }

    return (
        <Form handleSubmit={handleSubmit}>
            <h5 className="font-weight-bold mb-3">Sign In.</h5>
            {fields.errorMessage &&
                <FormRow className="justify-content-center">
                    <div className="alert alert-danger p-2" role="alert">
                        {fields.errorMessage}
                    </div>
                </FormRow>
            }
            <FormGroup>
                <input id="signInForm1" type="text" name="username" className="form-control"
                    placeholder="Username" value={fields.username} onChange={handleChange}
                        aria-label="Username" required />
            </FormGroup>
            <FormGroup>
                <input id="signInForm2" type="password" name="password" className="form-control"
                    placeholder="Password" value={fields.password} onChange={handleChange}
                        aria-label="Password" required />
            </FormGroup>
            <FormGroup className="mb-2">
                <FormSubmit className="btn-primary w-100">Sign In</FormSubmit>
            </FormGroup>
        </Form>
    );
}