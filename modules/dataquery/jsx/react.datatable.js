DataTable = React.createClass({
    getInitialState: function() {
        return {
            'PageNumber': 1
        };
    },
    getDefaultProps: function() {
        return {
            Identifiers: [],
            Headers: [],
            Data: {}
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
            that.setState({
                SortColumn: colNumber
            });
        }
    },
    render: function() {
        var rowsPerPage = 20;
        var headers = [<th>Identifier</th>];
        for(var i = 0; i < this.props.Headers.length; i += 1) {
            headers.push(<th onClick={this.setSortColumn(i)}>{this.props.Headers[i]}</th>);
        }
        var rows = [];
        var curRow = [];
        var index = [];

        if(this.state.SortColumn >= 0) {
            for(var i =0; i < this.props.Data.length; i += 1) {
                var val = this.props.Data[i][this.state.SortColumn];

                if (parseInt(val, 10) == val) {
                    val = parseInt(val, 10);
                } else if (parseFloat(val, 10) == val) {
                    val = parseFloat(val, 10);
                } else if (val == '.') {
                    val = null;
                }

                index.push({ RowIdx: i, Value: val });
            }
            index.sort(function(a, b) {
                // Sort by value
                if(a.Value < b.Value) return -1;
                if(a.Value > b.Value) return 1;

                // If all values are equal, sort by rownum
                if(a.RowIdx < b.RowIdx) { return -1; }
                if(a.RowIdx > b.RowIdx) { return 1; }

                // They're equal..
                return 0;
            });
        } else {
            for(var i =0; i < this.props.Data.length; i += 1) {
                index.push({ RowIdx: i });

            }
        }
        for(var i = (rowsPerPage*(this.state.PageNumber-1));
                (i < this.props.Identifiers.length) && (rows.length < rowsPerPage);
                i += 1) {
            curRow = [];

            for(var j = 0; j < this.props.Headers.length; j += 1) {
                if(this.props.Data[index[i].RowIdx]) {
                    curRow.push(<td>{this.props.Data[index[i].RowIdx][j]}</td>);
                } else {
                    curRow.push(<td>Unknown</td>);
                }
            }
            rows.push(
                <tr colSpan={headers.length}>
                    <td>{this.props.Identifiers[index[i].RowIdx].join()}</td>
                    {curRow}
                </tr>
            );
        }

        return (
            <div>
                <PaginationLinks total={this.props.Data.length} onChangePage={this.changePage} RowsPerPage={rowsPerPage} Active={this.state.PageNumber} />
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
