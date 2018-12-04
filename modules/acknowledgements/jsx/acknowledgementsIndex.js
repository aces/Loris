import React, {Component} from 'react';
import PropTypes from 'prop-types';

// import Panel from 'Panel';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class AcknowledgementsIndex extends Component {
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
    return <td>{cell}</td>;
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
    * queried columns in _setupVariables() in acknowledgements.class.inc
    */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'Ordering', show: true},
      {label: 'Full Name', show: true, filter: {
        name: 'fullName',
        type: 'text',
      }},
      {label: 'Citation Name', show: true, filter: {
        name: 'citationName',
        type: 'text',
      }},
      {label: 'Affiliations', show: true},
      {label: 'Degrees', show: true},
      {label: 'Roles', show: true},
      {label: 'Start Date', show: true, filter: {
        name: 'startDate',
        type: 'date',
      }},
      {label: 'End Date', show: true, filter: {
        name: 'startDate',
        type: 'date',
        }},
      {label: 'Present', show: true, filter: {
        name: 'present',
        type: 'select',
        options: options.presents,
      }},
    ];

    // const citationPolicy = (
    //  <Panel
    //    id="citationPolicy"
    //    title="Citation Policy"
    //  >
    //    <div className="col-sm-12 col-md-12">
    //      <span>{this.state.data.citation_policy}</span>
    //    </div>
    //  </Panel>
    // );

    const addButton = (
      <ButtonElement
        name="addAcknowledgement"
        label="Add Acknowledgement"
        type="button"
        buttonClass="btn btn-sm btn-primary col-xs-12 addCTA"
        columnSize="col-sm-3 col-md-2 col-xs-12 pull-right"
        onUserInput={this.openModalForm}
      />
    );

    return (
      <div id="acknowledgementsIndex">
          <div id="addAcknowledgements">
            {addButton}
          </div>
        <div id="acknowledgementsFilter">
          <FilterableDataTable
            name="acknowledgements"
            data={this.state.data.Data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        </div>
      </div>
    );
  }
}

AcknowledgementsIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
  ReactDOM.render(
    <AcknowledgementsIndex
      dataURL={`${loris.BaseURL}/acknowledgements/?format=json`}
      hasPermission={loris.userHasPermission}
    />,
    document.getElementById('lorisworkspace')
  );
});
