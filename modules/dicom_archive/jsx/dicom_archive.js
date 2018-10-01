import FilterForm from 'FilterForm';
import Loader from 'Loader';

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
class DicomArchive extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {}
    };

    // Bind component instance to custom methods
    this.fetchData = this.fetchData.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Retrive data from the provided URL and save it in state
   * Additionaly add hiddenHeaders to global loris vairable
   * for easy access by columnFormatter.
   */
  fetchData() {
    $.ajax(this.props.DataURL, {
      method: 'GET',
      dataType: 'json',
      success: data => {
        this.setState({
          data: data,
          isLoaded: true
        });
      },
      error: error => console.error(error)
    });
  }

  /**
   * Set this.state.filter to the input filter object.
   *
   * @param {object} filter - the filter object
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  // TODO: deprecate use of refs for filter clearing in future refactoring.
  /**
   * Reset the fitler elements with textInput refs to empty value
   */
  resetFilters() {
    this.refs.dicomFilter.clearFilter();
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (this.state.data.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    let row = {};
    rowHeaders.forEach((header, index) => {
      row[header] = rowData[index];
    });
    switch (column) {
      case 'Archive Location': {
        const downloadURL = '/mri/jiv/get_file.php?file=' + cell;
        const toRet =
          <td>
            <a href={downloadURL}>
              <span className="glyphicon glyphicon-cloud-download"/>
              &nbsp;
              {cell}
            </a>
          </td>;
        return toRet;
      }
      case 'Metadata': {
        const metadataURL = loris.BaseURL +
          '/dicom_archive/viewDetails/?tarchiveID=' + row.TarchiveID;
        return <td><a href={metadataURL}>{cell}</a></td>;
      }
      case 'MRI Browser': {
        if (row.SessionID === null || row.SessionID === '') {
          return <td>&nbsp;</td>;
        }
        let mrlURL = loris.BaseURL + '/imaging_browser/viewSession/?sessionID=' +
          row.SessionID;
        return <td><a href={mrlURL}>{cell}</a></td>;
      }
      case 'INVALID - HIDDEN':
        return <td className="text-danger">{cell}</td>;
      default:
        return <td>{cell}</td>;
    }
  }

  render() {
    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    return (
      <div>
        <FilterForm
          Module="dicom_archive"
          name="dicom_filter"
          id="dicom_filter"
          ref="dicomFilter"
          columns={2}
          formElements={this.state.data.form}
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
          Data={this.state.data.Data}
          Headers={this.state.data.Headers}
          hiddenHeaders={this.state.data.hiddenHeaders}
          Filter={this.state.filter}
          getFormattedCell={this.formatColumn}
        />
      </div>
    );
  }
}

DicomArchive.propTypes = {
  Module: React.PropTypes.string.isRequired,
  DataURL: React.PropTypes.string.isRequired
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

  ReactDOM.render(dicomArchive, document.getElementById('lorisworkspace'));
};
