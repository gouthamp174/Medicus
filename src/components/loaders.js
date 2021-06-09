import React, { useEffect, useRef, useState } from 'react';
import { Col, FluidContainer, Row } from './layout';


export const Loader = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="md-loader p-1">
            {props.isLoading &&
                <FluidContainer className="p-3">
                    <Row className="justify-content-center">
                        <Col className="col-auto align-self-center">
                            <Row>
                                <div id="ellipsis01" className="md-ellipsis mx-1"></div>
                                <div id="ellipsis02" className="md-ellipsis mx-1"></div>
                                <div id="ellipsis03" className="md-ellipsis mx-1"></div>
                            </Row>
                        </Col>
                    </Row>
                </FluidContainer>
            }
        </div>
    );
})


export function AutoLoader({ callback=null }) {
    const loaderRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const currentLoaderRef = loaderRef.current;
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: [0, 1]
        };

        async function handleObserver(entries, observer) {
            if (!isLoading) {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.intersectionRatio >= 0.90 && !hasLoaded) {
                            setIsLoading(true);

                            if (callback) {
                                callback();
                            }
                            
                            setIsLoading(false);
                            setHasLoaded(true);
                        }
                    } else {
                        setHasLoaded(false);
                    }
                });
            }
        }

        const observer = new IntersectionObserver(handleObserver, options);
        observer.observe(currentLoaderRef);

        return function disconnectObserver() {
            if (observer) {
                observer.disconnect();
            }
        }
    }, [callback, hasLoaded]);

    return (
        <Loader ref={loaderRef} isLoading={isLoading} />
    );
}