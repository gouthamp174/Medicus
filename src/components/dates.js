import React from 'react';

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

/* Function Definitions */
export const getDayInName = (day) => {
  return DayInNames[day];
}


export const getMonthInName = (month) => {
  return MonthInNames[month];
}

export const getMonthInFullName = (month) => {
  return MonthInFullNames[month];
}


export const getTimeInString = (date) => {
  return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

export const getDateInString = (date) => {
  return `${(date.getMonth()+1).toString().padStart(2, 0)}/${date.getDate().toString().padStart(2, 0)}/${date.getFullYear().toString().padStart(4, 0)}`;
}

export const getDateInPrettyString = (date) => {
  return `${date.getDate().toString().padStart(2, 0)} ${getMonthInName(date.getMonth())} ${date.getFullYear().toString().padStart(4, 0)}`;
}

export const getDateTillMonth = (date) => {
  return `${(date.getMonth()+1).toString().padStart(2, 0)}/${date.getFullYear().toString().padStart(4, 0)}`;
}


export const getAge = (date) => {
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
export function YearInput(props) {
  let startYear = props.startYear;
  let endYear = props.endYear;

  const yearOptions = [];
  for (let i = endYear; i > startYear; i--) {
    yearOptions.push(<option key={i} value={i}>{i}</option>);
  }

  return (
    <select id={props.id} name={props.name} className={props.className} aria-label={props.label}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}>
      {yearOptions}
    </select>
  );
}


export function MonthInput(props) {
  const dayOptions = [];
  for (let i = 1; i <= 12; i++) {
    dayOptions.push(<option key={i} value={i}>{i}</option>);
  }

  return (
    <select id={props.id} name={props.name} className={props.className} aria-label={props.label}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}>
      {dayOptions}
    </select>
  );
}


export function MonthNameInput(props) {
  let monthNames = (props.shortForm) ? MonthInNames: MonthInFullNames;

  const monthOptions = [];
  for (const [i, monthName] of monthNames.entries()) {
    monthOptions.push(<option key={i} value={i+1}>{monthName}</option>);
  }

  return (
    <select id={props.id} name={props.name} className={props.className} aria-label={props.label}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}>
      {monthOptions}
    </select>
  );
}


export function DateInput(props) {
  const dayOptions = [];
  for (let i = 1; i <= 31; i++) {
    dayOptions.push(<option key={i} value={i}>{i}</option>);
  }

  return (
    <select id={props.id} name={props.name} className={props.className} aria-label={props.label}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}>
      {dayOptions}
    </select>
  );
}


export function TimeInput(props) {
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
    <select id={props.id} name={props.name} className={props.className} aria-label={props.label}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}>
      {timeOptions}
    </select>
  );
}
