/**
 *  The following file contains the components used for the filter builder tab
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @author   Alizée Wickenheiser <alizee.wickenheiser@mcgill.ca>
 *  @license  GPL-3.0-or-later
 *  @see {@link https://github.com/aces/Loris"|Loris}
 */

import React, {Component} from 'react';
import ModalImportCSV from './react.importCSV';
import {getSessions, enumToArray} from '../js/arrayintersect';
import PropTypes from 'prop-types';

/**
 * LogicOperator Component
 *
 * The following component is used for displaying operator for the group component
 */
class LogicOperator extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.changeOperator = this.changeOperator.bind(this);
  }

  /**
   * Wrapper function updating operator
   *
   * @param {object} op
   */
  changeOperator(op) {
    // Wrapper function updating operator
    this.props.updateGroupOperator(op);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let andClass = 'btn';
    let orClass = 'btn';

    // Set operator to OR if logicOperator is 1, AND otherwise
    if (this.props.logicOperator === 1) {
      orClass += ' btn-primary-filter';
      andClass += ' switch';
    } else {
      andClass += ' btn-primary-filter';
      orClass += ' switch';
    }
    return (
      <div className='btn-group' role='group'>
        <button type='button'
          className={andClass}
          onClick={this.changeOperator.bind(this, 0)}>And</button>
        <button type='button'
          className={orClass}
          onClick={this.changeOperator.bind(this, 1)}>Or</button>
      </div>
    );
  }
}
LogicOperator.propTypes = {
  updateGroupOperator: PropTypes.func,
  logicOperator: PropTypes.number,
};

/**
 * FilterRule Component
 *
 * The following component is used for displaying a filter rule
 */
class FilterRule extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      operators: {
        equal: '=',
        notEqual: '!=',
        lessThanEqual: '<=',
        greaterThanEqual: '>=',
        startsWith: 'startsWith',
        contains: 'contains',
        isNull: 'isNull',
        isNotNull: 'isNotNull',
      },
      value: '',
    };
    this.selectInstrument = this.selectInstrument.bind(this);
    this.fieldSelect = this.fieldSelect.bind(this);
    this.operatorSelect = this.operatorSelect.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.valueSet = this.valueSet.bind(this);
    this.updateVisit = this.updateVisit.bind(this);
  }

  /**
   * Component will mount
   */
  componentWillMount() {
    this.valueSet = loris.debounce(this.valueSet, 1000);
  }

  /**
   * Update the rules instrument, getting the instruments available fields
   *
   * @param {object} event
   */
  selectInstrument(event) {
    let rule = this.props.rule;
    if (event.target.value) {
      rule.instrument = event.target.value;
      fetch(
        loris.BaseURL + '/dqt/ajax/datadictionary.php?category='
            + rule.instrument,
        {credentials: 'same-origin'},
      )
        .then( (resp) => resp.json())
        .then( (data) => {
          rule.fields = data;
          this.props.updateRule(this.props.index, rule);
        });
    }
  }

  /**
   * Update the rules desired field, setting the rules field and field type
   *
   * @param {object} event
   */
  fieldSelect(event) {
    let rule = JSON.parse(JSON.stringify(this.props.rule));
    delete rule.field;
    delete rule.fieldType;
    delete rule.operator;
    delete rule.value;
    delete rule.visit;
    delete rule.candidates;
    if (event.target.value) {
      rule.field = rule.fields[event.target.value].key[1];
      rule.fieldType = rule.fields[event.target.value].value.Type;
    }
    this.props.updateRule(this.props.index, rule);
  }

  /**
   * Update the desired rule operation for the selected field
   *
   * @param {object} event
   */
  operatorSelect(event) {
    // Update the desired rule operation for the selected field
    let rule = JSON.parse(JSON.stringify(this.props.rule));
    delete rule.operator;
    delete rule.value;
    delete rule.visit;
    delete rule.candidates;
    if (event.target.value) {
      rule.operator = event.target.value;
    }
    this.props.updateRule(this.props.index, rule);
    if (rule.operator === 'isNull' || rule.operator === 'isNotNull') {
      this.setState({
        value: 'null',
      });
      this.valueSet();
    }
  }

  /**
   * value changed event
   *
   * @param {object} event
   */
  valueChange(event) {
    let rule = JSON.parse(JSON.stringify(this.props.rule));
    delete rule.visit;
    delete rule.candidates;

    rule.value = event.target.value;

    this.setState({
      value: event.target.value,
    });
    this.valueSet();
    this.props.updateRule(this.props.index, rule);
  }

  /**
   * Update the value to filter for, and runs the query for the rules parameters
   */
  valueSet() {
    let rule = JSON.parse(JSON.stringify(this.props.rule));
    if (this.state.value) {
      let responseHandler = (data) => {
        let i;
        let allSessions = {};
        let allCandiates = {};
        // Loop through data and divide into individual visits with unique PSCIDs
        // storing a master list of unique PSCIDs
        for (i = 0; i < data.length; i++) {
          if (!allSessions[data[i][1]]) {
            allSessions[data[i][1]] = [];
          }
          allSessions[data[i][1]].push(data[i][0]);
          if (!allCandiates[data[i][0]]) {
            allCandiates[data[i][0]] = [];
          }
          allCandiates[data[i][0]].push(data[i][1]);
        }
        rule.candidates = {
          allCandiates: allCandiates,
          allSessions: allSessions,
        };
        rule.session = Object.keys(allCandiates);
        rule.visit = 'All';
        this.props.updateSessions(this.props.index, rule);
      };
      let ajaxRetrieve = (script) => {
        fetch(loris.BaseURL + '/dqt/ajax/' + script
            + '?category=' + rule.instrument
            + '&field=' + rule.field
            + '&value=' + this.state.value,
        {credentials: 'same-origin'},
        )
          .then( (resp) => resp.json())
          .then( (data) => {
            responseHandler(data);
          });
      };
      switch (rule.operator) {
      case 'equal':
      case 'isNull':
        ajaxRetrieve('queryEqual.php');
        break;
      case 'notEqual':
      case 'isNotNull':
        ajaxRetrieve('queryNotEqual.php');
        break;
      case 'lessThanEqual':
        ajaxRetrieve('queryLessThanEqual.php');
        break;
      case 'greaterThanEqual':
        ajaxRetrieve('queryGreaterThanEqual.php');
        break;
      case 'startsWith':
        ajaxRetrieve('queryStartsWith.php');
        break;
      case 'contains':
        ajaxRetrieve('queryContains.php');
        break;
      default:
        break;
      }
    }
  }

  /**
   * Update rule to filter for specified visit
   *
   * @param {object} event
   */
  updateVisit(event) {
    let rule = JSON.parse(JSON.stringify(this.props.rule));
    rule.visit = event.target.value;

    if (event.target.value === 'all') {
      // If all visits, use keys of master list
      rule.session = Object.keys(rule.candidates.allCandiates);
    } else {
      // Else use list of PSCIDs for given vist
      rule.session = rule.candidates.allSessions[event.target.value];
    }
    this.props.updateSessions(this.props.index, rule);
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let rule;
    let fieldIndex;
    let forVisits;
    let visits;
    if (this.props.rule.instrument) {
      // Only display field select and etc. if instrument is selected
      let fields = this.props.rule.fields.map((field, index) => {
        if (this.props.rule.field && field.key[1] === this.props.rule.field) {
          fieldIndex = index;
        }
        return (
          <option key={index} value={index}>
            {field.key[1]}
          </option>
        );
      });
      let operators = [];
      let inputOptions = [];
      let input = [];
      let operatorKey = '';
      let operatorSelect = [];
      let options = [];
      let value = '';
      let inputType = [];

      if (this.props.rule.fieldType) {
        // Only display operators if field is selected
        inputType = this.props.rule.fieldType.split('(');
        operatorKey = inputType[0];
        for (let key in this.state.operators) {
          if (this.state.operators.hasOwnProperty(key)) {
            operators.push(
              <option key={key} value={key} onChange={this.operatorSelect}>
                {this.state.operators[key]}
              </option>
            );
          }
        }
        value = (this.props.rule.operator) ? this.props.rule.operator : '';
        operatorSelect = (
          <select className='input-sm col-xs-3 '
            onChange={this.operatorSelect}
            value={value}>
            <option value=''/>
            {operators}
          </select>
        );
        if (this.props.rule.operator &&
          this.props.rule.operator !== 'isNull' &&
          this.props.rule.operator !== 'isNotNull'
        ) {
          // Only display value input if operator is selected, displaying specific
          // input type field data type
          switch (operatorKey) {
          case 'enum':
            inputOptions = enumToArray(this.props.rule.fieldType);
            options = inputOptions.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            });
            input = (
              <select className='input-sm col-xs-3'
                onChange={this.valueChange}
                value={this.props.rule.value ?? ''}>
                <option value=''/>
                {options}
              </select>
            );
            break;
          default:
            input = (
              <input type='text'
                className='input-sm col-xs-3'
                onChange={this.valueChange}
                value={this.props.rule.value ?? ''}
              />
            );
            break;
          }
        }
        if (this.props.rule.visit) {
          // Display dropdown for visit select. This only displays after a value
          // has been inputed
          visits = Object.keys(this.props.Visits).map((visit, index) => {
            return (
              <option key={index} value={visit}>
                {visit}
              </option>
            );
          });
          forVisits = (
            <select className='input-sm col-xs-3'
              onChange={this.updateVisit}
              value={this.props.rule.visit}>
              <option value='all'>All Visits</option>
              {visits}
            </select>
          );
        }
      }
      rule = (
        <div>
          <div className='col-xs-12'>
            <label className='instrumentLabel'>
              {this.props.rule.instrument}
            </label>
          </div>
          <div className='col-xs-10'>
            <select className='input-sm col-xs-3'
              onChange={this.fieldSelect}
              value={fieldIndex}>
              <option value=''/>
              {fields}
            </select>
            {operatorSelect}
            {input}
            {forVisits}
          </div>
        </div>
      );
    } else {
      // Else display dropdown for instrument select
      if (Array.isArray(this.props.items)) {
        let options = this.props.items.map((item, index) => {
          return (
            <option key={index} value={item.category}>{item.category}</option>
          );
        });
        rule = (
          <select onChange={this.selectInstrument}
            className="input-sm col-xs-10">
            <option value=''/>
            {options}
          </select>
        );
      }
    }
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          {rule}
          <div className='col-xs-2'>
            <button className='btn btn-danger btn-sm pull-right'
              onClick={this.props.deleteRule.bind(this, this.props.index)}
            >
              <span className='glyphicon glyphicon-remove'/> Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}
FilterRule.propTypes = {
  rule: PropTypes.object,
  updateRule: PropTypes.func,
  index: PropTypes.number,
  updateSessions: PropTypes.func,
  Visits: PropTypes.object,
  items: PropTypes.array,
  deleteRule: PropTypes.func,
};

/**
 * FilterGroup Component
 * The following component is used for displaying a filter group
 */
class FilterGroup extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {};
    this.updateChild = this.updateChild.bind(this);
    this.updateGroupOperator = this.updateGroupOperator.bind(this);
    this.updateSessions = this.updateSessions.bind(this);
    this.addChild = this.addChild.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
  }

  /**
   * Update a specified child in the groups children
   *
   * @param {number} index
   * @param {string} child
   */
  updateChild(index, child) {
    let group = this.props.group;
    group.children[index] = child;

    if (this.props.index) {
      // If not base filter group, recursively call update child
      this.props.updateGroup(this.props.index, group);
    } else {
      // Else base filter group, update the filter in the data query component
      this.props.updateFilter(group);
    }
  }

  /**
   * Update the group's operator
   *
   * @param {object} operator
   */
  updateGroupOperator(operator) {
    let group = this.props.group;
    group.activeOperator = operator;

    // Update the groups sessions by calling the arrayintersect.js functions
    group.session = getSessions(group);

    if (this.props.index) {
      // If not base filter group, recursively call update child
      this.props.updateGroup(this.props.index, group);
    } else {
      // Else base filter group, update the filter in the data query component
      this.props.updateFilter(group);
    }
  }

  /**
   * Computes the desired sessions of the current group
   *
   * @param {number} index
   * @param {string} child
   */
  updateSessions(index, child) {
    // Computes the desired sessions of the current group
    const group = this.props.group;
    group.children[index] = child;

    // Update the groups sessions by calling the arrayintersect.js functions
    group.session = getSessions(group);
    if (this.props.index) {
      // If not base filter group, recursively call update parents session
      this.props.updateSessions(this.props.index, group);
    } else {
      // Else base filter group, update the filter in the data query component
      this.props.updateFilter(group);
    }
  }

  /**
   * Add a child to the group
   *
   * @param {string} type
   */
  addChild(type) {
    let child;
    let group = this.props.group;

    // Define the child's base data structure depending on specified type
    if (type === 'rule') {
      child = {
        type: 'rule',
      };
    } else {
      child = {
        type: 'group',
        activeOperator: 0,
        children: [
          {
            type: 'rule',
          },
        ],
      };
    }
    group.children.push(child);

    if (this.props.index) {
      // If not base filter group, recursively call update child
      this.props.updateGroup(this.props.index, group);
    } else {
      // Else base filter group, update the filter in the data query component
      this.props.updateFilter(group);
    }
  }

  /**
   * Delete a child
   *
   * @param {number} index
   */
  deleteChild(index) {
    let group = this.props.group;
    group.children.splice(index, 1);

    // Update the groups sessions by calling the arrayintersect.js functions
    group.session = getSessions(group);
    if (this.props.index) {
      // If not base filter group, recursively call update child
      this.props.updateGroup(this.props.index, group);
    } else {
      // Else base filter group, update the filter in the data query component
      this.props.updateFilter(group);
    }
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let logicOperator = (
      <LogicOperator
        logicOperator={this.props.group.activeOperator}
        updateGroupOperator={this.updateGroupOperator}
      />
    );

    // Render the children based on their type
    let children = this.props.group.children.map((child, index) => {
      if (child.type === 'rule') {
        return (
          <li key={index}>
            <FilterRule rule={child}
              items={this.props.items}
              index={index}
              updateRule={this.updateChild}
              updateSessions={this.updateSessions}
              deleteRule={this.deleteChild}
              Visits={this.props.Visits}
            />
          </li>
        );
      } else if (child.type === 'group') {
        return (
          <li key={index}>
            <FilterGroup group={child}
              items={this.props.items}
              index={index}
              updateFilter={this.props.updateFilter} // this.updateChild this.props.updateFilter
              updateGroup={this.updateChild}
              updateSessions={this.updateSessions}
              deleteGroup={this.deleteChild}
              Visits={this.props.Visits}
            />
          </li>
        );
      }
    });

    let deleteButton;

    if (this.props.deleteGroup) {
      // Can only delete a group that isn't the base group
      deleteButton = (
        <button
          className='btn btn-danger btn-sm pull-right'
          onClick={this.props.deleteGroup.bind(this, this.props.index)}
        >
          <span className='glyphicon glyphicon-remove'></span> Delete Group
        </button>
      );
    }
    return (
      <div className='tree'>
        <ul className='firstUL'>
          <li>
            <div className='row'>
              <div className='col-xs-2'>
                {logicOperator}
              </div>
              <div className='col-xs-10'>
                {deleteButton}
                <button className='btn btn-primary btn-sm pull-right'
                  onClick={() => this.addChild('group')}
                >
                  <span className='glyphicon glyphicon-add'></span> Add Group
                </button>
                <button className='btn btn-primary btn-sm pull-right'
                  onClick={() => this.addChild('rule')}
                >
                  <span className='glyphicon glyphicon-add'></span> Add Rule
                </button>
              </div>
            </div>
            <ul>
              {children}
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}
FilterGroup.propTypes = {
  group: PropTypes.object,
  index: PropTypes.number,
  updateGroup: PropTypes.func,
  updateFilter: PropTypes.func,
  updateSessions: PropTypes.func,
  items: PropTypes.array,
  Visits: PropTypes.object,
  deleteGroup: PropTypes.func,
};

/**
 * FilterBuilder Component
 *
 * The following component is the base componenet for the filter builder
 */
class FilterBuilder extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      showModalCSV: false,
    };
    this.openModalCSV = this.openModalCSV.bind(this);
    this.closeModalCSV = this.closeModalCSV.bind(this);
    this.defineCSVCandidates = this.defineCSVCandidates.bind(this);
    this.requestSessions = this.requestSessions.bind(this);
  }

  /**
   * Open the CSV "import data" Modal.
   *
   * @param {object} e
   */
  openModalCSV(e) {
    e.preventDefault();
    this.setState({showModalCSV: true});
  }

  /**
   * Close the CSV "import data" Modal.
   */
  closeModalCSV() {
    this.setState({showModalCSV: false});
  }

  /**
   * requestSessions - get request for session mapping.
   *
   * @param {string} type
   * @param {object} data
   * @param {function} callback
   */
  async requestSessions(type, data, callback) {
    // fetch CandID for PSCID (session) map
    if (type === 'CandID') {
      await fetch(
        window.location.origin
      + '/dqt/Filterbuilder',
        {
          credentials: 'same-origin',
          method: 'GET',
        }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            data = {
              allCandidates: data['allCandidates'],
              mapping: Object.assign({}, ...data['mapping']),
            };
            return callback(data);
          });
        } else {
          response.json().then((data) => {
            console.error(data);
          });
        }
      }).catch((error) => {
        console.error(error);
      });
    }
    return callback(null);
  }

  /**
   * Define the Candidates from CSV.
   *
   * @param {string} type
   * @param {number} operator
   * @param {object} data
   */
  async defineCSVCandidates(type, operator, data) {
    let session = [];
    await this.requestSessions(type, data, (sessions) => {
      if (sessions || type !== 'CandID') {
        let children = [];
        let pscidSessions = [];
        let candidSessions = [];
        for (const item of data) {
          const value = item[0];
          if (value && operator === 1) {
            pscidSessions.push(value);
          }
          const rule = {
            field: type,
            fieldType: 'varchar(255)',
            instrument: 'demographics',
            operator: 'equal',
            session: [
              sessions ? sessions['mapping'][value] ?? '' : value,
            ],
            type: 'rule',
            value: value,
            visit: 'All',
            fields: [{
              id: 'DataDictionary:Demographics',
              key: ['demographics', type],
            }],
          };
          if (type === 'CandID') {
            const sessionKey = sessions
              ? sessions['mapping'][value] ?? '' : value;
            candidSessions.push(sessionKey);
            rule.candidate = {
              allCandidates: {
                [sessionKey]: Object.values(sessions.allCandidates[sessionKey]),
              },
              allSessions: {},
            };
            for (const key of (rule.candidate.allCandidates[sessionKey])) {
              rule.candidate.allSessions[key] = [sessionKey];
            }
          }
          children.push(rule);
        }
        session.push(children);
        const filters = {
          activeOperator: operator,
          session: operator === 1
            ? (type !== 'CandID' ? pscidSessions : candidSessions)
            : [],
          children: children,
        };
        this.props.loadImportedCSV(filters);
        this.closeModalCSV();
      }
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    return (
      <div>
        <ModalImportCSV
          showModalCSV={this.state.showModalCSV}
          closeModalCSV={this.closeModalCSV}
          defineCSVCandidates={this.defineCSVCandidates}
        />
        <div className='row'>
          <h1 className='col-xs-6'
            style={{color: '#0A3572'}}>The Query's Filter</h1>
          <button className='import-csv'
            onClick={this.openModalCSV}>
            Import Population from CSV&nbsp;&nbsp;
            <span className='glyphicon glyphicon-file'/>
          </button>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='well well-primary'>
              <FilterGroup group={this.props.filter}
                items={this.props.items}
                updateFilter={this.props.updateFilter}
                Visits={this.props.Visits}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
FilterBuilder.propTypes = {
  filter: PropTypes.object,
  items: PropTypes.array,
  updateFilter: PropTypes.func,
  Visits: PropTypes.object,
  loadImportedCSV: PropTypes.func,
};

window.LogicOperator = LogicOperator;
window.FilterRule = FilterRule;
window.FilterGroup = FilterGroup;
window.FilterBuilder = FilterBuilder;

export default {
  LogicOperator,
  FilterRule,
  FilterGroup,
  FilterBuilder,
};
