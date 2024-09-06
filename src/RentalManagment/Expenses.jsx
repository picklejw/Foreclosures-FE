import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@material-ui/core/Paper';
import Stack from '@mui/material/Stack';

// import throttle from 'lodash/throttle';
// import { ImageSearch } from '@material-ui/icons';
import Carousel from 'react-material-ui-carousel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // faCircleArrowRight
import { faCamera, faImage, faPlus } from '@fortawesome/free-solid-svg-icons';
// import TableView from '../TableView';

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

  .forms {
    display: flex;
    flex-wrap: wrap;

  }

`;

const ImagePicker = styled(Paper)`
    margin: 15px !important;
    width: 200px;
    height: 240px;
    text-align: center;
    display: flex;
    flex-direction: column;

    .new-placeholder {
      display: flex;
      flex: 1;
      align-items: center;
       
      svg {
        margin: 0 auto;
        display: block;
        font-size: 100px;
      }
    }

    .image-container {
      flex: 1;
      box-shadow: 0px 0px 2px 1px #000000;
      margin: 10px;
    }

    .new-title {
      display: flex;
      width: 100%;
      height: 25px;

      .title {
        flex: 1;
        height: 20px;
        font-weight: 800;
        overflow: hidden;
      }

      img {
        width: 20px;
        height: 20px;
        margin: 0 5px;
      }
    }

 `;

const CarouselContainer = styled(Carousel)`
    > * {
      display: inline-block;
    }
 `;

let newImgTitle = '';

const Expenses = (props) => {
  // const [projectList, setProjectList] = useState([]);
  const [images, setImages] = useState([{ title: 'Front' }, { title: 'Back' }]); // can set default state when existing too.
  const [showNew, setShowNew] = useState();
  // const [value, setValue] = useState([]);
  // useEffect(async () => {
  //   // const response = await getManagedOwned();
  //   // const mapped = Object.entries(response).map(([Address, otherData]) => ({
  //   //   Address,
  //   //   ...otherData,
  //   // }));
  //   // debugger;
  // }, []);

  const renderProjectList = () => {
    // if (projectList.length) {

    // } else {
    //   return <Typography>You Have No Expenses, Add One Now!</Typography>;
    // }
  };

  const renderUploadImageContainer = () => {
    const addNewImage = () => {
      setImages([...images, {
        title: newImgTitle,
      }]);
    };

    return (
      <CarouselContainer>
        {images.map(({ title }) => (
          <>
            <ImagePicker elevation={3}>
              <Stack className="image-container" direction="row" divider={<Divider orientation="vertical" flexItem justifyContent="space-evenly" alignItems="center" />}>
                <div style={{ flex: 1, alignSelf: 'center' }}>
                  <FontAwesomeIcon icon={faCamera} />
                </div>
                <div style={{ flex: 1, alignSelf: 'center' }}>
                  <FontAwesomeIcon icon={faImage} />
                </div>
              </Stack>
              <div className="new-title">
                <div className="title">{title}</div>
              </div>
            </ImagePicker>
          </>
        ))}
        <ImagePicker
          onClick={(e) => {
            const newTitleEl = e.currentTarget.querySelector('.title');
            newTitleEl.focus();
          }}
          elevation={3}
        >
          <div className="new-placeholder">
            <FontAwesomeIcon size="lg" icon={faPlus} />
          </div>
          <div className="new-title">
            <div
              contentEditable="true"
              onInput={({ target }) => {
                let oldString = `${target.innerText}`;
                newImgTitle = target.innerText;
                // intercept enter key as submission
                while (target.scrollHeight > target.clientHeight || target.scrollWidth > target.clientWidth) {
                  oldString = oldString.slice(0, -1);
                  target.innerText = oldString;
                }
              }}
              className="title"
            >
              [ New Image Name ]
            </div>
            <img src="/assets/svgs/circleRightArrow.svg" onClick={addNewImage} />

          </div>
        </ImagePicker>
      </CarouselContainer>
    );
  };

  const renderAddProjectForm = () => {
    const [date, setDate] = useState();
    const [cost, setCost] = useState();

    // const renderPictureOrPlaceholder = () => {

    // };

    if (showNew) {
      return (
        <NewProjectContainer className="NewProjectContainer">
          <div className="forms">
            <div className="metadata">
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
            </div>
            <div className="upload-container">
              {renderUploadImageContainer()}

            </div>
          </div>
          <Button
            onClick={() => {
              props.instance.updateItem(['projects', newProjTitle], {
                completedTodos: {},
                todos: {},
              });
            }}
            variant="contained"
          >
            Add Expense
          </Button>
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

export default Expenses;
