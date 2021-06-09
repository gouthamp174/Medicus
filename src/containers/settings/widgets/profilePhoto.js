import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormButton, FormGroup, FormLabel, FormRow, FormSubmit } from '../../../components/form';
import { Col, FluidContainer, Row } from '../../../components/layout';
import { Photo } from '../../../components/users';
import { TitleBar, TitleButton, Widget, WidgetBody } from '../../../components/widgets';


function EditSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        name: "",
        data: null
    });

    async function handleChange(e) {
        setFields({
            ...fields,
            name: e.target.value,
            data: e.target.files[0]
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const username = props.session.username;

            let formData = new FormData();
            formData.append('data', fields.data);
            formData.append('isProfilePhoto', true);

            const response = await fetch(`/api/users/${username}/photos`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                },
                body: formData
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (props.updateProfilePhotoId) {
                props.updateProfilePhotoId(data.id);
            }
        } catch (err) {
            console.error(`Failed to set new profile photo. ${err}`);
            setErrorMessage(err.message);
        }
    }

    async function clickedDelete(e) {
        e.preventDefault();
        try {
            const username = props.session.username;
            const profilePhotoId = props.session.profilePhotoId;

            const response = await fetch(`/api/users/${username}/photos/${profilePhotoId}`, {
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

            if (props.updateProfilePhotoId) {
                props.updateProfilePhotoId(null);
            }
        } catch (err) {
            console.error(`Failed to delete profile photo. ${err}`);
            setErrorMessage(err.message);
        }
    }

    return (
        <Form className="container-fluid" handleSubmit={handleSubmit} 
            enctype="multipart/form-data">
            {(errorMessage) &&
                <FormRow className="justify-content-center">
                    <div className="alert alert-danger" role="alert">{errorMessage}</div>
                </FormRow>
            }
            <FormRow>
                <FormLabel for="profilePhoto01" className="col-12 col-sm-4">Select new photo</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <FormRow>
                        <input id="profilePhoto01" type="file" name="name" 
                            className="custom-file-input" value={fields.name} 
                                onChange={handleChange}/>
                        <label className="custom-file-label" for="generalInput07">
                            {
                                (fields.name) ?
                                fields.name.replace(/^.*[\\\/]/, '') :
                                "Choose a file..."
                            }
                    </label>
                    </FormRow>
                    {fields.data &&
                        <FormRow>
                            <FluidContainer className="m-2">
                                <Row for="profilePhoto02">
                                    <Col>Preview</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Photo
                                            id="profilePhoto02"
                                            className="md-pfl-bg"
                                            alt="Preview Photo"
                                            src={fields.data}
                                        />
                                    </Col>
                                </Row>
                            </FluidContainer>
                        </FormRow>
                    }
                    <FormRow className="mt-3">
                        <FormSubmit>Set as Profile photo</FormSubmit>
                    </FormRow>
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="profilePhoto03" className="col-12 col-sm-4">Remove photo</FormLabel>
                <FormGroup className="col-12 col-sm-8">
                    <FormButton className="btn btn-danger" handleClick={clickedDelete}>Remove</FormButton>
                </FormGroup>
            </FormRow>
        </Form>
    );
}



export default function ProfilePhotoWidget(props) {
    const session = useSelector(s => s.session);
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false);

    async function toggleEditMode(e) {
        e.preventDefault();
        setEditMode(!editMode);
    }

    async function updateProfilePhotoId(newProfilePhotoId) {
        dispatch({
            type: "session/set",
            payload: {
                profilePhotoId: newProfilePhotoId
            }
        });

        setEditMode(!editMode);
    }

    return (
        <Widget>
            <TitleBar title="Change Profile Photo">
                {
                    (editMode) ?
                    <TitleButton name="Cancel" icon="clear" handleClick={toggleEditMode} /> :
                    <TitleButton name="Edit" icon="edit" handleClick={toggleEditMode} />
                }
            </TitleBar>
            {(editMode) &&
                <WidgetBody>
                    <EditSection 
                        session={session}
                        updateProfilePhotoId={updateProfilePhotoId}
                    />
                </WidgetBody>
            }
        </Widget>
    );
}