import {createRoot} from 'react-dom/client';
import React, {useEffect, useState} from 'react';
import type {ReactElement, ReactNode} from 'react';
import type {TFunction} from 'i18next';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import frStrings from '../locale/fr/LC_MESSAGES/electrophysiology_browser.json';
import jaStrings from '../locale/ja/LC_MESSAGES/electrophysiology_browser.json';
import zhStrings from '../locale/zh/LC_MESSAGES/electrophysiology_browser.json';

declare const loris: {
  BaseURL: string;
};

type FieldOptions = {
  projects: Record<string, string>;
  sites: Record<string, string>;
  types: Record<string, string>;
};

type BrowserData = {
  Data: Array<Record<string, string>>;
  fieldOptions: FieldOptions;
};

type BrowserIndexProps = {
  dataURL: string;
  t: TFunction;
};

/**
 * Electrophysiology Browser page.
 *
 * Serves as an entry-point to the module, rendering the whole react
 * component page on load.
 *
 * Renders Electrophysiology Browser main page consisting of FilterTable and
 * DataTable components.
 *
 * @author Cecile Madjar
 * @version 1.0.0
 */
function ElectrophysiologyBrowserIndex({
  dataURL,
  t,
}: BrowserIndexProps): ReactElement {
  const [data, setData] = useState<BrowserData | null>(null);
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(dataURL, {credentials: 'same-origin'})
      .then((resp) => {
        if (!resp.ok) {
          throw Error(resp.statusText);
        }
        return resp.json() as Promise<BrowserData>;
      })
      .then(setData)
      .catch((error) => {
        setError(true);
        console.error(error);
      })
      .finally(() => setIsLoaded(true));
  }, [dataURL]);

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {*} a formatted table cell for a given column
   */
  function formatColumn(
    column: string,
    cell: string,
    row: Record<string, string>
  ): ReactElement {
    const sessionIDKey = t('SessionID', {ns: 'loris'});
    const sessionID = row[sessionIDKey] || row.SessionID;

    if (column === t('Links', {ns: 'electrophysiology_browser'})) {
      const cellTypes = cell.split(',').reverse();
      const cellLinks: ReactNode[] = cellTypes.flatMap((cellType, index) => [
        <a
          key={cellType}
          href={
            `${loris.BaseURL}/electrophysiology_browser/sessions/`
            + `${sessionID}?outputType=${cellType}`
          }
        >
          {cellType}
        </a>,
        ...(index < cellTypes.length - 1 ? [' | '] : []),
      ]);

      if (cellTypes.length > 1) {
        cellLinks.push(
          ' | ',
          <a
            key='all'
            href={
              `${loris.BaseURL}/electrophysiology_browser/sessions/`
              + sessionID
            }
          >
            {t('all types', {ns: 'electrophysiology_browser'})}
          </a>
        );
      }

      return <td>{cellLinks}</td>;
    }

    if (column === t('Has HED Tags', {ns: 'electrophysiology_browser'})) {
      return <td>{t(cell, {ns: 'loris'})}</td>;
    }

    return <td>{cell}</td>;
  }

  if (error) {
    return (
      <h3>
        {t('An error occurred while loading the page.', {ns: 'loris'})}
      </h3>
    );
  }

  if (!isLoaded || !data) {
    return <Loader/>;
  }

  const options = data.fieldOptions;
  // The field order must match the queried columns in _setupVariables().
  const fields = [
    {
      label: t('Site', {ns: 'loris', count: 1}),
      show: true,
      filter: {
        name: 'site',
        type: 'select',
        options: options.sites,
      },
    },
    {
      label: t('PSCID', {ns: 'loris'}),
      show: true,
      filter: {
        name: 'PSCID',
        type: 'text',
      },
    },
    {
      label: t('DCCID', {ns: 'loris'}),
      show: true,
      filter: {
        name: 'DCCID',
        type: 'text',
      },
    },
    {
      label: t('Project', {ns: 'loris', count: 1}),
      show: true,
      filter: {
        name: 'project',
        type: 'select',
        options: options.projects,
      },
    },
    {
      label: t('Visit Label', {ns: 'loris'}),
      show: true,
      filter: {
        name: 'visitLabel',
        type: 'text',
      },
    },
    {
      label: t('Has HED Tags', {ns: 'electrophysiology_browser'}),
      show: true,
      filter: {
        name: 'HasHEDTags',
        type: 'select',
        hide: false,
        options: {
          yes: t('Yes', {ns: 'loris'}),
          no: t('No', {ns: 'loris'}),
        },
      },
    },
    {
      label: t('Acquisition Time', {ns: 'electrophysiology_browser'}),
      show: true,
    },
    {
      label: t('Insertion Time', {ns: 'electrophysiology_browser'}),
      show: true,
    },
    {
      label: t('Links', {ns: 'electrophysiology_browser'}),
      show: true,
    },
    {
      label: t('Output Type', {ns: 'electrophysiology_browser'}),
      show: false,
      filter: {
        name: 'type',
        type: 'multiselect',
        options: options.types,
      },
    },
    {label: t('SessionID', {ns: 'loris'}), show: false},
  ];

  return (
    <FilterableDataTable
      name='electrophysiology_filter'
      data={data.Data}
      fields={fields}
      getFormattedCell={formatColumn}
    />
  );
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'electrophysiology_browser', jaStrings);
  i18n.addResourceBundle('fr', 'electrophysiology_browser', frStrings);
  i18n.addResourceBundle('zh', 'electrophysiology_browser', zhStrings);
  const Index = withTranslation(
    ['electrophysiology_browser', 'loris']
  )(ElectrophysiologyBrowserIndex);
  const workspace = document.getElementById('lorisworkspace');
  if (!workspace) {
    throw Error('Could not find the LORIS workspace element.');
  }
  createRoot(workspace).render(
    <Index
      dataURL={`${loris.BaseURL}/electrophysiology_browser/?format=json`}
    />
  );
});
