import React, { useState } from 'react';
import { AutoLoader } from '../../../../../../components/loaders';
import { TitleBar, Widget } from '../../../../../../components/widgets';

import ListSection from './listSection';


export default function MedicationSection(props) {
    const [state, setState] = useState({
        medications: [],
        limit: 10
    });

    async function appendMedications() {
        try {
            const url = `/api/users/${props.user.username}/medications`;

            const searchParams = new URLSearchParams();
            searchParams.append('page', Math.ceil(state.medications.length / state.limit));
            searchParams.append('limit', state.limit);

            const response = await fetch(`${url}?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let newMedications = await response.json();
            if (!response.ok) {
                throw new Error(newMedications.message);
            }

            setState(prevState => {
                const updatedMedications = [...prevState.medications, ...newMedications];

                return {
                    ...prevState,
                    medications: updatedMedications
                }
            })
        } catch (err) {
            console.error(`Failed to append more medications. ${err}`);
        }
    }

    return (
        <>
            <Widget>
                <TitleBar title="Medications"></TitleBar>
                <ListSection
                    medications={state.medications}
                />
            </Widget>
            <AutoLoader callback={appendMedications} />
        </>
    );
}