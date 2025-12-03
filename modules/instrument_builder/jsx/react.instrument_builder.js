import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs, TabPane} from 'Tabs';
import {withTranslation} from 'react-i18next';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/instrument_builder.json';
import jaStrings from '../locale/ja/LC_MESSAGES/instrument_builder.json';
/* global Instrument */
/* exported RInstrumentBuilderApp */

/**
 * This file contains the React classes for instrument builder
 * module.
 */

/**
 * This is the React class for loading in a previously
 * made instrument.
 */
class LoadPane extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      // This is used to alert the user if the file was
      // loaded successfully or there was an error with
      // the loading.
      alert: '',
    };
    this.chooseFile = this.chooseFile.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.resetAlert = this.resetAlert.bind(this);
    this.loadFile = this.loadFile.bind(this);
  }

  /**
   * Choose file
   * Indicates to the state which file has been chosen
   *
   * @param {object} e - Event object
   */
  chooseFile(e) {
    const {t} = this.props;
    let value = e.target.files[0];

    if (value) {
      const fileName = value.name;
      const allowedExtension = '.linst';

      // Extract file name (without extension) and extension
      const lastDotIndex = fileName.lastIndexOf('.');
      const nameWithoutExtension = fileName.substring(0, lastDotIndex);
      const fileExtension = fileName.substring(lastDotIndex);

      // Only allow letters, numbers, and underscores (_)
      const validNamePattern = /^[a-zA-Z0-9_]+$/;
      // File Name cannot be end with Special characters
      const invalidTrailingChars = /[^a-zA-Z0-9]$/;

      let errorMessage = '';

      if (fileExtension !== allowedExtension) {
        errorMessage = t('Invalid extension. Only .linst files are allowed.',
          {ns: 'instrument_builder'});
      } else if (/\s/.test(nameWithoutExtension)) {
        errorMessage = t('Spaces are not allowed in the file name.',
          {ns: 'instrument_builder'});
      } else if ((nameWithoutExtension.match(/\./g) || []).length > 0) {
        errorMessage = t('Multiple periods in the file name are not allowed.',
          {ns: 'instrument_builder'});
      } else if (!validNamePattern.test(nameWithoutExtension)) {
        errorMessage = t(
          'Special characters are not allowed (only letters, numbers, and _).',
          {ns: 'instrument_builder'}
        );
      } else if (invalidTrailingChars.test(nameWithoutExtension)) {
        errorMessage = t('File name cannot end with a special character.',
          {ns: 'instrument_builder'});
      }

      if (errorMessage) {
        this.setState({
          alert: 'typeError',
          alertMessage: errorMessage, // Set the specific error message
          disabled: true, // Disable button if invalid
        });
      } else {
        this.setState({
          file: value, // Store file
          disabled: false, // Enable button if valid
          alert: '', // Clear previous errors
        });
      }
    }
  }
  /**
   * Sets the alert to the specified type.
   *
   * @param {*} type
   * @param {string} message
   */
  setAlert(type, message) {
    this.setState({
      alert: type,
      alertMessage: message,
    });
  }

  /**
   * Reset the alert to empty.
   */
  resetAlert() {
    this.setState({
      alert: '',
      alertMessage: '',
    });
  }

  /**
   * Loads the specified file into builder tab.
   */
  loadFile() {
    // Declare the success and error callbacks
    let callback = {
      success: this.props.loadCallback,
      error: this.setAlert,
    };
    Instrument.load(this.state.file, callback);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let alert = {
      message: '',
      details: '',
      display: 'none',
    };
    // Set up declared alerts, if there is any.
    switch (this.state.alert) {
    case 'success':
      alert = {
        message: t('Success!', {ns: 'loris'}),
        details: t('Instrument Loaded', {ns: 'instrument_builder'}),
        display: 'block',
        class: 'alert alert-success alert-dismissible',
      };
      break;
    case 'typeError':
      alert = {
        message: t('Error!', {ns: 'loris'}),
        details: this.state.alertMessage,
        display: 'block',
        class: 'alert alert-danger alert-dismissible',
      };
      break;
    case 'duplicateEntry':
      alert = {
        message: t('Error!', {ns: 'loris'}),
        details: this.state.alertMessage,
        display: 'block',
        class: 'alert alert-danger alert-dismissible',
      };
      break;
    default:
      break;
    }
    return (
      <TabPane
        Title={t('Load Instrument', {ns: 'instrument_builder'})}
        {...this.props}
      >
        <div className='col-sm-6 col-xs-12'>
          <div id='load_alert'
            style={{display: alert.display}}
            className={alert.class}
            role='alert'
          >
            <button type='button' className='close' onClick={this.resetAlert}>
              <span aria-hidden='true'>&times;</span>
            </button>
            <strong>{alert.message}</strong><br/>
            {alert.details}
          </div>
          <input
            className='fileUpload'
            type='file' id='instfile'
            onChange={this.chooseFile}
          />
          <input
            className='btn btn-primary spacingTop'
            type='button' id='load'
            value={t('Load Instrument', {ns: 'instrument_builder'})}
            disabled={this.state.disabled}
            onClick={this.loadFile}
          />
        </div>
      </TabPane>
    );
  }
}
LoadPane.propTypes = {
  loadCallback: PropTypes.func,
  t: PropTypes.func,
};

/**
 * This is the React class for saving the instrument
 */
class SavePane extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      instrumentName: '',
    };
    this.loadState = this.loadState.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeInst = this.onChangeInst.bind(this);
  }

  /**
   * Load state
   * Used to set the state when a file is loaded
   * using the load tab.
   *
   * @param {object} newState
   */
  loadState(newState) {
    this.setState({
      fileName: newState.fileName,
      instrumentName: newState.instrumentName,
    });
  }

  /**
   * On change file
   * Keep track of the file name, saving it in the state
   *
   * @param {object} e - Event object
   */
  onChangeFile(e) {
    let value = e.target.value;
    this.setState({
      fileName: value,
    });
  }

  /**
   * On change instrument
   * Keep track of the instrument name, saving it in the state
   *
   * @param {object} e - Event object
   */
  onChangeInst(e) {
    let value = e.target.value;
    this.setState({
      instrumentName: value,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let value = this.state.fileName;
    return (
      <TabPane
        Title={t('Save Instrument', {ns: 'instrument_builder'})}
        {...this.props}
      >
        <div className='form-group'>
          <div className='col-xs-12'>
            <label className='col-sm-2 control-label'>
              {t('Filename:', {ns: 'instrument_builder'})}{' '}
            </label>
            <div className='col-sm-4'>
              <input className='form-control'
                type='text' id='filename'
                value={value}
                onChange={this.onChangeFile}
              />
            </div>
          </div>
          <div className='col-xs-12 spacingTop'>
            <label className='col-sm-2 control-label'>
              {t('Instrument Name:', {ns: 'instrument_builder'})}{' '}
            </label>
            <div className='col-sm-4'>
              <input className='form-control'
                type='text' id='longname'
                value={this.state.instrumentName}
                onChange={this.onChangeInst}
              />
            </div>
          </div>
          <div className='col-xs-12 spacingTop'>
            <div className='col-xs-12 col-sm-4 col-sm-offset-2'>
              <input className='btn btn-primary col-xs-12'
                type='submit' value={t('Save', {ns: 'loris'})}
                onClick={this.props.save}
              />
            </div>
          </div>
        </div>
      </TabPane>
    );
  }
}
SavePane.propTypes = {
  save: PropTypes.func,
  t: PropTypes.func,
};

/**
 * This is the React class displaying the questions
 * in the table.
 */
class DisplayElements extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getPlaceholder = this.getPlaceholder.bind(this);
    this.getTableRow = this.getTableRow.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.tableRows = this.tableRows.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
  }

  /**
   * Get placeholder
   * Used for the drag and drop rows
   *
   * @return {object} - A <tr> DOM element
   */
  getPlaceholder() {
    if (!this.placeholder) {
      let tr = document.createElement('tr');
      tr.className = 'placeholder';
      let td = document.createElement('td');
      td.colSpan = 2;
      const {t} = this.props;
      td.appendChild(
        document.createTextNode(t('Drop here', {ns: 'instrument_builder'}))
      );
      tr.appendChild(td);
      this.placeholder = tr;
    }
    return this.placeholder;
  }

  /**
   * Get table row
   * Used for the drag and drop rows
   *
   * @param {object} element
   * @return {object} - A <tr> DOM element
   */
  getTableRow(element) {
    if (element.tagName === 'tr') {
      return element;
    }
    return element.closest('tr');
  }

  /**
   * Drag start
   * Used for the drag and drop rows
   *
   * @param {object} e - Event object
   */
  dragStart(e) {
    this.dragged = this.getTableRow(e.currentTarget);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData('text/html', e.currentTarget);
  }

  /**
   * Drag end
   * Used for the drag and drop rows
   *
   * @param {object} e - Event object
   */
  dragEnd(e) {
    this.dragged.style.display = 'table-row';
    this.dragged.parentNode.removeChild(this.getPlaceholder());

    // Update data
    let data = this.props.elements;
    let from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);
    if (from < to) to--;
    if (this.nodePlacement === 'after') to++;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({
      data: data,
    });
  }

  /**
   * Drag over
   * Used for the drag and drop rows
   *
   * @param {object} e - Event object
   */
  dragOver(e) {
    e.preventDefault();
    let targetRow = this.getTableRow(e.target);

    this.dragged.style.display = 'none';
    if (targetRow.className === 'placeholder') return;
    this.over = targetRow;
    // Inside the dragOver method
    let relY = e.pageY -
               (window.innerHeight - this.over.getBoundingClientRect().top);

    let height = this.over.offsetHeight / 2;
    let parent = targetRow.parentNode;

    if (relY >= height) {
      this.nodePlacement = 'after';
      parent.insertBefore(this.getPlaceholder(), targetRow.nextElementSibling);
    } else { // relY < height
      this.nodePlacement = 'before';
      parent.insertBefore(this.getPlaceholder(), targetRow);
    }
  }

  /**
   * Create table rows
   *
   * @return {JSX} - React markup for the component
   */
  tableRows() {
    return this.props.elements.map(function(element, i) {
      let row;
      let colStyles = {wordWrap: 'break-word'};
      if (element.editing) {
        // If you are editing an element, show element as an AddElement object
        row = (
          <tr data-id={i}
            key={i}
            draggable={this.props.draggable}
            onDragEnd={this.dragEnd}
            onDragStart={this.dragStart}
          >
            <td className="col-xs-2" colSpan="3">
              <AddElement
                updateQuestions={this.props.updateElement}
                element={element} index={i}
              />
            </td>
          </tr>
        );
      } else {
        // Else display element in regular way
        row = (
          <tr data-id={i}
            key={i}
            draggable={this.props.draggable}
            onDragEnd={this.dragEnd}
            onDragStart={this.dragStart}>
            <td style={colStyles}>
              {element.Name}
            </td>
            <td style={colStyles}>
              <LorisElement element={element}/>
            </td>
            <td style={colStyles}>
              <button onClick={this.props.editElement.bind(null, i)}
                className="button"
              >
                {this.props.t('Edit', {ns: 'instrument_builder'})}
              </button>
              <button onClick={this.props.deleteElement.bind(null, i)}
                className="button"
              >
                {this.props.t('Delete', {ns: 'instrument_builder'})}
              </button>
            </td>
          </tr>
        );
      }
      return row;
    }.bind(this));
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    // Set fixed layout to force column widths to be based on first row
    const tableStyles = {
      tableLayout: 'fixed',
    };

    const tableRows = this.tableRows();

    return (
      <table id='sortable' className='table table-hover' style={tableStyles}>
        <thead>
          <tr>
            <th className='col-xs-2'>
              {t('Database Name', {ns: 'instrument_builder'})}
            </th>
            <th className='col-xs-6'>
              {t('Question Display (Front End)', {ns: 'instrument_builder'})}
            </th>
            <th className='col-xs-4'>
              {t('Edit', {ns: 'instrument_builder'})}
            </th>
          </tr>
        </thead>
        <tbody onDragOver={this.dragOver}>
          {tableRows}
        </tbody>
      </table>
    );
  }
}
DisplayElements.propTypes = {
  draggable: PropTypes.bool,
  updateElement: PropTypes.func,
  editElement: PropTypes.func,
  deleteElement: PropTypes.func,
  elements: PropTypes.array,
  t: PropTypes.func,
};

/**
 * This is the React class for building the instrument
 */
class BuildPane extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      // Keep track of the page groups
      Elements: [{
        Type: 'ElementGroup',
        GroupType: 'Page',
        Description: 'Top',
        // Keep track of the elements on the page
        Elements: [],
      }],
      // Keep track if elements are being edited to ensure
      // that drag and drop is not usable if any are being
      // edited
      amountEditing: 0,
      // Keep track of which page you are on
      currentPage: 0,
      // Keep track of elements DB names to ensure no doubles
      // are added
      elementDBNames: {},
    };
    this.loadElements = this.loadElements.bind(this);
    this.editElement = this.editElement.bind(this);
    this.deleteElement = this.deleteElement.bind(this);
    this.updateElement = this.updateElement.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.addPage = this.addPage.bind(this);
    this.selectPage = this.selectPage.bind(this);
  }

  /**
   * Load elements
   * Load in a group of elements, replacing any that
   * were already present
   *
   * @param {object[]} elements
   */
  loadElements(elements) {
    // Populate existing DB names
    let elContent = elements[this.state.currentPage].Elements;
    let elNames = {};
    elContent.forEach(function(el) {
      elNames[el.Name] = '';
    });

    this.setState({
      Elements: elements,
      elementDBNames: elNames,
    });
  }

  /**
   * Set the element editing flag to true to render the element
   * as an AddQuestion object. Increase the number of editing to
   * disable drag and drop
   *
   * @param {number} elementIndex
   */
  editElement(elementIndex) {
    // Use a function to update the state to enqueue an atomic
    // update that consults the previous value of state before
    // setting any values
    this.setState(function(state) {
      let temp = state.Elements;
      let edit = state.amountEditing + 1;
      let dbNames = state.elementDBNames;
      delete dbNames[temp[state.currentPage].Elements[elementIndex].Name];
      temp[state.currentPage].Elements[elementIndex].editing = true;
      return {
        Elements: temp,
        amountEditing: edit,
        elementDBNames: dbNames,
      };
    });
  }

  /**
   * Delete element
   * Remove an element from the current page's elements.
   *
   * @param {number} elementIndex
   */
  deleteElement(elementIndex) {
    // Use a function to update the state to enqueue an atomic
    // update that consults the previous value of state before
    // setting any values
    this.setState(function(state) {
      let temp = state.Elements;
      let dbNames = state.elementDBNames;
      delete dbNames[temp[state.currentPage].Elements[elementIndex].Name];
      temp[state.currentPage].Elements.splice(elementIndex, 1);
      return {
        Elements: temp,
      };
    });
  }

  /**
   * Update an element.
   *
   * @param {object} element
   * @param {number} index
   * @return {boolean} - true on success, false otherwise
   */
  updateElement(element, index) {
    if (element.Name && element.Name in this.state.elementDBNames) {
      // If the DB name already exists return false.
      return false;
    }
    // Use a function to update the state to enqueue an atomic
    // update that consults the previous value of state before
    // setting any values
    this.setState(function(state) {
      let temp = state.Elements;
      // Decrement the editing count
      let edit = state.amountEditing - 1;
      let dbNa = state.elementDBNames;
      temp[state.currentPage].Elements[index] = element;
      if (element.Name) {
        // Add the DB name to the list of current names
        dbNa[element.Name] = '';
      }
      return {
        Elements: temp,
        amountEditing: edit,
        elementDBNames: dbNa,
      };
    });
    return true;
  }
  /**
   * Add a new question to the page's elements
   *
   * @param {object} element
   * @return {object}
   */
  addQuestion(element) {
    if (element.Name && element.Name in this.state.elementDBNames) {
      // If the DB name already exists return false.
      return false;
    }
    // Use a function to update the state to enqueue an atomic
    // update that consults the previous value of state before
    // setting any values
    this.setState(function(state) {
      let temp = state.Elements;
      let dbNa = state.elementDBNames;
      if (element.Name) {
        // Add the DB name to the list of current names
        dbNa[element.Name] = '';
      }
      temp[state.currentPage].Elements.push(element);
      return {
        Elements: temp,
        elementDBNames: dbNa,
      };
    });
    return true;
  }

  /**
   * Add a new page
   *
   * @param {string} pageName
   */
  addPage(pageName) {
    // Use a function to update the state to enqueue an atomic
    // update that consults the previous value of state before
    // setting any values
    this.setState(function(state) {
      let temp = state.Elements;
      // change the current page to the new one
      let page = state.currentPage + 1;
      temp.push({
        Type: 'ElementGroup',
        GroupType: 'Page',
        Description: pageName,
        Elements: [],
      });
      return {
        Elements: temp,
        currentPage: page,
      };
    });
  }

  /**
   * Change to a page
   *
   * @param {number} index
   */
  selectPage(index) {
    this.setState({
      currentPage: index,
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let draggable = this.state.amountEditing === 0;
    // List the pages
    const {t} = this.props;
    let pages = this.state.Elements.map(function(element, i) {
      const description = this.state.Elements[i].Description;
      const translatedDescription = description === 'Top' ?
        t('Top', {ns: 'instrument_builder'}) :
        description;
      return (
        <li key={i} onClick={this.selectPage.bind(null, i)}>
          <a>{translatedDescription}</a>
        </li>
      );
    }.bind(this));

    return (
      <TabPane
        Title={t('Build Instrument', {ns: 'instrument_builder'})}
        {...this.props}
      >
        <div className='form-group col-xs-12'>
          <label htmlFor='selected-input'
            className='col-xs-2 col-sm-1 control-label'
          >{t('Page:', {ns: 'instrument_builder'})}</label>
          <div className='col-sm-4'>
            <div className='btn-group'>
              <button id='selected-input'
                type='button'
                className='btn btn-default dropdown-toggle'
                data-toggle='dropdown'
              >
                <span id='search_concept'>
                  {this.state.Elements[this.state.currentPage].Description ===
                    'Top' ?
                    t('Top', {ns: 'instrument_builder'}) :
                    this.state.Elements[this.state.currentPage].Description}
                </span>
                <span className='caret'/>
              </button>
              <ul className='dropdown-menu' role='menu'>
                {pages}
              </ul>
            </div>
          </div>
        </div>
        <TranslatedDisplayElements
          elements={this.state.Elements[this.state.currentPage].Elements}
          editElement={this.editElement}
          deleteElement={this.deleteElement}
          updateElement={this.updateElement}
          draggable = {draggable}
        />
        <div className='row'>
          <AddElement
            updateQuestions={this.addQuestion}
            addPage={this.addPage}
          />
        </div>
      </TabPane>
    );
  }
}
BuildPane.propTypes = {
  t: PropTypes.func,
};

const TranslatedDisplayElements = withTranslation(
  ['instrument_builder', 'loris']
)(DisplayElements);

/**
 * This is the React class for the instrument builder
 */
class InstrumentBuilderApp extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {

    };
    this.saveInstrument = this.saveInstrument.bind(this);
    this.loadCallback = this.loadCallback.bind(this);
  }

  /**
   * Save the instrument
   */
  saveInstrument() {
    // Call to external function, passing it the save information and the elements
    // to save
    Instrument.save(
      this.refs.savePane.state,
      this.refs.buildPane.state.Elements
    );
  }

  /**
   * Load an instrument
   *
   * @param {*} elements
   * @param {*} info
   */
  loadCallback(elements, info) {
    // Set the savePane state to that extracted from the file
    this.refs.savePane.loadState(info);
    // Set the buildPane elements to the rendered elements
    this.refs.buildPane.loadElements(elements);
    // Set the alert state to success in the loadPane
    this.refs.loadPane.setAlert('success');
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    let tabs = [];
    tabs.push(
      <LoadPane
        TabId='Load'
        ref='loadPane'
        loadCallback={this.loadCallback}
        t={t}
        key={1}
      />
    );
    tabs.push(
      <BuildPane
        TabId='Build'
        ref='buildPane'
        t={t}
        key={2}
      />
    );
    tabs.push(
      <SavePane
        TabId='Save'
        ref='savePane'
        save={this.saveInstrument}
        t={t}
        key={3}
      />
    );

    let tabList = [
      {
        id: 'Load',
        label: t('Load', {ns: 'instrument_builder'}),
      },
      {
        id: 'Build',
        label: t('Build', {ns: 'instrument_builder'}),
      },
      {
        id: 'Save',
        label: t('Save', {ns: 'loris'}),
      },
    ];

    return (
      <div>
        <Tabs tabs={tabList} defaultTab='Build'>
          {tabs}
        </Tabs>
      </div>
    );
  }
}
InstrumentBuilderApp.propTypes = {
  t: PropTypes.func,
};

// Add resource bundle for Hindi translations at module load time
i18n.addResourceBundle('hi', 'instrument_builder', hiStrings);
i18n.addResourceBundle('ja', 'instrument_builder', jaStrings);

const TranslatedInstrumentBuilderApp = withTranslation(
  ['instrument_builder', 'loris']
)(InstrumentBuilderApp);

let RInstrumentBuilderApp = React.createFactory(TranslatedInstrumentBuilderApp);

window.RInstrumentBuilderApp = RInstrumentBuilderApp;

export default TranslatedInstrumentBuilderApp;
