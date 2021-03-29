import React, {useState} from 'react';

const theme = {
  primary: '#053665',
  secondary: '#A6D3F5',
  accent: '#E89A0C',
  neutral: '#DDD',
};

/**
 * Produces the pagination number links
 *
 * @param {jsx} children
 * @param {bool} active
 * @param {func} onClick
 *
 * @return {jsx}
 */
function PaginationLink({
  children,
  active,
  onClick,
}) {
  const [hover, setHover] = useState(false);
  const hoverOn = () => setHover(true);
  const hoverOff = () => setHover(false);
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.2rem',
    width: '3rem',
    height: '3rem',
    background: onClick && hover && !active && theme.neutral,
    border: active && '0.1rem solid '+theme.primary,
    borderRadius: '50%',
    cursor: onClick && 'pointer',
  };

  return (
    <>
      <div
        style={style}
        onClick={onClick}
        onMouseOver={hoverOn}
        onMouseOut={hoverOff}
      >
         {children}
      </div>
    </>
  );
};

/**
 * Produces the series of pagination links
 *
 * @param {int} rowsPerPage
 * @param {int} total
 * @param {int} active
 * @param {func} onChangePage
 *
 * @return {jsx}
 */
function PaginationLinks({
  rowsPerPage = 10,
  total,
  active = 1,
  onChangePage,
}) {
  let pageLinks = [];
  const lastPage = Math.ceil(total / rowsPerPage);
  if (lastPage < active) {
    onChangePage(1);
  }

  let startPage = 1;
  let endPage = lastPage;
  if (lastPage > 5) {
    if (active - 2 > 1) {
      startPage = active - 2;
    }
    if (active + 2 < lastPage) {
      endPage = active + 2;
    }
  }

  if (total === 0 || total < rowsPerPage || lastPage === 1) {
    return null;
  }

  if (active - 2 > 1) {
    pageLinks = [
      <PaginationLink
        key={startPage-1}
        onClick={() => onChangePage(1)}
      >
        1
      </PaginationLink>,
      <PaginationLink key={'front_ellipsis'}>...</PaginationLink>,
    ];
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pageLinks = [...pageLinks,
      <PaginationLink
        key={i}
        active={active === i}
        onClick={() => onChangePage(i)}
      >
        {i}
      </PaginationLink>,
    ];
  }

  if (active + 2 < lastPage) {
    pageLinks = [...pageLinks,
      <PaginationLink key={'back_ellipsis'}>...</PaginationLink>,
      <PaginationLink
        key={endPage+1}
        onClick={() => onChangePage(lastPage)}
      >
        {lastPage}
      </PaginationLink>,
    ];
  }

  const paginationStyle = {
    display: 'flex',
    fontSize: '1.6rem',
  };

  return <div style={paginationStyle}>{pageLinks}</div>;
}

export default PaginationLinks;
