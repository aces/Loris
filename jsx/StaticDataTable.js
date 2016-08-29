var StaticDataTable = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        Headers: React.PropTypes.array.isRequired,
        Data: React.PropTypes.array.isRequired,
        RowNumLabel: React.PropTypes.string,
        // Function of which returns a JSX element for a table cell, takes
        // parameters of the form: func(ColumnName, CellData, EntireRowData)
        getFormattedCell: React.PropTypes.func
    },
    componentDidMount: function() {
        if (jQuery.fn.DynamicTable) {
            if(this.props.freezeColumn) {
                $("#dynamictable").DynamicTable({"freezeColumn" : this.props.freezeColumn});
            } else {
                $("#dynamictable").DynamicTable();
            }
        }
    },
    componentDidUpdate: function() {
        if (jQuery.fn.DynamicTable) {
            if(this.props.freezeColumn) {
                $("#dynamictable").DynamicTable({"freezeColumn" : this.props.freezeColumn});
            } else {
                $("#dynamictable").DynamicTable();
            }
        }
    },
    getInitialState: function() {
        return {
            'PageNumber' : 1,
            'SortColumn' : -1,
            'SortOrder' : 'ASC',
            'RowsPerPage' : 20
        };
    },
    getDefaultProps: function() {
        return {
            Headers: [],
            Data: {},
            RowNumLabel: 'No.',
            Filter: {}
        };
    },
    changePage: function(pageNo) {
        this.setState({
            PageNumber: pageNo
        });
    },
    setSortColumn: function(colNumber) {
        var that = this;
        return function(e) {
            if(that.state.SortColumn === colNumber) {
                that.setState({
                    'SortOrder' : that.state.SortOrder === 'ASC' ? 'DESC' : 'ASC'
                });
            } else {
                that.setState({
                    SortColumn: colNumber
                });
            }
        }
    },
    changeRowsPerPage: function(val) {
       this.setState({
           'RowsPerPage' : val.target.value,
           'PageNumber' : 1
       });
    },
    downloadCSV: function() {
        var headers = this.props.Fields,
            csvworker = new Worker(loris.BaseURL + '/js/workers/savecsv.js');


        csvworker.addEventListener('message', function (e) {
            var dataURL, dataDate, link;
            if (e.data.cmd === 'SaveCSV') {
                dataDate = new Date().toISOString();
                dataURL = window.URL.createObjectURL(e.data.message);
                link = document.createElement("a");
                link.download = "data-" + dataDate + ".csv";
                link.type = "text/csv";
                link.href = dataURL;
                document.body.appendChild(link);
                $(link)[0].click();
                document.body.removeChild(link);
            }
        });
        csvworker.postMessage({
            cmd: 'SaveFile',
            data: this.props.Data,
            headers: this.props.Headers,
            identifiers: this.props.RowNameMap
        });
    },
    countFilteredRows: function() {

      var filterMatchCount = 0;
      var filterValuesCount = this.props.Filter ? Object.keys(this.props.Filter).length : 0;
      var tableData = this.props.Data;
      var headersData = this.props.Headers;

      for (var i = 0; i < tableData.length; i++) {

        var headerCount = 0;

        for (var j = 0; j < headersData.length; j++) {
          var data = tableData[i] ? tableData[i][j] : null;
          if (this.hasFilterKeyword(headersData[j], data)) {
            headerCount++;
          }
        }

        if (headerCount === filterValuesCount) {
          filterMatchCount++;
        }
      }

      var hasFilters = (filterValuesCount !== 0);
      if (filterMatchCount === 0 && hasFilters) {
        return 0;
      }

      return (filterMatchCount === 0) ? tableData.length : filterMatchCount;
    },
    toCamelCase: function(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (match === 0) return "";
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
    },
    /**
     * Return true, if filter value is found to be a substring
     * of one of the column values, false otherwise.
     *
     * Note: Search is case-insensitive.
     *
     * @param header
     * @param data
     * @returns {boolean}
     */
    hasFilterKeyword: function(headerData, data) {

      var header = this.toCamelCase(headerData);
      var filterData = this.props.Filter[header] ? this.props.Filter[header] : null;

      // Handle nullinputs
      if (filterData === null || data === null) {
        return false;
      }

      // Handle numeric inputs
      if (typeof filterData === 'number') {
        var intData = Number.parseInt(data, 10);
        return filterData === intData;
      }

      // Handle string inputs
      if (typeof filterData === 'string') {
        var searchKey = filterData.toLowerCase();
        var searchString = data.toLowerCase();
        return (searchString.indexOf(searchKey) > -1);
      }

      return false;

    },
    render: function() {
        if (this.props.Data == null || this.props.Data.length == 0) {
            return (
                <div
                    className="alert alert-info no-result-found-panel"
                >
                    <strong>No result found.</strong>
                </div>
            );
        }
        var rowsPerPage = this.state.RowsPerPage;
        var headers = [<th onClick={this.setSortColumn(-1)}>{this.props.RowNumLabel}</th>];
        for(var i = 0; i < this.props.Headers.length; i += 1) {

            if ( typeof loris.hiddenHeaders === "undefined" || -1 == loris.hiddenHeaders.indexOf(this.props.Headers[i]) ) {
                if(this.props.Headers[i] == this.props.freezeColumn){
                    headers.push(<th id={this.props.freezeColumn} onClick={this.setSortColumn(i)}>{this.props.Headers[i]}</th>);
                }else {
                    headers.push(<th onClick={this.setSortColumn(i)}>{this.props.Headers[i]}</th>);
                }
            }
        }
        var rows = [];
        var curRow = [];
        var index = [], that = this;

        for (var i = 0; i < this.props.Data.length; i += 1) {
            var val = this.props.Data[i][this.state.SortColumn];

            if (parseInt(val, 10) == val) {
                val = parseInt(val, 10);
            } else if (parseFloat(val, 10) == val) {
                val = parseFloat(val, 10);
            } else if (val == '.') {
                val = null;
            }

            // if string - convert to lowercase to make sort algorithm work
            var isString = (typeof val === 'string' || val instanceof String);
            if (val != undefined && isString) {
                val = val.toLowerCase();
            }

            if (this.props.RowNameMap) {
                index.push({ RowIdx: i, Value: val, Content: this.props.RowNameMap[i]});
            } else {
                index.push({ RowIdx: i, Value: val, Content: i+1 });
            }
        }

        index.sort(function(a, b) {
            if (that.state.SortOrder === 'ASC') {
                // Check if null values
                if(a.Value === null) return -1;
                if(b.Value === null) return 1;

                // Sort by value
                if (a.Value < b.Value) return -1;
                if (a.Value > b.Value) return 1;

                // If all values are equal, sort by rownum
                if (a.RowIdx < b.RowIdx) { return -1; }
                if (a.RowIdx > b.RowIdx) { return 1; }
            } else {
                // Check if null values
                if(a.Value === null) return 1;
                if(b.Value === null) return -1;

                // Sort by value
                if (a.Value < b.Value) return 1;
                if (a.Value > b.Value) return -1;

                // If all values are equal, sort by rownum
                if (a.RowIdx < b.RowIdx) { return 1; }
                if (a.RowIdx > b.RowIdx) { return -1; }
            }
            // They're equal..
            return 0;
        });

        var matchesFound = 0; // Keeps track of how many rows where displayed so far across all pages
        var filteredRows = this.countFilteredRows();
        var currentPageRow = (rowsPerPage * (this.state.PageNumber - 1));
        // Push rows to data table
        for (var i = 0; (i < this.props.Data.length) && (rows.length < rowsPerPage); i++) {

            curRow = [];

            // Counts filter matches
            var filterMatchCount = 0;

            // Itterates through headers to populate row columns
            // with corresponding data
            for (var j = 0; j < this.props.Headers.length; j += 1) {

                var data = "Unknown";

                // Set column data
                if (this.props.Data[index[i].RowIdx]) {
                    data = this.props.Data[index[i].RowIdx][j];
                }

                if (this.hasFilterKeyword(this.props.Headers[j], data)) {
                  filterMatchCount++;
                }

                // Get custom cell formatting if available
                if (this.props.getFormattedCell) {
                    data = this.props.getFormattedCell(
                        this.props.Headers[j],
                        data,
                        this.props.Data[index[i].RowIdx],
                        this.props.Headers
                    );
                    curRow.push({data});
                } else {
                    curRow.push(<td>{data}</td>);
                }
            }

            // Only display a row if all filter values have been matched
            if (Object.keys(this.props.Filter).length === filterMatchCount) {
                matchesFound++;
                if (matchesFound > currentPageRow) {
                  rows.push(
                    <tr colSpan={headers.length}>
                      <td>{index[i].Content}</td>
                      {curRow}
                    </tr>
                  );
                }
            }
        }

        var RowsPerPageDropdown = (
            <select className="input-sm perPage" onChange={this.changeRowsPerPage}>
                <option>20</option>
                <option>50</option>
                <option>100</option>
                <option>1000</option>
                <option>5000</option>
                <option>10000</option>
            </select>
            );
        return (
            <div className="panel panel-default">
                <div className="table-header panel-heading">
                    <div className="row">
                        <div className="col-xs-12">
                            {rows.length} rows displayed of {filteredRows}. (Maximum rows per page: {RowsPerPageDropdown})
                            <div className="pull-right">
                                <PaginationLinks Total={filteredRows} onChangePage={this.changePage} RowsPerPage={rowsPerPage} Active={this.state.PageNumber} />
                            </div>
                        </div>
                    </div>
                </div>
                    <table className="table table-hover table-primary table-bordered" id="dynamictable">
                        <thead>
                            <tr className="info">{headers}</tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                <div className="panel-footer table-footer">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="col-xs-12 footerText">
                                {rows.length} rows displayed of {filteredRows}. (Maximum rows per page: {RowsPerPageDropdown})
                            </div>
                            <div className="col-xs-6">
                                <button className="btn btn-primary downloadCSV" onClick={this.downloadCSV}>Download Table as CSV</button>
                            </div>
                            <div className="pull-right">
                                <PaginationLinks Total={filteredRows} onChangePage={this.changePage} RowsPerPage={rowsPerPage} Active={this.state.PageNumber} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var RStaticDataTable = React.createFactory(StaticDataTable);
