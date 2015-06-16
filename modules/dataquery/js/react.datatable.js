DataTable = React.createClass({displayName: 'DataTable',
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
        var headers = [React.createElement("th", null, "Identifier")];
        for(var i = 0; i < this.props.Headers.length; i += 1) {
            headers.push(React.createElement("th", null, this.props.Headers[i]));
        }
        var rows = [];
        var curRow = [];

        for(var i = (rowsPerPage*(this.state.PageNumber-1));
                (i < this.props.Identifiers.length) && (rows.length < rowsPerPage);
                i += 1) {
            curRow = [];

            for(var j = 0; j < this.props.Headers.length; j += 1) {
                if(this.props.Data[i]) {
                    curRow.push(React.createElement("td", null, this.props.Data[i][j]));
                } else {
                    curRow.push(React.createElement("td", null, "Unknown"));
                }
            }
            rows.push(
                React.createElement("tr", {colSpan: headers.length}, 
                    React.createElement("td", null, this.props.Identifiers[i].join()), 
                    curRow
                )
            );
        }

        return (
            React.createElement("div", null, 
                React.createElement(PaginationLinks, {total: this.props.Data.length, onChangePage: this.changePage, RowsPerPage: rowsPerPage, Active: this.state.PageNumber}), 
                React.createElement("table", {className: "table table-hover table-primary table-bordered"}, 
                    React.createElement("thead", null, 
                        React.createElement("tr", {className: "info"}, headers)
                    ), 
                    React.createElement("tbody", null, 
                        rows
                    ), 
                    React.createElement("tfoot", null, 
                        React.createElement("tr", null, React.createElement("td", {className: "info", colSpan: headers.length}, rows.length, " rows displayed of ", this.props.Data.length, " "))
                    )
                )
            )
        );
    }
});
