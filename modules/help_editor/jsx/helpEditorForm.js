import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import Markdown from 'jsx/Markdown';
import Help from 'jsx/Help';
import swal from 'sweetalert2';
import {TextboxElement, TextareaElement} from 'jsx/Form';

/**
 * Help Editor Form Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Help Editor form page
 *
 * @author LORIS Team
 * @version 1.0.0
 */

const HelpEditorForm = (props) => {
  const [title, setTitle] = useState(props.title ?? '');
  const [content, setContent] = useState(props.content ?? '');
  const helpPreview = [];
  const helpContainers = document.getElementsByClassName('help-container');

  Array.from(helpContainers).forEach((helpContainer) => {
    helpPreview.push(createPortal(
      <Help
        testname={loris.TestName}
        subtest={loris.Subtest}
        baseURL={loris.BaseURL}
      >
          <h1>{title}</h1>
          <Markdown content={content} />
      </Help>,
      helpContainer
    ));
  });

  const onUserInput = (formElement, value) => {
    switch (formElement) {
      case 'title':
        setTitle(value);
        break;
      case 'content':
        setContent(value);
        break;
    }
  };

  /**
   * Save the form and display a success/error message
   */
  const save = () => {
    const formData = new FormData();
    formData.append('title', title ?? '');
    formData.append('content', content ?? '');
    formData.append('section', props.section ?? '');
    formData.append('subsection', props.subsection ?? '');
    formData.append('helpID', props.helpid ?? '');

    fetch(loris.BaseURL + '/help_editor/ajax/process.php', {
      method: 'POST',
      body: formData,
    }).then((response) => {
        if (response.status !== 200) {
          console.error(response.status);
          return;
        }
        swal.fire({
          title: 'Content update successful!',
          type: 'success',
          confirmButtonText: 'Close',
        });
    }).catch((error) => {
      console.error(error);
      swal.fire({
        title: 'Content update unsuccessful.',
        text: 'Something went wrong',
        type: 'error',
        confirmButtonText: 'Try again',
      });
    });
  };

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  return (
    <div className="panel panel-primary">
      <div className="panel-body">
        <div className="row">
          <div className="col-sm-9">
            <TextboxElement
              label='Title'
              name='title'
              value={title}
              onUserInput={onUserInput}
            />
            <TextareaElement
              label='Content'
              rows={15}
              name='content'
              value={content}
              onUserInput={onUserInput}
            />
            <div className="col-sm-9 col-sm-offset-3">
              <p><small>
                Open the help dialog to preview the changes.
              </small></p>
              <input
                className="btn btn-sm btn-primary"
                id="save-help"
                name="fire_away"
                value="Save"
                type="submit"
                onClick={save}
              />
            </div>
          </div>
        </div>
      </div>
      {helpPreview}
    </div>
  );
};

HelpEditorForm.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  section: PropTypes.string,
  subsection: PropTypes.string,
  helpid: PropTypes.string,
  url: PropTypes.string,
};

window.RHelpEditorForm = React.createFactory(HelpEditorForm);
