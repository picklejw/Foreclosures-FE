import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@material-ui/core/Paper';

import throttle from 'lodash/throttle';
import TableView from '../TableView';

const NewProjectContainer = styled(Box)`
  overflow: hidden;

  .MuiTextField-root {
      margin: 10px;
  }

  .MuiGrid-root {
      padding: 10px;
  }


  .MuiFormControl-fullWidth {
    display: block;
    width: unset;
  }

`;

const Projects = (props) => {
  //   const [showNewForm, setShowNewForm] = useState();
  //   const [managedProperties, setManagedProperties] = useState([]);
  //   const { user } = props;
  const [projectList, setProjectList] = useState([]);
  const [showNew, setShowNew] = useState();
  const [value, setValue] = useState([]);
  useEffect(async () => {
    // const response = await getManagedOwned();
    // const mapped = Object.entries(response).map(([Address, otherData]) => ({
    //   Address,
    //   ...otherData,
    // }));
    // debugger;
  }, []);

  const renderProjectSearch = () => {

  };

  const renderProjectList = () => {
    if (projectList.length) {

    } else {
      return <Typography>You Have No Budgets, Add One Now!</Typography>;
    }
  };

  const renderAddProjectForm = () => {
    const [date, setDate] = useState();
    const [cost, setCost] = useState();

    if (showNew) {
      return (
        <NewProjectContainer className="NewProjectContainer">
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="Title"
          />
          <Box>
            <TextField
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              value={cost && new Intl.NumberFormat().format(cost)}
              onChange={({ currentTarget: { value } }) => {
                setCost(value.replace(/\,/g, ''));
              }}
              id="outlined-required"
              label="Cost"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                renderInput={(params) => <TextField {...params} />}
                value={date}
                label="Cost"
                onChange={(newValue) => setDate(newValue)}
              />
            </LocalizationProvider>
          </Box>

          <TextField
            required
            fullWidth
            id="outlined-required"
            label="Summary"
            multiline
            maxRows={4}
          />
          <Stack direction="row" spacing={2}>
            <Paper elevation={1} style={{ padding: 10 }}>Picturer</Paper>
            <Paper elevation={1} style={{ padding: 10 }}>Picturer</Paper>
          </Stack>
          <Button variant="contained">Add Recept Picture</Button>
        </NewProjectContainer>
      );
    }
    return <Button onClick={() => setShowNew(true)} variant="contained">Add New</Button>;
  };

  return (
    <>
      <div style={{ padding: 5 }}>
        {renderProjectList()}
      </div>
      <div style={{ paddingTop: 5 }}>
        {renderAddProjectForm()}
      </div>
    </>
  );
};

export default Projects;
