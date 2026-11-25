import React from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import {Icon} from './icons';
import type {TableState} from './useTableState';

/**
 * The footer under a table: the CSV download, how many rows match, and
 * which are in view.
 *
 * @param props - React props
 * @param props.state - the table's state
 * @param props.total - how many records the table holds
 * @param props.first - the position of the first record in view
 * @param props.last - the position of the last record in view
 * @param props.onDownload - saves the matching rows as a CSV, when offered
 * @param props.start - shown at the footer's start in place of the download,
 *                      such as the selection and what can be done to it
 */
function TableFooter<R>(props: {
  state: TableState<R>,
  total: number,
  first: number,
  last: number,
  onDownload?: () => void,
  start?: React.ReactNode,
}) {
  const {t} = useTranslation(['loris']);
  const {filtered, shown} = props.state;
  return (
    <div className="rt-footer">
      {props.start ? (
        <span className="rt-footer-start">{props.start}</span>
      ) : props.onDownload && (
        <span className="rt-footer-start">
          <Button display="quiet" onClick={props.onDownload}>
            <Icon name="download" /> {t('Download CSV')}
          </Button>
        </span>
      )}
      {filtered.length < props.total && (
        <span className="rt-muted">
          {t('Filtered from {{count}}', {count: props.total})}
        </span>
      )}
      <span className="rt-range" data-total={shown.length}>
        {t('{{first}}–{{last}} of {{total}}', {
          first: shown.length === 0 ? 0 : props.first,
          last: props.last,
          total: shown.length,
        })}
      </span>
    </div>
  );
}

export default TableFooter;
