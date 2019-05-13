import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import SetFlagForm from './setFlagForm';

class DataIntegrityFlagIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component.
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;
    switch (column) {
    case 'Instrument':
      const url = loris.BaseURL + '/data_team_helper/?visit_label=' +
        row['Visit Label'] + '&instrument=' + row.Instrument;
      result = <td><a href={url}>{this.state.data.fieldOptions.instruments[cell]}</a></td>;
      break;
    case 'Flag Status':
      const statusList = this.state.data.fieldOptions.flagStatusList;
      if (Object.keys(statusList).length > 0 && statusList[cell]) {
        result = <td>{statusList[cell]}</td>;
      }
      break;
    case 'User':
      result = <td>{this.state.data.fieldOptions.users[cell]}</td>;
      break;
    }

    return result;
  }

  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

   /**
    * XXX: Currently, the order of these fields MUST match the order of the
    * queried columns in _setupVariables() in data_integrity_flag.class.inc
    */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'ID', show: true},
      {label: 'Visit Label', show: true, filter: {
        name: 'visitLabel',
        type: 'select',
        options: options.visits,
      }},
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: options.instruments,
      }},
      {label: 'Date', show: true},
      {label: 'Flag Status', show: true, filter: {
        name: 'flagStatus',
        type: 'select',
        options: options.flagStatusList,
      }},
      {label: 'Comments', show: true},
      {label: 'User', show: true, filter: {
        name: 'user',
        type: 'select',
        options: options.users,
        }},
    ];
    const tabs = [
      {id: 'browse', label: 'Browse'},
      {id: 'setFlag', label: 'Update'},
    ];

    return (
      <Tabs tabs={tabs} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabs[0].id}>
          <FilterableDataTable
            name="dataIntegrityFlag"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        <TabPane TabId={tabs[1].id}>
          <SetFlagForm
            fieldOptions={this.state.data.fieldOptions}
            updateData={this.fetchData}
          />
        </TabPane>
      </Tabs>
    );
  }
}

DataIntegrityFlagIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <DataIntegrityFlagIndex
      dataURL={`${loris.BaseURL}/data_integrity_flag/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
