import React, {Component} from 'reac';
import PropTypes from 'prop-types';
import Loader from 'jsx/Loader';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * Dictionary viewer component
 */
class DictionaryViewer extends Component {
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
    fetch(`${this.state.baseURL}/dictionary`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((resp) => {
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
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    let result = (<td>{cell}</td>);

    // background color
    let bgGreen = {textAlign: 'center', backgroundColor: '#EDF7E5'};
    let bgYellow = {textAlign: 'center', backgroundColor: '#FFF696'};

    switch (column) {
    case 'Required':
      // yes/no answers
      result = (cell === '1')
        ? (<td style={bgGreen}>&#9989;</td>)
        : (<td style={bgYellow}>&#129000;</td>);
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
    let fields = [
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
        label: 'Field',
        show: true,
        type: 'text',
        filter: {
          name: 'Field',
          type: 'text',
        },
      },
      {
        label: 'Required',
        show: true,
        type: 'text',
      },
      {
        label: 'Type',
        show: true,
        type: 'text',
        filter: {
          name: 'Type',
          type: 'text',
        },
      },
      {
        label: 'Label',
        show: true,
        type: 'text',
        filter: {
          name: 'Label',
          type: 'text',
        },
      },
      {
        label: 'Section Header',
        show: false,
        type: 'text',
        filter: {
          name: 'Section Header',
          type: 'text',
        },
      },
      {
        label: 'Choices',
        show: true,
        type: 'text',
        filter: {
          name: 'Choices',
          type: 'text',
        },
      },
      {
        label: 'Note',
        show: true,
        type: 'text',
        filter: {
          name: 'Project ID',
          type: 'text',
        },
      },
      {
        label: 'Validation Type',
        show: true,
        type: 'text',
      },
      {
        label: 'Validation Min',
        show: true,
        type: 'text',
      },
      {
        label: 'Validation Max',
        show: true,
        type: 'text',
      },
      {
        label: 'Identifier',
        show: true,
        type: 'text',
      },
      {
        label: 'Branching Logic',
        show: true,
        type: 'text',
      },
      {
        label: 'Custom Alignment',
        show: true,
        type: 'text',
      },
      {
        label: 'Question Number',
        show: true,
        type: 'text',
      },
      {
        label: 'Matrix Group',
        show: true,
        type: 'text',
      },
      {
        label: 'Matrix Ranking',
        show: true,
        type: 'text',
      },
      {
        label: 'Annotation',
        show: true,
        type: 'text',
      },
    ];

    return (
      <div>
        {this.state.data == null
          ? (<div className="alert alert-warning" role="alert">
            <strong>Error:</strong> no Data Dictionary entry found.
          </div>)
          : <FilterableDataTable
            name='redcapDictionaryTable'
            data={this.state.data}
            fields={fields}
            getFormattedCell={this.formatColumn}
          />
        }
      </div>
    );
  }
}

DictionaryViewer.propTypes = {
  data: PropTypes.object,
  baseURL: PropTypes.string.isRequired,
};

export default DictionaryViewer;
