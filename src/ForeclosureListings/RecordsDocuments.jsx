import React, { useState, useRef } from 'react';
import { fetchRecordsPageByCaseNumber } from '../utils/fetchAPI'
import styled from 'styled-components';
// import { ContactSupportOutlined } from '@material-ui/icons';

const RecordsContainer = styled('div')`
    tbody {
        background: #FAFAFA;
    }
    tbody tr {
        background: #CEE3F6;
        border-bottom: 1px solid grey;
    }
    tbody tr td:nth-child(odd) {
        background: #D8D8D8;
    }
    img {
        border: 1px solid #A4A4A4;
        border-radius: 50%;
    }
`;


export default function CaseRecords({
    foreclosureData
}) {
    const [recordsHTML, setRecordsHTML] = useState()
    const [showRecords, doShowrecords] = useState()
    const didFetchRecords = useRef();

    const renderRecords = () => {
        if (!didFetchRecords.current) {
            didFetchRecords.current = true
            fetchRecordsPageByCaseNumber(foreclosureData.caseNumber).then((data) => {
                setRecordsHTML(data.rHTMLArr.join(""))
            })
        }
        return (
            <div style={{ border: '1px solid black', padding: 5 }}>
                <RecordsContainer dangerouslySetInnerHTML={{ __html: recordsHTML || "Fetching records..." }} />
            </div>
        )
    }

    return (
        <>
            <button onClick={() => doShowrecords(!showRecords)}>{!showRecords ? "View" : "Hide"} County Records</button>
            {showRecords ? renderRecords() : ""}
        </>

    );
}
