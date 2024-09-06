/* eslint-disable */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@material-ui/core/Paper';
import Stack from '@mui/material/Stack';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, } from '@fortawesome/free-solid-svg-icons';

import ProjectCard from './ProjectCard';
import { getManagedOwnedByAddress } from '../utils/apolloClient';

const ProjectsContainer = styled(Box)`
  overflow: hidden;

  .MuiTextField-root, button {
    margin: 5px 10px;
  }

  .MuiGrid-root {
      padding: 10px;
  }


  .MuiFormControl-fullWidth {
    display: block;
    width: unset;
  }

  .MuiAccordion-root {
    background-color: #0093E9;
    background-image: linear-gradient(225deg, #0093E9 0%, #42c9ab 75%);
    margin: 10px 0;
    color: #fff;

  }

`;

export const ProjectCardContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px !important;
  margin: 15px !important;
  width: 400px;
  height: 500px;

  .title-section {
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
    margin: 10px 0;

    .title {
      margin: 20px 10px;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .content-section {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
    > * {
      box-sizing: border-box;
     }
  }

  .new-proj-form {
    display: flex;
    flex-direction: column;
  }

  .MuiCollapse-root {
    overflow-y: auto;
    overflow-x: hidden;
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgb(255,153,51);
      border-radius: 5px;
    }
    
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: rgb(255,128,0);
    }
  }
`;

const Projects = (props) => {
  const { addSlate, removeSlate, instance } = props;
  const [projectList, setProjectList] = useState(instance?.data?.projects || {});
  const [showNew, setShowNew] = useState();
  const [value, setValue] = useState([]);

  const renderAddProjectForm = () => {
    const [newProjTitle, setNewProjTitle] = useState();
    if (showNew) {
      return (
        <ProjectCardContainer>
          <div className="title-section">
            <div className="title">New Project</div>
            <div>
              <DatePicker
                renderInput={(params) => <TextField {...params} />}
                value={(new Date())}
                label="Cost"
                onChange={(newValue) => setDate(newValue)}
              />
            </div>
          </div>
          <div className="new-proj-form">
            <TextField
              id="outlined-basic"
              label="Project Name"
              variant="outlined"
              value={newProjTitle}
              onChange={(e) => {
                setNewProjTitle(e.currentTarget.value);
              }}
            />
            <div>
              <Button
                onClick={() => {
                  props.instance.updateItem({
                    keyPath: ['projects'],
                    value: {
                      [`${newProjTitle}`]: {
                        completedTodos: {},
                        todos: {},
                      }
                    },
                    valueType: "object",
                    callback: (rental) => {
                      setProjectList(rental?.projects)
                    }
                  });
                }}
                variant="contained"
              >
                Add New
              </Button>
            </div>
          </div>
        </ProjectCardContainer>
      );
    }
    return (
      <ProjectCardContainer
        onClick={() => setShowNew(true)}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <FontAwesomeIcon style={{ fontSize: 200 }} icon={faPlus} />
      </ProjectCardContainer>
    );
  };

  const renderProjects = () => {
    const { instance: { data: { address, ...managmentData }, updateItem } } = props;
    const otherNotes = managmentData['Other Notes'];
    const renderPictureOrPlaceholder = () => {
    };

    if (!projectList.length) {
      return <Typography>You Have No Budgets, Add One Now!</Typography>;
    }

    return ( // ProjectCard
      <>
        {projectList.map(({ name, todos }) => <ProjectCard tasks={todos} title={name} updateItem={updateItem} addSlate={addSlate} removeSlate={removeSlate} />)}
      </>
    );
  };

  console.log('pjts')

  {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */ }
  return (
    <div style={{ padding: 5 }}>
      <ProjectsContainer>
        <Stack direction="row" spacing={2}>
          {renderProjects()}
          {renderAddProjectForm()}
        </Stack>
      </ProjectsContainer>
    </div>
  );
  {/* </LocalizationProvider> */ }
};
export default Projects;
/* eslint-enable */