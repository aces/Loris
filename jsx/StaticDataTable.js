StaticDataTable = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        Headers: React.PropTypes.array.isRequired,
        Data: React.PropTypes.array.isRequired,
        RowNumLabel: React.PropTypes.string,
        // Function of which returns a JSX element for a table cell, takes parameters of the form:
        // func(ColumnName, CellData, EntireRowData)
        getFormattedCell: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            'PageNumber' : 1,
            'SortColumn' : -1,
            'SortOrder' : 'ASC'
        };
    },
    getDefaultProps: function() {
        return {
            Headers: [],
            Data: {},
            RowNumLabel: 'No.'
        };
    },
    changePage: function(pageNo) {
        this.setState({
            PageNumber: pageNo
        });
    },
    setSortColumn: function(colNumber) {
        that = this;
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
    render: function() {
        var rowsPerPage = 20;
        var headers = [<th onClick={this.setSortColumn(-1)}>{this.props.RowNumLabel}</th>];
        for(var i = 0; i < this.props.Headers.length; i += 1) {
            headers.push(<th onClick={this.setSortColumn(i)}>{this.props.Headers[i]}</th>);
        }
        var rows = [];
        var curRow = [];
        var index = [], that = this;

        if(this.state.SortColumn >= 0) {
            for(var i = 0; i < this.props.Data.length; i += 1) {
                var val = this.props.Data[i][this.state.SortColumn];

                if (parseInt(val, 10) == val) {
                    val = parseInt(val, 10);
                } else if (parseFloat(val, 10) == val) {
                    val = parseFloat(val, 10);
                } else if (val == '.') {
                    val = null;
                }

                if (this.props.RowNumCol) {
                    index.push({ RowIdx: i, Value: val, Content: this.props.RowNameMap[i]});
                } else {
                    index.push({ RowIdx: i, Value: val, Content: i+1 });
                }
            }
            index.sort(function(a, b) {
                if(that.state.SortOrder === 'ASC') {
                    // Sort by value
                    if(a.Value < b.Value) return -1;
                    if(a.Value > b.Value) return 1;

                    // If all values are equal, sort by rownum
                    if(a.RowIdx < b.RowIdx) { return -1; }
                    if(a.RowIdx > b.RowIdx) { return 1; }
                } else {
                    // Sort by value
                    if(a.Value < b.Value) return 1;
                    if(a.Value > b.Value) return -1;

                    // If all values are equal, sort by rownum
                    if(a.RowIdx < b.RowIdx) { return 1; }
                    if(a.RowIdx > b.RowIdx) { return -1; }
                }
                // They're equal..
                return 0;

            });
        } else {
            for(var i = 0; i < this.props.Data.length; i += 1) {
                if (this.props.RowNumCol) {
                    index.push({ RowIdx: i, Content: this.props.RowNameMap[i]});
                } else {
                    index.push({ RowIdx: i, Content: i+1});
                }
            }
        }
        for(var i = (rowsPerPage*(this.state.PageNumber-1));
                (i < this.props.Data.length) && (rows.length < rowsPerPage);
                i += 1) {
            curRow = [];

            for(var j = 0; j < this.props.Headers.length; j += 1) {
                if(this.props.Data[index[i].RowIdx]) {
                    data = this.props.Data[index[i].RowIdx][j];
                } else {
                    data = "Unknown";
                }
                if (this.props.getFormattedCell) {
                    data = this.props.getFormattedCell(this.props.Headers[j], data, this.props.Data[index[i].RowIdx]);
                    curRow.push({data});
                } else {
                    curRow.push(<td>{data}</td>);
                }
            }
            rows.push(
                <tr colSpan={headers.length}>
                    <td>{index[i].Content}</td>
                    {curRow}
                </tr>
            );
        }

        return (
            <div>
                <PaginationLinks Total={this.props.Data.length} onChangePage={this.changePage} RowsPerPage={rowsPerPage} Active={this.state.PageNumber} />
                <table className="table table-hover table-primary table-bordered">
                    <thead>
                        <tr className="info">{headers}</tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                    <tfoot>
                        <tr><td className="info" colSpan={headers.length}>{rows.length} rows displayed of {this.props.Data.length} </td></tr>
                    </tfoot>
                </table>
            </div>
        );
    }
});

RStaticDataTable = React.createFactory(StaticDataTable);
