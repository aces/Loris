import FilterForm from 'FilterForm';
import formatColumn from './columnFormatter';
import StaticDataTable from 'jsx/components/StaticDataTable';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * DICOM Archive Page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders DICOM Archive main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Alex Ilea
 * @version 1.0.0
 *
 * */
class DicomArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        loris.hiddenHeaders = data.hiddenHeaders ? data.hiddenHeaders : [];
        this.setState({
          Data: data,
          isLoaded: true,
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      },
    });
  }

  updateFilter(filter) {
    this.setState({filter});
  }

  resetFilters() {
    this.dicomFilter.clearFilter();
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    const filterRef = function(f) {
      this.dicomFilter = f;
    }.bind(this);

    return (
      <div>
        <FilterForm
          Module="dicom_archive"
          name="dicom_filter"
          id="dicom_filter"
          ref={filterRef}
          columns={2}
          formElements={this.state.Data.form}
          onUpdate={this.updateFilter}
          filter={this.state.filter}
        >
          <ButtonElement
            label="Clear Filters"
            type="reset"
            onUserInput={this.resetFilters}
          />
        </FilterForm>
        <StaticDataTable
          Data={this.state.Data.Data}
          Headers={this.state.Data.Headers}
          Filter={this.state.filter}
          getFormattedCell={formatColumn}
        />
      </div>
    );
  }
}

DicomArchive.propTypes = {
  Module: PropTypes.string.isRequired,
  DataURL: PropTypes.string.isRequired,
};

/**
 * Render dicom_page on page load
 */
window.onload = function() {
  let dataURL = loris.BaseURL + '/dicom_archive/?format=json';
  let dicomArchive = (
    <DicomArchive
      Module="dicom_archive"
      DataURL={dataURL}
    />
  );

  // Create a wrapper div in which react component will be loaded
  const dicomArchiveDOM = document.createElement('div');
  dicomArchiveDOM.id = 'page-dicom-archive';

  // Append wrapper div to page content
  const rootDOM = document.getElementById('lorisworkspace');
  rootDOM.appendChild(dicomArchiveDOM);

  ReactDOM.render(dicomArchive, document.getElementById('page-dicom-archive'));
};
