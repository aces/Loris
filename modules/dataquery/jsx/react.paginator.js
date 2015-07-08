//var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

PaginationLinks = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    propTypes: {
        onChangePage: React.PropTypes.func
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
        var lastPage = Math.ceil(this.props.total / rowsPerPage);
        var startPage = Math.max(1, this.props.Active-3);
        var lastShownPage = Math.min(this.props.Active+3, lastPage);

        if(this.props.total === 0) {
            return <div />;
        }

        if((lastShownPage - startPage) <= 7) {
            lastShownPage = startPage + 6;
            if(lastShownPage > lastPage) {
                lastShownPage = lastPage;
                startPage = lastPage - 6
            }

        }


        if(startPage > 1) {
            pageLinks.push(<li onClick={this.changePage(1)}><a href="#">&laquo;</a></li>);
        }
        for(var i = startPage; i <= lastShownPage; i += 1) {
            classList = '';
            if(this.props.Active == i) {
                classList = "active";
            }
            pageLinks.push(<li onClick={this.changePage(i)} className={classList}><a href="#">{i}</a></li>);
        }
        if(lastShownPage !== lastPage) {
        pageLinks.push(<li onClick={this.changePage(lastPage)}><a href="#">&raquo;</a></li>);
        }
        return (
            <ul className="pagination">
                {pageLinks}
            </ul>
        );
    }
});

RPaginationLinks = React.createFactory(PaginationLinks);

