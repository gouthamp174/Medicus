import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormGroup, FormLabel, FormRow, FormSubmit } from '../../../components/form';
import { DescriptionDetails, DescriptionList, DescriptionTerm, FluidContainer } from '../../../components/layout';
import { Loader } from '../../../components/loaders';
import { QualificationInput, SpecializationInput } from '../../../components/users';
import { TitleBar, TitleButton, Widget, WidgetBody } from '../../../components/widgets';


function EditSection(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        qualification: (props.user.qualification) ? props.user.qualification: "",
        specialization: (props.user.specialization) ? props.user.specialization: ""
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
            const newUserInfo = {
                qualification: fields.qualification,
                specialization: fields.specialization
            };

            const response = await fetch(`/api/users/${props.session.username}`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newUserInfo)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (props.updateUser) {
                props.updateUser(newUserInfo);
            }
        } catch (err) {
            console.error(`Failed to update physician information. ${err}`);
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
                <FormLabel for="physicianInput01" className="col-12 col-sm-4">Qualification</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <QualificationInput
                        id="physicianInput01"
                        className="form-control"
                        name="qualification"
                        value={fields.qualification}
                        handleChange={handleChange}
                        required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="physicianInput02" className="col-12 col-sm-4">Specialization</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <SpecializationInput
                        id="physicianInput02"
                        className="form-control"
                        name="specialization"
                        value={fields.specialization}
                        handleChange={handleChange}
                        required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow className="justify-content-center">
                <FormSubmit type="submit" className="col-auto col-sm-4">Save</FormSubmit>
            </FormRow>
        </Form>
    );
}



function ViewSection(props) {
    return (
        <FluidContainer>
            <DescriptionList className="justify-content-center">
                <DescriptionTerm className="col-12 col-sm-4">Qualification</DescriptionTerm>
                <DescriptionDetails className="col-12 col-sm-8">
                    {props.user.qualification}
                </DescriptionDetails>

                <DescriptionTerm className="col-12 col-sm-4">Specialization</DescriptionTerm>
                <DescriptionDetails className="col-12 col-sm-8">
                    {props.user.specialization}
                </DescriptionDetails>
            </DescriptionList>
        </FluidContainer>
    );
}



export default function PhysicianInformationWidget(props) {
    const session = useSelector(s => s.session);

    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${session.username}`, {
                    headers: {
                        'Authorization': `Bearer ${session.authToken}`
                    }
                });

                let data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                setUser(data);
            } catch (err) {
                console.error(`Failed to get user account information. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserInfo();
    }, [session]);

    async function toggleEditMode(e) {
        e.preventDefault();
        setEditMode(!editMode);
    }

    async function updateUser(newUserInfo) {
        setUser({
            ...user,
            ...newUserInfo
        });

        setEditMode(!editMode);
    }

    return (
        <Widget>
            <TitleBar title="Physician Information">
                {
                    (editMode) ?
                    <TitleButton name="Cancel" icon="clear" handleClick={toggleEditMode} /> :
                    <TitleButton name="Edit" icon="edit" handleClick={toggleEditMode} />
                }
            </TitleBar>
            <WidgetBody>
                {
                    (isLoading) ?
                    <>
                        <Loader isLoading={true} />
                    </> :
                    <>
                        {                    
                            (editMode) ?
                            <>
                                <EditSection 
                                    session={session}
                                    user={user}
                                    updateUser={updateUser}
                                />
                            </> :
                            <>
                                <ViewSection 
                                    user={user}
                                />
                            </>
                        }
                    </>
                }
            </WidgetBody>
        </Widget>
    );
}