import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class SurveyAccountsIndex extends Component {
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
    let result = <td>{cell}</td>;
    switch (column) {
    case 'URL':
      const url = loris.BaseURL + '/survey.php?key=' + row.URL;
      result = <td><a href={url}>{cell}</a></td>;
      break;
    case 'Instrument':
      result = <td>{this.state.data.fieldOptions.instruments[cell]}</td>;
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
    * queried columns in _setupVariables() in survey_accounts.class.inc
    */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'PSCID', show: true, filter: {
        name: 'pscid',
        type: 'text',
      }},
      {label: 'Visit', show: true, filter: {
        name: 'visit',
        type: 'select',
        options: options.visits,
      }},
      {label: 'Email', show: true, filter: {
        name: 'email',
        type: 'text',
      }},
      {label: 'Instrument', show: true, filter: {
        name: 'instrument',
        type: 'select',
        options: options.instruments,
      }},
      {label: 'URL', show: true},
      {label: 'Status', show: true},
    ];
  const addSurvey = () => {
    window.location.replace(
      loris.BaseURL+'/survey_accounts/addSurvey/'
    );
  };
  const actions = [
    {label: 'Add Survey', action: addSurvey},
  ];

    return (
       <FilterableDataTable
         title="Survey Accounts"
         data={this.state.data.Data}
         fields={fields}
         getFormattedCell={this.formatColumn}
         actions={actions}
       />
    );
  }
}

SurveyAccountsIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <SurveyAccountsIndex
      dataURL={`${loris.BaseURL}/survey_accounts/?format=json`}
    />,
    document.getElementById('lorisworkspace')
  );
});
