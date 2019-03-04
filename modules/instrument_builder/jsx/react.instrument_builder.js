import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs, TabPane} from 'Tabs';
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

  // Indicates to the state which file has been chosen
  chooseFile(e) {
    let value = e.target.files[0];
    this.setState({
      file: value,
      disabled: true,
      alert: '',
    });
    if (value) {
      this.setState({disabled: false});
    }
  }
  // Sets the alert to the specified type.
  setAlert(type, message) {
    this.setState({
      alert: type,
      alertMessage: message,
    });
  }
  // Reset the alert to empty.
  resetAlert() {
    this.setState({
      alert: '',
      alertMessage: '',
    });
  }
  // Loads the specified file into builder tab.
  loadFile() {
    // Declare the success and error callbacks
    let callback = {
      success: this.props.loadCallback,
      error: this.setAlert,
    };
    Instrument.load(this.state.file, callback);
  }
  // Render the HTML
  render() {
    let alert = {
      message: '',
      details: '',
      display: 'none',
    };
    // Set up declared alerts, if there is any.
    switch (this.state.alert) {
      case 'success':
        alert = {
          message: 'Success!',
          details: 'Instrument Loaded',
          display: 'block',
          class: 'alert alert-danger alert-dismissible',
        };
        break;
      case 'typeError':
        alert = {
          message: 'Error!',
          details: 'Wrong file format',
          display: 'block',
          class: 'alert alert-danger alert-dismissible',
        };
        break;
      case 'duplicateEntry':
        alert = {
          message: 'Error!',
          details: this.state.alertMessage,
          display: 'block',
          class: 'alert alert-success alert-dismissible',
        };
        break;
      default:
        break;
    }
    return (
      <TabPane Title='Load Instrument' {...this.props}>
        <div className='col-sm-6 col-xs-12'>
          <div id='load_alert' style={{display: alert.display}} className={alert.class} role='alert'>
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
            value='Load Instrument'
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
};

/**
 * This is the React class for saving the instrument
 */
class SavePane extends Component {
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

  // Used to set the state when a file is loaded
  // using the load tab.
  loadState(newState) {
    this.setState({
      fileName: newState.fileName,
      instrumentName: newState.instrumentName,
    });
  }
  // Keep track of the file name, saving it in the state
  onChangeFile(e) {
    let value = e.target.value;
    this.setState({
      fileName: value,
    });
  }
  // Keep track of the instrument name, saving it in the state
  onChangeInst(e) {
    let value = e.target.value;
    this.setState({
      instrumentName: value,
    });
  }
  // Render the HTML
  render() {
    let value = this.state.fileName;
    return (
      <TabPane Title='Save Instrument' {...this.props}>
        <div className='form-group'>
          <div className='col-xs-12'>
            <label className='col-sm-2 control-label'>Filename: </label>
            <div className='col-sm-4'>
              <input className='form-control'
                     type='text' id='filename'
                     value={value}
                     onChange={this.onChangeFile}
              />
            </div>
          </div>
          <div className='col-xs-12 spacingTop'>
            <label className='col-sm-2 control-label'>Instrument Name: </label>
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
                     type='submit' value='Save'
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
};

/**
 * This is the React class displaying the questions
 * in the table.
 */
class DisplayElements extends Component {
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
  // Used for the drag and drop rows
  getPlaceholder() {
    if (!this.placeholder) {
      let tr = document.createElement('tr');
      tr.className = 'placeholder';
      let td = document.createElement('td');
      td.colSpan = 2;
      td.appendChild(document.createTextNode('Drop here'));
      tr.appendChild(td);
      this.placeholder = tr;
    }
    return this.placeholder;
  }
  // Used for the drag and drop rows
  getTableRow(element) {
    if (element.tagName === 'tr') {
      return element;
    }

    return $(element).closest('tr')[0];
  }
  // Used for the drag and drop rows
  dragStart(e) {
    this.dragged = this.getTableRow(e.currentTarget);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data to be set
    e.dataTransfer.setData('text/html', e.currentTarget);
  }
  // Used for the drag and drop rows
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
  // Used for the drag and drop rows
  dragOver(e) {
    e.preventDefault();
    let targetRow = this.getTableRow(e.target);

    this.dragged.style.display = 'none';
    if (targetRow.className === 'placeholder') return;
    this.over = targetRow;
    // Inside the dragOver method
    let relY = e.pageY - $(this.over).offset().top;
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
  // Create table rows
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
              <button onClick={this.props.editElement.bind(null, i)} className="button">
                Edit
              </button>
              <button onClick={this.props.deleteElement.bind(null, i)} className="button">
                Delete
              </button>
            </td>
          </tr>
        );
      }
      return row;
    }.bind(this));
  }

  // Render the HTML
  render() {
    // Set fixed layout to force column widths to be based on first row
    const tableStyles = {
      tableLayout: 'fixed',
    };

    const tableRows = this.tableRows();

    return (
      <table id='sortable' className='table table-hover' style={tableStyles}>
        <thead>
        <tr>
          <th className='col-xs-2'>Database Name</th>
          <th className='col-xs-6'>Question Display (Front End)</th>
          <th className='col-xs-4'>Edit</th>
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
  editElement: PropTypes.func,
  deleteElement: PropTypes.func,
};

/**
 * This is the React class for building the instrument
 */
class BuildPane extends Component {
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
  // Load in a group of elements, replacing any that
  // were already present
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
  // Set the element editing flag to true to render the element
  // as an AddQuestion object. Increase the number of editing to
  // disable drag and drop
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
  // Remove an element from the current page's elements.
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
  // Update an element. Returns true on success, false otherwise
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
  // Add a new question to the page's elements
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
  // Add a new page
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
  // Change to a page
  selectPage(index) {
    this.setState({
      currentPage: index,
    });
  }
  // Render the HTML
  render() {
    let draggable = this.state.amountEditing === 0;
    // List the pages
    let pages = this.state.Elements.map(function(element, i) {
      return (
        <li key={i} onClick={this.selectPage.bind(null, i)}>
          <a>{this.state.Elements[i].Description}</a>
        </li>
      );
    }.bind(this));

    return (
      <TabPane Title='Build Instrument' {...this.props}>
        <div className='form-group col-xs-12'>
          <label htmlFor='selected-input' className='col-xs-2 col-sm-1 control-label'>Page:</label>
          <div className='col-sm-4'>
            <div className='btn-group'>
              <button id='selected-input' type='button' className='btn btn-default dropdown-toggle' data-toggle='dropdown'>
                <span id='search_concept'>{this.state.Elements[this.state.currentPage].Description}</span>
                <span className='caret'/>
              </button>
              <ul className='dropdown-menu' role='menu'>
                {pages}
              </ul>
            </div>
          </div>
        </div>
        <DisplayElements
          elements={this.state.Elements[this.state.currentPage].Elements}
          editElement={this.editElement}
          deleteElement={this.deleteElement}
          updateElement={this.updateElement}
          draggable = {draggable}
        />
        <div className='row'>
          <AddElement updateQuestions={this.addQuestion} addPage={this.addPage}/>
        </div>
      </TabPane>
    );
  }
}
BuildPane.propTypes = {
};

/**
 * This is the React class for the instrument builder
 */
class InstrumentBuilderApp extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.saveInstrument = this.saveInstrument.bind(this);
    this.loadCallback = this.loadCallback.bind(this);
  }

  // Save the instrument
  saveInstrument() {
    // Call to external function, passing it the save information and the elements
    // to save
    Instrument.save(this.refs.savePane.state, this.refs.buildPane.state.Elements);
  }
  // Load an instrument
  loadCallback(elements, info) {
    // Set the savePane state to that extracted from the file
    this.refs.savePane.loadState(info);
    // Set the buildPane elements to the rendered elements
    this.refs.buildPane.loadElements(elements);
    // Set the alert state to success in the loadPane
    this.refs.loadPane.setAlert('success');
  }
  // Render the HTML
  render() {
    let tabs = [];
    tabs.push(
      <LoadPane
        TabId='Load'
        ref='loadPane'
        loadCallback={this.loadCallback}
        key={1}
      />
    );
    tabs.push(
      <BuildPane
        TabId='Build'
        ref='buildPane'
        key={2}
      />
    );
    tabs.push(
      <SavePane
        TabId='Save'
        ref='savePane'
        save={this.saveInstrument}
        key={3}
      />
    );

    let tabList = [
      {
        id: 'Load',
        label: 'Load',
      },
      {
        id: 'Build',
        label: 'Build',
      },
      {
        id: 'Save',
        label: 'Save',
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
};

let RInstrumentBuilderApp = React.createFactory(InstrumentBuilderApp);

window.RInstrumentBuilderApp = RInstrumentBuilderApp;

export default InstrumentBuilderApp;
