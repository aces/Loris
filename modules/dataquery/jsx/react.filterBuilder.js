/**
 *  The following file contains the components used for the filter builder tab
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

import React, {Component} from 'react';

/*
 *  The following component is used for displaying operator for the group component
 */
class LogicOperator extends Component {
  constructor(props) {
    super(props);
    this.changeOperator = this.changeOperator.bind(this);
  }

  changeOperator(op) {
    // Wrapper function updating operator
    this.props.updateGroupOperator(op);
  }

  render() {
    // Renders the html for the component

    let andClass = 'btn',
      orClass = 'btn';

    // Set operator to OR if logicOperator is 1, AND otherwise
    if (this.props.logicOperator === 1) {
      orClass += ' btn-primary';
      andClass += ' switch'
    } else {
      andClass += ' btn-primary';
      orClass += ' switch'
    }
    return (
      <div className='btn-group' role='group'>
        <button type='button' className={andClass} onClick={this.changeOperator.bind(this, 0)}>And</button>
        <button type='button' className={orClass} onClick={this.changeOperator.bind(this, 1)}>Or</button>
      </div>
    );
  }
}

/*
 *  The following component is used for displaying a filter rule
 */
class FilterRule extends Component {
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
        isNotNull: 'isNotNull'
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

  componentWillMount() {
    this.valueSet = loris.debounce(this.valueSet, 1000);
  }

  selectInstrument(event) {
    // Update the rules instrument, getting the instruments avalible fields
    let rule = this.props.rule;
    if (event.target.value) {
      rule.instrument = event.target.value;
      $.get(loris.BaseURL + '/dataquery/ajax/datadictionary.php', {category: rule.instrument}, (data) => {
        rule.fields = data;
        this.props.updateRule(this.props.index, rule);
      }, 'json');
    }
  }

  fieldSelect(event) {
    // Update the rules desired field, setting the rules field and field type
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
        value: 'null'
      });
      this.valueSet();
    }
  }

  valueChange(event) {
    let rule = JSON.parse(JSON.stringify(this.props.rule));
    delete rule.visit;
    delete rule.candidates;

    rule.value = event.target.value;

    this.setState({
      value: event.target.value
    });
    this.valueSet();
    this.props.updateRule(this.props.index, rule);
  }

  valueSet() {
    // Update the value to filter for, and runs the query for the rules parameters
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
        $.get(loris.BaseURL + '/dataquery/ajax/' + script,
          {
            category: rule.instrument,
            field: rule.field,
            value: this.state.value,
          },
          responseHandler,
          'json',
        );
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

  updateVisit(event) {
    // Update rule to filter for specified visit
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

  render() {
    // Renders the html for the component

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
          <option key={index} value={index}>{field.key[1]}</option>
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
        inputType = this.props.rule.fieldType.split("(");
        operatorKey = inputType[0]
        for (let key in this.state.operators) {
          operators.push(
            <option value={key} onChange={this.operatorSelect}>
              {this.state.operators[key]}
            </option>
          );
        }
        value = (this.props.rule.operator) ? this.props.rule.operator : "";
        operatorSelect = (
          <select className="input-sm col-xs-3 " onChange={this.operatorSelect} value={value}>
            <option value=""></option>
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
              value = (this.props.rule.value) ? this.props.rule.value : '';
              input = (
                <select className='input-sm col-xs-3' onChange={this.valueChange} value={value}>
                  <option value=''></option>
                  {options}
                </select>
              );
              break;
            default:
              input = (
                <input type='text'
                       className='input-sm col-xs-3'
                       onChange={this.valueChange}
                       value={this.props.rule.value}
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
            <select className='input-sm col-xs-3' onChange={this.updateVisit} value={this.props.rule.visit}>
              <option value='all'>All Visits</option>
              {visits}
            </select>
          );
        }
      }
      rule = (
        <div>
          <div className='col-xs-12'>
            <label className='instrumentLabel'>{this.props.rule.instrument}</label>
          </div>
          <div className='col-xs-10'>
            <select className='input-sm col-xs-3' onChange={this.fieldSelect} value={fieldIndex}>
              <option value=''></option>
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
      let options = this.props.items.map((item, index) => {
        return (
          <option key={index} value={item.category}>{item.category}</option>
        );
      });
      rule = (
        <select onChange={this.selectInstrument} className="input-sm col-xs-10">
          <option value=''></option>
          {options}
        </select>
      )
    }
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          {rule}
          <div className='col-xs-2'>
            <button className='btn btn-danger btn-sm pull-right'
                    onClick={this.props.deleteRule.bind(this, this.props.index)}
            >
              <span className='glyphicon glyphicon-remove'></span> Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/*
 *  The following component is used for displaying a filter group
 */
class FilterGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateChild = this.updateChild.bind(this);
    this.updateGroupOperator = this.updateGroupOperator.bind(this);
    this.updateSessions = this.updateSessions.bind(this);
    this.addChild = this.addChild.bind(this);
    this.deleteChild = this.deleteChild.bind(this);
  }

  updateChild(index, child) {
    // Update a specified child in the groups children

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

  updateGroupOperator(operator) {
    // Update the group's operator
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

  updateSessions(index, child) {
    // Computes the desired sessions of the current group
    let group = this.props.group,
      sessions = [],
      session = [];
    group.children[index] = child;

    // Update the groups sessions by calling the arrayintersect.js functions
    group.session = getSessions(group);
    if (this.props.index) {
      // If not base filter group, recursively call update parents session
      this.props.updateSessions(this.props.index, group);
    } else {
      // Else base filter group, update the filter in the data query component
      this.props.updateFilter(group)
    }
  }

  addChild(type) {
    // Add a child to the group
    let child,
      group = this.props.group;

    // Define the child's base data structure depending on specifed type
    if (type === 'rule') {
      child = {
        type: 'rule'
      }
    } else {
      child = {
        type: 'group',
        activeOperator: 0,
        children: [
          {
            type: 'rule'
          }
        ]
      }
    }
    group.children.push(child);

    if (this.props.index) {
      // If not base filter group, recursively call update child
      this.props.updateGroup(this.props.index, group);
    } else {
      // Else base filter group, update the filter in the data query component
      this.props.updateFilter(group)
    }
  }

  deleteChild(index) {
    // Delete a child

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

  render() {
    // Renders the html for the component
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
                        onClick={this.addChild.bind(this, 'group')}
                >
                  <span className='glyphicon glyphicon-add'></span> Add Group
                </button>
                <button className='btn btn-primary btn-sm pull-right'
                        onClick={this.addChild.bind(this, 'rule')}
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

/*
 *  The following component is the base componenet for the filter builder
 */
class FilterBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1 className='col-xs-12'>Filter</h1>
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
    );
  }
}

window.LogicOperator = LogicOperator;
window.FilterRule = FilterRule;
window.FilterGroup = FilterGroup;
window.FilterBuilder = FilterBuilder;

export default {
  LogicOperator,
  FilterRule,
  FilterGroup,
  FilterBuilder
};
