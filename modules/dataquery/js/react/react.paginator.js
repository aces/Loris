PaginationLinks = React.createClass({
    changePage: function(i) {
        var that = this;
        return function(evt) {
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
            return <div />;
        }
            <li>
          <a href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        pageLinks.push(<li onClick={this.changePage(1)}><a href="#">&laquo;</a></li>);
        for(var i = Math.max(1, this.props.Active-3); i <= Math.min(this.props.Active+3, lastPage); i += 1) {
            classList = '';
            if(this.props.Active == i) {
                classList = "active";
            }
            pageLinks.push(<li onClick={this.changePage(i)} className={classList}><a href="#">{i}</a></li>);
        }
        pageLinks.push(<li onClick={this.changePage(lastPage)}><a href="#">&raquo;</a></li>);
        return (
            <ul className="pagination">
                {pageLinks}
            </ul>
        );
    }
});
