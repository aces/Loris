import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';

import LogPanel from './LogPanel';
import UploadForm from './UploadForm';

class ImagingUploader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      filter: {},
      hiddenHeaders: ['PatientName']
    };

    /**
     * Set filter to the element's ref for filtering
     */
    this.filter = null;
    this.setFilterRef = element => {
      this.filter = element;
    };

    /**
     * Bind component instance to custom methods
     */
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
      method: "GET",
      dataType: 'json',
      success: data => {
        // FIXME: Remove the following line of code, add ['PatientName'] to the
        // hiddenHeaders state and pass this.state.hiddenHeaders as a prop to
        // StaticDataTable as soon as hiddenHeaders is accepted as a prop by
        // the StaticDataTable Component.
        loris.hiddenHeaders = this.state.hiddenHeaders;
        this.setState({
          data: data,
          isLoaded: true
        });
      },
      error: error => console.error(error)
    });
  }

  /**
   * Set this.state.filter to the input filter object
   *
   * @param {object} filter = the filter object
   */
  updateFilter(filter) {
    this.setState({filter});
  }

  // TODO: deprecate clearing filters via refs in future refactoring.
  /**
   * Reset the filter elements with textInput refs to empty values
   */
  resetFilters() {
    this.filter.clearFilter();
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {array} rowData - array of cell contents for a specific row
   * @param {array} rowHeaders - array of table headers (column names)
   *
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, rowData, rowHeaders) {
    // If a column if set as hidden, don't display it
    if (this.state.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

    // Create the mapping between rowHeaders and rowData in a row object.
    let row = {};
    rowHeaders.forEach((header, index) => {
      row[header] = rowData[index];
    });

    // Default cell style
    const cellStyle = {whiteSpace: 'nowrap'};

    if (column === 'Progress') {
      if (cell === 'Failure') {
        cellStyle.color = '#fff';
        return (
          <td className="label-danger" style={cellStyle}>
            {cell}
          </td>
        );
      }

      if (cell === 'In Progress...') {
        cellStyle.color = '#fff';
        return (
          <td className="label-warning" style={cellStyle}>
            {cell}
          </td>
        );
      }

      const created = row['Number Of MincCreated'];
      const inserted = row['Number Of MincInserted'];
      return (
        <td style={cellStyle}>
          {cell} ({inserted} out of {created})
        </td>
      );
    }

    if (column === 'Tarchive Info') {
      if (!cell || cell === "0") {
        return (<td></td>);
      }

      const url = loris.BaseURL + '/dicom_archive/viewDetails/?tarchiveID=' + cell;
      return (
        <td style={cellStyle}>
          <a href={url}>View Details</a>
        </td>
      );
    }

    if (column === 'Number Of MincInserted') {
      if (cell > 0) {
        return (
          <td style={cellStyle}>
            <a onClick={this.handleClick.bind(null, row.CandID)}>{cell}</a>
          </td>
        );
      }
    }

    if (column === 'Number Of MincCreated') {
      let violatedScans;
      if (row['Number Of MincCreated'] - row['Number Of MincInserted'] > 0) {
        let numViolatedScans =
             row['Number Of MincCreated'] - row['Number Of MincInserted'];

        let patientName = row.PatientName;
        violatedScans = <a onClick={this.openViolatedScans.bind(null, patientName)}>
           ({numViolatedScans} violated scans)
         </a>;
      }

      return (
        <td style={cellStyle}>
          {cell}
          &nbsp;
          {violatedScans}
        </td>
      );
    }

    return (<td style={cellStyle}>{cell}</td>);
  }

  /**
   * Handles clicks on 'Number Of MincInserted' cells
   *
   * @param {string} dccid - dccid
   * @param {object} e - event info
   */
  handleClick(dccid, e) {
    loris.loadFilteredMenuClickHandler('imaging_browser/', {
      DCCID: dccid
    })(e);
  }

  /**
   * Opens MRI Violations for when there are violated scans
   *
   * @param {string} patientName - Patient name of the form PSCID_DCCID_VisitLabel
   * @param {object} e - event info
   */
  openViolatedScans(patientName, e) {
    loris.loadFilteredMenuClickHandler('mri_violations/', {
      PatientName: patientName
    })(e);
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const tabList = [
      {id: "browse", label: "Browse"},
      {id: "upload", label: "Upload"}
    ];

    return (
      <Tabs tabs={tabList} defaultTab="browse" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <div className="row">
            <div className="col-md-5">
              <FilterForm
                Module="imaging_uploader"
                name="imaging_filter"
                id="imaging_filter"
                ref={this.setFilterRef}
                onUpdate={this.updateFilter}
                filter={this.state.filter}
              >
                <TextboxElement {... this.state.data.form.candID} />
                <TextboxElement {... this.state.data.form.pSCID} />
                <SelectElement {... this.state.data.form.visitLabel} />
                <ButtonElement type="reset" label="Clear Filters" onUserInput={this.resetFilters}/>
              </FilterForm>
            </div>
            <div className="col-md-7">
              <LogPanel />
            </div>
          </div>
          <div id="mri_upload_table">
            <StaticDataTable
              Data={this.state.data.Data}
              Headers={this.state.data.Headers}
              getFormattedCell={this.formatColumn}
              Filter={this.state.filter}
            />
          </div>
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <UploadForm
            form={this.state.data.form}
            mriList={this.state.data.mriList}
            maxUploadSize={this.state.data.maxUploadSize}
          />
        </TabPane>
      </Tabs>
    );
  }
}

ImagingUploader.propTypes = {
  DataURL: React.PropTypes.string.isRequired
};

export default ImagingUploader;
