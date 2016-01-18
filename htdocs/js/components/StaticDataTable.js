StaticDataTable = React.createClass({
    displayName: 'StaticDataTable',

    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        Headers: React.PropTypes.array.isRequired,
        Data: React.PropTypes.array.isRequired,
        RowNumLabel: React.PropTypes.string,
        // Function of which returns a JSX element for a table cell, takes parameters of the form:
        // func(ColumnName, CellData, EntireRowData)
        getFormattedCell: React.PropTypes.func
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
            RowNumLabel: 'No.'
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
    render: function () {
        if (this.props.Data == null) {
            return React.createElement(
                'div',
                {
                    className: 'alert alert-info no-result-found-panel'
                },
                React.createElement(
                    'strong',
                    null,
                    'No result found.'
                )
            );
        }
        var rowsPerPage = this.state.RowsPerPage;
        var headers = [React.createElement(
            'th',
            { onClick: this.setSortColumn(-1) },
            this.props.RowNumLabel
        )];
        for (var i = 0; i < this.props.Headers.length; i += 1) {
            headers.push(React.createElement(
                'th',
                { onClick: this.setSortColumn(i) },
                this.props.Headers[i]
            ));
        }
        var rows = [];
        var curRow = [];
        var index = [],
            that = this;

        if (this.state.SortColumn >= 0) {
            for (var i = 0; i < this.props.Data.length; i += 1) {
                var val = this.props.Data[i][this.state.SortColumn];

                if (parseInt(val, 10) == val) {
                    val = parseInt(val, 10);
                } else if (parseFloat(val, 10) == val) {
                    val = parseFloat(val, 10);
                } else if (val == '.') {
                    val = null;
                }

                if (this.props.RowNameMap) {
                    index.push({ RowIdx: i, Value: val, Content: this.props.RowNameMap[i] });
                } else {
                    index.push({ RowIdx: i, Value: val, Content: i + 1 });
                }
            }
            index.sort(function (a, b) {
                if (that.state.SortOrder === 'ASC') {
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
        } else {
            for (var i = 0; i < this.props.Data.length; i += 1) {
                if (this.props.RowNameMap) {
                    index.push({ RowIdx: i, Content: this.props.RowNameMap[i] });
                } else {
                    index.push({ RowIdx: i, Content: i + 1 });
                }
            }
        }
        for (var i = rowsPerPage * (this.state.PageNumber - 1); i < this.props.Data.length && rows.length < rowsPerPage; i += 1) {
            curRow = [];

            for (var j = 0; j < this.props.Headers.length; j += 1) {
                if (this.props.Data[index[i].RowIdx]) {
                    data = this.props.Data[index[i].RowIdx][j];
                } else {
                    data = "Unknown";
                }
                if (this.props.getFormattedCell) {
                    data = this.props.getFormattedCell(this.props.Headers[j], data, this.props.Data[index[i].RowIdx]);
                    curRow.push({ data });
                } else {
                    curRow.push(React.createElement(
                        'td',
                        null,
                        data
                    ));
                }
            }
            rows.push(React.createElement(
                'tr',
                { colSpan: headers.length },
                React.createElement(
                    'td',
                    null,
                    index[i].Content
                ),
                curRow
            ));
        }

        var RowsPerPageDropdown = React.createElement(
            'select',
            { onChange: this.changeRowsPerPage },
            React.createElement(
                'option',
                null,
                '20'
            ),
            React.createElement(
                'option',
                null,
                '50'
            ),
            React.createElement(
                'option',
                null,
                '100'
            ),
            React.createElement(
                'option',
                null,
                '1000'
            ),
            React.createElement(
                'option',
                null,
                '5000'
            ),
            React.createElement(
                'option',
                null,
                '10000'
            )
        );
        return React.createElement(
            'div',
            null,
            React.createElement(
                'table',
                { className: 'table table-hover table-primary table-bordered' },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        { className: 'info' },
                        headers
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    rows
                ),
                React.createElement(
                    'tfoot',
                    null,
                    React.createElement(
                        'tr',
                        null,
                        React.createElement(
                            'td',
                            { className: 'info', colSpan: headers.length },
                            rows.length,
                            ' rows displayed of ',
                            this.props.Data.length,
                            '. (Maximum rows per page: ',
                            RowsPerPageDropdown,
                            ')',
                            React.createElement(
                                'div',
                                { className: 'pull-right' },
                                React.createElement(PaginationLinks, { Total: this.props.Data.length, onChangePage: this.changePage, RowsPerPage: rowsPerPage, Active: this.state.PageNumber })
                            )
                        )
                    )
                )
            )
        );
    }
});

RStaticDataTable = React.createFactory(StaticDataTable);
