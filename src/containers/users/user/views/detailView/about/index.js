import React from 'react';

import AboutWidget from './about';
import EducationWidget from './education';
import ExperienceWidget from './experience';
import InsuranceWidget from './insurance';


export default function AboutSection(props) {
    return (
        <>
            <AboutWidget
                session={props.session}
                user={props.user}
                disableEdit={props.disableEdit}
            />
            <EducationWidget
                session={props.session}
                user={props.user}
                disableEdit={props.disableEdit}
            />
            <ExperienceWidget 
                session={props.session}
                user={props.user}
                disableEdit={props.disableEdit}
            />
            <InsuranceWidget 
                session={props.session}
                user={props.user}
                disableEdit={props.disableEdit}
            />
        </>
    );
}