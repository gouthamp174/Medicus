import React, { useEffect, useState } from 'react';
import { MonthDate, SelectMonthByName, SelectYear } from '../../../../../../components/dates';
import { Form, FormGroup, FormLabel, FormLegend, FormRow, 
    FormSubmit } from '../../../../../../components/form';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Loader } from '../../../../../../components/loaders';
import { QualificationInput, Qualifications, Username } from '../../../../../../components/users';
import { TitleBar, TitleButton, Widget, WidgetBody, WidgetDropdown, WidgetDropdownItem, 
    WidgetList, WidgetListItem } from '../../../../../../components/widgets';


function DefaultDegreeItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No education available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function DegreeItem(props) {
    async function handleDelete(e) {
        e.preventDefault();
        if (props.handleDelete) {
            props.handleDelete(props.degree.id);
        }
    }

    const username = props.degree.username;
    const currentUsername = Username({ user: props.session });
    const fromCurrentUser = (currentUsername === username) ? true : false;

    const fromDate = new Date(props.degree.fromDate);
    const toDate = new Date(props.degree.toDate);

    return (
        <WidgetListItem>
            <FluidContainer className="px-0">
                <Row>
                    <Col>
                        <Row>
                            <Col className="align-self-center">
                                <Row>
                                    <Col className="text-truncate font-weight-bold">{props.degree.degree}</Col>
                                    <Col className="col-auto">
                                        <MonthDate date={fromDate} /> - <MonthDate date={toDate} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-truncate">{props.degree.university}</Col>
                        </Row>
                    </Col>
                    <Col className="col-auto">
                        {fromCurrentUser &&
                            <WidgetDropdown>
                                <WidgetDropdownItem handleClick={handleDelete}>Delete</WidgetDropdownItem>
                            </WidgetDropdown>
                        }
                    </Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function AddForm(props) {
    const today = new Date();

    const [errorMessage, setErrorMessage] = useState("");
    const [fields, setFields] = useState({
        degree: (Qualifications.length) ? Qualifications[0]: "",
        fromMonth: today.getMonth() + 1,
        fromYear: today.getFullYear(),
        toMonth: today.getMonth() + 1,
        toYear: today.getFullYear(),
        university: ""
    });

    async function handleChange(e) {
        setFields(prevFields => {
            return {
                ...prevFields,
                [e.target.name]: e.target.value
            }
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const fromDate = new Date(fields.fromYear, fields.fromMonth-1);
            const toDate = new Date(fields.toYear, fields.toMonth-1);

            const newDegree = {
                degree: fields.degree,
                fromDate: fromDate,
                toDate: toDate,
                university: fields.university,
            };

            const response = await fetch(`/api/users/${props.user.username}/degrees`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newDegree)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (props.appendDegree) {
                props.appendDegree(newDegree);
            }
        } catch (err) {
            console.error(`Failed to update education information for user- ${props.user.username}. ${err}`);
            setErrorMessage(err.message);
        }
    }

    return (
        <Form handleSubmit={handleSubmit}>
            {(fields.errorMessage) &&
                <FormRow className="justify-content-center">
                    <div className="alert alert-danger" role="alert">{errorMessage}</div>
                </FormRow>
            }
            <FormRow>
                <FormLabel for="educationForm01" className="col-sm-4">Qualification</FormLabel>
                <FormGroup className="col-sm-8">
                    <QualificationInput
                        id="educationForm01"
                        className="form-control"
                        name="degree"
                        label="Degree"
                        value={fields.degree}
                        handleChange={handleChange}
                        required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLegend for="educationForm02" className="col-sm-4">From Date</FormLegend>
                <FormGroup className="col-sm-4">
                    <SelectMonthByName
                    id="educationForm02"
                    className="form-control"
                    name="fromMonth"
                    label="From Month"
                    shortForm={true}
                    value={fields.fromMonth}
                    handleChange={handleChange}
                    required={true}
                    />
                </FormGroup>
                <FormGroup className="col-sm-4">
                    <SelectYear
                    id="educationForm03"
                    className="form-control"
                    name="fromYear"
                    label="From Year"
                    startYear={today.getFullYear()-100}
                    endYear={today.getFullYear()}
                    value={fields.fromYear}
                    handleChange={handleChange}
                    required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLegend for="educationForm04" className="col-sm-4">To Date</FormLegend>
                <FormGroup className="col-sm-4">
                    <SelectMonthByName
                    id="educationForm04"
                    className="form-control"
                    name="toMonth"
                    label="To Month"
                    shortForm={true}
                    value={fields.toMonth}
                    handleChange={handleChange}
                    required={true}
                    />
                </FormGroup>
                <FormGroup className="col-sm-4">
                    <SelectYear
                    id="educationForm05"
                    className="form-control"
                    name="toYear"
                    label="To Year"
                    startYear={today.getFullYear()-100}
                    endYear={today.getFullYear()}
                    value={fields.toYear}
                    handleChange={handleChange}
                    required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="educationForm06" className="col-sm-4">University</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="educationForm06" name="university" type="text" 
                        className="form-control" value={fields.university} onChange={handleChange} 
                            placeholder="Name of University"
                    />
                </FormGroup>
            </FormRow>
            <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
            </FormRow>
        </Form>
    );
}


export default function EducationWidget(props) {
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [degrees, setDegrees] = useState([]);

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${props.user.username}/degrees`, {
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

                setDegrees(prevDegrees => {
                    return [ ...prevDegrees, ...data ];
                });
            } catch (err) {
                console.error(`Failed to get education information for user- ${props.user.username}. ${err}`);
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

    async function appendDegree(newDegree) {
        setDegrees(prevDegrees => {
            return [ ...prevDegrees, newDegree ];
        });
        setEditMode(false);
    }

    return (
        <Widget>
            <TitleBar title="Education">
                {!props.disableEdit &&
                    (
                        (editMode) ?
                        <TitleButton name="Cancel" icon="clear" handleClick={toggleEditMode} /> :
                        <TitleButton name="Add" icon="add" handleClick={toggleEditMode} />
                    )
                }
            </TitleBar>
            {editMode &&
                <WidgetBody>
                    <AddForm
                        session={props.session}
                        user={props.user}
                        appendDegree={appendDegree}
                    />
                </WidgetBody>
            }
            <WidgetBody>
                {
                    (isLoading) ?
                    <Loader isLoading={true} /> :
                    <WidgetList>
                        {(degrees.length !== 0) ?
                            <>
                                {degrees.map((degree, index) => (
                                    <DegreeItem 
                                        key={index}
                                        session={props.session}
                                        degree={degree}
                                    />
                                ))}
                            </> :
                            <DefaultDegreeItem />
                        }
                    </WidgetList>
                }
            </WidgetBody>
        </Widget>
    );
}