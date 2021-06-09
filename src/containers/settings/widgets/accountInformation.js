import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrettyDate, DateInput, NumericDate } from '../../../components/dates';
import { Form, FormGroup, FormLabel, FormRow, FormSubmit } from '../../../components/form';
import { Col, DescriptionDetails, DescriptionList, DescriptionTerm, 
    FluidContainer, Row } from '../../../components/layout';
import { Loader } from '../../../components/loaders';
import { Email, FullName, Gender, GenderInput, PhoneNumber } from '../../../components/users';
import { TitleBar, TitleButton, Widget, WidgetBody } from '../../../components/widgets';


function EditSection(props) {
    const [errorMessage, setErrorMessage] = useState("");

    const [fields, setFields] = useState({
        firstName: (props.user.firstName) ? props.user.firstName : "",
        lastName: (props.user.lastName) ? props.user.lastName : "",
        dob: NumericDate({ date: props.user.dob }),
        gender: (props.user.gender) ? props.user.gender : "",
        emailId: (props.user.emailId) ? props.user.emailId : "",
        phoneNumber: (props.user.phoneNumber) ? props.user.phoneNumber : ""
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
            const dob = new Date(fields.dob);

            const newUserInfo = {
                firstName: fields.firstName,
                lastName: fields.lastName,
                dob: dob,
                gender: fields.gender,
                emailId: fields.emailId,
                phoneNumber: fields.phoneNumber
            };

            const response = await fetch(`/api/users/${props.user.username}`, {
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
                await props.updateUser(newUserInfo);
            }
        } catch (err) {
            console.error(`Failed to update account information. ${err}`);
            setErrorMessage(err.message);
        }
    }

    const today = new Date();
    return (
        <Form className="container-fluid" handleSubmit={handleSubmit}>
            {(fields.errorMessage) &&
                <FormRow className="justify-content-center">
                    <div className="alert alert-danger" role="alert">{errorMessage}</div>
                </FormRow>
            }
            <FormRow>
                <FormLabel for="acctInput01" className="col-12 col-sm-4">Full Name</FormLabel>
                <FormGroup className="col-12 col-sm-8">
                    <Row>
                        <Col className="col-sm-auto">
                            <input type="text" id="acctInput01" name="firstName" 
                                className="form-control"
                                value={fields.firstName} onChange={handleChange}
                                placeholder="First name" 
                            />
                        </Col>
                        <Col className="col-sm-auto">
                            <input type="text" id="acctInput02" name="lastName" 
                                className="form-control"
                                value={fields.lastName} onChange={handleChange}
                                placeholder="Last name" 
                            />
                        </Col>
                    </Row>
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="acctInput03" className="col-12 col-sm-4">Date of Birth</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <DateInput
                        id="acctInput03"
                        name="dob"
                        label="Date of Birth"
                        value={fields.dob}
                        handleChange={handleChange}
                        required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="acctInput04" className="col-12 col-sm-4">Gender</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <GenderInput
                        id="acctInput04"
                        className="form-control"
                        name="gender"
                        label="Gender"
                        value={fields.gender}
                        handleChange={handleChange}
                        required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="acctInput05" className="col-12 col-sm-4">Email ID</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <input type="text" id="acctInput05" name="emailId" className="form-control"
                        placeholder="Email ID" value={fields.emailId} onChange={handleChange}
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="acctInput06" className="col-12 col-sm-4">Phone Number</FormLabel>
                <FormGroup className="col-12 col-sm-auto">
                    <input type="text" id="acctInput06" name="phoneNumber" className="form-control"
                        placeholder="Phone Number" value={fields.phoneNumber} onChange={handleChange}
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
    const dobDate = new Date(props.user.dob);
    return (
        <FluidContainer>
            <DescriptionList className="justify-content-center">
                <DescriptionTerm className="col-12 col-sm-4">Full Name</DescriptionTerm>
                <DescriptionDetails className="col-12 col-sm-8">
                    <FullName user={props.user} />
                </DescriptionDetails>

                <DescriptionTerm className="col-12 col-sm-4">Date of Birth</DescriptionTerm>
                <DescriptionDetails className="col-12 col-sm-8">
                    <PrettyDate date={dobDate} />
                </DescriptionDetails>

                <DescriptionTerm className="col-12 col-sm-4">Gender</DescriptionTerm>
                <DescriptionDetails className="col-12 col-sm-8">
                    <Gender user={props.user} />
                </DescriptionDetails>

                <DescriptionTerm className="col-12 col-sm-4">Email ID</DescriptionTerm>
                <DescriptionDetails className="col-12 col-sm-8">
                    <Email user={props.user} />
                </DescriptionDetails>

                <DescriptionTerm className="col-12 col-sm-4">Phone Number</DescriptionTerm>
                <DescriptionDetails className="col-12 col-sm-8">
                    <PhoneNumber user={props.user} />
                </DescriptionDetails>
            </DescriptionList>
        </FluidContainer>
    );
}


export default function AccountInformationWidget(props) {
    const session = useSelector(s => s.session);
    const dispatch = useDispatch();

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

        dispatch({
            type: "session/set",
            payload: {
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

        setEditMode(!editMode);
    }

    return (
        <Widget>
            <TitleBar title="Account Information">
                {
                    (editMode) ?
                    <TitleButton name="Cancel" icon="clear" handleClick={toggleEditMode} /> :
                    <TitleButton name="Edit" icon="edit" handleClick={toggleEditMode} />
                }
            </TitleBar>
            <WidgetBody>
                { (isLoading) ?
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