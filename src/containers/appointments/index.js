import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Loader } from '../../components/loaders';

const AppointmentView = lazy(() => import("./views/appointment"));
const AllAppointmentsView = lazy(() => import("./views/allAppointments"));
const WaitingRoomView = lazy(() => import('./views/waitingRoom'));
const NewAppointmentView = lazy(() => import('./views/newAppointment'));


export default function AppointmentApp(props) {
    const session = useSelector(s => s.session);

    return (
        <Suspense fallback={<Loader isLoading={true} />}>
            <Switch>
                <Route
                    path={`${props.match.path}/:id`}
                    render={(props) => (
                        <AppointmentView
                            {...props} 
                            id={props.match.params.id}
                            session={session}
                        />
                    )}
                />
                <Route
                    path=""
                    render={(props) => {
                        if (props.location.search) {
                            let searchParams = new URLSearchParams(props.location.search);

                            if (searchParams.has("view")) {
                                const viewName = searchParams.get("view");

                                if (viewName === "new") {
                                    let physician = "";
                                    if (searchParams.has("physician")) {
                                        physician = searchParams.get("physician");
                                    }

                                    return (
                                        <NewAppointmentView {...props} session={session} />
                                    );
                                } else if (viewName === "waiting") {
                                    return (
                                        <WaitingRoomView {...props} session={session} />
                                    );
                                }
                            }
                        }

                        return (
                            <AllAppointmentsView {...props} session={session} />
                        );
                    }}
                />
            </Switch>
        </Suspense>
    );
}