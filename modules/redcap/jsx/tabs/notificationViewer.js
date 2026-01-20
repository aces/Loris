import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';


class NotificationViewer extends Component {
  /**
   * Constructor of component
   *
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      baseURL: props.baseURL,
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrieve data for the form and save it in state.
   */
  fetchData() {
    fetch(`${this.state.baseURL}/?format=json`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => {
      if (!resp.ok) {
        this.setState({error: true});
        console.error(resp.status + ': ' + resp.statusText);
        return;
      }

      resp.json()
        .then((data) => {
          this.setState({
            data,
            isLoaded: true,
          });
        });
    }).catch((error) => {
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
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = (<td>{cell}</td>);

    // background color
    let bgGreen = {textAlign: 'center', backgroundColor: '#EDF7E5'};
    let bgRed = {textAlign: 'center', backgroundColor: '#F7D6E0'};

    switch (column) {
    case 'Complete':
      // yes/no answers
      result = (cell === '2')
        ? (<td style={bgGreen}>&#9989;</td>)
        : (<td style={bgRed}>&#10060;</td>);
      break;
    default:
      result = (<td>{cell}</td>);
      break;
    }
    return result;
  }

  /**
   * @return {JSX} the incomplete form to render.
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    // The fields configured for display/hide.
    /**
     * Fields.
     */
    const fields = [
      {
        label: 'Notification ID',
        show: false,
        type: 'text',
      },
      {
        label: 'Complete',
        show: true,
        type: 'text',
      },
      {
        label: 'Record ID',
        show: true,
        type: 'text',
        filter: {
          name: 'Record ID',
          type: 'text',
        },
      },
      {
        label: 'Event Name',
        show: true,
        type: 'text',
        filter: {
          name: 'Event Name',
          type: 'text',
        },
      },
      {
        label: 'Instrument',
        show: true,
        type: 'text',
        filter: {
          name: 'Instrument',
          type: 'text',
        },
      },
      {
        label: 'REDCap URL',
        show: true,
        type: 'text',
      },
      {
        label: 'Project ID',
        show: true,
        type: 'text',
        filter: {
          name: 'Project ID',
          type: 'text',
        },
      },
      {
        label: 'Received',
        show: true,
        type: 'date',
      },
      {
        label: 'Handled',
        show: true,
        type: 'date',
      },
    ];

    return (
      <>
        <br />
        <div className="alert alert-warning" role="alert">
          <strong>Note:</strong> Only the last 10.000 notifications will be
          displayed. If more are required, please contact the administrator.
        </div>
        <FilterableDataTable
          name='redcapNotificationTable'
          data={this.state.data.Data}
          fields={fields}
          getFormattedCell={this.formatColumn}
        />
      </>
    );
  }
}

NotificationViewer.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
};

export default NotificationViewer;
