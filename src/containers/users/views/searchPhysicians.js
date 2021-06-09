import React, { useState } from 'react';
import { Col, Row } from '../../../components/layout';

import TitleBar, { TitleBarSearch } from '../../home/titleBar';
import InfiniteUserList from '../lists';


export default function SearchPhysiciansView(props) {
    const [searchQuery, setSearchQuery] = useState("");

    async function handleSearch(query) {
        setSearchQuery(query);
    }

    return (
        <>
            <TitleBar title="Search Physicians">
                <TitleBarSearch
                    handleSearch={handleSearch}
                    placeholder="Search physicians..."
                />
            </TitleBar>
            <Row className="flex-grow-1">
                <Col>
                    <InfiniteUserList
                        view="physician"
                        search={searchQuery}
                        defaultMessage="Search for Physicians using the search bar."
                    />
                </Col>
            </Row>
        </>
    );
}