import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FluidContainer } from '../../../../components/layout';
import { Loader } from '../../../../components/loaders';

import TitleBar, { TitleBarLink, TitleBarLinks } from '../../../home/titleBar';
import MessageWindow from './messageWindow';
import SendMessageBar from './sendMessage';


export default function DetailedView(props) {
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        async function reconnect() {
            try {
                if (channel && !channel.connected) {
                    connect();
                }
            } catch (err) {
                console.error(`Failed to reconnect to server. ${err}`);
            }
        }

        async function connect() {
            try {
                const newChannel = io();

                newChannel.on('connect', () => {
                    console.debug(`Channel connection status: ${newChannel.connected}`);
                    console.log("Connected to server.");
                });

                newChannel.on('disconnect', reconnect);

                newChannel.emit('join',
                    { chatId: props.chat.id },
                    (response) => {
                        if (response.status === "ok") {
                            console.debug("Joined chat session.");
                        } else {
                            console.log("Failed to join chat session.");
                        }
                    }
                );

                setChannel(newChannel);
            } catch (err) {
                console.error(`Failed to connect to server. ${err}`);
            }
        }

        connect();
        return function disconnect() {
            async function closeChannel() {
                try {
                    if (channel) {
                        channel.emit('leave',
                            { chatId: props.chat.id },
                            (response) => {
                                if (response.status === "ok") {
                                    console.debug("Left chat session.");
                                } else {
                                    console.log("Failed to leave chat session.");
                                }
                            }
                        );

                        channel.close();
                        console.debug(`Channel connection status: ${channel.connected}`);
                    }

                    console.log("Disconnected from server.");
                    setChannel(null);
                } catch (err) {
                    console.error(`Failed to disconnect from server. ${err}`);
                }
            }

            closeChannel();
        }
    }, [props.chat]);

    return (
        <FluidContainer className="d-flex flex-column md-chat h-100 px-0">
            {
                (props.isLoading) ?
                <>
                    <Loader isLoading={true} />
                </> :
                <>
                    <TitleBar title={props.chat.title} >
                        <TitleBarLinks>
                            <TitleBarLink
                                path={`/appointments/${props.chat.appointmentId}`}
                                title="Go to Appointment"
                                icon="event"
                            />
                        </TitleBarLinks>
                    </TitleBar>
                    <MessageWindow 
                        session={props.session}
                        chat={props.chat}
                        channel={channel}
                    />
                    <SendMessageBar
                        session={props.session}
                        chat={props.chat}
                        channel={channel}
                    />
                </>
            }
        </FluidContainer>
    );
}