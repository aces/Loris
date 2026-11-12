import React from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Select from 'jsx/Select';
import {Icon} from './icons';
import type {TableState} from './useTableState';

/**
 * The footer under a table: how many rows match, the page size and paging.
 *
 * @param {object} props - React props
 * @param {TableState} props.state - the table's state
 * @param {number} props.total - how many records the table holds
 * @param {number[]} props.pageSizes - the page sizes offered
 * @return {JSX.Element}
 */
function TableFooter<R>(props: {
  state: TableState<R>,
  total: number,
  pageSizes: number[],
}) {
  const {t} = useTranslation(['loris']);
  const {pageSizes} = props;
  const {
    filtered, page, setPage, pageable, start, pageRecords, pageNumber,
    lastPage,
  } = props.state;
  const sizeOptions: {[value: string]: string} = {};
  pageSizes.forEach((n) => sizeOptions[String(n)] = String(n));
  sizeOptions['0'] = t('All');
  const first = pageable.length === 0 ? 0 : start + 1;
  const last = start + pageRecords.length;
  return (
    <div className="rt-footer">
      {filtered.length < props.total && (
        <span className="rt-muted">
          {t('Filtered from {{count}}', {count: props.total})}
        </span>
      )}
      <span className="rt-footer-label">{t('Rows per page')}</span>
      <div className="rt-pagesize">
        <Select
          multiple={false}
          options={sizeOptions}
          value={[String(page.size)]}
          onChange={(values) => setPage({
            number: 1, size: parseInt(values[0], 10),
          })}
        />
      </div>
      <span className="rt-range" data-total={pageable.length}>
        {t('{{first}}–{{last}} of {{total}}', {
          first, last, total: pageable.length,
        })}
      </span>
      <Button
        display="quiet"
        title={t('Previous page')}
        disabled={pageNumber <= 1}
        onClick={() => setPage((p) => ({...p, number: pageNumber - 1}))}
      >
        <Icon name="chevronLeft" />
      </Button>
      <Button
        display="quiet"
        title={t('Next page')}
        disabled={pageNumber >= lastPage}
        onClick={() => setPage((p) => ({...p, number: pageNumber + 1}))}
      >
        <Icon name="chevronRight" />
      </Button>
    </div>
  );
}

export default TableFooter;
