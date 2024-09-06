import React, { type FC, type ReactElement } from 'react';
import Property from '../utils/Property'
import { forelosureAPIMap, getValueFromArrayPath } from '../utils/mappings'
import TD from '../TableView/TD';
import DebtsExpander from './DebtsExpander';
// import CaseRecords from '../ForeclosureListings/CaseDocuments';
// import RecordsDocuments from '../ForeclosureListings/RecordsDocuments.jsx';
import type { ForeclosureModel } from '../utils/models';
import { type AnyValue } from '../utils/types'

interface ExpandedTRrops {
  listing: Property<ForeclosureModel>;
}

interface ColData {
  title: string;
  elType?: string | ReactElement;
  children?: ReactElement;
  style?: string;
  readOnly?: boolean;
  type?: string;
}

const ExpandedTR: FC<ExpandedTRrops> = ({ listing }) => {
  const leftColumn: ColData[] = [
    {
      title: 'Sale Date',
      elType: 'date',
      style: 'inline',
      readOnly: true,
    },
    {
      title: 'Address',
      elType: 'input',
      type: 'string'
    },
    {
      title: 'Other Notes',
      elType: 'textarea',
      type: 'string'
    },
    {
      title: 'Other Debts',
      children: (
        <DebtsExpander
          debts={listing.data.detailedNotes}
          foreclosureData={listing.data}
          updateChecklist={(keyPath, value, callback) => {
            listing.updateItem({keyPath, value, callback});
          }}
          updateDebts={(debts, cb) => {
            listing.updateItem({
              keyPath: ['detailedNotes', 'otherDebts'],
              value: debts as unknown as AnyValue,
              callback: cb,
              skipQuery: true
            });
          }}
        />),
    },
    // {
    //   title: 'Case Docs',
    //   children: (
    //     <CaseRecords
    //       foreclosureData={listing.data}
    //     />),
    // },
    // {
    //   title: 'Records Docs',
    //   children: (
    //     <RecordsDocuments
    //       foreclosureData={listing.data}
    //     />),
    // },
  ];
  const rightColumn: ColData[] = [
    {
      title: 'Debt',
      elType: 'input',
      type: 'number',
    },
    {
      title: 'Zillow Value',
      elType: 'input',
      type: 'number',
    },
    {
      title: 'Max Bid',
      elType: 'input',
      type: 'number',
    },

    {
      title: 'Canceled?',
      elType: 'check',
    },
    {
      title: 'Advertised?',
      elType: 'check',
    },
  ];

  const renderColumn = (column: ColData[]) => (
    column.map(({
      title, elType, type, readOnly, children
    }, i) => {
      const tdVal: string | number = getValueFromArrayPath(listing.data, forelosureAPIMap[title])
      return (
        <tr key={i}>
          <td style={{ width: 90 }}>{title}</td>
          <TD
            style={{ width: '100%', float: 'right' }}
            inputStyle={{ width: '100%' }}
            onBlurUpdate={(newVal: string, cb?: (f: ForeclosureModel) => void) => {
              listing.updateItem({
                keyPath: forelosureAPIMap[title],
                value: newVal,
                valueType: type || typeof newVal,
                callback: cb
              });
            }}
            type={type}
            readOnly={readOnly}
            defaultValue={tdVal}
            elementType={elType}
          >{children}</TD>
        </tr>
      )
    })
  )

  return (
    <tr className="expanded-tr">
      <td colSpan={99}>
        <div className="content">
          <div className="col">
            <table style={{ width: '100%' }}>
              {renderColumn(leftColumn)}
            </table>
          </div>
          <div className="col">
            <table style={{ width: '100%' }}>
              {renderColumn(rightColumn)}
            </table>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ExpandedTR;