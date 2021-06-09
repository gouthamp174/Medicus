import React, { useState } from 'react';
import { Col, Row } from '../../../components/layout';

import TitleBar, { TitleBarSearch } from '../../home/titleBar';
import InfiniteUserList from '../lists';


export default function SearchPatientsView(props) {
    const [searchQuery, setSearchQuery] = useState("");

    async function handleSearch(query) {
        setSearchQuery(query);
    }

    return (
        <>
            <TitleBar title="Search Patients">
                <TitleBarSearch
                    handleSearch={handleSearch}
                    placeholder="Search patients..."
                />
            </TitleBar>
            <Row className="flex-grow-1">
                <Col>
                    <InfiniteUserList 
                        view="patient"
                        search={searchQuery}
                        defaultMessage="Search for Patients using the search bar."
                    />
                </Col>
            </Row>
        </>
    );
}