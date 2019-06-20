/**
 *  The following file contains the base component for the data query react app.
 *  It also contains the component for the saved queries dropdown.
 *
 *  @author   Jordan Stirling <jstirling91@gmail.com>
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/mohadesz/Loris-Trunk
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/*
 *  The following component is for saved queries dropdown which appears in the
 *  tab bar of the base component.
 */
class SavedQueriesList extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.loadQuery = this.loadQuery.bind(this);
  }

  componentDidMount() {

  }

  loadQuery(queryName) {
    // Loads in the selected query

    this.props.onSelectQuery(
      this.props.queryDetails[queryName].Fields,
      this.props.queryDetails[queryName].Conditions
    );
  }

  render() {
    // Renders the html for the component

    let userSaved = [];
    let globalSaved = [];
    let queryName, curQuery;

    if (this.props.queriesLoaded === false) {
      return <div/>;
    }
    // Build the list for the user queries
    for (let i = 0; i < this.props.userQueries.length; i += 1) {
      curQuery = this.props.queryDetails[this.props.userQueries[i]];
      if (curQuery.Meta && curQuery.Meta.name) {
        queryName = curQuery.Meta.name;
      } else {
        queryName = this.props.userQueries[i];
      }
      userSaved.push(<li key={this.props.userQueries[i]}><a href='#' onClick={this.loadQuery.bind(this, this.props.userQueries[i])}>{queryName}</a></li>);
    }
    // Build the list for the global queries
    for (let i = 0; i < this.props.globalQueries.length; i += 1) {
      curQuery = this.props.queryDetails[this.props.globalQueries[i]];
      if (curQuery.Meta && curQuery.Meta.name) {
        queryName = curQuery.Meta.name;
      } else {
        queryName = this.props.globalQueries[i];
      }
      globalSaved.push(<li key={this.props.globalQueries[i]}><a href='#' onClick={this.loadQuery.bind(this, this.props.globalQueries[i])}>{queryName}</a></li>);
    }
    return (
      <ul className='nav nav-tabs navbar-right'>
        <li className='dropdown'>
          <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>Load Saved Query <span className='caret'></span></a>
          <ul className='dropdown-menu' role='menu'>
            <li role='presentation' className='dropdown-header'>User Saved Queries</li>
            {userSaved}
            <li role='presentation' className='dropdown-header'>Shared Saved Queries</li>
            {globalSaved}
          </ul>
        </li>
        <li role='presentation'><a href='#SavedQueriesTab' data-toggle='tab'>Manage Saved Queries</a></li>
      </ul>
    );
  }
}

SavedQueriesList.propTypes = {
  queryDetails: PropTypes.array,
  queriesLoaded: PropTypes.bool,
};
SavedQueriesList.defaultProps = {
  queryDetails: [],
  queriesLoaded: false,
};

/*
 *  The following component is the data queries base element. It controls which tab is currently
 *  shown, along with keeping the state of the current query being built and running the query.
 */
class DataQueryApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayType: 'Cross-sectional',
      fields: [],
      criteria: {},
      sessiondata: {},
      grouplevel: 0,
      queryIDs: this.props.SavedQueries,
      savedQueries: {},
      queriesLoaded: false,
      alertLoaded: false,
      alertSaved: false,
      alertConflict: {
        show: false
      },
      ActiveTab: 'Info',
      rowData: {},
      filter: {
        type: 'group',
        activeOperator: 0,
        children: [
          {
            type: 'rule'
          }
        ],
        session: this.props.AllSessions
      },
      selectedFields: {},
      downloadableFields: {},
      loading: false
    };
    this.saveFilterRule = this.saveFilterRule.bind(this);
    this.saveFilterGroup = this.saveFilterGroup.bind(this);
    this.saveCurrentQuery = this.saveCurrentQuery.bind(this);
    this.overrideQuery = this.overrideQuery.bind(this);
    this.loadFilterRule = this.loadFilterRule.bind(this);
    this.loadFilterGroup = this.loadFilterGroup.bind(this);
    this.loadSavedQuery = this.loadSavedQuery.bind(this);
    this.fieldVisitSelect = this.fieldVisitSelect.bind(this);
    this.fieldChange = this.fieldChange.bind(this);
    this.getSessions = this.getSessions.bind(this);
    this.runQuery = this.runQuery.bind(this);
    this.getRowData = this.getRowData.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.resetQuery = this.resetQuery.bind(this);
    this.changeDataDisplay = this.changeDataDisplay.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentDidMount() {
    // Before the dataquery is loaded into the window, this function is called to gather
    // any data that was not passed in the initial load.

    // The left and right menu items are part of the same menu, but bootstrap considers
    // them two separate ones, so we need to make sure that only one is selected by removing
    // "active" from all the tab classes and only adding it to the really active one
    let domNode = this;
    $(domNode).find('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
      $(domNode).find('li').removeClass('active');
      if (e.target) {
        e.target.classList.add('active');
        // Both the <li> tag and the <a> tag should be active
        if (e.target.parentNode) {
          e.target.parentNode.classList.add('active');
        }
      }
    });

    // Load the save queries' details
    let promises = [];
    for (let key in this.state.queryIDs) {
      for (let i = 0; i < this.state.queryIDs[key].length; i += 1) {
        let curRequest;
        curRequest = Promise.resolve(
          $.ajax(loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=' + this.state.queryIDs[key][i]), {
            data: {
              DocID: this.state.queryIDs[key][i]
            },
            dataType: 'json'
          }).then((value) => {
          let queries = this.state.savedQueries;

          queries[value._id] = value;
          this.setState({savedQueries: queries});
        });
        promises.push(curRequest);
      }
    }

    let allDone = Promise.all(promises).then((value) => {
      this.setState({'queriesLoaded': true});
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
      this.setState({
        ActiveTab: e.target.getAttribute('href').substr(1)
      });
    });
  }

  saveFilterRule(rule) {
    // Used to build a filter rule for saving query

    let savedRule = {
      field: rule.field,
      operator: rule.operator,
      value: rule.value,
      instrument: rule.instrument,
      visit: rule.visit
    };
    return savedRule;
  }

  saveFilterGroup(group) {
    // Used to build a filter group for saving query

    let savedFilter = {
      activeOperator: group.activeOperator,
      children: []
    };
    // Recursively build the filter groups children
    for (let i = 0; i < group.children.length; i++) {
      if (group.children[i].type === 'rule') {
        savedFilter.children.push(this.saveFilterRule(group.children[i]));
      } else if (group.children[i].type === 'group') {
        savedFilter.children.push(this.saveFilterGroup(group.children[i]));
      }
    }
    return savedFilter;
  }

  saveCurrentQuery(name, shared, override) {
    // Used to save the current query

    let filter = this.saveFilterGroup(this.state.filter);

    $.post(loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=saveQuery.php', {
      Fields: this.state.selectedFields,
      Filters: filter,
      QueryName: name,
      SharedQuery: shared,
      OverwriteQuery: override
    }, (data) => {
      // Once saved, add the query to the list of saved queries
      let id = JSON.parse(data).id,
        queryIDs = this.state.queryIDs;
      if (!override) {
        if (shared === true) {
          queryIDs.Shared.push(id);
        } else {
          queryIDs.User.push(id);
        }
      }
      $.get(loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=GetDoc.php&DocID=' + id,
        (value) => {
          let queries = this.state.savedQueries;

          queries[value._id] = value;
          this.setState({
            savedQueries: queries,
            queryIDs: queryIDs,
            alertLoaded: false,
            alertSaved: true,
            alertConflict: {
              show: false
            }
          });
        });
    }).fail((data) => {
      if (data.status === 409) {
        this.setState({
          alertConflict: {
            show: true,
            QueryName: name,
            SharedQuery: shared
          }
        })
      }
    });
  }

  overrideQuery() {
    this.saveCurrentQuery(
      this.state.alertConflict.QueryName,
      this.state.alertConflict.SharedQuery,
      true
    )
  }

  loadFilterRule(rule) {
    // Used to load in a filter rule

    let script;
    if (!rule.type) {
      rule.type = 'rule'
    }

    // Get given fields of the instrument for the rule.
    // This call is made synchronously
    $.ajax({
      url: loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=datadictionary.php',
      success: (data) => {
        rule.fields = data;
      },
      async: false,
      data: {category: rule.instrument},
      dataType: 'json'
    });

    // Find the rules selected field's data type
    for (let i = 0; i < rule.fields.length; i++) {
      if (rule.fields[i].key[1] === rule.field) {
        rule.fieldType = rule.fields[i].value.Type;
        break;
      }
    }

    // Get the sessions which meet the rules criterias.
    // TODO:    Build the sessions in the new format
    switch (rule.operator) {
      case 'equal':
      case 'isNull':
        script = 'queryEqual.php';
        break;
      case 'notEqual':
      case 'isNotNull':
        script = 'queryNotEqual.php';
        break;
      case 'lessThanEqual':
        script = 'queryLessThanEqual.php';
        break;
      case 'greaterThanEqual':
        script = 'queryGreaterThanEqual.php';
        break;
      case 'startsWith':
        script = 'queryStartsWith.php';
        break;
      case 'contains':
        script = 'queryContains.php';
        break;
      default:
        break;
    }
    $.ajax({
      url: loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=' + script,
      success: (data) => {
        let i,
          allSessions = {},
          allCandiates = {};
        // Loop through data and divide into individual visits with unique PSCIDs
        // storing a master list of unique PSCIDs
        for (i = 0; i < data.length; i++) {
          if (!allSessions[data[i][1]]) {
            allSessions[data[i][1]] = [];
          }
          allSessions[data[i][1]].push(data[i][0]);
          if (!allCandiates[data[i][0]]) {
            allCandiates[data[i][0]] = []
          }
          allCandiates[data[i][0]].push(data[i][1]);
        }
        rule.candidates = {
          allCandiates: allCandiates,
          allSessions: allSessions
        };
        if (rule.visit === 'All') {
          rule.session = Object.keys(allCandiates);
        } else {
          if (allSessions[rule.visit]) {
            rule.session = allSessions[rule.visit];
          } else {
            rule.session = [];
          }
        }
      },
      async: false,
      data: {
        category: rule.instrument,
        field: rule.field,
        value: rule.value
      },
      dataType: 'json'
    });

    return rule;
  }

  loadFilterGroup(group) {
    // Used to load in a filter group

    // Recursively load the children on the group
    for (let i = 0; i < group.children.length; i++) {
      if (group.children[i].activeOperator) {
        if (!group.children[i].type) {
          group.children[i].type = 'group'
        }
        group.children[i] = this.loadFilterGroup(group.children[i]);
      } else {
        group.children[i] = this.loadFilterRule(group.children[i]);
      }
    }
    group.session = getSessions(group);
    return group;
  }

  loadSavedQuery(fields, criteria) {
    // Used to load a saved query

    let filterState = {},
      selectedFields = {},
      fieldsList = [];
    this.setState({loading: true});
    if (Array.isArray(criteria)) {
      // This is used to load a query that is saved in the old format
      // so translate it into the new format, grouping the given critiras
      // into a filter group

      filterState = {
        type: 'group',
        activeOperator: 0,
        children: []
      };
      filterState.children = criteria.map((item) => {
        let fieldInfo = item.Field.split(',');
        let rule = {
          instrument: fieldInfo[0],
          field: fieldInfo[1],
          value: item.Value,
          type: 'rule',
          visit: 'All'
        };
        switch (item.Operator) {
          case '=':
            rule.operator = 'equal';
            break;
          case '!=':
            rule.operator = 'notEqual';
            break;
          case '<=':
            rule.operator = 'lessThanEqual';
            break;
          case '>=':
            rule.operator = 'greaterThanEqual';
            break;
          default:
            rule.operator = item.Operator;
            break;
        }
        return rule;
      });

      let fieldSplit;
      fieldsList = fields;
      for (let i = 0; i < fields.length; i++) {
        fieldSplit = fields[i].split(',');
        if (!selectedFields[fieldSplit[0]]) {
          selectedFields[fieldSplit[0]] = {};
          selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
          selectedFields[fieldSplit[0]].allVisits = {};
          for (let key in this.props.Visits) {
            selectedFields[fieldSplit[0]].allVisits[key] = 1;
            selectedFields[fieldSplit[0]][fieldSplit[1]][key] = [key];
          }
        } else {
          selectedFields[fieldSplit[0]][fieldSplit[1]] = {};
          for (let key in this.props.Visits) {
            selectedFields[fieldSplit[0]].allVisits[key]++;
            selectedFields[fieldSplit[0]][fieldSplit[1]][key] = [key];
          }
        }
      }
    } else {
      // Query was saved in the new format
      filterState = criteria;
      selectedFields = fields;
      for (let instrument in fields) {
        for (let field in fields[instrument]) {
          if (field !== 'allVisits') {
            fieldsList.push(instrument + ',' + field);
          }
        }
      }
    }
    if (filterState.children && filterState.children.length > 0) {
      filterState = this.loadFilterGroup(filterState);
    } else {
      filterState.children = [
        {
          type: 'rule'
        }
      ];
      filterState.session = this.props.AllSessions;
    }
    this.setState({
      fields: fieldsList,
      selectedFields: selectedFields,
      filter: filterState,
      alertLoaded: true,
      alertSaved: false,
      loading: false,
    });
    for (let i = 0; i < fieldsList.length; i++) {
      $.ajax({
        url: loris.BaseURL + '/dataquery/ajax/datadictionary.php',
        success: (data) => {
          if (data[0].value.IsFile) {
            let key = data[0].key[0] + ',' + data[0].key[1];
            let downloadable = this.state.downloadableFields;
            downloadable[key] = true;
            this.setState({
              downloadableFields: downloadable,
            })
          }
        },
        data: {key: fieldsList[i]},
        dataType: 'json'
      });
    }
  }

  fieldVisitSelect(action, visit, field) {
    // Used to select visits for a given field
    this.setState((state) => {
      let temp = state.selectedFields[field.instrument];
      if (action === 'check') {
        // Adding a new visit for field, add visit to field and
        // increase count of visit in allVisits
        temp[field.field][visit] = visit;
        if (temp.allVisits[visit]) {
          temp.allVisits[visit]++;
        } else {
          temp.allVisits[visit] = 1;
        }
      } else {
        // Removing visit, delete visit from field
        delete temp[field.field][visit];
        if (temp.allVisits[visit] === 1) {
          // If visit count in allVisits is 1 delete visit from
          // allVisits
          delete temp.allVisits[visit];
        } else {
          // Else decrement count of visit in allVisists
          temp.allVisits[visit]--;
        }
      }
      return temp;
    });
  }

  fieldChange(fieldName, category, downloadable) {
    // Used to add and remove fields from the current query being built

    this.setState((state) => {
      let selectedFields = state.selectedFields,
        fields = state.fields.slice(0);
      if (!selectedFields[category]) {
        // The given category has no selected fields, add the category to the selectedFields
        selectedFields[category] = {};
        // Add all visits to the given field for the given category
        selectedFields[category][fieldName] = JSON.parse(JSON.stringify(this.props.Visits));
        // Add all visits to the given category, initializing their counts to 1
        selectedFields[category].allVisits = {};
        for (let key in this.props.Visits) {
          selectedFields[category].allVisits[key] = 1;
        }

        // Add field to the field list
        fields.push(category + ',' + fieldName);

        if (downloadable) {
          // If the field is downloadable add to the list of downloadable fields
          state.downloadableFields[category + ',' + fieldName] = true;
        }
      } else if (selectedFields[category][fieldName]) {
        // Remove the field from the selectedFields
        for (let key in selectedFields[category][fieldName]) {
          // Decrement the count of field's visits, delete visit if count is 1
          if (selectedFields[category].allVisits[key] === 1) {
            delete selectedFields[category].allVisits[key];
          } else {
            selectedFields[category].allVisits[key]--;
          }
        }
        delete selectedFields[category][fieldName];

        // Find the given field in the fields list and remove it
        let idx = fields.indexOf(category + ',' + fieldName);
        fields.splice(idx, 1);

        if (Object.keys(selectedFields[category]).length === 1) {
          // If no more fields left for category, delete category from
          // selectedFields
          delete selectedFields[category];
        }

        if (downloadable) {
          // If the field was downloadable, delete it from the downloadable list
          delete state.downloadableFields[category + ',' + fieldName];
        }
      } else {
        // The category already has fields but not the desired one, add it
        if (!selectedFields[category][fieldName]) {
          selectedFields[category][fieldName] = {};
        }

        // Increment the visit count for the visit, setting it to 1 if doesn't exist
        for (let key in selectedFields[category].allVisits) {
          if (key === 'allVisits') {
            continue;
          }
          selectedFields[category].allVisits[key]++;
          selectedFields[category][fieldName][key] = key;
        }
        fields.push(category + ',' + fieldName);
        if (downloadable) {
          // If the field is downloadable add to the list of downloadable fields
          state.downloadableFields[category + ',' + fieldName] = true;
        }
      }
      return {
        selectedFields: selectedFields,
        fields: fields
      };
    });
  }

  getSessions() {
    // Get the sessions to be selected

    if (this.state.filter.children.length > 0) {
      // If filter exists return filter sessions
      return this.state.filter.session;
    } else {
      // Else return all sessions
      return this.props.AllSessions;
    }
  }

  runQuery(fields, sessions) {
    // Run the current query

    let DocTypes = [],
      semaphore = 0,
      sectionedSessions,
      ajaxComplete = () => {
        // Wait until all ajax calls have completed before computing the rowdata
        if (semaphore == 0) {
          let rowdata = this.getRowData(this.state.grouplevel);
          this.setState({
            rowData: rowdata,
            loading: false
          });
        }
      };

    // Reset the rowData and sessiondata
    this.setState({
      rowData: {},
      sessiondata: {},
      loading: true
    });

    // Get list of DocTypes to be retrieved
    for (let i = 0; i < fields.length; i += 1) {
      let field_split = fields[i].split(',');
      let category = field_split[0];

      // Check if the current category has already been queried, if so skip
      if (DocTypes.indexOf(category) === -1) {
        let sessionInfo = [];

        // Build the session data to be queried for the given category
        for (let j = 0; j < this.state.filter.session.length; j++) {
          if (Array.isArray(this.state.filter.session[j])) {
            if (this.state.selectedFields[category].allVisits[this.state.filter.session[j][1]]) {
              sessionInfo.push(this.state.filter.session[j]);
            }
          } else {
            for (let key in this.state.selectedFields[category].allVisits) {
              let temp = [];

              temp.push(this.state.filter.session[j]);
              // Add the visit to the temp variable then add to the sessions to be queried
              temp.push(key);
              sessionInfo.push(temp);
            }
          }
        }

        DocTypes.push(category);
        // keep track of the number of requests waiting for a response
        semaphore++;
        sectionedSessions = JSON.stringify(sessionInfo);
        $.ajax({
          type: 'POST',
          url: loris.BaseURL + '/AjaxHelper.php?Module=dataquery&script=retrieveCategoryDocs.php',
          data: {
            DocType: category,
            Sessions: sectionedSessions
          },
          dataType: 'text',
          success: (data) => {
            if (data) {
              let i, row, rows, identifier,
                sessiondata = this.state.sessiondata;
              data = JSON.parse(data);
              rows = data.rows;
              for (i = 0; i < rows.length; i += 1) {
                /*
                 * each row is a JSON object of the
                 * form:
                 * {
                 *  "key" : [category, pscid, vl],
                 *  "value" : [pscid, vl],
                 *  "doc": {
                 *      Meta: { stuff }
                 *      data: { "FieldName" : "Value", .. }
                 * }
                 */
                row = rows[i];
                identifier = row.value;
                if (!sessiondata.hasOwnProperty(identifier)) {
                  sessiondata[identifier] = {}
                }

                sessiondata[identifier][row.key[0]] = row.doc;

              }
              this.setState({'sessiondata': sessiondata});
            }
            semaphore--;
            ajaxComplete();
          }
        });
      }
    }
  }

  getRowData(displayID) {
    // Build the queried data to be displayed in the data table

    let sessiondata = this.state.sessiondata;
    let sessions = this.getSessions();
    let fields = this.state.fields.sort();
    let downloadableFields = this.state.downloadableFields;
    let i, j;
    let rowdata = [];
    let currow = [];
    let Identifiers = [];
    let RowHeaders = [];
    let fileData = [];
    let href;

    if (displayID === 0) {
      // Displaying the data in the cross-sectional way

      // Add the fields as the tables headers
      for (i = 0; fields && i < fields.length; i += 1) {
        RowHeaders.push(fields[i]);
      }

      // Build the table rows, using the session data as the row identifier
      for (let session in sessiondata) {
        currow = [];
        for (i = 0; fields && i < fields.length; i += 1) {
          let fieldSplit = fields[i].split(',');
          currow[i] = '.';
          let sd = sessiondata[session];
          if (sd[fieldSplit[0]] && sd[fieldSplit[0]].data[fieldSplit[1]] && downloadableFields[fields[i]]) {
            // If the current field has data and is downloadable, create a download link
            href = loris.BaseURL + '/mri/jiv/get_file.php?file=' + sd[fieldSplit[0]].data[fieldSplit[1]];
            currow[i] = (
              <a href={href}>
                {sd[fieldSplit[0]].data[fieldSplit[1]]}
              </a>
            );
            fileData.push('file/' + sd[fieldSplit[0]]._id + '/' + encodeURIComponent(sd[fieldSplit[0]].data[fieldSplit[1]]));
          } else if (sd[fieldSplit[0]]) {
            // else if field is not null add data and string
            currow[i] = sd[fieldSplit[0]].data[fieldSplit[1]];
          }
        }
        rowdata.push(currow);
        Identifiers.push(session);
      }
    } else {
      // Displaying the data in the longitudinal way

      let Visits = {},
        visit, identifier, temp, colHeader, index, instrument, fieldSplit;

      // Loop trough session data building the row identifiers and desired visits
      for (let session in sessiondata) {
        temp = session.split(',');
        visit = temp[1];
        if (!Visits[visit]) {
          Visits[visit] = true;
        }
        identifier = temp[0];
        if (Identifiers.indexOf(identifier) === -1) {
          Identifiers.push(identifier);
        }
      }

      // Loop through the desired fields, adding a row header for each visit if it
      // has been selected in the build phase
      for (i = 0; fields && i < fields.length; i += 1) {
        for (visit in Visits) {
          temp = fields[i].split(',');
          instrument = this.state.selectedFields[temp[0]]
          if (instrument && instrument[temp[1]] && instrument[temp[1]][visit]) {
            RowHeaders.push(visit + ' ' + fields[i])
          }
        }
      }

      // Build the row data for the giving identifiers and headers
      for (identifier in Identifiers) {
        currow = [];
        for (colHeader in RowHeaders) {
          temp = Identifiers[identifier] + ',' + RowHeaders[colHeader].split(' ')[0];
          index = sessiondata[temp];
          if (!index) {
            currow.push('.');
          } else {
            temp = index[RowHeaders[colHeader].split(',')[0].split(' ')[1]];
            fieldSplit = RowHeaders[colHeader].split(' ')[1].split(',');
            if (temp) {
              if (temp.data[RowHeaders[colHeader].split(',')[1]] && downloadableFields[fieldSplit[0] + ',' + fieldSplit[1]]) {
                // Add a downloadable link if the field is set and downloadable
                href = loris.BaseURL + '/mri/jiv/get_file.php?file=' + temp.data[RowHeaders[colHeader].split(',')[1]];
                temp = (
                  <a href={href}>
                    {temp.data[RowHeaders[colHeader].split(',')[1]]}
                  </a>
                );
              } else {
                temp = temp.data[RowHeaders[colHeader].split(',')[1]];
              }
            } else {
              temp = '.';
            }
            currow.push(temp);
          }
        }
        rowdata.push(currow);
      }
    }
    return {rowdata: rowdata, Identifiers: Identifiers, RowHeaders: RowHeaders, fileData: fileData};
  }

  dismissAlert() {
    // Used to dismiss alerts
    this.setState({
      alertLoaded: false,
      alertSaved: false,
      alertConflict: {
        show: false
      }
    });
  }

  resetQuery() {
    // Used to reset the current query
    this.setState({
      fields: [],
      criteria: {},
      selectedFields: {}
    });
  }

  changeDataDisplay(displayID) {
    // Change the display format of the data table
    let rowdata = this.getRowData(displayID);
    this.setState({
      grouplevel: displayID,
      rowData: rowdata
    });
  }

  updateFilter(filter) {
    // Update the filter
    if (filter.children.length === 0) {
      filter.session = this.props.AllSessions
    }
    this.setState({filter});
  }

  render() {
    // Renders the html for the component

    let tabs = [];
    let tabsNav = [];
    let alert = <div/>;

    // Add the info tab
    tabs.push(<InfoTabPane
      key='Info'
      TabId='Info'
      UpdatedTime={this.props.UpdatedTime}
      Loading={this.state.loading}
      Active={this.state.ActiveTab == 'Info'}
    />);

    // Add the field select tab
    tabs.push(<FieldSelectTabPane
      key='DefineFields'
      TabId='DefineFields'
      categories={this.props.categories}
      onFieldChange={this.fieldChange}
      selectedFields={this.state.selectedFields}
      Visits={this.props.Visits}
      fieldVisitSelect={this.fieldVisitSelect}
      Loading={this.state.loading}
      Active={this.state.ActiveTab == 'DefineFields'}
    />);

    // Add the filter builder tab
    tabs.push(<FilterSelectTabPane
        key='DefineFilters'
        TabId='DefineFilters'
        categories={this.props.categories}
        filter={this.state.filter}
        updateFilter={this.updateFilter}
        Visits={this.props.Visits}
        Loading={this.state.loading}
        Active={this.state.ActiveTab == 'DefineFilters'}
      />
    );

    // Define the data displayed type and add the view data tab
    let displayType = (this.state.grouplevel === 0) ? "Cross-sectional" : "Longitudinal";
    tabs.push(<ViewDataTabPane
      key='ViewData'
      TabId='ViewData'
      Active={this.state.ActiveTab == 'ViewData'}
      Fields={this.state.fields}
      Criteria={this.state.criteria}
      Sessions={this.getSessions()}
      Data={this.state.rowData.rowdata}
      RowInfo={this.state.rowData.Identifiers}
      RowHeaders={this.state.rowData.RowHeaders}
      FileData={this.state.rowData.fileData}
      onRunQueryClicked={this.runQuery}
      displayType={displayType}
      changeDataDisplay={this.changeDataDisplay}
      Loading={this.state.loading}
      runQuery={this.runQuery}
    />);

    // Add the stats tab
    tabs.push(<StatsVisualizationTabPane
      key='Statistics'
      TabId='Statistics'
      Active={this.state.ActiveTab == 'Statistics'}
      Fields={this.state.rowData.RowHeaders}
      Data={this.state.rowData.rowdata}
      Loading={this.state.loading}
    />);

    // Add the manage saved queries tab
    tabs.push(<ManageSavedQueriesTabPane
      key='SavedQueriesTab'
      TabId='SavedQueriesTab'
      userQueries={this.state.queryIDs.User}
      globalQueries={this.state.queryIDs.Shared}
      onSaveQuery={this.saveCurrentQuery}
      queryDetails={this.state.savedQueries}
      queriesLoaded={this.state.queriesLoaded}
      Loading={this.state.loading}
    />);

    // Display load alert if alert is present
    if (this.state.alertLoaded) {
      alert = (
        <div className='alert alert-success' role='alert'>
          <button type='button' className='close' aria-label='Close' onClick={this.dismissAlert}>
            <span aria-hidden='true'>&times;</span>
          </button>
          <strong>Success</strong> Query Loaded.
        </div>
      )
    }

    // Display save alert if alert is present
    if (this.state.alertSaved) {
      alert = (
        <div className='alert alert-success' role='alert'>
          <button type='button' className='close' aria-label='Close' onClick={this.dismissAlert}>
            <span aria-hidden='true'>&times;</span>
          </button>
          <strong>Success</strong> Query Saved.
        </div>
      )
    }

    // Display Conflict Query alert
    if (this.state.alertConflict.show) {
      alert = (
        <div className='alert alert-warning' role='alert'>
          <button type='button' className='close' aria-label='Close' onClick={this.dismissAlert}>
            <span aria-hidden='true'>&times;</span>
          </button>
          <button type='button' className='close' aria-label='Close' onClick={this.dismissAlert}>
            <span aria-hidden='true'>Override</span>
          </button>
          <strong>Error</strong> Query with the same name already exists.
          <a href='#' class='alert-link' onClick={this.overrideQuery}>Click here to override</a>
        </div>
      )
    }

    let widthClass = 'col-md-12';
    let sideBar = <div/>;

    // Display the field sidebar for certain tabs
    if (this.state.fields.length > 0
      && this.state.ActiveTab !== 'ViewData'
      && this.state.ActiveTab !== 'Statistics'
      && this.state.ActiveTab !== 'Info'
    ) {
      widthClass = 'col-md-10';
      sideBar = <div className='col-md-2'>
        <FieldsSidebar
          Fields={this.state.fields}
          Criteria={this.state.criteria}
          resetQuery={this.resetQuery}
        />
      </div>;
    }
    return <div>
      {alert}
      <div className={widthClass}>
        <nav className='nav nav-tabs'>
          <ul className='nav nav-tabs navbar-left' data-tabs='tabs'>
            <li role='presentation' className='active'><a href='#Info' data-toggle='tab'>Info</a></li>
            <li role='presentation'><a href='#DefineFields' data-toggle='tab'>Define Fields</a></li>
            <li role='presentation'><a href='#DefineFilters' data-toggle='tab'>Define Filters</a></li>
            <li role='presentation'><a href='#ViewData' data-toggle='tab'>View Data</a></li>
            <li role='presentation'><a href='#Statistics' data-toggle='tab'>Statistical Analysis</a></li>
          </ul>
          <SavedQueriesList
            userQueries={this.state.queryIDs.User}
            globalQueries={this.state.queryIDs.Shared}
            queryDetails={this.state.savedQueries}
            queriesLoaded={this.state.queriesLoaded}
            onSelectQuery={this.loadSavedQuery}
            loadedQuery={this.state.loadedQuery}
          />
        </nav>
        <div className='tab-content'>
          {tabs}
        </div>
      </div>
      {sideBar}

    </div>;
  }
}

DataQueryApp.propTypes = {
  SavedQueries: PropTypes.array,
  AllSessions: PropTypes.array,
};

DataQueryApp.defaultProps = {
  SavedQueries: [],
  AllSessions: [],
};


window.SavedQueriesList = SavedQueriesList;
window.DataQueryApp = DataQueryApp;
window.RDataQueryApp = React.createFactory(DataQueryApp);

export default DataQueryApp;
