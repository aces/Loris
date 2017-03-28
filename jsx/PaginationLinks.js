/* exported RPaginationLinks */

var PaginationLinks = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    onChangePage: React.PropTypes.func,
    Total: React.PropTypes.number.isRequired
  },
  getDefaultProps: function() {
    return {
      RowsPerPage: 10,
      Active: 1
    };
  },
  changePage: function(i) {
    var that = this;
    return function(evt) {
      // Don't jump to the top of the page
      evt.preventDefault();

      if (that.props.onChangePage) {
        that.props.onChangePage(i);
      }
    };
  },
  render: function() {
    var rowsPerPage = this.props.RowsPerPage;
    var pageLinks = [];
    var classList;
    var lastPage = Math.ceil(this.props.Total / rowsPerPage);
    var startPage = Math.max(1, this.props.Active - 3);
    var lastShownPage = Math.min(this.props.Active + 3, lastPage);

    if (this.props.Total === 0) {
      return <div />;
    }
    if (this.props.Total < this.props.RowsPerPage) {
      return <div />;
    }

    if ((lastShownPage - startPage) <= 7) {
      lastShownPage = startPage + 6;
      if (lastShownPage > lastPage) {
        lastShownPage = lastPage;
        startPage = lastPage - 6;
      }
    }

    if (startPage > 1) {
      pageLinks.push(
        <li onClick={this.changePage(1)}><a href="#">&laquo;</a></li>
      );
    }
    if (startPage < 1) {
      startPage = 1;
    }
    if (lastShownPage < 1) {
      lastShownPage = 1;
    }

        // If there is only 1 page, don't display pagination links
    if (startPage === lastShownPage) {
      return <div />;
    }

    for (var i = startPage; i <= lastShownPage; i += 1) {
      classList = '';
      if (this.props.Active === i) {
        classList = "active";
      }
      pageLinks.push(
        <li key={"table_page_" + i} onClick={this.changePage(i)} className={classList}>
          <a href="#">{i}</a>
        </li>
      );
    }
    if (lastShownPage !== lastPage) {
      pageLinks.push(
        <li key={"table_page_more"} onClick={this.changePage(lastPage)}>
          <a href="#">&raquo;</a>
        </li>
      );
    }
    return (
            <ul className="pagination pagination-table">
                {pageLinks}
            </ul>
        );
  }
});

var RPaginationLinks = React.createFactory(PaginationLinks);

window.PaginationLinks = PaginationLinks;
window.RPaginationLinks = RPaginationLinks;

export default PaginationLinks;
