PaginationLinks = React.createClass({displayName: 'PaginationLinks',
    changePage: function(i) {
        var that = this;
        return function(evt) {
            // Don't jump to the top of the page
            evt.preventDefault();

            if(that.props.onChangePage) {
                that.props.onChangePage(i);
            }
        };
    },
    render: function() {
        var rowsPerPage = this.props.RowsPerPage || 10;
        var pageLinks = [];
        var classList;
        var lastPage = Math.ceil(this.props.total / rowsPerPage);
        if(this.props.total === 0) {
            return React.createElement("div", null);
        }
            React.createElement("li", null, 
          React.createElement("a", {href: "#", 'aria-label': "Previous"}, 
            React.createElement("span", {'aria-hidden': "true"}, "«")
          )
        )
        pageLinks.push(React.createElement("li", {onClick: this.changePage(1)}, React.createElement("a", {href: "#"}, "«")));
        for(var i = Math.max(1, this.props.Active-3); i <= Math.min(this.props.Active+3, lastPage); i += 1) {
            classList = '';
            if(this.props.Active == i) {
                classList = "active";
            }
            pageLinks.push(React.createElement("li", {onClick: this.changePage(i), className: classList}, React.createElement("a", {href: "#"}, i)));
        }
        pageLinks.push(React.createElement("li", {onClick: this.changePage(lastPage)}, React.createElement("a", {href: "#"}, "»")));
        return (
            React.createElement("ul", {className: "pagination"}, 
                pageLinks
            )
        );
    }
});
