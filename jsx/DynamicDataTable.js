/* exported RDynamicDataTable */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StaticDataTable from 'StaticDataTable';

class DynamicDataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Headers: [],
      Data: [],
      isLoaded: false,
      loadedData: 0,
    };

    this.fetchData = this.fetchData.bind(this);
    this.ajaxSuccess = this.ajaxSuccess.bind(this);
    this.ajaxFailure = this.ajaxFailure.bind(this);
    this.xhrFunction = this.xhrFunction.bind(this);
    this.xhrProgress = this.xhrProgress.bind(this);
  };

  componentDidMount() {
    this.fetchData();
      // Listen for update event to update data table on outside changes
    window.addEventListener('update-datatable', this.fetchData);
  }

  componentWillUnmount() {
      // Unsubscribe from the event before component is destroyed
    window.removeEventListener('update-datatable', this.fetchData);
  }

  fetchData() {
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      cache: false,
      xhr: this.xhrFunction,
      success: this.ajaxSuccess,
      error: this.ajaxFailure,
    });
  }

  xhrFunction() {
    let xhr = new window.XMLHttpRequest();
    xhr.addEventListener('progress', this.xhrProgress);
    return xhr;
  }

  xhrProgress(evt) {
    this.setState({
      loadedData: evt.loaded,
    });
  }

  ajaxSuccess(data) {
    this.setState({
      Headers: data.Headers,
      Data: data.Data,
      isLoaded: true,
    });
  }

  ajaxFailure(data, errorCode, errorMsg) {
    console.error(errorCode + ': ' + errorMsg);
    this.setState({
      error: 'Error loading data',
    });
  }

  render() {
    if (!this.state.isLoaded) {
      if (this.state.error !== undefined) {
        return (
          <div className='alert alert-danger'>
            <strong>{this.state.error}</strong>
          </div>
        );
      }

      return (
        <button className='btn-info has-spinner'>
          Loading
          <span className='glyphicon glyphicon-refresh glyphicon-refresh-animate'/>
        </button>
      );
    }

    return (
      <StaticDataTable
        Headers={this.state.Headers}
        Data={this.state.Data}
        Filter={this.props.Filter}
        getFormattedCell={this.props.getFormattedCell}
        freezeColumn={this.props.freezeColumn}
        onSort={this.props.onSort}
        hiddenHeaders={this.props.hiddenHeaders}
      />
    );
  }
}

DynamicDataTable.propTypes = {
  DataURL: PropTypes.string.isRequired,
  hiddenHeaders: PropTypes.array,
};

DynamicDataTable.defaultProps = {
  DataURL: '',
};

let RDynamicDataTable = React.createFactory(DynamicDataTable);

window.DynamicDataTable = DynamicDataTable;
window.RDynamicDataTable = RDynamicDataTable;

export default DynamicDataTable;
