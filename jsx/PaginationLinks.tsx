import React from 'react';

/**
 * Display pagination links (usually for a table) within LORIS
 *
 * @param {object} props - React props
 * @param {number} props.Total - The total number of pages
 * @param {function} props.onChangePage - Callback to call when page number
 *                                        is clicked
 * @param {number|undefined} props.RowsPerPage - The number of rows on each page.
 *                                               Defaults to 10.
 * @param {number|undefined} props.Active - The currently active page number.
 *                                          Defaults to 1.
 */
function PaginationLinks(props: {
  Total: number,
  onChangePage: (pagnum: number) => void,
  RowsPerPage: number|undefined,
  Active: number|undefined,
}): React.ReactElement {
  const pageLinks = [];
  let classList = '';
  const rowsPerPage = props.RowsPerPage || 10;
  const activePage = props.Active || 1;

  const lastPage = Math.ceil(props.Total / rowsPerPage);
  let startPage = Math.max(1, activePage - 3);
  let lastShownPage = Math.min(activePage + 3, lastPage);

  if (props.Total === 0) {
    return <div />;
  }
  if (props.Total < rowsPerPage) {
    return <div />;
  }

  if ((lastShownPage - startPage) <= 7) {
    lastShownPage = startPage + 6;
    if (lastShownPage > lastPage) {
      lastShownPage = lastPage;
      startPage = lastPage - 6;
    }
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

  if (startPage > 1) {
    pageLinks.push(
      <li
        key={'table_page_beginning_' + startPage.toString()}
        onClick={(e) => {
          e.preventDefault();
          props.onChangePage(1);
        }}>
        <a href='#'>&laquo;</a>
      </li>
    );
  }

  for (let i = startPage; i <= lastShownPage; i += 1) {
    classList = '';
    if (activePage === i) {
      classList = 'active';
    }
    pageLinks.push(
      <li
        key={'table_page_' + i.toString()}
        onClick={(e) => {
          e.preventDefault();
          props.onChangePage(i);
        }}
        className={classList}
      >
        <a href="#">{i}</a>
      </li>
    );
  }
  if (lastShownPage !== lastPage) {
    pageLinks.push(
      <li
        key={'table_page_more_' + lastShownPage.toString()}
        onClick={(e) => {
          e.preventDefault();
          props.onChangePage(lastPage);
        }}>
        <a href='#'>&raquo;</a>
      </li>
    );
  }

  return (
    <ul className='pagination pagination-table'>
      {pageLinks}
    </ul>
  );
}

export default PaginationLinks;
