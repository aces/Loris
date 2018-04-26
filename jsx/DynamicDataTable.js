/* exported RDynamicDataTable */
import {Component} from 'react';
import PropTypes from 'prop-types';

import StaticDataTable from 'jsx/StaticDataTable';

class DynamicDataTable extends Component {
  constructor() {
    super();

    this.state = {
      Headers: [],
      Data: [],
      isLoaded: false,
      loadedData: 0
    };

    this.fetchData = this.fetchData.bind(this);
  }

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
    var that = this;
    $.ajax(this.props.DataURL, {
      dataType: 'json',
      cache: false,
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function(evt) {
          that.setState({
            loadedData: evt.loaded
          });
        });
        return xhr;
      },
      success: function(data) {
        that.setState({
          Headers: data.Headers,
          Data: data.Data,
          isLoaded: true
        });
      },
      error: function(data, errorCode, errorMsg) {
        console.error(errorCode + ': ' + errorMsg);
        that.setState({error: "Error loading data"});
      }
    });
  }

  render() {
    if (!this.state.isLoaded) {

      if (this.state.error !== undefined) {
        return (
          <div className="alert alert-danger">
            <strong>{this.state.error}</strong>
          </div>
        );
      }

      return (
        <button className="btn-info has-spinner">
          Loading
          <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </button>
      );
    }

    return (
      <StaticDataTable Headers={this.state.Headers}
        Data={this.state.Data}
        Filter={this.props.Filter}
        getFormattedCell={this.props.getFormattedCell}
        freezeColumn={this.props.freezeColumn}
        onSort={this.props.onSort}
      />
    );
  }
}

DynamicDataTable.propTypes = {
  DataURL: PropTypes.string.isRequired
};

export default DynamicDataTable;
