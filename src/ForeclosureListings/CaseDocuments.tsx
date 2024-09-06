import React, { useState, useRef, FC } from 'react';
import { getCaseRecords } from '../utils/apolloClient'
import { ForeclosureModel } from '../utils/models'
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

interface Props {
  foreclosureData: ForeclosureModel;
}

const CaseRecords: FC<Props>= ({
    foreclosureData
}) => {
    const [recordsHTML, setRecordsHTML] = useState()
    const [showRecords, doShowrecords] = useState<boolean>()
    const didFetchRecords = useRef<boolean>();

    const renderRecords = () => {
        if (!didFetchRecords.current) {
            didFetchRecords.current = true
            getCaseRecords(foreclosureData.caseNumber).then((data) => {
                setRecordsHTML(data)
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
            <button onClick={() => doShowrecords(!showRecords)}>{!showRecords ? "View" : "Hide"} County Case Docs</button>
            {showRecords ? renderRecords() : ""}
        </>

    );
}

export default CaseRecords