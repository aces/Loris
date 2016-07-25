//var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

PaginationLinks = React.createClass({displayName: 'PaginationLinks',
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        onChangePage: React.PropTypes.func,
        Total: React.PropTypes.number.isRequired
    },
    getDefaultProps: function() {
        return {
            'RowsPerPage' : 10,
            'Active' : 1
        }
    },
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
        var rowsPerPage = this.props.RowsPerPage;
        var pageLinks = [];
        var classList;
        var lastPage = Math.ceil(this.props.Total / rowsPerPage);
        var startPage = Math.max(1, this.props.Active-3);
        var lastShownPage = Math.min(this.props.Active+3, lastPage);

        if(this.props.Total === 0) {
            return React.createElement("div", null);
        }
        if(this.props.Total < this.props.RowsPerPage) {
            return React.createElement("div", null);
        }

        if((lastShownPage - startPage) <= 7) {
            lastShownPage = startPage + 6;
            if(lastShownPage > lastPage) {
                lastShownPage = lastPage;
                startPage = lastPage - 6
            }

        }


        if(startPage > 1) {
            pageLinks.push(React.createElement("li", {onClick: this.changePage(1)}, React.createElement("a", {href: "#"}, "«")));
        }
        if(startPage < 1) {
            startPage = 1;
        }
        if(lastShownPage < 1) {
            lastShownPage = 1;
        }
        for(var i = startPage; i <= lastShownPage; i += 1) {
            classList = '';
            if(this.props.Active == i) {
                classList = "active";
            }
            pageLinks.push(React.createElement("li", {onClick: this.changePage(i), className: classList}, React.createElement("a", {href: "#"}, i)));
        }
        if(lastShownPage !== lastPage) {
        pageLinks.push(React.createElement("li", {onClick: this.changePage(lastPage)}, React.createElement("a", {href: "#"}, "»")));
        }
        return (
            React.createElement("ul", {className: "pagination"}, 
                pageLinks
            )
        );
    }
});

RPaginationLinks = React.createFactory(PaginationLinks);
