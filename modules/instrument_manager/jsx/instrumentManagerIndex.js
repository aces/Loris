import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import InstrumentUploadForm from './uploadForm';

class InstrumentManagerIndex extends Component {
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
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
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
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    // Set class to 'bg-danger' if file is hidden.
    return (
      <td>{cell}</td>
    );
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

    const fields = [
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'text',
      }},
      {label: 'Instrument Type', show: true, filter: {
        name: 'instrument_type',
        type: 'select',
        options: {
          'Instrument Builder': 'Instrument Builder',
          'PHP': 'PHP',
          'Missing': 'Missing',
        },
      }},
      {label: 'Table Installed', show: true, filter: {
        name: 'table_installed',
        type: 'select',
        options: {
          'Exists': 'Exists',
          'Missing': 'Missing',
        },
      }},
      {label: 'Table Valid', show: true, filter: {
        name: 'table_valid',
        type: 'text',
      }},
      {label: 'Pages Valid', show: true, filter: {
        name: 'pages_valid',
        type: 'text',
      }},
    ];

    const tabs = [{id: 'browse', label: 'Browse'}];

    const uploadTab = () => {
      if (this.state.data.writable) {
        let url = loris.BaseURL.concat('/instrument_manager/?format=json');
        tabs.push({
          id: 'upload',
          label: 'Upload',
        });
        return (
          <TabPane TabId='upload'>
            <InstrumentUploadForm action={url}/>
          </TabPane>
        );
      }
    };

    const feedbacks = () => {
      if (this.state.data.feedback.length > 0) {
        let items = this.state.data.feedback.map(function(f, i) {
          return (
            <span key={i}>{f}</span>
          );
        });
        feedback = (
          <div class="alert alert-warning">
            {items}
          </div>
        );
      }
    };

    return (
      <Tabs tabs={tabs} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabs[0].id}>
          {feedbacks()}
          <FilterableDataTable
            name="instrument_manager"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </TabPane>
        {uploadTab()}
      </Tabs>
    );
  }
}

InstrumentManagerIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <InstrumentManagerIndex
      dataURL={`${loris.BaseURL}/instrument_manager/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
