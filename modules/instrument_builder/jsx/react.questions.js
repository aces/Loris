/* exported LorisElement, QuestionText, BasicOptions, DropdownOptions, DateOptions,
 NumericOptions, ListElements, AddElement */

/* global Instrument */

/**
 * This file contains the React classes for instrument builder
 * module. It is used to add and edit questions in the instrument
 * builder.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    SelectElement,
    DateElement,
    TextareaElement,
    TextElement,
    NumericElement,
    ButtonElement,
} from 'jsx/Form';

/**
 * Note: This is a wrapper for Form.js (Only used in instrument builder)
 *
 * This is the React class for a LORIS element. It takes
 * in an element and render's the HTML based on its type
 *
 */
class LorisElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let element = this.props.element;
    let elementHtml = '';
    switch (element.Type) {
      case 'header':
        elementHtml = <h2>{element.Description}</h2>;
        break;
      case 'label':
        elementHtml = <p>{element.Description}</p>;
        break;
      case 'line':
        elementHtml = <div></div>;
        break;
      case 'score':
        elementHtml = <StaticElement text={0} label={element.Description} />;

        break;
      case 'text':
        if (element.Options.Type === 'small') {
          elementHtml = <TextboxElement label={element.Description}/>;
        } else {
          elementHtml = <TextareaElement label={element.Description}/>;
        }
        break;
      case 'select':
        if (element.Options.AllowMultiple) {
          elementHtml = <SelectElement label={element.Description}
                                       options={element.Options.Values}
                                       emptyOption={false}
                                       sortByValue={false}
                                       multiple={true}/>;
        } else {
          elementHtml = <SelectElement label={element.Description}
                                       emptyOption={false}
                                       sortByValue={false}
                                       options={element.Options.Values}/>;
        }
        break;
      case 'date':
        elementHtml = <DateElement
          label={element.Description}
          minYear={element.Options.MinYear}
          maxYear={element.Options.MaxYear}
        />;
        break;
      case 'numeric':
        elementHtml = <NumericElement
          label={element.Description}
          min={element.Options.MinValue}
          max={element.Options.MaxValue}
        />;
        break;
      default:
        break;
    }
    return (
      <div>{elementHtml}</div>
    );
  }
}
LorisElement.propTypes = {
  element: PropTypes.object,
};

/**
 * This is the React class for the question text input
 */
class QuestionText extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {

    };
    this.onChange = this.onChange.bind(this);
  }

  /**
   * On change
   * Keep track of the current input
   *
   * @param {object} e - Event object
   */
  onChange(e) {
    this.props.updateState({Description: e.target.value});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let errorMessage = '';
    let errorClass = 'form-group';
    if (this.props.element.error && this.props.element.error.questionText) {
      // If an error is present, display the error
      errorMessage = (
        <font className="form-error">
          {this.props.element.error.questionText}
        </font>
      );
      errorClass += ' has-error';
    }
    return (
      <div className={errorClass}>
        <label className="col-sm-2 control-label">
          {this.props.inputLabel}:
        </label>
        <div className="col-sm-6">
          <input className="form-control col-xs-12"
            type="text" id="questionText"
            size="75"
            value={this.props.element ? this.props.element.Description : ''}
            onChange={this.onChange}
          />
          {errorMessage}
        </div>
      </div>
    );
  }
}
QuestionText.propTypes = {
  inputLabel: PropTypes.string,
  updateState: PropTypes.func,
  element: PropTypes.object,
};
QuestionText.defaultProps = {
  inputLabel: 'Question Text',
};

/**
 * This is the React class for the question name input
 */
class BasicOptions extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {

    };
    this.onChange = this.onChange.bind(this);
  }

  /**
   * On change
   * Keep track of the current input
   *
   * @param {object} e - Event object
   */
  onChange(e) {
    // replace whitespaces with underscores
    let questionName = (e.target.value).trim().split(' ').join('_');
    this.props.updateState({Name: questionName});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let errorMessage = '';
    let errorClass = 'form-group';
    if (this.props.element.error && this.props.element.error.questionName) {
      // If an error is present, display the error
      errorMessage = (
        <font className="form-error">
          {this.props.element.error.questionName}
        </font>
      );
      errorClass += ' has-error';
    }
    return (
      <div>
        <div className={errorClass}>
          <label className="col-sm-2 control-label">Question Name: </label>
          <div className="col-sm-6">
            <input className="form-control"
              type="text" id="questionName"
              onChange={this.onChange}
              value={this.props.element ? this.props.element.Name : ''}
            />
            {errorMessage}
          </div>
        </div>
        <QuestionText
          updateState={this.props.updateState}
          element={this.props.element}
        />
      </div>
    );
  }
}
BasicOptions.propTypes = {
  updateState: PropTypes.func,
  element: PropTypes.object,
};

/**
 * This is the React class for the Dropdown options
 */
class DropdownOptions extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      option: '',
    };
    this.onChange = this.onChange.bind(this);
    this.addOption = this.addOption.bind(this);
    this.resetOptions = this.resetOptions.bind(this);
  }

  /**
   * On change
   * Keep track of the current input
   *
   * @param {object} e - Event object
   */
  onChange(e) {
    this.setState({
      option: e.target.value,
    });
  }

  /**
   * Add an option to the element
   */
  addOption() {
    let option = this.state.option.trim();

    // Check for empty options
    if (option === '') {
      let temp = (this.state.error) ? this.state.error : {};
      temp.newSelectOption = 'Dropdown options cannot be empty!';
      this.setState({
        error: temp,
      });
      return;
    }

    // Remove error if corrected
    if (this.state.error) {
      let temp = this.state.error;
      delete temp.newSelectOption;
      this.setState({
        error: temp,
      });
    }

    // add to option list
    let temp = Instrument.clone(this.props.element.Options);
    let key = Instrument.enumize(this.state.option);
    temp.Values[key] = this.state.option;
    this.props.updateState({Options: temp});

    // clear input field
    this.state.option = '';
  }

  /**
   * Reset the dropdown options
   */
  resetOptions() {
    let temp = Instrument.clone(this.props.element.Options);
    temp.Values = {};
    this.props.updateState({Options: temp});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let multi = '';
    let options = Instrument.clone(this.props.element.Options.Values);
    let errorMessage = '';
    let dropdownClass = 'form-group';

    // Set the select option type
    if (this.props.element.Options.AllowMultiple) {
      multi = 'multiple';
    }

    // If an error is present, display the error
    if (this.state.error && this.state.error.newSelectOption) {
      errorMessage = (
        <span className="form-error">{this.state.error.newSelectOption}</span>
      );
      dropdownClass += ' has-error';
    }

    return (
      <div>
        <BasicOptions
          updateState={this.props.updateState}
          element={this.props.element}
        />
        <div className={dropdownClass}>
          <label className="col-sm-2 control-label">Dropdown Option: </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              type="text"
              id="newSelectOption"
              value={this.state.option}
              onChange={this.onChange}
            />
          </div>
          <input
            className="btn btn-default"
            type="button"
            value="Add option"
            onClick={this.addOption.bind(this, false) }
          />
          <input
            className="btn btn-default"
            type="button"
            value="Reset"
            onClick={this.resetOptions}
          />
          <div className="col-sm-6 col-sm-offset-2">
            {errorMessage}
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">Preview: </label>
          <div className="col-sm-2">
            <select multiple={multi}
                    id="selectOptions"
                    className="form-control"
            >
              {Object.keys(options).map(function(option, key) {
                return (<option key={key}>{options[option]}</option>);
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }
}
DropdownOptions.propTypes = {
  updateState: PropTypes.func,
  element: PropTypes.object,
};

/**
 * This is the React class for the date options
 */
class DateOptions extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      dateFormat: {
        Date: 'Standard Date',
        BasicDate: 'Basic Date (does not include \'Not Answered\' option)',
        MonthYear: 'Month Year (does not include day of the month)',
      },
    };
    this.onChange = this.onChange.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    // Check if the date format is already set (editing elements)
    // if not, set it to default value (new elements)
    if (!this.props.element.Options.dateFormat) {
      this.props.element.Options.dateFormat = 'Date';
    }
  }

  /**
   * On change
   * Keep track of the inputed years
   *
   * @param {object} e - Event object
   */
  onChange(e) {
    let options = Instrument.clone(this.props.element.Options);
    if (e.target.id === 'yearmin') {
      options.MinYear = e.target.value;
    } else if (e.target.id === 'yearmax') {
      options.MaxYear = e.target.value;
    } else if (e.target.id === 'dateFormat') {
      options.dateFormat = e.target.value;
    }
    this.props.updateState({Options: options});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let minYear = this.props.element.Options.MinYear;
    let maxYear = this.props.element.Options.MaxYear;
    let dateFormat = this.props.element.Options.dateFormat;

    let dateOptionsClass = 'options form-group';
    let errorMessage = '';

    let dateFormatOptions = this.state.dateFormat;

    if (this.props.element.error && this.props.element.error.dateOption) {
      // If an error is present, display the error
      errorMessage = (
        <span className="form-error">
          {this.props.element.error.dateOption}
        </span>
      );
      dateOptionsClass += ' has-error';
    }

    return (
      <div>
        <BasicOptions
          updateState={this.props.updateState}
          element={this.props.element}
        />
        <div id="dateoptions" className={dateOptionsClass}>
          <label className="col-sm-2 control-label">Start year: </label>
          <div className="col-sm-2">
            <input
              className="form-control"
              type="number"
              id="yearmin"
              min="1900"
              max="2100"
              value={minYear}
              onChange={this.onChange}
            />
            {errorMessage}
          </div>
          <label className="col-sm-2 control-label">End year: </label>
          <div className="col-sm-2">
            <input
              className="form-control"
              type="number"
              id="yearmax"
              min="1900"
              max="2100"
              onChange={this.onChange}
              value={maxYear}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-sm-2 control-label">Date Format: </label>
          <div className="col-sm-6">
            <select
              id="dateFormat"
              className="form-control"
              onChange={this.onChange}
              defaultValue={dateFormat}>
              {Object.keys(dateFormatOptions).map(function(option, key) {
                return (
                  <option key={key} value={option}>
                    {dateFormatOptions[option]}
                  </option>
                );
              }) }
            </select>
          </div>
        </div>
      </div>
    );
  }
}
DateOptions.propTypes = {
  element: PropTypes.object,
  updateState: PropTypes.func,
};

/**
 * This is the React class for the numeric options
 */
class NumericOptions extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {

    };
    this.onChange = this.onChange.bind(this);
  }

  /**
   * On change
   * Keep track of the inputed numbers, casting them to
   * integer values.
   *
   * @param {object} e - Event object
   */
  onChange(e) {
    let options = Instrument.clone(this.props.element.Options);

    if (e.target.id === 'numericmin') {
      options.MinValue = parseInt(e.target.value, 10);
    } else if (e.target.id === 'numericmax') {
      options.MaxValue = parseInt(e.target.value, 10);
    }
    this.props.updateState({Options: options});
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let errorMessage = '';
    let optionsClass = 'options form-group';

        // If an error is present, display the error
    if (this.props.element.error && this.props.element.error.numeric) {
      errorMessage = (
        <span className="form-error">
          {this.props.element.error.numeric}
        </span>
      );
      optionsClass += 'options form-group has-error';
    }

    return (
      <div>
        <BasicOptions
          updateState={this.props.updateState}
          element={this.props.element}
        />
        <div id="numericoptions" className={optionsClass}>
          <label className="col-sm-2 control-label">Min: </label>
          <div className="col-sm-2">
            <input
              className="form-control"
              type="number"
              id="numericmin"
              onChange={this.onChange}
              value={this.props.element.Options.MinValue}
            />
          </div>
          <label className="col-sm-2 control-label">Max: </label>
          <div className="col-sm-2">
            <input
              className="form-control"
              type="number"
              id="numericmax"
              onChange={this.onChange}
              value={this.props.element.Options.MaxValue}
            />
          </div>
          <div className="col-sm-offset-2 col-sm-10">
            {errorMessage}
          </div>
        </div>
      </div>
    );
  }
}
NumericOptions.propTypes = {
  updateState: PropTypes.func,
  element: PropTypes.object,
};

/**
 * This is the React class for the dropdown for the
 *  different question types.
 */
class ListElements extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {

    };
    this.selectType = this.selectType.bind(this);
  }

  /**
   * Set the desired question type
   *
   * @param {*} newId
   * @param {*} newValue
   */
  selectType(newId, newValue) {
    let newState = {
      selected: {
        id: newId,
        value: newValue,
      },
    };
    let multi = false;
    let textSize = 'small';
    // Set the options for the desired type
    switch (newId) {
      case 'line':
        newState.Options = {};
        newState.Name = '';
        newState.Description = '';
        break;
      case 'textarea':
        textSize = 'large';
        // falls through
      case 'textbox':
        newState.Options = {
          Type: textSize,
        };
        break;
      case 'multiselect':
        multi = true;
        // falls through
      case 'dropdown':
        newState.Options = {
          Values: {},
          AllowMultiple: multi,
        };
        break;
      case 'date':
        newState.Options = {
          MinYear: '',
          MaxYear: '',
        };
        break;
      case 'numeric':
        newState.Options = {
          MinValue: null,
          MaxValue: null,
        };
        break;
      default:
        break;
    }
    this.props.updateState(newState);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
        <div className="form-group">
            <label htmlFor="selected-input"
                   className="col-sm-2 control-label"
            >Question Type:</label>
            <div className="col-sm-4">
                <div className="btn-group">
                    <button id="selected-input"
                            type="button"
                            className="btn btn-default dropdown-toggle"
                            data-toggle="dropdown"
                    >
                        <span id="search_concept">{this.props.value} </span>
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu" role="menu">
                        <li>
                            <div className="col-sm-12">
                              <h5 className="">Information</h5>
                            </div>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'header',
                          'Header'
                        )}>
                            <a id="header"
                               className="option"
                               title="Centered, header information"
                            >Header</a>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'label',
                          'Label'
                        )}>
                            <a id="label"
                               className="option"
                               title="Unemphasized display text"
                            >Label</a>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'score',
                          'Scored Field'
                        )}>
                            <a id="scored"
                               className="option"
                               title="Column which stores calculated data"
                            >Scored Field</a>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <div className="col-sm-12">
                              <h5 className="">Data entry</h5>
                            </div>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'textbox',
                          'Textbox'
                        )}>
                            <a id="textbox"
                               className="option"
                               title="Text box for user data entry"
                            >Textbox</a>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'textarea',
                          'Textarea'
                        )}>
                            <a id="textarea"
                               className="option"
                               title="Larger text area for data entry"
                            >Textarea</a>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'dropdown',
                          'Dropdown'
                        )}>
                            <a id="dropdown"
                               className="option"
                               title={'Dropdown menu for users to select '
                                     + 'data from'}
                            >Dropdown</a>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'multiselect',
                          'Multiselect'
                        )}>
                            <a id="multiselect"
                               className="option"
                               title={'Data entry where multiple options '
                                     + 'may be selected'}
                            >Multiselect</a>
                        </li>
                        <li onClick={this.selectType.bind(
                          this,
                          'date',
                          'Date'
                        )}>
                            <a id="date"
                               className="option"
                               title="User data entry of a date"
                            >Date</a>
                        </li>
                        <li onClick={
                          this.selectType.bind(this, 'numeric', 'Numeric')
                        }>
                            <a id="numeric"
                               className="option"
                               title="User data entry of a number"
                            >Numeric</a>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <div className="col-sm-12">
                              <h5 className="">Formatting</h5>
                            </div>
                        </li>
                        <li onClick={
                          this.selectType.bind(this, 'line', 'Blank Line')
                        }>
                            <a id="line"
                               className="option"
                               title="Empty line"
                            >Blank Line</a>
                        </li>
                        <li onClick={this.selectType.bind(
                            this,
                            'page-break',
                            'Page Break'
                        )}>
                            <a id="page-break"
                               className="option"
                               title="Start a new page"
                            >Page Break</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
  }
}
ListElements.propTypes = {
  value: PropTypes.string,
  updateState: PropTypes.func,
};

/**
 * This is the React class for adding a new element or
 * editing an existing one
 */
class AddElement extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    if (this.props !== undefined && this.props.element) {
      // Editing an element, set to elements state
      this.state = {
        Options: Instrument.clone(this.props.element.Options === undefined ?
          {} :
          this.props.element.Options
        ),
        Description: Instrument.clone(
          this.props.element.Description === undefined ?
          {} :
          this.props.element.Description
        ),
        Name: Instrument.clone(this.props.element.Name === undefined ?
          '' :
          this.props.element.Name
        ),
        selected: Instrument.clone(this.props.element.selected === undefined ?
          {} :
          this.props.element.selected
        ),
      };
    } else {
      this.state = {
        Options: {},
        Description: '',
        Name: '',
        selected: {
          id: '',
          value: 'Select One',
        },
      };
    }
    this.updateState = this.updateState.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.addOption = this.addOption.bind(this);
    this.resetOptions = this.resetOptions.bind(this);
  }

  /**
   * Update element state
   *
   * @param {object} newState
   */
  updateState(newState) {
    this.setState(newState);
  }

  /**
   * Add a question to the buildPane
   */
  addQuestion() {
    let selected = this.state.selected.id;
    let questionText = this.state.Description;
    let questionName = this.state.Name;
    let hasError = false;

    if (questionName && questionName.indexOf('status') > -1) {
      alert('Question name can\'t contain \'status\' as part of the name!');
      return;
    }

    if (!selected) {
      // Error, no element selected, alert the user and return
      alert('No element type selected');
      return;
    }

    if (selected === 'date') {
      let min = this.state.Options.MinYear;
      let max = this.state.Options.MaxYear;
      let minYear = parseInt(min, 10);
      let maxYear = parseInt(max, 10);
      let minDate = Date.parse(min);
      let maxDate = Date.parse(max);
      if ((isNaN(minDate) && min !== '') || (isNaN(maxDate) && max !== '')) {
        let temp = (this.state.error) ? this.state.error : {};

        temp.dateOption = 'Invalid date provided';
        this.setState({
          error: temp,
        });
        hasError = true;
      }

      if (minDate > maxDate && min !== '' && max !== '') {
        let temp = (this.state.error) ? this.state.error : {};

        temp.dateOption = 'End year happened before start year';
        this.setState({
          error: temp,
        });
        hasError = true;
      }
      if (minYear > 9999
        || minYear < 1000
        || maxYear > 9999
        || maxYear < 1000
      ) {
        let temp = (this.state.error) ? this.state.error : {};

        temp.dateOption = 'The year must have exactly 4 digits. '
                          + 'Please choose an integer number '
                          + 'between 1000 and 9999.';
        this.setState({
          error: temp,
        });
        hasError = true;
      }

      if (!hasError && this.state.error) {
        let temp = this.state.error;
        delete temp.dateOption;
        this.setState({
          error: temp,
        });
      }
    }

    // Checking for error on numeric field
    if (selected === 'numeric') {
      let min = this.state.Options.MinValue;
      let max = this.state.Options.MaxValue;

      if (min != null && max != null && min >= max) {
        let temp = (this.state.error) ? this.state.error : {};
        temp.numeric = 'Max value must be larger than min value';
        this.setState({
          error: temp,
        });
        hasError = true;
      }

      // If error corrected, remove error message and error
      if (!hasError && this.state.error) {
        let temp = this.state.error;
        delete temp.numeric;
        this.setState({
          error: temp,
        });
      }
    }

    if (questionText === '' && selected !== 'line') {
        // Error, question text is required. Set the element error flag
        // for the questionText with message. Set the hasError flag
      let temp = (this.state.error) ? this.state.error : {};
      if (selected === 'page-break') {
        temp.questionText = 'Must use question text as page header';
      } else {
        temp.questionText = 'No question text specified';
      }
      this.setState({
        error: temp,
      });
      hasError = true;
    }

    if (!hasError && this.state.error) {
        // No error, remove the elememt's questionText error flag
        // if set
      let temp = this.state.error;
      delete temp.questionText;
      this.setState({
        error: temp,
      });
    }

    if (questionName.length > 64 && selected !== 'textbox'
        && selected !== 'textarea' && selected !== 'date'
        && selected !== 'numeric') {
      // Error, question name is needed for the desired type. Set the element
      // error flag for the questionName with message. Set the hasError flag
      let temp = (this.state.error) ? this.state.error : {};
      temp.questionName = 'Please shorten to 64 characters maximum';
      this.setState({
        error: temp,
      });
      hasError = true;
    } else if (this.state.error) {
      // No error, remove the element's questionName error flag if set
      let temp = this.state.error;
      delete temp.questionName;
      this.setState({
        error: temp,
      });
    }
    if (hasError) {
      // An error is present, return
      return;
    }

    if (questionName.length > 57 && (selected === 'textbox'
      || selected === 'textarea' || selected === 'date'
      || selected === 'numeric')) {
      // Error, question name is needed for the desired type. Set the element
      // error flag for the questionName with message. Set the hasError flag
      let temp = (this.state.error) ? this.state.error : {};
      temp.questionName = 'Please shorten to 57 characters maximum';
      this.setState({
        error: temp,
      });
      hasError = true;
    } else if (this.state.error) {
      // No error, remove the elememt's questionName error flag if set
      let temp = this.state.error;
      delete temp.questionName;
      this.setState({
        error: temp,
      });
    }
    if (hasError) {
      // An error is present, return
      return;
    }

    if (questionName === '' && selected !== 'header' && selected !== 'label' &&
      selected !== 'line' && selected !== 'page-break') {
      // Error, question name is needed for the desired type. Set the element
      // error flag for the questionName with message. Set the hasError flag
      let temp = (this.state.error) ? this.state.error : {};
      temp.questionName = 'Must specify name for database to save value into';
      this.setState({
        error: temp,
      });
      hasError = true;
    } else if (this.state.error) {
      // No error, remove the elememt's questionName error flag if set
      let temp = this.state.error;
      delete temp.questionName;
      this.setState({
        error: temp,
      });
    }
    if (hasError) {
      // An error is present, return
      return;
    }

    // Setup the desired element to be added
    switch (selected) {
      case 'line':
        break;
      case 'header':
      case 'label':
        questionName = '';
        break;
      case 'textbox':
      case 'textarea':
        selected = 'text';
        break;
      case 'dropdown':
      case 'multiselect':
        selected = 'select';
        break;
      case 'page-break':
        // If page-break, add new page to the buildPane
        // element list
        this.props.addPage(questionText);
        return;
      default:
        break;
    }

    // Remove all error flags
    delete this.state.error;
    let element = {
      Type: selected,
      Description: questionText,
      Name: questionName,
      Options: this.state.Options,
      selected: this.state.selected,
    };

    // Add/Update the Page's element array. The updateQuestion returns true
    // if element was added/updated, false if the element name already exists.
    if (typeof this.props.index === 'undefined') {
      hasError = !this.props.updateQuestions(element);
    } else {
      // If editing, supply updateQuestion with the elements index in the
      // Page's element array.
      hasError = !this.props.updateQuestions(element, this.props.index);
    }

    if (hasError) {
      // Error, element name already exists. Set the element error flag
      // for the questionName with message.
      this.setState(function(state) {
        let temp = (state.error) ? state.error : {};
        temp.questionName = 'Duplicate question name';
        return {
          error: temp,
        };
      });
    }
  }

  /**
   * Add an option to the options array
   *
   * @param {boolean} multi
   */
  addOption(multi) {
    // Use a function to update the state to enqueue an atomic
    // update that consults the previous value of state before
    // setting any values
    this.setState(function(state) {
      let temp = state.options;
      const newmultiSelectOption = document.getElementById(
        'newmultiSelectOption'
      );
      const newSelectOption = document.getElementById(
        'newSelectOption'
      );

      if (multi && newmultiSelectOption) {
        temp.push(newmultiSelectOption.value);
      } else if (newSelectOption) {
        temp.push(newSelectOption.value);
      }

      return {
        options: temp,
      };
    });
  }

  /**
   * Reset the options array
   */
  resetOptions() {
    this.setState({
      options: [],
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let questionInput;
    let header = '';
    let buttons;
        // Set the inputs to display based on the desired element type
    switch (this.state.selected.id) {
      case 'line':
        break;
      case 'header':
      case 'label':
        questionInput = <QuestionText
          updateState={this.updateState}
          element={this.state}
        />;
        break;
      case 'page-break':
        questionInput = <QuestionText
          updateState={this.updateState}
          element={this.state}
          inputLabel={'Page Name'}
        />;
        break;
      case 'score':
      case 'textbox':
      case 'textarea':
        questionInput = <BasicOptions
          updateState={this.updateState}
          element={this.state}
        />;
        break;
      case 'multiselect':
      case 'dropdown':
        questionInput = <DropdownOptions
          updateState={this.updateState}
          element={this.state}
        />;
        break;
      case 'date':
        questionInput = <DateOptions
          updateState={this.updateState}
          element={this.state}
        />;
        break;
      case 'numeric':
        questionInput = <NumericOptions
          updateState={this.updateState}
          element={this.state}
        />;
        break;
      default:
        break;
    }

    // Set the button/header based on whether you are editing or adding an element.
    if (this.props.element) {
      buttons = (
        <input
          className="btn btn-default"
          type="button"
          value="Edit Row"
          onClick={this.addQuestion}
        />
      );
    } else {
      header = (<h2>Add Question</h2>);
      buttons = (
        <input
          className="btn btn-default"
          type="button"
          value="Add Row"
          onClick={this.addQuestion}
        />
      );
    }
    return (
      <div className="col-xs-12">
        {header}
        <div className="form-horizontal" role="form">
          <ListElements
            updateState={this.updateState}
            value={this.state.selected.value}
          />
          {questionInput}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              {buttons}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
AddElement.propTypes = {
  element: PropTypes.object,
  updateQuestions: PropTypes.func,
  addPage: PropTypes.func,
  index: PropTypes.number,
};

window.LorisElement = LorisElement;
window.QuestionText = QuestionText;
window.BasicOptions = BasicOptions;
window.DropdownOptions = DropdownOptions;
window.DateOptions = DateOptions;
window.NumericOptions = NumericOptions;
window.ListElements = ListElements;
window.AddElement = AddElement;

export default {
  LorisElement,
  QuestionText,
  BasicOptions,
  DropdownOptions,
  DateOptions,
  NumericOptions,
  ListElements,
  AddElement,
};
