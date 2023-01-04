import swal from 'sweetalert2';
import React, {useState, useEffect} from 'react';
import {unmountComponentAtNode, createPortal} from 'react-dom';
import Help from 'jsx/Help';

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

  const returnLabel = 'Return to ' + props.module;
  const helpContainers = document.getElementsByClassName('help-container');

  useEffect(() => {
    Array.from(helpContainers).forEach((helpContainer) =>
      unmountComponentAtNode(helpContainer)
    );
  }, []);

  const helpPreview = [];
  Array.from(helpContainers).forEach((helpContainer) => {
    helpPreview.push(createPortal(
      <Help content={
        <>
          <h1>{title}</h1>
          {content}
        </>
      } />,
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
   * Reset the form
   */
  const reset = () => {
    setTitle(props.title ?? '');
    setContent(props.content ?? '');
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
            showCancelButton: true,
            confirmButtonText: returnLabel,
            cancelButtonText: 'Close',
        }).then((result) => {
            if (result.value) {
                location.href = document.referrer;
            }
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
                Use the help button to open the help dialog
                and preview the changes.
              </small></p>
              <input
                className="btn btn-sm btn-primary"
                id="save-help"
                name="fire_away"
                value="Save"
                type="submit"
                onClick={save}
              />
              <input
                type="button"
                name="reset"
                value="Reset"
                className="btn btn-sm btn-primary"
                onClick={reset}
              />
              <input
                className="btn btn-sm btn-primary"
                onClick={() => location.href=props.url}
                value={returnLabel}
                type="button"
              />
            </div>
          </div>
        </div>
      </div>
      {helpPreview}
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  ReactDOM.render(
    <HelpEditorForm {...app.dataset} />,
    document.getElementById('lorisworkspace')
  );
});
