import React from 'react';
import styled from 'styled-components';
import { Editor } from 'react-draft-wysiwyg';
import {
  convertToRaw, //EditorState, createWithContent, convertFromRaw,
} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Rnd } from 'react-rnd';

import { Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { addSlateAction, removeSlateAction } from '../actions';

const EditorContainer = styled(Paper)`
    position: relative;
    overflow: auto;

    height: 100%;
    cursor: auto;
`;

const PaperBar = styled('div')`
    cursor: move;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    background-color: #00A36C;
    color: #fff;
    
    > * {
        padding: 0 5px;
    }
`;

const getSaveString = (paramState) => JSON.stringify(convertToRaw(paramState.getCurrentContent()));

class DraggableSlate extends React.Component {
  constructor() {
    super();
    this.state = {
      resizeState: {},
      editorState: {},
    };
  }

  render() {
    const { slates, removeSlate } = this.props;
    const { resizeState, editorState } = this.state;
    return Object.entries(slates).map(([slateTitle = '', slateData = {}], i) => (
      <Rnd
        style={{ zIndex: 10 }}
        minWidth={500}
        minHeight={190}
        bounds="window"
        key={i}
        cancel=".rdw-editor-wrapper"
        size={{ width: resizeState[slateTitle]?.width, height: resizeState[slateTitle]?.height }}
        onResizeStop={(e, direction, ref, delta, position) => {
          resizeState[slateTitle] = {
            ...resizeState[slateTitle],
            width: ref.style.width,
            height: ref.style.height,
            ...position,
          };
          this.setState({ resizeState });
        }}
      >
        <EditorContainer onDragStart={(e) => e.preventDefault()} draggable="false">
          <div>
            <PaperBar>
              <FontAwesomeIcon
                icon={faCircleXmark}
                onClick={() => {
                  removeSlate(slateTitle);
                  const savedata = editorState[slateTitle] && getSaveString(editorState[slateTitle]);
                  slateData?.onClose(slateTitle, savedata);
                }}
              />
              {slateTitle}
            </PaperBar>
            <div style={{ padding: 20 }}>
              <Editor
                editorState={editorState[slateTitle] || slateData?.context}
                onEditorStateChange={(state) => {
                  const toSave = getSaveString(state);
                  slateData.contentUpdate(toSave);
                  editorState[slateTitle] = state;
                  this.setState({ editorState });
                }}
              />
            </div>
          </div>
        </EditorContainer>
      </Rnd>
    ));
  }
}

const mapStateToProps = (state) => ({
  slates: state.slates,
});

const mapDispatchToProps = (dispatch) => ({
  addSlate: (slate) => dispatch(addSlateAction(slate)),
  removeSlate: (slate) => dispatch(removeSlateAction(slate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DraggableSlate);
