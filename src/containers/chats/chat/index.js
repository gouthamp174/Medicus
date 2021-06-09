import React, { useEffect, useState } from 'react';

import DetailedView from './detailedView';


export default function Chat(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [chat, setChat] = useState({});

    useEffect(() => {
        async function initialize() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/chats/${props.id}`, {
                    credentials: 'same-origin',
                    headers: {
                      'Authorization': `Bearer ${props.session.authToken}`
                    }
                });

                let data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                setChat(data);
            } catch (err) {
                console.error(`Failed to initialize chat- ${props.id}. ${err}`);
            } finally {
                setIsLoading(false);
            }
        }

        initialize();
    }, [props.id, props.session]);


    if (props.listView) {
        return null;
    } else {
        return (
            <DetailedView
                session={props.session}
                chat={chat}
                isLoading={isLoading}
            />
        );
    }
}