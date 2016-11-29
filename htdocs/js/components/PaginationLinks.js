"use strict";

/* exported RPaginationLinks */

var PaginationLinks = React.createClass({
  displayName: "PaginationLinks",

  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    onChangePage: React.PropTypes.func,
    Total: React.PropTypes.number.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      RowsPerPage: 10,
      Active: 1
    };
  },
  changePage: function changePage(i) {
    var that = this;
    return function (evt) {
      // Don't jump to the top of the page
      evt.preventDefault();

      if (that.props.onChangePage) {
        that.props.onChangePage(i);
      }
    };
  },
  render: function render() {
    var rowsPerPage = this.props.RowsPerPage;
    var pageLinks = [];
    var classList;
    var lastPage = Math.ceil(this.props.Total / rowsPerPage);
    var startPage = Math.max(1, this.props.Active - 3);
    var lastShownPage = Math.min(this.props.Active + 3, lastPage);

    if (this.props.Total === 0) {
      return React.createElement("div", null);
    }
    if (this.props.Total < this.props.RowsPerPage) {
      return React.createElement("div", null);
    }

    if (lastShownPage - startPage <= 7) {
      lastShownPage = startPage + 6;
      if (lastShownPage > lastPage) {
        lastShownPage = lastPage;
        startPage = lastPage - 6;
      }
    }

    if (startPage > 1) {
      pageLinks.push(React.createElement(
        "li",
        { onClick: this.changePage(1) },
        React.createElement(
          "a",
          { href: "#" },
          "\xAB"
        )
      ));
    }
    if (startPage < 1) {
      startPage = 1;
    }
    if (lastShownPage < 1) {
      lastShownPage = 1;
    }

    // If there is only 1 page, don't display pagination links
    if (startPage === lastShownPage) {
      return React.createElement("div", null);
    }

    for (var i = startPage; i <= lastShownPage; i += 1) {
      classList = '';
      if (this.props.Active === i) {
        classList = "active";
      }
      pageLinks.push(React.createElement(
        "li",
        { key: "table_page_" + i, onClick: this.changePage(i), className: classList },
        React.createElement(
          "a",
          { href: "#" },
          i
        )
      ));
    }
    if (lastShownPage !== lastPage) {
      pageLinks.push(React.createElement(
        "li",
        { key: "table_page_more", onClick: this.changePage(lastPage) },
        React.createElement(
          "a",
          { href: "#" },
          "\xBB"
        )
      ));
    }
    return React.createElement(
      "ul",
      { className: "pagination pagination-table" },
      pageLinks
    );
  }
});

var RPaginationLinks = React.createFactory(PaginationLinks);