import React, { useState } from 'react';
import { Form, FormGroup, FormLabel, FormRow, 
    FormSubmit } from '../../../../../../components/form';
import { Username } from '../../../../../../components/users';


export default function AddSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        title: "",
        content: ""
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
            const newNote = {
                fromUsername: Username({ user: props.session }),
                title: fields.title,
                content: fields.content,
                date: new Date()
            };

            const response = await fetch(`/api/appointments/${props.appointment.id}/notes`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newNote)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            newNote.id = data.id;
            if (props.appendNote) {
                props.appendNote(newNote);
            }

            setFields({
                ...fields,
                title: "",
                content: ""
            });
        } catch (err) {
            console.error(`Failed to add new note. ${err}`);
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
                <FormLabel for="noteWidget1" className="col-sm-4">Title</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="noteWidget1" type="text" name="title" 
                        className="form-control" value={fields.title} onChange={handleChange}
                            placeholder="Add new title">
                    </input>
                </FormGroup>
            </FormRow>
            <FormRow className="my-2">
                <FormLabel for="noteWidget2" className="col-sm-4">Content</FormLabel>
                <FormGroup className="col-sm-8">
                    <textarea id="noteWidget2" type="text" name="content" 
                        className="form-control" value={fields.content} onChange={handleChange}
                            placeholder="Add new content" rows="3">
                    </textarea>
                </FormGroup>
            </FormRow>
            <FormRow className="my-2 justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
            </FormRow>
        </Form>
    );
}