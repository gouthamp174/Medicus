import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Loader } from '../../components/loaders';

const ChatView = lazy(() => import('./views/chatView'));


export default function ChatApp(props) {
    const session = useSelector(s => s.session);

    return (
        <Suspense fallback={<Loader isLoading={true} />}>
            <Switch>
                <Route
                    path={`${props.match.path}/:id`}
                    render={(props) => (
                        <ChatView 
                            {...props}
                            id={props.match.params.id}
                            session={session} 
                        />
                    )}
                />
            </Switch>
        </Suspense>
    );
}