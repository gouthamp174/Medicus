import React from 'react';


/* Constant Definitions */
export const Genders = [
  "Male", "Female", "Other"
];

export const Qualifications = [
  "MBBS", "MD", "MS", "Intern"
]

export const Specializations = [
  "Cardiologist", "Radiologist", "Psychiatrist",
  "Anesthesiologist", "Pediatrician", "Neurologist",
  "Dermatologist", "Dentist", "Pathologist",
  "General Surgeon", "Orthopaedic Surgeon", "Urologist",
  "Nephrologist", "Oncologist", "Gynaecologist"
];


/* Function Definitions */
export const getUserFullName = (userInfo) => {
  let fullName = `${userInfo.firstName} ${userInfo.lastName}`;

  if (userInfo.isPhysician) {
    fullName = `Dr. ${fullName}`;
  }
  return fullName;
}


/* Component Definitions */
export function GenderInput(props) {
  const genderOptions = [];
  for (const [idx, gender] of Genders.entries()) {
    genderOptions.push(<option key={idx} value={gender}>{gender}</option>);
  }

  return (
    <select id={props.id} name={props.name} className={(props.className) ? props.className: ""}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}
        aria-label={props.label}>
      {genderOptions}
    </select>
  );
}

export function QualificationInput(props) {
  const qualificationOptions = [];
  for (const [idx, qualification] of Qualifications.sort().entries()) {
    qualificationOptions.push(<option key={idx} value={qualification}>{qualification}</option>);
  }

  return (
    <select id={props.id} name={props.name} className={props.className} aria-label={props.label}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}
        readOnly={props.readOnly} >
      {qualificationOptions}
    </select>
  );
}


export function SpecializationInput(props) {
  const specializationOptions = [];
  for (const [idx, specialization] of Specializations.sort().entries()) {
    specializationOptions.push(<option key={idx} value={specialization}>{specialization}</option>);
  }

  return (
    <select id={props.id} name={props.name} className={props.className} aria-label={props.label}
      value={props.value} onChange={props.handleChange} required={(props.required) ? true: false}
        readOnly={props.readOnly}>
      {specializationOptions}
    </select>
  );
}


export function Photo(props) {
  let className = "img-fluid md-pfl-pic";
  if (props.className) {
    className = className.concat(" ", props.className);
  }

  return (
    <img id={props.id} className={className} alt={props.alt}
      src={(props.src) ? URL.createObjectURL(props.src): ""} />
  );
}


export class ProfilePhoto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    }
  }

  async componentDidMount() {
    try {
      const username = this.props.user.username;
      const profilePhotoId = this.props.user.profilePhotoId;

      const response = await fetch(`/api/users/${username}/photos/${profilePhotoId}`, {
        headers: {
          'Authorization': `Bearer ${this.props.session.authToken}`
        }
      });

      let data
      if (!response.ok) {
        data = await response.json();
        throw new Error(data.message);
      } else {
        data = await response.blob();
      }

      this.setState({
        data: data
      });
    } catch (err) {
      console.error(`Failed to load profile photo. ${err}`);
    }
  }

  render() {
    let className = "img-fluid md-pfl-pic";
    if (this.props.className) {
      className = className.concat(" ", this.props.className);
    }

    return (
      <Photo id={this.props.id} className={className} src={this.state.data} />
    );
  }
}
