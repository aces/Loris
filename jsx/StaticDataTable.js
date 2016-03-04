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
    componentDidMount: function() {
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
    changeRowsPerPage: function(val) {
       this.setState({
           'RowsPerPage' : val.target.value,
           'PageNumber' : 1
       });
    },
    render: function() {
        if (this.props.Data == null) {
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
            if(this.props.Headers[i] == this.props.freezeColumn){
                headers.push(<th id={this.props.freezeColumn} onClick={this.setSortColumn(i)}>{this.props.Headers[i]}</th>);
            }else {
                headers.push(<th onClick={this.setSortColumn(i)}>{this.props.Headers[i]}</th>);
            }
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

                if (this.props.RowNameMap) {
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
                if (this.props.RowNameMap) {
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

        var RowsPerPageDropdown = (<select className="input-sm rowsPerPage" onChange={this.changeRowsPerPage}>
                <option>20</option>
                <option>50</option>
                <option>100</option>
                <option>1000</option>
                <option>5000</option>
                <option>10000</option>
            </select>
            );
        return (
            <div className="panel panel-primary">
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
                            {rows.length} rows displayed of {this.props.Data.length}. (Maximum rows per page: {RowsPerPageDropdown}) 
                            <div className="pull-right">
                                <PaginationLinks Total={this.props.Data.length} onChangePage={this.changePage} RowsPerPage={rowsPerPage} Active={this.state.PageNumber} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

RStaticDataTable = React.createFactory(StaticDataTable);
