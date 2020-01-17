import React, {useState} from 'react';
import PropTypes from 'prop-types';

const PaginationLinks = (props) => {

  const [RowsPerPage, setRowsPerPage] = useState(10);
  const [Active, setActive] = useState(1);

  const changePage = (i) => {
    return (evt) => {
      // Don't jump to the top of the page
      evt.preventDefault();

      if (props.onChangePage) {
        props.onChangePage(i);
      }
    };
  };

  let rowsPerPage = props.RowsPerPage;
  let pageLinks = [];
  let classList;
  let lastPage = Math.ceil(props.Total / rowsPerPage);
  let startPage = Math.max(1, props.Active - 3);
  let lastShownPage = Math.min(props.Active + 3, lastPage);

  if (props.Total === 0) {
    return null;
  }

  if ((lastShownPage - startPage) <= 7) {
    lastShownPage = startPage + 6;
    if (lastShownPage > lastPage) {
      lastShownPage = lastPage;
      startPage = lastPage - 6
    }
  }

  if (startPage > 1) {
    pageLinks.push(
      <li onClick={changePage(1)}>
        <a href='#'>&laquo;</a>
      </li>
    );
  }
  for (let i = startPage; i <= lastShownPage; i += 1) {
    classList = '';
    if (props.Active === i) {
      classList = 'active';
    }
    pageLinks.push(
      <li onClick={changePage(i)} className={classList}>
        <a href="#">
          {i}
        </a>
      </li>
    );
  }
  if (lastShownPage !== lastPage) {
    pageLinks.push(
      <li onClick={changePage(lastPage)}>
        <a href="#">
          &raquo;
        </a>
      </li>
    );
  }
  return (
    <ul className='pagination'>
      {pageLinks}
    </ul>
  );
};
PaginationLinks.propTypes = {
  onChangePage: PropTypes.func,
};

export default PaginationLinks;
