import React from 'react';
import { DateInput, SelectTime } from '../../../../components/dates';
import { FormGroup, FormLabel, FormRow, FormSubmit } from '../../../../components/form';


export default function InfoSection(props) {
    if (props.currentStep !== 3) {
        return null;
    }

    const today = new Date();
    return (
        <>
            {(props.errorMessage) &&
                <FormRow className="justify-content-center">
                    <div className="alert alert-danger" role="alert">{props.errorMessage}</div>
                </FormRow>
            }
            <FormGroup>
                <FormLabel for="newApptInput3" className="text-muted">Add a new Title</FormLabel>
                <input id="newApptInput3" type="text" name="title" className="form-control"
                    placeholder="New Title" value={props.title} onChange={props.handleChange}
                        aria-describedby="titleHelpBlock" aria-label="Title" maxlength="75" 
                            required>
                </input>
                <small id="titleHelpBlock" className="form-text text-muted help-text">
                    Your title must not exceed a maximum of 75 characters.
                </small>
            </FormGroup>
            <FormGroup>
                <FormLabel for="newApptInput4" className="text-muted">Start time</FormLabel>
                <FormRow>
                    <FormGroup className="col-6">
                        <DateInput
                            id="newApptInput4"
                            className="form-control"
                            name="startDate"
                            label="Start Date"
                            value={props.startDate}
                            handleChange={props.handleChange}
                            required={true}
                        />
                    </FormGroup>
                    <FormGroup className="col-6">
                        <SelectTime
                            id="newApptInput5"
                            className="form-control"
                            name="startTime"
                            label="Start Time"
                            value={props.startTime}
                            handleChange={props.handleChange}
                            required={true}
                        />
                    </FormGroup>
                </FormRow>
            </FormGroup>
            <FormGroup>
                <FormLabel for="newApptInput4" className="text-muted">End time</FormLabel>
                <FormRow>
                    <FormGroup className="col-6">
                        <DateInput
                            id="newApptInput6"
                            className="form-control"
                            name="endDate"
                            label="End Date"
                            value={props.endDate}
                            handleChange={props.handleChange}
                            required={true}
                        />
                    </FormGroup>
                    <FormGroup className="col-6">
                        <SelectTime
                            id="newApptInput7"
                            className="form-control"
                            name="endTime"
                            label="End Time"
                            value={props.endTime}
                            handleChange={props.handleChange}
                            required={true}
                        />
                    </FormGroup>
                </FormRow>
            </FormGroup>
            <FormGroup>
                <FormLabel for="newApptInput8" className="text-muted">Description</FormLabel>
                <textarea id="newApptInput11" type="text" name="description" className="form-control"
                    placeholder="Add a description" value={props.description} onChange={props.handleChange}
                        aria-describedby="descriptionHelpBlock" aria-label="Physician" 
                            rows="3" maxlength="300" required>
                </textarea>
                <small id="descriptionHelpBlock" className="form-text text-muted help-text">
                    Your description must not exceed a maximum of 300 characters.
                </small>
            </FormGroup>
            <FormRow className="d-flex justify-content-center m-2">
                <FormSubmit>Request Appointment</FormSubmit>
            </FormRow>
        </>
    );
}