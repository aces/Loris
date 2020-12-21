import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * Pagination links component
 */
class PaginationLinks extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      RowsPerPage: 10,
      Active: 1,
    };
    this.changePage = this.changePage.bind(this);
  }

  /**
   * Change page
   * @param {Number} i
   * @return {function} - A callback function
   */
  changePage(i) {
    let that = this;
    return function(evt) {
      // Don't jump to the top of the page
      evt.preventDefault();

      if (that.props.onChangePage) {
        that.props.onChangePage(i);
      }
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let rowsPerPage = this.props.RowsPerPage;
    let pageLinks = [];
    let classList;
    let lastPage = Math.ceil(this.props.Total / rowsPerPage);
    let startPage = Math.max(1, this.props.Active - 3);
    let lastShownPage = Math.min(this.props.Active + 3, lastPage);

    if (this.props.Total === 0) {
      return <div/>;
    }

    if ((lastShownPage - startPage) <= 7) {
      lastShownPage = startPage + 6;
      if (lastShownPage > lastPage) {
        lastShownPage = lastPage;
        startPage = lastPage - 6;
      }
    }

    if (startPage > 1) {
      pageLinks.push(<li onClick={this.changePage(1)}>
        <a href="#">&laquo;</a>
      </li>);
    }

    for (let i = startPage; i <= lastShownPage; i += 1) {
      classList = '';
      if (this.props.Active === i) {
        classList = 'active';
      }
      pageLinks.push(<li onClick={this.changePage(i)} className={classList}>
        <a href="#">{i}</a>
      </li>);
    }

    if (lastShownPage !== lastPage) {
      pageLinks.push(<li onClick={this.changePage(lastPage)}>
        <a href="#">&raquo;</a>
      </li>);
    }

    return (
      <ul className="pagination">
        {pageLinks}
      </ul>
    );
  }
}
PaginationLinks.propTypes = {
  onChangePage: PropTypes.func,
};

window.PaginationLinks = PaginationLinks;
window.RPaginationLinks = React.createFactory(PaginationLinks);

export default PaginationLinks;
