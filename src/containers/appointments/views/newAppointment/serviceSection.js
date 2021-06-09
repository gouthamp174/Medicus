import React, { useCallback, useEffect, useState } from 'react';
import { FormGroup, FormLabel } from '../../../../components/form';
import { ServiceItem } from './utils';
import { AutoLoader, Loader } from '../../../../components/loaders';
import { List, ListButton } from '../../../../components/lists';


export default function ServiceSection(props) {
    const [state, setState] = useState({
        services: [],
        limit: 25
    });

    const getServices = useCallback( async({physician='', page=0, limit=10}) => {
        try {
            const url = `/api/users/${physician}/services`;
            const searchParams = new URLSearchParams();
            searchParams.append('page', page);
            searchParams.append('limit', limit);

            const response = await fetch(`${url}?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let newServices = await response.json();
            if (!response.ok) {
                throw new Error(newServices.message);
            }

            return newServices;
        } catch (err) {
            throw(err);
        }
    });
    
    useEffect(() => {
        async function load() {
            try {
                const newServices = await getServices({
                    physician: props.physician,
                    page: 0,
                    limit: state.limit
                });
                
                setState(prevState => {
                    return {
                        ...prevState,
                        services: [...newServices]
                    }
                });
            } catch (err) {
                console.log(`Failed to load services for selected physician. ${err}`);
            }
        }

        if (props.physician) {
            load();
        }
    }, [props.physician, state.limit]);

    async function appendServices() {
        try {
            const newServices = await getServices({
                physician: props.physician,
                page: Math.ceil(state.services.length / state.limit),
                limit: state.limit
            });

            setState(prevState => {
                const updatedServices = [...prevState.services, ...newServices];
                return {
                    ...prevState,
                    physicians: updatedServices
                }
            });
        } catch (err) {
            console.log(`Failed to append more services. ${err}`);
        }
    }

    if (props.currentStep !== 2) {
        return null;
    }

    return (
        <FormGroup>
            <FormLabel className="text-muted">Choose a Service</FormLabel>
            {
                (state.services.length === 0) ?
                <>
                    <Loader isLoading={true} />
                </> :
                <>
                    <List className="md-list">
                        {state.services.map((service, index) => (
                            <ListButton
                                key={index}
                                name={props.name}
                                value={service.id}
                                handleClick={props.handleClick}
                            >
                                <ServiceItem
                                    session={props.session}
                                    service={service} 
                                    clickable={true}
                                />
                            </ListButton>
                        ))}
                    </List>
                    <AutoLoader callback={appendServices} />
                </>
            }
        </FormGroup>
    );
}