import React, { useEffect, useState } from 'react';
import { MonthDate, SelectMonthByName, SelectYear } from '../../../../../../components/dates';
import { Form, FormGroup, FormLabel, FormLegend, FormRow, 
    FormSubmit } from '../../../../../../components/form';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Loader } from '../../../../../../components/loaders';
import { Username } from '../../../../../../components/users';
import { TitleBar, TitleButton, Widget, WidgetBody, WidgetDropdown, WidgetDropdownItem, 
    WidgetList, WidgetListItem } from '../../../../../../components/widgets';


function DefaultJobItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No experience available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function JobItem(props) {
    async function handleDelete(e) {
        e.preventDefault();
        if (props.handleDelete) {
            props.handleDelete(props.job.id);
        }
    }

    const username = props.job.username;
    const currentUsername = Username({ user: props.session });
    const fromCurrentUser = (currentUsername === username) ? true : false;

    const fromDate = new Date(props.job.fromDate);
    const toDate = new Date(props.job.toDate);

    return (
        <WidgetListItem>
            <FluidContainer className="px-0">
                <Row>
                    <Col>
                        <Row>
                            <Col className="align-self-center">
                                <Row>
                                    <Col className="text-truncate font-weight-bold">{props.job.title}</Col>
                                    <Col className="col-auto">
                                        <MonthDate date={fromDate} /> - <MonthDate date={toDate} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-truncate">{props.job.company}</Col>
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
        title: "",
        fromMonth: today.getMonth() + 1,
        fromYear: today.getFullYear(),
        toMonth: today.getMonth() + 1,
        toYear: today.getFullYear(),
        company: ""
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

            const newJob = {
                title: fields.title,
                fromDate: fromDate,
                toDate: toDate,
                company: fields.company,
            };

            const response = await fetch(`/api/users/${props.user.username}/jobs`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newJob)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (props.appendJob) {
                props.appendJob(newJob);
            }
        } catch (err) {
            console.error(`Failed to update experience information for user- ${props.user.username}. ${err}`);
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
                <FormLabel for="experienceForm01" className="col-sm-4">Title</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="experienceForm01" name="title" type="text" className="form-control"
                        value={fields.title} onChange={handleChange} placeholder="Title"
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLegend for="experienceForm02" className="col-sm-4">From Date</FormLegend>
                <FormGroup className="col-sm-4">
                    <SelectMonthByName
                    id="experienceForm02"
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
                    id="experienceForm03"
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
                <FormLegend for="experienceForm04" className="col-sm-4">To Date</FormLegend>
                <FormGroup className="col-sm-4">
                    <SelectMonthByName
                    id="experienceForm04"
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
                    id="experienceForm05"
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
                <FormLabel for="experienceForm06" className="col-sm-4">Company</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="experienceForm06" name="company" type="text" 
                        className="form-control" value={fields.company} onChange={handleChange} 
                            placeholder="Name of Company"
                    />
                </FormGroup>
            </FormRow>
            <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
            </FormRow>
        </Form>
    );
}


export default function ExperienceWidget(props) {
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${props.user.username}/jobs`, {
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

                setJobs(prevJobs => {
                    return [ ...prevJobs, ...data ];
                });
            } catch (err) {
                console.error(`Failed to get experience information for user- ${props.user.username}. ${err}`);
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

    async function appendJob(newJob) {
        setJobs(prevJobs => {
            return [ ...prevJobs, newJob ];
        });
        setEditMode(false);
    }

    return (
        <Widget>
            <TitleBar title="Experience">
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
                        appendJob={appendJob}
                    />
                </WidgetBody>
            }
            <WidgetBody>
                {
                    (isLoading) ?
                    <Loader isLoading={true} /> :
                    <WidgetList>
                        {(jobs.length !== 0) ?
                            <>
                                {jobs.map((job, index) => (
                                    <JobItem 
                                        key={index}
                                        session={props.session}
                                        job={job}
                                    />
                                ))}
                            </> :
                            <DefaultJobItem />
                        }
                    </WidgetList>
                }
            </WidgetBody>
        </Widget>
    );
}