import React, { useState } from 'react';
import { useExtendClass } from "./hooks";


/* Constant Definitions */
export const DayInNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];
  
  
export const MonthInNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];


export const MonthInFullNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


/* Function definitions */
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}


export function calculateAge(date) {
    const today = new Date();
    const dateOfBirth = new Date(date);
  
    var age = today.getFullYear() - dateOfBirth.getFullYear();
    var diffInMonths = today.getMonth() - dateOfBirth.getMonth();
    var diffInDays = today.getDate() - dateOfBirth.getDate();
  
    if (diffInMonths < 0 || (diffInMonths === 0 && diffInDays < 0)) {
        age--;
    }
  
    return age;
}


/* Component Definitions */
export function FullTime(props) {
    if (props.date) {
        const dateObj = new Date(props.date);
        const hour12 = (props.hour12) ? true: false;
        return dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: hour12 });
    }
    return "";
}


export function Day(props) {
    if (props.date) {
        const dateObj = new Date(props.date);
        const format = (props.format) ? props.format: "numeric";
        return dateObj.toLocaleString('en-US', {day: format});
    }
    return "";
}


export function Month(props) {
    if (props.date) {
        const dateObj = new Date(props.date);
        const format = (props.format) ? props.format: "numeric";
        return dateObj.toLocaleString('en-US', {month: format});
    }
    return "";
}


export function Year(props) {
    if (props.date) {
        const dateObj = new Date(props.date);
        const format = (props.format) ? props.format: "numeric";
        return dateObj.toLocaleString('en-US', {year: format});
    }
    return "";
}


export function PrettyDate(props) {
    if (props.date) {
        const dateObj = new Date(props.date);
        const monthFormat = (props.long) ? 'long': 'short';
        
        return dateObj.toLocaleString('en-US', {
            year: 'numeric', month: monthFormat, day: 'numeric'
        });
    }
    return "";
}


export function NumericDate(props) {
    if (props.date) {
        const dateObj = new Date(props.date);
        return dateObj.toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
    }
    return "";
}


export function MonthDate(props) {
    if (props.date) {
        const dateObj = new Date(props.date);
        return dateObj.toLocaleString('en-US', {year: 'numeric', month: '2-digit'});
    }
    return "";
}


export function SelectYear(props) {
    let startYear = props.startYear;
    let endYear = props.endYear;
  
    const yearOptions = [];
    for (let i = endYear; i > startYear; i--) {
        yearOptions.push(<option key={i} value={i}>{i}</option>);
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {yearOptions}
        </select>
    );
}
  
  
export function SelectMonth(props) {
    const dayOptions = [];
    for (let i = 1; i <= 12; i++) {
        dayOptions.push(<option key={i} value={i}>{i}</option>);
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {dayOptions}
        </select>
    );
}
  
  
export function SelectMonthByName(props) {
    let monthNames = (props.shortForm) ? MonthInNames: MonthInFullNames;
  
    const monthOptions = [];
    for (const [i, monthName] of monthNames.entries()) {
        monthOptions.push(<option key={i} value={i+1}>{monthName}</option>);
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {monthOptions}
        </select>
    );
}
  
  
export function SelectDate(props) {
    const dayOptions = [];
    for (let i = 1; i <= 31; i++) {
        dayOptions.push(<option key={i} value={i}>{i}</option>);
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {dayOptions}
        </select>
    );
}
  
  
export function SelectTime(props) {
    const timeOptions = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 2; j++) {
            const hour = i.toString().padStart(2, '0');
            const minutes = (j === 0) ? "00" : "30";
    
            let time = `${hour}:${minutes}`;
            timeOptions.push(<option key={time} value={time}>{time}</option>);
        }
    }
  
    return (
        <select id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("custom-select", props.className)}
                value={props.value} onChange={props.handleChange} 
                    required={(props.required) ? true: false}>
            {timeOptions}
        </select>
    );
}


export function DateInput(props) {
    const [prevValue, setPrevValue] = useState('');

    async function handleChange(e) {
        const newValue = e.target.value;
        
        if (newValue.length === 2 || newValue.length === 5) {
            if (newValue.length > prevValue.length) {
                e.target.value = `${e.target.value}/`;
            } else if (newValue.length < prevValue.length) {
                e.target.value = e.target.value.slice(0, e.target.value.length - 1);
            }
        }

        setPrevValue(e.target.value);
        if (props.handleChange) {
            props.handleChange(e);
        }
    }

    return (
        <input type="text" id={props.id} name={props.name} aria-label={props.label}
            className={useExtendClass("form-control", props.className)} value={props.value}
                onChange={handleChange} pattern="\d{2}/\d{2}/\d{4}" placeholder="MM/DD/YYYY"
                    maxLength="10" required={Boolean(props.required)}>
        </input>
    );
}


export function NumericAge(props) {
    return calculateAge(props.date);
}