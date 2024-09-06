/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faArrowDown, faPlus } from '@fortawesome/free-solid-svg-icons';

import TD from '../TableView/TD';
import TableView from '../TableView';
// import DraggableSlate from '../DraggableSlate';
import Expenses from './Expenses';
import Projects from './Projects';

import { addSlateAction, removeSlateAction } from '../actions';
// import { fetchHistorialRecords } from '../utils/fetchAPI';
import { addNewUpdateManagedOwned, getAllManagedOwned, getManagedOwnedByAddress } from '../utils/apolloClient';
import Property,{ mapDataToProperty } from '../utils/Property';
// import { icon } from '@fortawesome/fontawesome-svg-core';
// import { id } from 'date-fns/locale';
// import { entries, forEach, filter, includes, map } from 'draft-js/lib/DefaultDraftBlockRenderMap';
// import { push } from 'draft-js/lib/EditorState';
// import { title } from 'process';

const tableHeaders = [
  { label: '📝', width: { desktop: "width: 25px; text-align: center; ", mobile: "10" } },
  { label: '👍', width: { desktop: "width: 25px; text-align: center; ", mobile: "10" } },
  { label: '⚠️', width: { desktop: "width: 25px; text-align: center; ", mobile: "10" } },
  { label: 'Address', width: { desktop: "flex:1;", mobile: "10" } },
]

const AccordionContainer = styled(Accordion)`
  background-image: radial-gradient( circle farthest-corner at 10% 20%, rgba(255,200,124,1) 0%, rgba(252,251,121,1) 90% );
  overflow: hidden;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;

  > .MuiAccordionSummary-root {
    background: rgba(255,255,255, 0.4);
    box-shadow: 2px 5px 12px 0px rgba(0,0,0,0.75);
  }
`;

const DetailsContainer = styled(AccordionDetails)`
  overflow: hidden;
  padding: 10px !important;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export const RentalManagment = (props) => {
  const [showNewForm, setShowNewForm] = useState();
  const [draggableSlates, setDraggableSlates] = useState([]);
  const [managedProperties, setManagedProperties] = useState(props?.user?.rentals ? mapDataToProperty(props?.user?.rentals) : []);
  const [historicalRecords, setHistoricalRecords] = useState([]);

  const { user, addSlate, removeSlate } = props;

  useEffect(() => {
    // const historicalRecords = await fetchHistorialRecords();
    // setHistoricalRecords(historicalRecords);
    getAllManagedOwned().then((response) => setManagedProperties(mapDataToProperty(response)));
    
  }, []);

  const closeFormModal = (resetForm, data) => {
    setShowNewForm(false);
  };

  const addNew = (property) => {
    // const { address } = property;
    // const foreclosureData = historicalRecords[caseNum] || {};
    // should we get other foreclosure info?
    addNewUpdateManagedOwned(property);
    closeFormModal();
  };

  const addRentalSlate = (slate) => {
    setDraggableSlates({...draggableSlates, slate})
    addSlate(slate)
  }
  const rmRentalSlate = (slate) => {
    debugger
    // setDraggableSlates({...draggableSlates, slate})
    // removeSlate(slate)
  }

  const newManagmentForm = () => {
    const [address, setAddress] = useState('');
    const options = [];
    if (historicalRecords) {
      Object.entries(historicalRecords).forEach(([caseNum, foreclosureData]) => {
        if (foreclosureData.Address) {
          options.push([foreclosureData.Address, caseNum]);
        }
      });
    }

    return (
      <Dialog open={!!showNewForm} onClose={closeFormModal}>
        <DialogTitle>Add New Property to Manage</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add the existing house address to pull in info from past foreclosures or type in address.
          </DialogContentText>
          <br />
          <Autocomplete
            options={options}
            getOptionLabel={(label) => label}
            value={address}
            onInputChange={(ev, val, reason) => {
              setAddress(val);
            }}
            blurOnSelect
            filterOptions={(filteredOptions, { inputValue }) => {
              if (inputValue.length === 0) {
                return filteredOptions;
              }

              return filteredOptions.filter((foreclosure) => {
                const dataStr = foreclosure.toString().toLowerCase();
                const lowerCaseVal = inputValue.toLocaleLowerCase();
                return dataStr.includes(lowerCaseVal);
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Add a location" fullWidth />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ borderBottom: '1px solid #C0C0C0' }}>
                <Grid direction="column" alignItems="flex-start" container>
                  {option[0]}
                  <Typography style={{ paddingLeft: 10 }} variant="body2" color="text.secondary">
                    {option[1]}
                  </Typography>

                </Grid>
              </li>
            )}
          />
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="House Address"
            type="text"
            fullWidth
            variant="standard"
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFormModal}>Cancel</Button>
          <Button onClick={() => addNew({address})}>Add</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderExpander = ({listing}) => {
    const sectionsMap = [
      {
        comp: Projects,
        title: 'Projects'
      },
      // {
      //   comp: Expenses,
      //   title: 'Expenses',
      // },
      // // {
      // //   comp: Debts,
      // //   title: 'Debts',
      // // },
    ];
    
    const expanderProps = {
      removeSlate: rmRentalSlate,
      addSlate: addRentalSlate,
      instance: listing,
    };
    return (
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: 10, background: '#208EE7' }} />
        <div style={{ flexGrow: 1 }}>
          {sectionsMap.map((section) => (
            <AccordionContainer>
              <AccordionSummary
                expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <span style={{ fontWeight: 600, fontSize: 14 }}>{section.title}</span>
              </AccordionSummary>
              <DetailsContainer>
                <section.comp {...expanderProps} />
              </DetailsContainer>
            </AccordionContainer>
          ))}
        </div>
      </div>
    );
  };

  const expanderGetter = async (rentalInst) => await getManagedOwnedByAddress(rentalInst?.data?.address)
  console.log('renMgmt')

  return (
    <>
      {newManagmentForm()}
      <div>
        <div style={{
          height: 100, background: 'red', display: 'flex', alignItems: 'center',
        }}
        >
          <button
            style={{
              background: '#fff', border: '1px solid grey', borderRadius: 5, padding: 10, margin: 20,
            }}
          >
            <FontAwesomeIcon onClick={setShowNewForm} icon={faPlus} />
          </button>
        </div>
        <div style={{ height: 'calc(100vh - 100px)' }}>
          <TableContainer style={{ height: '100%' }} component={Paper}>
            <TableView
              tableHeaders={tableHeaders}
              properties={managedProperties}
              expanderTR={{
                comp: renderExpander,
                getter: expanderGetter
              }}
            />
          </TableContainer>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  // slates: state.slates,
  user: state.user
});


const mapDispatchToProps = (dispatch) => ({
  addSlate: (slate) => dispatch(addSlateAction(slate)),
  removeSlate: (slate) => dispatch(removeSlateAction(slate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RentalManagment);
/* eslint-enable */