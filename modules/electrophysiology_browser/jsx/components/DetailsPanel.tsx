import React from 'react';
import type {CSSProperties, ReactNode} from 'react';
import type {TFunction} from 'i18next';
import Panel from 'jsx/Panel';

type DetailRow = {
  name: ReactNode;
  value: ReactNode;
};

type DetailsPanelProps = {
  data?: DetailRow[];
  id: string;
  title?: string;
  t: TFunction;
};

/**
 * Acquisition details panel for an electrophysiology recording.
 */
export default function DetailsPanel({
  data = [],
  id,
  title,
  t,
}: DetailsPanelProps): React.ReactElement {
  const halfSize = data.length/2;
  const columns = [
    data.slice(0, halfSize),
    data.slice(halfSize),
  ];

  return (
    <Panel id={id} title={getPanelTitle(title, t)}>
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="no-gutters">
            {columns.map((column, i) => (
              <div key={i} className="col-md-6">
                <div className="table-responsive">
                  <table style={tableStyle} className="table-bordered">
                    <tbody>
                      {column.map(({name, value}, j) => (
                        <tr key={j}>
                          <th scope="row" style={headerCellStyle}>
                            {name}
                          </th>
                          <td style={valueCellStyle}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/**
 * Build the acquisition details panel title.
 */
function getPanelTitle(title: string | undefined, t: TFunction) {
  if (title === undefined) {
    return t('Loading...', {ns: 'loris'});
  }

  return t(
    'Acquisition Details for Recording {{recording}}',
    {
      ns: 'electrophysiology_browser',
      recording: title.split('.').slice(0, -1).join('.'),
    }
  );
}

const tableStyle: CSSProperties = {
  background: '#fff',
  width: '100%',
};

const headerCellStyle: CSSProperties = {
  color: '#074785',
  padding: '5px 10px',
  wordWrap: 'break-word',
  width: '200px',
};

const valueCellStyle: CSSProperties = {
  padding: '5px 10px',
  wordWrap: 'break-word',
};
