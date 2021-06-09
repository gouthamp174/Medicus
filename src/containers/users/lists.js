import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FluidContainer, Row, Col } from '../../components/layout';
import { List, ListItem } from '../../components/lists';
import { AutoLoader } from '../../components/loaders';

import User from './user';


function DefaultItems(props) {
    return (
        <ListItem className="border-0">
            <FluidContainer>
                <Row className="justify-content-center">
                    <Col className="col-auto align-items-center">
                        <h6 className="my-0 text-muted">
                            {props.message}
                        </h6>
                    </Col>
                </Row>
            </FluidContainer>
        </ListItem>
    );
}


export function ListView(props) {
    const userItems = [];
    if (props.users && props.users.length > 0) {
        for (const [index, user] of props.users.entries()) {

            const userItem = (
                <ListItem key={index} className="px-3">
                    <User
                        session={props.session}
                        username={user.username}
                        listView={true}
                    />
                </ListItem>
            );
            userItems.push(userItem);
        }
    } else {
        userItems.push(
            <DefaultItems message={props.defaultMessage} />
        );
    }

    return (
        <List className="md-list">
            {userItems}
        </List>
    );
}


export default function InfiniteUserList(props) {
    const session = useSelector(s => s.session);

    const getUsers = useCallback(async ({view='', search='', page=0, limit=10}) => {
        try {
            const searchParams = new URLSearchParams();
            searchParams.append('view', (view) ? view : '');
            searchParams.append('search', (search) ? search : '');
            searchParams.append('page', page);
            searchParams.append('limit', limit);

            const response = await fetch(`/api/users?${searchParams.toString()}`, {
                headers: {
                'Authorization': `Bearer ${session.authToken}`
                }
            });

            const users = await response.json();
            if (!response.ok) {
                throw new Error(users.message);
            }

            return users;
        } catch (err) {
            throw(err);
        }
    }, [session.authToken]);

    const [state, setState] = useState({
        users: [],
        limit: 10
    });

    // If props change, initialize users.
    useEffect(() => {
        async function load() {
            try {
                const newUsers = await getUsers({
                    view: props.view,
                    search: props.search,
                    page: 0,
                    limit: state.limit
                });

                setState(prevState => {
                    return {
                        ...prevState,
                        users: newUsers
                    }
                });
            } catch (err) {
                console.error(`Failed to load users. ${err}`);
            }
        }

        load();
    }, [props.view, props.search, getUsers, state.limit]);

    async function appendUsers() {
        try {
            const newUsers = await getUsers({
                view: props.view,
                search: props.search,
                page: Math.ceil(state.users.length / state.limit),
                limit: state.limit
            });
            
            setState(prevState => {
                const updatedUsers = [...prevState.users, ...newUsers];

                return {
                    ...prevState,
                    users: updatedUsers
                }
            });
        } catch (err) {
            console.error(`Failed to append more users. ${err}`);
        }
    }

    // Now render view
    return (
        <FluidContainer>
            <Row>
                <Col className="px-0">
                    <ListView
                        session={session}
                        users={state.users}
                        defaultMessage={props.defaultMessage}
                    />
                    {(state.users.length > 0) &&
                        <AutoLoader callback={appendUsers} />
                    }
                </Col>
            </Row>
        </FluidContainer>
    );
}