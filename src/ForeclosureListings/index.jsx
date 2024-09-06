import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import { Toaster } from 'react-hot-toast';
import { connect } from 'react-redux';
import TableView from '../TableView';
import ExpandedTR from './ExpandedTR';
import Foreclosure from '../utils/Property';
import { isForeclosure } from '../utils/Property';
import { getUserForeclosureItems } from '../utils/apolloClient';

const MenuProps = {
  PaperProps: {
    style: {
      width: '100%',
    },
  },
};
const tabMargin = 5;

const TabContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  margin-top: ${tabMargin}px;

  .select-container,
  .filter-container {
    width: 50%;
  }
`;
const TableContainer = styled.div`
  position: fixed;
  top: ${({ marginTop }) => marginTop}px;
  bottom: 0;
  width: 100vw;
  overflow-y: scroll;
`;

//, type CSSProperties
// type Responsivename = 'desktop' | 'mobile'

// type ColResponsiveStyles = {
//   [key in Responsivename]: CSSProperties;
// }[];

// interface TableHeaders {
//   label: String;
//   style: ColResponsiveStyles;
// }


const tableHeaders = [ // : TableHeaders[] 
  { label: '📝', style: { desktop: { width: 25, textAlign: 'center' }, mobile: { width: 20 } } },
  { label: '👍', style: { desktop: { width: 25, textAlign: 'center' }, mobile: { width: 20 } } },
  { label: '👀', style: { desktop: { width: 25, textAlign: 'center' }, mobile: { width: 20 } } },
  { label: 'Case Number', style: { desktop: { width: 200 }, mobile: { flex: 1 } } },
  { label: 'Address', style: { desktop: { flex: 1 }, mobile: { display: 'none' } } },
  { label: 'Equity', style: { desktop: { width: 100 }, mobile: { display: 'none' } } }
]

function ForeclosureListings(props) {
  const [tabs, setTabs] = useState({});
  const [isSelecting, setSelecting] = useState();
  const [selected, setSelected] = useState([]);
  const tabContainerRef = React.createRef();

  useEffect(() => {
    (async () => {
      const foreclosures = props.foreclosureListings;
      const { user } = props;
      const userForeclosureData = new Map(([...(user.foreclosures || []), ...(user.historialArchive || [])]).map(item => [item.caseNumber, item]));
      const mapped = {};
      const handleSale = (foreclosure) => {
        const { data, setPersonalizationData } = foreclosure;
        const hasForeclosureData = userForeclosureData.get(data.caseNumber)
        if (hasForeclosureData) {
          setPersonalizationData(hasForeclosureData);
        }

        if (!Array.isArray(mapped[data.saleDate])) {
          mapped[data.saleDate] = [foreclosure];
        } else {
          mapped[data.saleDate].push(foreclosure);
        }
      };
      foreclosures.forEach(handleSale);

      // get hisorical archives in new call here.
      const salesArchive = [];
      Object.entries(userForeclosureData).forEach(([caseNum, casePayload]) => {
        // IF CANCELED, do not archive
        // Notes are not working :-(

        const hasEquityValues = parseInt(casePayload['Zillow Value'], 10)
          - parseInt(casePayload.Debt, 10)
          > 1;
        if (!casePayload.isCanceled && hasEquityValues) {
          salesArchive.push(
            new Foreclosure({
              'Case Number': caseNum,
              ...casePayload,
            }),
          );
        }
      });

      const sorted = Object.keys(mapped).sort((a, b) => new Date(a) - new Date(b)).reduce(
        (obj, key) => {
          obj[key] = mapped[key];
          return obj;
        },
        {},
      );

      setTabs({
        'Historical Archives': salesArchive,
        ...sorted,
      });
    })();
  }, []);

  const handleDateSelection = async (ev) => {
    const { value } = ev.target;
    setSelected(value);
  };

  const getFilteredTableResults = () => {
    let results = [];
    selected.forEach((name) => {
      results = tabs[name].concat(results);
    });

    return results;
  };

  return (
    <>
      <Toaster containerClassName="toaster-container" position="bottom-right" />
      {isSelecting && (
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            height: '100%',
            width: '100%',
            background: 'rgba(0,0,0,0.7)',
          }}
        />
      )}
      <TabContainer ref={tabContainerRef}>
        <FormControl className="filter-container">
          <InputLabel>Filter Auction Dates</InputLabel>
          <Select
            multiple
            className="select-container"
            value={selected}
            onOpen={() => setSelecting(true)}
            onClose={() => setSelecting(false)}
            onChange={handleDateSelection}
            input={<Input />}
            renderValue={(selectedVal) => selectedVal.join(', ')}
            SelectDisplayProps={{ top: 50 }}
            MenuProps={MenuProps}
          >
            {Object.keys(tabs).map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={selected.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TabContainer>
      <TableContainer marginTop={50}>
        <TableView
          properties={getFilteredTableResults()}
          tableHeaders={tableHeaders}
          expanderTR={{
            comp: ExpandedTR,
            getter: async (propertyInst) => {
              if (isForeclosure(propertyInst.data)) {
                const rData = await getUserForeclosureItems(propertyInst.data.caseNumber, [
                  ["detailedNotes", "otherNotes"],
                  ["detailedNotes", "todoTaxes"],
                  ["detailedNotes", "todoOwner"],
                  ["detailedNotes", "otherDebts", "title"],
                  ["detailedNotes", "otherDebts", "amount"],
                  ["debt"],
                  ["zillowValue"],
                  ["maxBid"],
                  ["isAdvertised"],
                  ["isCanceled"]
                ])
                return rData
              }
            }
          }}
        />
      </TableContainer>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  foreclosureListings: state.foreclosureListings,
});

export default connect(mapStateToProps)(ForeclosureListings);
