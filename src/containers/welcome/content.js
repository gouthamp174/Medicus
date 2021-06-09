import React, { useEffect, useRef } from 'react';
import { FluidContainer, Row, Col, RowDivider } from "../../components/layout.js";
import { BodyCard } from "../../components/cards.js";

import SignInForm from "./signInForm.js";
import RegisterForm from "./register.js";


function ContentMedia() {
    return (
        <FluidContainer className="md-wc-banner">
            <h1 className="text-center font-weight-bold">medicus</h1>
            <h4 className="text-center">Your Physician. Any time. Any where.</h4>
        </FluidContainer>
    );
}


function RegisterModal(props) {
    const closeButtonRef = useRef(null);

    // Reset faded background back to normal when modal unmounts.
    useEffect(() => {
        const closeButton = closeButtonRef.current;

        return function closeModal() {
            if (closeButton) {
                closeButton.click();
            }
        }
    });

    return (
        <FluidContainer>
            <Row>
                <button type="button" class="btn btn-success col" 
                    data-toggle="modal" data-target="#registerModal01">
                    Create a new Account
                </button>
            </Row>
            <div class="modal fade" id="registerModal01" tabindex="-1" 
                role="dialog" aria-labelledby="registerModalTitle" 
                    aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 id="registerModalTitle" class="modal-title font-weight-bold">
                                Register today.
                            </h5>
                            <button ref={closeButtonRef} type="button" 
                                class="close" data-dismiss="modal" 
                                    aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <RegisterForm />
                        </div>
                    </div>
                </div>
            </div>
        </FluidContainer>
    );
}


export default function ContentBar(props) {
    return (
        <Row className="justify-content-center flex-grow-1 md-wc-cbar">
            <Col className="col-md-11 col-xl-10 d-flex align-items-start align-items-sm-center">
                <Row className="flex-grow-1">
                    <Col className="col-sm-5 col-md-6 col-lg-7 col-xl-8 d-none d-sm-inline align-self-center">
                        <ContentMedia />
                    </Col>
                    <Col className="col-12 col-sm-7 col-md-6 col-lg-5 col-xl-4 py-3">
                        <BodyCard className="p-3">
                            <FluidContainer>
                                <Row>
                                    <Col className="px-0">
                                        <SignInForm />
                                    </Col>
                                </Row>
                                <RowDivider className="my-2" />
                                <Row className="mt-3">
                                    <Col className="px-0">
                                        <RegisterModal />
                                    </Col>
                                </Row>
                            </FluidContainer>
                        </BodyCard>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}
