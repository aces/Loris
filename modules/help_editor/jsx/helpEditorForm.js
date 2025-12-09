import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import Markdown from 'jsx/Markdown';
import Help from 'jsx/Help';
import swal from 'sweetalert2';
import {TextboxElement, TextareaElement} from 'jsx/Form';
import {SelectElement} from 'jsx/Form';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/help_editor.json';
import jaStrings from '../locale/ja/LC_MESSAGES/help_editor.json';
import frStrings from '../locale/fr/LC_MESSAGES/help_editor.json';

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
  const {t} = props;
  const [title, setTitle] = useState(props.title ?? '');
  const [content, setContent] = useState(props.content ?? '');
  const [instrument, setInstrument] = useState(props.instrument ?? '');
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
    case 'instrument':
      setInstrument(value);
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
    if (!props.helpid) {
      formData.append('new', 'true');
      formData.append('instrument', instrument ?? '');
    }
    fetch(loris.BaseURL + '/help_editor/ajax/process.php', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.status !== 200) {
        swal.fire({
          title: t('Content update unsuccessful.',
            {ns: 'help_editor'}),
          text: t('Help content cannot be added to an instrument '
           + 'that has already been registered.',
          {ns: 'help_editor'}),
          type: 'error',
          confirmButtonText: t('Try again', {ns: 'help_editor'}),
        });
        console.error(response.status);
        return;
      }
      swal.fire({
        title: t('Content update successful!',
          {ns: 'help_editor'}),
        type: 'success',
        confirmButtonText: t('Close', {ns: 'loris'}),
      });
    }).catch((error) => {
      console.error(error);
      swal.fire({
        title: t('Content update unsuccessful.',
          {ns: 'help_editor'}),
        text: t('Something went wrong', {ns: 'help_editor'}),
        type: 'error',
        confirmButtonText: t('Try again', {ns: 'help_editor'}),
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

            <SelectElement
              name='instrument'
              label={t('Instrument', {ns: 'loris', count: 1})}
              emptyOption={true}
              options={props.instrumentslist}
              onUserInput={onUserInput}
              value={instrument}
              disabled={props.helpid !== null}
            />
            <TextboxElement
              label={t('Title', {ns: 'help_editor'})}
              name='title'
              value={title}
              onUserInput={onUserInput}
            />
            <TextareaElement
              label={t('Content', {ns: 'help_editor'})}
              rows={15}
              name='content'
              value={content}
              onUserInput={onUserInput}
            />
            <div className="col-sm-9 col-sm-offset-3">
              <p><small>
                {t('Open the help dialog to preview the changes.',
                  {ns: 'help_editor'})}
              </small></p>
              <input
                className="btn btn-sm btn-primary"
                id="save-help"
                name="fire_away"
                value={t('Save', {ns: 'loris'})}
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
  helpid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  url: PropTypes.string,
  instrument: PropTypes.string,
  instrumentslist: PropTypes.objectOf(PropTypes.string),
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'help_editor', hiStrings);
  i18n.addResourceBundle('ja', 'help_editor', jaStrings);
  i18n.addResourceBundle('fr', 'help_editor', frStrings);
  i18n.changeLanguage(i18n.language || 'en');
});
window.RHelpEditorForm = React.createFactory(
  withTranslation(['help_editor'])(HelpEditorForm));
