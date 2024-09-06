import React, { useState } from "react";
import { ProjectCardContainer } from './Projects'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stack } from "@mui/material";
import styled from "styled-components";
import TextField from '@mui/material/TextField';
import { faArrowDown, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const TodoRow = styled(Stack)`
  border-bottom: 1px solid #000;
  justify-content: space-between;
  .row {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    :last-child, .MuiCheckbox-root {
      width: 42px;
    }
  }
`;

const ProjectCard = ({ tasks = [], title, updateItem, addSlate }) => { // removeSlate
  const [allTodos, setAllTodos] = useState(tasks) 
  const completedTodos = allTodos.filter(task => task.checked);
  const todos = allTodos.filter(task => !task.checked);
  const [expanded, setExpanded] = useState(null);
  const [newTodo, setNewTodo] = useState();


  console.log(completedTodos)
  console.log(completedTodos)

  const handleCardResizing = (target) => {
    // .Mui-expanded\
    const isOpening = target.offsetHeight === 0;
    const lookUpByClassName = (el, className) => {
      if (el.classList.contains(className)) {
        return el;
      }
      if (el.parentElement) {
        return lookUpByClassName(el.parentElement, className);
      }
    };
    const accordionEl = lookUpByClassName(target, 'MuiAccordion-root');
    const contentSectionEl = lookUpByClassName(accordionEl, 'content-section');
    const collapseEl = accordionEl.querySelector('.MuiCollapse-root');
    let otherElementsHeight = 20; // 20 is the accordians own margin
    for (let i = 0; i < contentSectionEl.childNodes.length; i++) {
      if (contentSectionEl.childNodes[i] !== accordionEl) {
        otherElementsHeight = contentSectionEl.childNodes[i].clientHeight + otherElementsHeight;
      } else {
        const accrodianHeaderHeight = accordionEl.querySelector('.MuiAccordionSummary-root').clientHeight;
        otherElementsHeight = accrodianHeaderHeight + otherElementsHeight;
      }
    }
    const doSizing = () => {
      const calcdHeight = contentSectionEl.clientHeight - otherElementsHeight;
      collapseEl.style.maxHeight = isOpening ? `${calcdHeight}px` : 'unset'; // need to calc
      collapseEl.style.overflowY = isOpening ? 'auto' : 'hidden';
    };
    if (!isOpening) {
      setTimeout(doSizing, collapseEl.style.transitionDuration.split('ms')[0]);
    } else {
      doSizing();
    }
  };

  console.log("pjtcrd")
  return (
    <ProjectCardContainer key={title} className="project-card" elevation={3}>
      <div className="title-section">
        <Typography>{title}</Typography>
        <Typography>Upcoming todo on [date]: [description]</Typography>
      </div>
      <div className="content-section">
        <Accordion
          expanded={expanded === 0}
          onChange={(e, open) => {
            // debugger;
            setExpanded(open ? 0 : null);
          }}
          TransitionProps={{
            mountOnEnter: true,
            addEndListener: (node, done) => {
              console.log(done)
              handleCardResizing(node, 0);
              // node.addEventListener('transitionend', () => {

              // });
            },
          }}
          disableGutters
          square
          className="accordion"
        >
          <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Completed Todos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {completedTodos.map(({name, checked}, key) => (
              <TodoRow key={key} direction="row" spacing={2}>
                <div className="row">
                  <Typography style={{ width: 120 }}>
                    8/24 5:57p
                  </Typography>
                </div>
                <div className="row">
                  <Typography>{name}</Typography>
                </div>
                <div className="row">
                  <Checkbox
                    edge="end"
                    onClick={() => { // // updateItem({ keyPath, value, valueType, callback, skipQuery }: UpdateItemParams<ModelT>) {
                      updateItem({
                        keyPath: ['projects', [{name: title}]],
                        value: [{
                          name: title,
                          todos: [{ name, checked: !checked }]
                        }],
                        callback: (rental) => {
                          const currentProject = rental?.projects.find(({name}) => name === title)
                          setAllTodos(currentProject?.todos)
                        }
                      })
                      // forceUpdate();
                    }}
                    checked={checked}
                  />
                </div>
              </TodoRow>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 1}
          onChange={(e, open) => {
            setExpanded(open ? 1 : null);
          }}
          TransitionProps={{
            mountOnEnter: true,
            addEndListener: (node, done) => {
              console.log(done)
              handleCardResizing(node, 1);
              // node.addEventListener('transitionend', () => {
              //   handleCardResizing(node, 0);
              // });
            },
          }}
          disableGutters
          square
        >
          <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Active Todos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {todos.map(({name, checked}, key) => {
              // const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <TodoRow key={key} direction="row" spacing={1}>
                  <div className="row">
                    <Typography style={{ width: 80 }}>
                      8/24 5:57p
                    </Typography>
                  </div>
                  <div className="row">
                    <Typography>{name}</Typography>
                  </div>
                  <div className="row">
                    <Checkbox
                      edge="end"
                      onChange={() => {
                        updateItem({
                          keyPath: ['projects', [{name: title}]],
                          value: [{
                            name: title,
                            todos: [{ name, checked: !checked }]
                          }],
                          callback: (rental) => {
                            const currentProject = rental?.projects.find(({name}) => name === title)
                            setAllTodos(currentProject?.todos)
                          }
                        })

                        
                        // forceUpdate();
                      }}
                      checked={checked}
                      inputProps={{ 'aria-labelledby': 'labelId' }}
                    />
                  </div>
                </TodoRow>
              );
            })}
          </AccordionDetails>
        </Accordion>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            position: 'absolute',
            bottom: 10,
            right: 10,
            left: 10,
          }}
        >
          <TextField
            id="outlined-basic"
            label="Add Todo"
            variant="outlined"
            value={newTodo}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                updateItem({
                  keyPath: ['projects', [{name: title}], 'todos'],
                  value: [{
                    name: title,
                    todos: [{ name: e?.target?.value, checked: false }]
                  }],
                  callback: (rental) => {
                    const currentProject = rental?.projects.find(({name}) => name === title)
                    setAllTodos(currentProject?.todos)
                    console.log(rental)
                  }
                });
                // forceUpdate();
              }
            }}
            onChange={(e) => {
              setNewTodo(e.target.value);
            }}
            style={{ width: '100%' }}
          />
          <div
            onClick={() => {
              addSlate({
                title,
                onClose: () => {},
                contentUpdate: (nNote) => {
                  // needs fixing...
                  updateItem({
                    keyPath: ['projects',[{ name: title }], 'notes'],
                    value: nNote,
                    callback: (rental) => {
                      console.log(rental)
                      debugger
                    }
                  });
                },
                context: null,
              });
            }}
            style={{
              width: 15,
              margin: 10,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <FontAwesomeIcon
              style={{ width: '100%' }}
              size="lg"
              icon={faArrowUpRightFromSquare}
            />
          </div>
        </div>
      </div>
    </ProjectCardContainer>
  );
}

export default ProjectCard