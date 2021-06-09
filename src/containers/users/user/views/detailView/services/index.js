import React, { useState } from 'react';
import { AutoLoader } from '../../../../../../components/loaders';
import { TitleBar, TitleToggler, Widget, 
    WidgetCollapsible } from '../../../../../../components/widgets';

import AddSection from './addSection';
import ListSection from './listSection';


export default function ServiceSection(props) {
    const [state, setState] = useState({
        services: [],
        limit: 10
    });

    async function appendServices() {
        try {
            const url = `/api/users/${props.user.username}/services`;

            const searchParams = new URLSearchParams();
            searchParams.append('page', Math.ceil(state.services.length / state.limit));
            searchParams.append('limit', state.limit);

            const response = await fetch(`${url}?${searchParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let newServices = await response.json();
            if (!response.ok) {
                throw new Error(newServices.message);
            }

            setState(prevState => {
                const updatedServices = [...prevState.services, ...newServices];

                return {
                    ...prevState,
                    services: updatedServices
                }
            })
        } catch (err) {
            console.error(`Failed to append more services. ${err}`);
        }
    }

    async function appendService(newService) {
        setState(prevState => {
            const newServices = [newService, ...prevState.services];

            return {
                ...prevState,
                services: newServices
            }
        });
    }

    async function deleteService(id) {
        try {
            const response = await fetch(`/api/users/${props.user.username}/services/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.session.authToken}`
                }
            });

            let data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setState(prevState => {
                const newServices = state.services.filter(service => {
                    return service.id !== id;
                });

                return {
                    ...prevState,
                    services: newServices
                }
            });
        } catch (err) {
            console.error(`Failed to delete service- ${id}. ${err}`);
        }
    }

    return (
        <>
            <Widget>
                <TitleBar title="Services">
                    {(!props.disableEdit) &&
                        <TitleToggler 
                            target="userServiceAdd01"
                            expandIcon="add"
                            collapseIcon="clear"
                        />
                    }
                </TitleBar>
                <WidgetCollapsible id="userServiceAdd01">
                    <AddSection
                        session={props.session}
                        user={props.user}
                        appendService={appendService}
                    />
                </WidgetCollapsible>
                <ListSection
                    session={props.session}
                    services={state.services}
                    deleteService={deleteService}
                />
            </Widget>
            <AutoLoader callback={appendServices} />
        </>
    );
}