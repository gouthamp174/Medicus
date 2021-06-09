import React, { useEffect, useState } from 'react';
import { MonthDate, SelectMonthByName, SelectYear } from '../../../../../../components/dates';
import { Form, FormGroup, FormLabel, FormLegend, FormRow, 
    FormSubmit } from '../../../../../../components/form';
import { Col, FluidContainer, Row } from '../../../../../../components/layout';
import { Loader } from '../../../../../../components/loaders';
import { Username } from '../../../../../../components/users';
import { TitleBar, TitleButton, Widget, WidgetBody, WidgetDropdown, WidgetDropdownItem, 
    WidgetList, WidgetListItem } from '../../../../../../components/widgets';


function DefaultInsuranceItem(props) {
    return (
        <WidgetListItem>
            <FluidContainer>
                <Row>
                    <Col className="md-font-sm text-center text-muted">No insurance available</Col>
                </Row>
            </FluidContainer>
        </WidgetListItem>
    );
}


function InsuranceItem(props) {
    async function handleDelete(e) {
        e.preventDefault();
        if (props.handleDelete) {
            props.handleDelete(props.insurance.id);
        }
    }

    const username = props.insurance.username;
    const currentUsername = Username({ user: props.session });
    const fromCurrentUser = (currentUsername === username) ? true : false;

    const expiryDate = new Date(props.insurance.expiryDate);

    return (
        <WidgetListItem>
            <FluidContainer className="px-0">
                <Row>
                    <Col>
                        <Row>
                            <Col className="align-self-center">
                                <Row>
                                    <Col className="text-truncate font-weight-bold">{props.insurance.providerName}</Col>
                                    <Col className="col-auto">
                                        <MonthDate date={expiryDate} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-truncate">{props.insurance.insuranceId}</Col>
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
        providerName: "",
        insuranceId: "",
        expiryMonth: today.getMonth() + 1,
        expiryYear: today.getFullYear()
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
            const expiryDate = new Date(fields.expiryYear, fields.expiryMonth-1);

            const newInsurance = {
                providerName: fields.providerName,
                insuranceId: fields.insuranceId,
                expiryDate: expiryDate
            };

            const response = await fetch(`/api/users/${props.user.username}/insurances`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.session.authToken}`
                },
                body: JSON.stringify(newInsurance)
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            if (props.appendInsurance) {
                props.appendInsurance(newInsurance);
            }
        } catch (err) {
            console.error(`Failed to update insurance information for user- ${props.user.username}. ${err}`);
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
                <FormLabel for="insuranceForm01" className="col-sm-4">Provider Name</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="insuranceForm01" name="providerName" type="text" 
                        className="form-control" value={fields.providerName} onChange={handleChange} 
                            placeholder="Name of Provider"
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLabel for="insuranceForm02" className="col-sm-4">Insurance ID</FormLabel>
                <FormGroup className="col-sm-8">
                    <input id="insuranceForm02" name="insuranceId" type="text"
                        className="form-control" value={fields.insuranceId} onChange={handleChange}
                            placeholder="Insurance ID" 
                    />
                </FormGroup>
            </FormRow>
            <FormRow>
                <FormLegend for="insuranceForm03" className="col-sm-4">Expiry Date</FormLegend>
                <FormGroup className="col-sm-4">
                    <SelectMonthByName
                    id="insuranceForm03"
                    className="form-control"
                    name="expiryMonth"
                    label="Expiry Month"
                    shortForm={true}
                    value={fields.expiryMonth}
                    handleChange={handleChange}
                    required={true}
                    />
                </FormGroup>
                <FormGroup className="col-sm-4">
                    <SelectYear
                    id="insuranceForm04"
                    className="form-control"
                    name="expiryYear"
                    label="Expiry Year"
                    startYear={today.getFullYear()-100}
                    endYear={today.getFullYear()}
                    value={fields.expiryYear}
                    handleChange={handleChange}
                    required={true}
                    />
                </FormGroup>
            </FormRow>
            <FormRow className="justify-content-center">
                <FormSubmit className="col-auto col-md-4">Add</FormSubmit>
            </FormRow>
        </Form>
    );
}


export default function InsuranceWidget(props) {
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [insurances, setInsurances] = useState([]);

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/users/${props.user.username}/insurances`, {
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

                setInsurances(prevInsurances => {
                    return [ ...prevInsurances, ...data ];
                });
            } catch (err) {
                console.error(`Failed to get insurance information for user- ${props.user.username}. ${err}`);
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

    async function appendInsurance(newInsurance) {
        setInsurances(prevInsurances => {
            return [ ...prevInsurances, newInsurance ];
        });
        setEditMode(false);
    }

    return (
        <Widget>
            <TitleBar title="Insurance">
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
                        appendInsurance={appendInsurance}
                    />
                </WidgetBody>
            }
            <WidgetBody>
                {
                    (isLoading) ?
                    <Loader isLoading={true} /> :
                    <WidgetList>
                        {(insurances.length !== 0) ?
                            <>
                                {insurances.map((insurance, index) => (
                                    <InsuranceItem 
                                        key={index}
                                        session={props.session}
                                        insurance={insurance}
                                    />
                                ))}
                            </> :
                            <DefaultInsuranceItem />
                        }
                    </WidgetList>
                }
            </WidgetBody>
        </Widget>
    );
}