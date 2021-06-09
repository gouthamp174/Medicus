import React, { useEffect, useState } from 'react';
import { calculateAge } from './dates.js';
import { useExtendClass } from "./hooks.js";


/* Generic User Components */
export function FullName(props) {
    if (props.user) {
        let fullName = `${props.user.firstName} ${props.user.lastName}`;
        return fullName;
    }
    return "";
}


export function Username(props) {
    return (props.user && props.user.username) ? props.user.username : "";
}


export function Gender(props) {
    return (props.user && props.user.gender) ? props.user.gender : "";
}


export function BioData(props) {
    if (props.user) {
        const bioArray = [];

        if (props.user.isPhysician) {
            if (props.user.qualification) bioArray.push(props.user.qualification);
            if (props.user.specialization) bioArray.push(props.user.specialization);
        } else {
            if (props.user.dob) bioArray.push(calculateAge(props.user.dob));
            if (props.user.gender) bioArray.push(props.user.gender);
        }

        return bioArray.join(", ");
    }
    return "";
}


export function Email(props) {
    return (props.user && props.user.emailId) ? props.user.emailId: "";
}


export function PhoneNumber(props) {
    return (props.user && props.user.phoneNumber) ? props.user.phoneNumber: "";
}


export function Currency(props) {
    if (props.value) {
        return Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(props.value);
    }
    return "";
}


/* Gender Components */
export const Genders = [
    "Male", "Female", "Other"
];


export function GenderInput(props) {
    const genderOptions = [];
    for (const [idx, gender] of Genders.entries()) {
        genderOptions.push(<option key={idx} value={gender}>{gender}</option>);
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {genderOptions}
        </select>
    );
}


/* Qualification Components */
export const Qualifications = [
    "MBBS", "MD", "MS", "Intern"
];


export function QualificationInput(props) {
    const qualificationOptions = [];
    for (const [idx, qualification] of Qualifications.sort().entries()) {
        qualificationOptions.push(<option key={idx} value={qualification}>{qualification}</option>);
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {qualificationOptions}
        </select>
    );
}


/* Specialization Components */
export const Specializations = [
    "Cardiologist", "Radiologist", "Psychiatrist",
    "Anesthesiologist", "Pediatrician", "Neurologist",
    "Dermatologist", "Dentist", "Pathologist",
    "General Surgeon", "Orthopaedic Surgeon", "Urologist",
    "Nephrologist", "Oncologist", "Gynaecologist"
];


export function SpecializationInput(props) {
    const specializationOptions = [];
    for (const [idx, specialization] of Specializations.sort().entries()) {
        specializationOptions.push(<option key={idx} value={specialization}>{specialization}</option>);
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {specializationOptions}
        </select>
    );
}


export function Photo(props) {  
    return (
      <img id={props.id} alt={props.alt}
        className={useExtendClass("img-fluid md-pfl-pic", props.className)} 
        src={(props.src) ? URL.createObjectURL(props.src): ""} />
    );
}


export function ProfilePhoto(props) {
    const [source, setSource] = useState("");

    useEffect(() => {
        async function initialize() {
            try {
                const username = props.user.username;
                const profilePhotoId = props.user.profilePhotoId;

                const response = await fetch(`/api/users/${username}/photos/${profilePhotoId}`, {
                    headers: {
                        'Authorization': `Bearer ${props.session.authToken}`
                    }
                });

                let data
                if (!response.ok) {
                    data = await response.json();
                    throw new Error(data.message);
                } else {
                    data = await response.blob();
                }

                setSource(data);
            } catch (err) {
                console.error(`Failed to load profile photo. ${err}`);
            }
        }

        initialize();
    }, [props.user, props.session]);

    return (
        <Photo 
            id={props.id} 
            className={props.className} 
            src={source}
        />
    );
}