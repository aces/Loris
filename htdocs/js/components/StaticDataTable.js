StaticDataTable = React.createClass({
    displayName: "StaticDataTable",

    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        Headers: React.PropTypes.array.isRequired,
        Data: React.PropTypes.array.isRequired,
        RowNumLabel: React.PropTypes.string,
        // Function of which returns a JSX element for a table cell, takes
        // parameters of the form: func(ColumnName, CellData, EntireRowData)
        getFormattedCell: React.PropTypes.func
    },
    componentDidMount: function () {
        if (jQuery.fn.DynamicTable) {
            if (this.props.freezeColumn) {
                $("#dynamictable").DynamicTable({ "freezeColumn": this.props.freezeColumn });
            } else {
                $("#dynamictable").DynamicTable();
            }
        }
    },
    componentDidUpdate: function () {
        if (jQuery.fn.DynamicTable) {
            if (this.props.freezeColumn) {
                $("#dynamictable").DynamicTable({ "freezeColumn": this.props.freezeColumn });
            } else {
                $("#dynamictable").DynamicTable();
            }
        }
    },
    getInitialState: function () {
        return {
            'PageNumber': 1,
            'SortColumn': -1,
            'SortOrder': 'ASC',
            'RowsPerPage': 20
        };
    },
    getDefaultProps: function () {
        return {
            Headers: [],
            Data: {},
            RowNumLabel: 'No.',
            Filter: {}
        };
    },
    changePage: function (pageNo) {
        this.setState({
            PageNumber: pageNo
        });
    },
    setSortColumn: function (colNumber) {
        that = this;
        return function (e) {
            if (that.state.SortColumn === colNumber) {
                that.setState({
                    'SortOrder': that.state.SortOrder === 'ASC' ? 'DESC' : 'ASC'
                });
            } else {
                that.setState({
                    SortColumn: colNumber
                });
            }
        };
    },
    changeRowsPerPage: function (val) {
        this.setState({
            'RowsPerPage': val.target.value,
            'PageNumber': 1
        });
    },
    downloadCSV: function () {
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
    render: function () {
        if (this.props.Data == null || this.props.Data.length == 0) {
            return React.createElement(
                "div",
                {
                    className: "alert alert-info no-result-found-panel"
                },
                React.createElement(
                    "strong",
                    null,
                    "No result found."
                )
            );
        }
        var rowsPerPage = this.state.RowsPerPage;
        var headers = [React.createElement(
            "th",
            { onClick: this.setSortColumn(-1) },
            this.props.RowNumLabel
        )];
        for (var i = 0; i < this.props.Headers.length; i += 1) {

            if (typeof loris.hiddenHeaders === "undefined" || -1 == loris.hiddenHeaders.indexOf(this.props.Headers[i])) {
                if (this.props.Headers[i] == this.props.freezeColumn) {
                    headers.push(React.createElement(
                        "th",
                        { id: this.props.freezeColumn, onClick: this.setSortColumn(i) },
                        this.props.Headers[i]
                    ));
                } else {
                    headers.push(React.createElement(
                        "th",
                        { onClick: this.setSortColumn(i) },
                        this.props.Headers[i]
                    ));
                }
            }
        }
        var rows = [];
        var curRow = [];
        var index = [],
            that = this;

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
            var isString = typeof val === 'string' || val instanceof String;
            if (val != undefined && isString) {
                val = val.toLowerCase();
            }

            if (this.props.RowNameMap) {
                index.push({ RowIdx: i, Value: val, Content: this.props.RowNameMap[i] });
            } else {
                index.push({ RowIdx: i, Value: val, Content: i + 1 });
            }
        }

        index.sort(function (a, b) {
            if (that.state.SortOrder === 'ASC') {
                // Check if null values
                if (a.Value === null) return -1;
                if (b.Value === null) return 1;

                // Sort by value
                if (a.Value < b.Value) return -1;
                if (a.Value > b.Value) return 1;

                // If all values are equal, sort by rownum
                if (a.RowIdx < b.RowIdx) {
                    return -1;
                }
                if (a.RowIdx > b.RowIdx) {
                    return 1;
                }
            } else {
                // Check if null values
                if (a.Value === null) return 1;
                if (b.Value === null) return -1;

                // Sort by value
                if (a.Value < b.Value) return 1;
                if (a.Value > b.Value) return -1;

                // If all values are equal, sort by rownum
                if (a.RowIdx < b.RowIdx) {
                    return 1;
                }
                if (a.RowIdx > b.RowIdx) {
                    return -1;
                }
            }
            // They're equal..
            return 0;
        });

        // Push rows to data table
        for (var i = rowsPerPage * (this.state.PageNumber - 1); i < this.props.Data.length && rows.length < rowsPerPage; i += 1) {
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

                // Increase counter, if filter value is found to be a substring
                // of one of the column values
                var filterData = this.props.Filter[this.props.Headers[j]];
                if (filterData !== null && data !== null && data.indexOf(filterData) > -1) {
                    filterMatchCount++;
                }

                // Get custom cell formatting if available
                if (this.props.getFormattedCell) {
                    data = this.props.getFormattedCell(this.props.Headers[j], data, this.props.Data[index[i].RowIdx], this.props.Headers);
                    curRow.push({ data });
                } else {
                    curRow.push(React.createElement(
                        "td",
                        null,
                        data
                    ));
                }
            }

            // Only display a row if all filter values have been matched
            if (Object.keys(this.props.Filter).length == filterMatchCount) {
                rows.push(React.createElement(
                    "tr",
                    { colSpan: headers.length },
                    React.createElement(
                        "td",
                        null,
                        index[i].Content
                    ),
                    curRow
                ));
            }
        }

        var RowsPerPageDropdown = React.createElement(
            "select",
            { className: "input-sm perPage", onChange: this.changeRowsPerPage },
            React.createElement(
                "option",
                null,
                "20"
            ),
            React.createElement(
                "option",
                null,
                "50"
            ),
            React.createElement(
                "option",
                null,
                "100"
            ),
            React.createElement(
                "option",
                null,
                "1000"
            ),
            React.createElement(
                "option",
                null,
                "5000"
            ),
            React.createElement(
                "option",
                null,
                "10000"
            )
        );
        return React.createElement(
            "div",
            { className: "panel panel-default" },
            React.createElement(
                "div",
                { className: "table-header panel-heading" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        rows.length,
                        " rows displayed of ",
                        this.props.Data.length,
                        ". (Maximum rows per page: ",
                        RowsPerPageDropdown,
                        ")",
                        React.createElement(
                            "div",
                            { className: "pull-right" },
                            React.createElement(PaginationLinks, { Total: this.props.Data.length, onChangePage: this.changePage, RowsPerPage: rowsPerPage, Active: this.state.PageNumber })
                        )
                    )
                )
            ),
            React.createElement(
                "table",
                { className: "table table-hover table-primary table-bordered", id: "dynamictable" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        { className: "info" },
                        headers
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    rows
                )
            ),
            React.createElement(
                "div",
                { className: "panel-footer table-footer" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        React.createElement(
                            "div",
                            { className: "col-xs-12 footerText" },
                            rows.length,
                            " rows displayed of ",
                            this.props.Data.length,
                            ". (Maximum rows per page: ",
                            RowsPerPageDropdown,
                            ")"
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-6" },
                            React.createElement(
                                "button",
                                { className: "btn btn-primary downloadCSV", onClick: this.downloadCSV },
                                "Download Table as CSV"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "pull-right" },
                            React.createElement(PaginationLinks, { Total: this.props.Data.length, onChangePage: this.changePage, RowsPerPage: rowsPerPage, Active: this.state.PageNumber })
                        )
                    )
                )
            )
        );
    }
});

RStaticDataTable = React.createFactory(StaticDataTable);
