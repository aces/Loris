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
    render: function() {
        var rowsPerPage = 20;
        var headers = [<th>Identifier</th>];
        for(var i = 0; i < this.props.Headers.length; i += 1) {
            headers.push(<th>{this.props.Headers[i]}</th>);
        }
        var rows = [];
        var curRow = [];

        for(var i = (rowsPerPage*(this.state.PageNumber-1));
                (i < this.props.Identifiers.length) && (rows.length < rowsPerPage);
                i += 1) {
            curRow = [];

            for(var j = 0; j < this.props.Headers.length; j += 1) {
                if(this.props.Data[i]) {
                    curRow.push(<td>{this.props.Data[i][j]}</td>);
                } else {
                    curRow.push(<td>Unknown</td>);
                }
            }
            rows.push(
                <tr colSpan={headers.length}>
                    <td>{this.props.Identifiers[i].join()}</td>
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
