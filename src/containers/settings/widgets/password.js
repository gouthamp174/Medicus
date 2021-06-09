import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormGroup, FormLabel, FormRow, FormSubmit } from '../../../components/form';
import { TitleBar, TitleButton, Widget, WidgetBody } from '../../../components/widgets';


function EditSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
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
            if (fields.confirmPassword !== fields.newPassword) {
                throw new Error("New Password and Comfirm Password do not match.");
            }

            const response = await fetch(`/api/auth/password`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify({
                  currentPassword: fields.currentPassword,
                  newPassword: fields.newPassword
                })
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (props.updatePassword) {
                props.updatePassword();
            }
        } catch (err) {
            console.error(`Failed to update user password. ${err}`);
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
                <FormLabel for="passwordInput01" className="col-12 col-sm-4">Current Password</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <input type="password" id="passwordInput01" name="currentPassword"
                        className="form-control" placeholder="" value={fields.currentPassword}
                            onChange={handleChange} minlength="8" maxlength="20" required
                  />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="passwordInput02" className="col-12 col-sm-4">New Password</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <input type="password" id="passwordInput02" name="newPassword"
                        className="form-control" placeholder="" value={fields.newPassword}
                            onChange={handleChange} minlength="8" maxlength="20" required
                  />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="passwordInput03" className="col-12 col-sm-4">Confirm Password</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <input type="password" id="passwordInput03" name="confirmPassword"
                        className="form-control" placeholder="" value={fields.confirmPassword}
                            onChange={handleChange} minlength="8" maxlength="20" required
                  />
                </FormGroup>
            </FormRow>
            <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-sm-4">Save</FormSubmit>
            </FormRow>
        </Form>
    );
}


export default function PasswordWidget(props) {
    const session = useSelector(s => s.session);

    const [editMode, setEditMode] = useState(false);

    async function toggleEditMode(e) {
        e.preventDefault();
        setEditMode(!editMode);
    }

    async function updatePassword() {
        setEditMode(!editMode);
    }

    return (
        <Widget>
            <TitleBar title="Change Password">
                {
                    (editMode) ?
                    <TitleButton name="Cancel" icon="clear" handleClick={toggleEditMode} /> :
                    <TitleButton name="Edit" icon="edit" handleClick={toggleEditMode} />
                }
            </TitleBar>
            {editMode &&
                <WidgetBody>
                    <EditSection 
                        session={session}
                        updatePassword={updatePassword}
                    />
                </WidgetBody>
            }
        </Widget>
    );
}