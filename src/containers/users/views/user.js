import React from 'react';

import User from '../user';


export default function UserView(props) {
    return (
        <>
            <User
                session={props.session}
                username={props.username}
                listView={false}
            />
        </>
    );
}