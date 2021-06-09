import React, { lazy, Suspense } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Col, FluidContainer } from '../../../../../components/layout';
import { Loader } from '../../../../../components/loaders';
import { WidgetRow } from '../../../../../components/widgets';

import TitleBar, { TitleBarLink, TitleBarLinks } from '../../../../home/titleBar';
import Banner from './banner';
const InformationSection = lazy(() => import('./information'));
const MedicationSection = lazy(() => import('./medications'));
const ReportSection = lazy(() => import('./reports'));
const NoteSection = lazy(() => import('./notes'));
const PaymentSection = lazy(() => import('./payments'));


export default function AppointmentDetailView(props) {
    let { path } = useRouteMatch();
    const routes = [
        {
            path: `${path}`,
            exact: true,
            component: InformationSection
        },
        {
            path: `${path}/medications`,
            component: MedicationSection
        },
        {
            path: `${path}/reports`,
            component: ReportSection
        },
        {
            path: `${path}/notes`,
            component: NoteSection
        },
        {
            path: `${path}/payments`,
            component: PaymentSection,
            componentProps: {
                updatePayment: props.updatePayment
            }
        }
    ];

    // Now render view.
    if (props.isLoading) {
        return (
            <Loader isLoading={true} />
        );
    }

    var showChatLink = false;
    if (props.appointment.status === "Accepted" || props.appointment.status === "Done") {
        showChatLink = true;
    }

    return (
        <FluidContainer className="md-appt px-0">
            <TitleBar title={props.appointment.title}>
                <TitleBarLinks>
                    {showChatLink &&
                        <TitleBarLink
                            path={`/chats/${props.appointment.chatId}`}
                            title="Chat"
                            icon="chat"
                        />
                    }
                </TitleBarLinks>
            </TitleBar>
            <WidgetRow>
                <Col>
                    <Banner
                        session={props.session}
                        appointment={props.appointment}
                        handleStatus={props.handleStatus}
                        handleDelete={props.handleDelete}
                    />
                </Col>
            </WidgetRow>
            <WidgetRow>
                <Col>
                    <Suspense fallback={<Loader isLoading={true} />}>
                        <Switch>
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    children={(routeProps) => (
                                        <route.component
                                            {...routeProps}
                                            session={props.session}
                                            appointment={props.appointment}
                                            {...route.componentProps}
                                        />
                                    )}
                                />
                            ))}
                        </Switch>
                    </Suspense>
                </Col>
            </WidgetRow>
        </FluidContainer>
    );
}