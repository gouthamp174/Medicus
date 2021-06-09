import React, { useEffect, useState } from 'react';
import { FluidContainer } from '../../../../../../components/layout';
import { TitleBar, TitleButton, Widget, WidgetBody } from '../../../../../../components/widgets';
import { Form, FormGroup, FormRow, FormSubmit } from '../../../../../../components/form.js';
import { Loader } from '../../../../../../components/loaders';


function EditForm(props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [state, setState] = useState({
        description: ""
    });

    useEffect(() => {
        setState(prevState => {
            return {
                ...prevState,
                description: props.description
            }
        });
    }, [props.description]);

    async function handleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${props.user.username}`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify({
                    description: state.description
                })
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (props.updateState) {
                props.updateState({
                    description: state.description
                });
            }
        } catch (err) {
            console.error(`Failed to update about information for user- ${props.user.username}. ${err}`);
            setErrorMessage(err.message);
        }
    }

    return (
        <FluidContainer>
            <Form handleSubmit={handleSubmit}>
                {errorMessage &&
                    <FormRow className="justify-content-center">
                        <div className="alert alert-danger" role="alert">{errorMessage}</div>
                    </FormRow>
                }
                <FormGroup>
                    <textarea id="descriptionInput01" type="text" name="description"
                        className="form-control"  value={state.description} onChange={handleChange} 
                            rows="3" placeholder="Say something about yourself.">
                    </textarea>
                </FormGroup>
                <FormRow className="justify-content-center">
                    <FormSubmit className="col-auto col-md-4">Save</FormSubmit>
                </FormRow>
            </Form>
        </FluidContainer>
    );
}


export default function AboutWidget(props) {
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fields, setFields] = useState({
        description: ""
    });

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${props.user.username}`, {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                    }
                });

                let data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                setFields(prevFields => {
                    return {
                        ...prevFields,
                        description: data.description
                    }
                });
            } catch (err) {
                console.error(`Failed to get about information for user- ${props.user.username}. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, [props.user, props.session]);

    async function toggleEditMode(e) {
        e.preventDefault();
        setEditMode(!editMode);
    }

    async function updateFields(newFields) {
        setFields(prevFields => {
            return { 
                ...prevFields, 
                ...newFields
            }
        });
        setEditMode(!editMode);
    }

    return (
        <Widget>
            <TitleBar title="About me">
                {!props.disableEdit &&
                    (
                        (editMode) ?
                        <TitleButton name="Cancel" icon="clear" handleClick={toggleEditMode} /> :
                        <TitleButton name="Edit" icon="edit" handleClick={toggleEditMode} />
                    )
                }
            </TitleBar>
            <WidgetBody>
                {
                    (editMode) ?
                    <>
                        <EditForm
                            session={props.session}
                            user={props.user}
                            description={fields.description}
                            updateState={updateFields}
                        />
                    </> :
                    <>
                        {
                            (isLoading) ?
                            <Loader isLoading={true} /> :
                            <p className="my-0">{fields.description}</p>
                        }
                    </>
                }
            </WidgetBody>
        </Widget>
    );
}