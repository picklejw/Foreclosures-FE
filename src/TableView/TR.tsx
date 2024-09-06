import React, { type Dispatch, type FC, type ReactElement, type SetStateAction, useState } from 'react';
import Property from '../utils/Property'
import { TableRow, ResponsiveName } from './index'
import { setToast } from '../Router'
import TD from './TD';
import { TableHeaders } from './index';
import type { ForeclosureModel, RentalModel } from '../utils/models';
import { Loader } from '../utils/Loader'
import { isForeclosure } from '../utils/Property'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faUserSecret, faUsersRectangle } from '@fortawesome/free-solid-svg-icons';
import { getValueFromArrayPath, forelosureAPIMap } from '../utils/mappings';

export type PropertyModel = Property<ForeclosureModel | RentalModel>

const getEquity = (data: PropertyModel["data"]): string => {
  if ((data as ForeclosureModel).debt !== undefined && (data as ForeclosureModel).zillowValue !== undefined) {
    return `${(data as ForeclosureModel).zillowValue - (data as ForeclosureModel).debt}`
  }
  return ""
}

type UseStateTuple<T> = [T, Dispatch<SetStateAction<T>>];

interface TRProps {
  listing: PropertyModel;
  screenType: ResponsiveName;
  tableHeaders: TableHeaders[];
  expanderTR: {
    comp: React.ElementType,
    getter: (inst: PropertyModel) => Promise<ForeclosureModel | RentalModel>
  };
}

interface RowData<T> {
  label: string;
  width: {
    desktop: string,
    mobile: string
  },
  value: string | ReactElement;
  onClick?: (arg?: T) => void
}

interface ListingTRProps extends TRProps {
  expanderState: UseStateTuple<boolean>;
  screenType: ResponsiveName;
}

const cleanCaseNumer = (caseNumber: string) => {
  return caseNumber.substring(
    0,
    caseNumber.length - 8,
  );
}

const colorByEquityClassName = (data: ForeclosureModel | RentalModel) => {
  if (isForeclosure(data)) {
    const updateForeclosureEquityPotential = () => {
      const zillowVal = getValueFromArrayPath(data, forelosureAPIMap['Zillow Value'])
      const debt = data.debt;
      if (!zillowVal || !debt) {
        return {};
      }
      const strZval = String(zillowVal);
      const strDebt = String(debt);
      const zVal = parseFloat(strZval);
      const intDebt = parseFloat(strDebt);
      const diffInt = zVal - intDebt;
      let color = '';
      if (diffInt < 0) {
        color = 'Red';
      } else if (diffInt > 0) {
        color = 'Yellow';
        if (diffInt > 30000) {
          color = 'Green';
          if (diffInt > 50000) {
            color = 'SuperGreen';
            if (diffInt > 100000) {
              color = 'Blue';
            }
          }
        }
      }

      return {
        diffInt,
        color,
      };
    };
    const rowProps = updateForeclosureEquityPotential() || {};
    return `bg-${rowProps?.color} ${data.isCanceled ? 'is-canceled' : ''}`;
  }
  return ""
}

const ListingTR: FC<ListingTRProps> = ({ listing, expanderState, screenType, tableHeaders }) => {
  const [isExpanded, setIsExpanded] = expanderState
  const [fData, setData] = useState(listing.data)
  // const [time, newT] = useState(0)
  const headerRowData = tableHeaders.map((item) => {
    const defaultItem: RowData<string> = { ...item, value: "", onClick: () => { } }

    switch (item.label) {
      case '📝':
        const expanderBtn: RowData<boolean> = {
          ...item,
          value: isExpanded ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} />,
          onClick: () => {
            setIsExpanded(isExpand => !isExpand)
          }
        }
        return expanderBtn
        break;
      case '👍':
        if (isForeclosure(fData)) {
          const favItemRow: RowData<boolean> = {
            ...item,
            value: (fData as ForeclosureModel)?.isFav ? "👍" : "👎",
            onClick: () => {
              listing.updateItem({ keyPath: ["isFav"], value: !fData?.isFav })
            }
          }
          return favItemRow
        }
      case '👀':
        const adItemRow: RowData<boolean> = {
          ...item,
          value: (fData as ForeclosureModel)?.isAdvertised ? <FontAwesomeIcon icon={faUsersRectangle} /> : <FontAwesomeIcon icon={faUserSecret} />
        }
        return adItemRow
      case 'Case Number':
        if (isForeclosure(fData)) {
          const shortCaseNumber = cleanCaseNumer(fData?.caseNumber || "")
          const caseNumItemRow: RowData<typeof fData.caseNumber> = {
            ...item,
            value: shortCaseNumber,
            onClick: () => {
              const cpVal = (shortCaseNumber);
              navigator.clipboard.writeText(cpVal).then(
                () => {
                  setToast(`Copied: ${cpVal}`);
                },
                () => {
                  setToast('Error copying text!');
                },
              );
            }
          }
          return caseNumItemRow
        }
      case 'Address':
        const addrItemRow: RowData<string> = {
          ...item,
          value: fData?.address,
          onClick: () => {
            const cpVal = (fData?.address);
            navigator.clipboard.writeText(cpVal).then(
              () => {
                setToast(`Copied: ${cpVal}`);
              },
              () => {
                setToast('Error copying text!');
              },
            );
          }
        }
        return addrItemRow
      case 'Equity':
        const equityItemRow: RowData<string> = {
          ...item,
          value: (fData as ForeclosureModel)?.debt && (fData as ForeclosureModel)?.zillowValue ? getEquity(fData) : ""
        }
        return equityItemRow
      default:
        break;
    }
    return defaultItem
  })

  listing.setUpdateCallback((nIData: ForeclosureModel | RentalModel) => {
    setData({ ...nIData }) // we need this, since react only looks shallow for comparison. New object, new referance
  })

  const equityCSS = colorByEquityClassName(fData)
  const classNameForColor = !equityCSS.includes("undefined") ? `${equityCSS} row-animate` : ""

  return (
    <div style={{overflow: 'hidden', width: '100vw'}}>
      <TableRow className={classNameForColor}>
        {headerRowData.map((data, i) => (
          /* @ts-expect-error todo  */
          <TD style={{ ...tableHeaders[i].style[screenType], border: "2px solid rgba(0, 0, 0, 0)" }} key={i} onClick={data.onClick ? () => data?.onClick?.() : undefined}>
            {data.value}
          </TD>
        ))}
      </TableRow>
    </div>
  )
};


const TR: FC<TRProps> = (props) => {
  const { listing, expanderTR } = props;
  const expanderState = useState(false);
  const [isExpanded] = expanderState
  const [didFetchExpander, setDidFetchExpander] = useState<boolean | null>(false)
  const renderListingTR = () => {
    return <ListingTR {...props} expanderState={expanderState} />
  }
  const handleRenderExpandingTR = () => {
    if (isExpanded) {
      if (didFetchExpander === true) {
        const Comp = expanderTR.comp
        return (
          <Comp listing={listing} />
        )
      } else {
        if (didFetchExpander === false) {
          setDidFetchExpander(null)
          expanderTR.getter(listing).then((rData) => {
            listing.setPersonalizationData(rData)
            setDidFetchExpander(true)
          }).catch((e) => {
            setToast(`Could not fetch for expander: ${e.message}`)
          })
        }
        return (
          <tr style={{
            height: 100,
            border: '5px solid black',
            borderRadius: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200
          }}><Loader /></tr>
        )
      }
    }
    return ""
  }

  return (
    <>
      {renderListingTR()}
      {handleRenderExpandingTR()}
    </>
  );
};

export default TR;
