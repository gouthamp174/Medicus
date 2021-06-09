import React from 'react';

import Chat from '../chat';


export default function ChatView(props) {
    return (
        <Chat
            session={props.session}
            id={props.id}
            listView={false}
        />
    );
}