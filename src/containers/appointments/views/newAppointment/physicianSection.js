import React, { useCallback, useEffect, useState } from 'react';
import { FormGroup, FormLabel } from '../../../../components/form';
import { List, ListButton } from '../../../../components/lists';
import { AutoLoader } from '../../../../components/loaders';
import { Username } from '../../../../components/users';
import { PhysicianItem } from './utils';


export default function PhysicianSection(props) {
    const { id, name, handleClick, ...otherProps } = props;

    const [state, setState] = useState({
        query: "",
        physicians: [],
        limit: 25
    });

    const getPhysicians = useCallback( async({search='', page=0, limit=10}) => {
        try {
            const url = `/api/users`;
            const searchParams = new URLSearchParams();
            searchParams.append('view', 'physician');
            searchParams.append('search', search);
            searchParams.append('page', page);
            searchParams.append('limit', limit);

            const response = await fetch(`${url}?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let newPhysicians = await response.json();
            if (!response.ok) {
                throw new Error(newPhysicians.message);
            }

            return newPhysicians;
        } catch (err) {
            throw(err);
        }
    })

    useEffect(() => {
        async function load() {
            try {
                const newPhysicians = await getPhysicians({
                    search: state.query,
                    page: 0,
                    limit: state.limit
                });

                setState(prevState => {
                    return {
                        ...prevState,
                        physicians: [...newPhysicians]
                    }
                });
            } catch (err) {
                console.log(`Failed to load physicians based on search. ${err}`);
            }
        }

        load();
    }, [state.query, state.limit]);

    async function appendPhysicians() {
        try {
            const newPhysicians = await getPhysicians({
                search: state.query,
                page: Math.ceil(state.physicians.length / state.limit),
                limit: state.limit
            });

            setState(prevState => {
                const updatedPhysicians = [...prevState.physicians, ...newPhysicians];
                return {
                    ...prevState,
                    physicians: updatedPhysicians
                }
            });
        } catch (err) {
            console.error(`Failed to append to physician suggestions. ${err}`);
        }
    }

    async function handleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value,
            physicians: []
        });
    }

    if (props.currentStep !== 1) {
        return null;
    }

    return (
        <>
            <FormGroup>
                <FormLabel className="text-muted">Select a Physician</FormLabel>
                <input id={id} type="text" className="form-control"
                    name="query" value={state.query} onChange={handleChange}
                        placeholder="Full Name or Username" {...otherProps} />
            </FormGroup>
            {(state.query.length > 0) &&
                <FormGroup>
                    <List className="md-list">
                        {state.physicians.map((physician, index) => (
                            <ListButton
                                key={index}
                                name={name}
                                value={Username({ user: physician })}
                                handleClick={handleClick}
                            >
                                <PhysicianItem
                                    session={props.session}
                                    user={physician} 
                                    clickable={true}
                                />
                            </ListButton>
                        ))}
                    </List>
                    <AutoLoader callback={appendPhysicians} />
                </FormGroup>
            }
        </>
    );
}