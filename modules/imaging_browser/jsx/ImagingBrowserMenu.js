import ImagingBrowserMenuFilter from './ImagingBrowserMenuFilter'

class ImagingBrowserMenu extends React.Component {
  constructor(props) {
    super(props);
    loris.hiddenHeaders = [ 'SessionID', 'Pending', 'Modalities' ];
    this.state = {
      filters: { }
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  updateFilter(filter) {
    var f = {};
    for (var filt in filter) {
      if (filter.hasOwnProperty(filt)) {
        f[this.toCamelCase(filt)] = filter[filt];
      }
    }
    this.setState({filters: f});
  }

  toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (Number(match) === 0) {
        return "";
      }
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {arrray} rowData - array of cell contents for a specific row
 * @param {arrray} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
  formatColumn(column, cell, rowData, rowHeaders) {
  // If a column if set as hidden, don't display it
    if (loris.hiddenHeaders.indexOf(column) > -1) {
      return null;
    }

   // Create the mapping between rowHeaders and rowData in a row object.
    var row = {};
    rowHeaders.forEach(function(header, index) {
      row[header] = rowData[index];
    }, this);

    if (column === 'New Data') {
      if (cell === 'new') {
        return <td className="newdata">NEW</td>;
      }
      return <td></td>;
    }

    if (column === 'Links') {
      var cellTypes = cell.split(",");
      var cellLinks = [];
      for (var i = 0; i < cellTypes.length; i += 1) {
        cellLinks.push(<a href={loris.BaseURL +
        "/imaging_browser/viewSession/?sessionID=" +
        row.SessionID + "&outputType=" +
        cellTypes[i] + "&backURL=/imaging_browser/"}>
          {cellTypes[i]}
        </a>);
        cellLinks.push(" | ");
      }
      cellLinks.push(<a href={loris.BaseURL +
        "/imaging_browser/viewSession/?sessionID=" +
        row.SessionID +
        "&selectedOnly=1&backURL=/imaging_browser/"}>
          selected
      </a>);

      cellLinks.push(" | ");
      cellLinks.push(<a href={loris.BaseURL +
        "/imaging_browser/viewSession/?sessionID=" +
        row.SessionID +
        "&backURL=/imaging_browser/"}>
          all types
        </a>);
      return (<td>{cellLinks}</td>);
    }

    return <td>{cell}</td>;
  }
  onSort(sortedIndex, data, headers) {
    var sortedSessIDs = [];
    var sessIndex = headers.indexOf('SessionID');
    for (var i = 0; i < sortedIndex.length; i++) {
      sortedSessIDs.push(
           data[sortedIndex[i].RowIdx][sessIndex]
         );
    }
    var url = loris.BaseURL + '/imaging_browser/ajax/setSortedRows.php';
    $.post(url, {sortedIDs: sortedSessIDs});
  }

  render() {
    return (<div>
                <ImagingBrowserMenuFilter
                    onFilterUpdated={this.updateFilter}
                />
                <DynamicDataTable
                   DataURL={`${loris.BaseURL}/imaging_browser/?format=json`}
                   getFormattedCell={this.formatColumn}
                   Filter={this.state.filters}
                   onSort={this.onSort}
                />
            </div>
         );
  }

}
export default ImagingBrowserMenu;

