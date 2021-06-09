import React from 'react';
import { Link } from 'react-router-dom';
import { useExtendClass } from '../../../../components/hooks';
import { Col, FluidContainer, Row } from '../../../../components/layout';
import { Loader } from '../../../../components/loaders';
import { BioData, FullName, ProfilePhoto } from '../../../../components/users';


function Title(props) {
    return (
        <h6 className={useExtendClass("my-0", props.className)}>
            {props.children}
        </h6>
    );
}


function SubTitle(props) {
    return (
        <p className="md-font-sm text-muted my-1">
            {props.children}
        </p>
    );
}


export default function UserListView(props) {
    // Now render view.
    if (props.isLoading) {
        return (
            <Loader isLoading={true} />
        );
    }

    return (
        <FluidContainer className="md-usr">
            <Row>
                <Col className="col-auto">
                    <ProfilePhoto
                        className="md-pfl-sm"
                        session={props.session}
                        user={props.user}
                    />
                </Col>
                <Col>
                    <Title className="font-weight-bold">
                        <Link to={`/users/${props.user.username}`}>
                            <FullName user={props.user} />
                        </Link>
                    </Title>
                    <SubTitle>
                        <BioData user={props.user} />
                    </SubTitle>
                </Col>
            </Row>
        </FluidContainer>
    );
}