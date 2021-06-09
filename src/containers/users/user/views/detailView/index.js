import React, { lazy, Suspense } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Col, FluidContainer } from '../../../../../components/layout';
import { Loader } from '../../../../../components/loaders';
import { FullName, Username } from '../../../../../components/users';
import { WidgetRow } from '../../../../../components/widgets';

import TitleBar from '../../../../home/titleBar';
import Banner from './banner';
const AboutSection  = lazy(() => import("./about"));
const MedicationSection = lazy(() => import('./medications'));
const ReportSection = lazy(() => import('./reports'));
const ServicesSection = lazy(() => import("./services"));


export default function UserDetailView(props) {
    let { path } = useRouteMatch();
    const routes = [
        {
            path: `${path}`,
            exact: true,
            component: AboutSection
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
            path: `${path}/services`,
            component: ServicesSection
        }
    ];

    // If profile is not of current user, disable edit mode.
    const profileUsername = Username({ user: props.user });
    const currentUsername = Username({ user: props.session });
    const disableEdit = (currentUsername === profileUsername) ? false: true;

    // Now render view.
    if (props.isLoading) {
        return (
            <Loader isLoading={true} />
        );
    }

    return (
        <FluidContainer className="md-usr px-0">
            <TitleBar title={<FullName user={props.user} />} />
            <WidgetRow>
                <Col>
                    <Banner
                        session={props.session}
                        user={props.user}
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
                                            user={props.user}
                                            disableEdit={disableEdit}
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
