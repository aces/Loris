import React from 'react';
import type {CSSProperties, ReactNode} from 'react';
import type {TFunction} from 'i18next';
import Panel from '../recording-viewer/src/ui/Panel';

type SummaryRow = {
  name: ReactNode;
  value: ReactNode;
};

type SummaryPanelProps = {
  data?: SummaryRow[];
  id?: string;
  t: TFunction;
};

/**
 * Summary panel for electrophysiology recording metadata.
 */
export default function SummaryPanel({data = [], id, t}: SummaryPanelProps) {
  return (
    <Panel collapsing={false} id={id} title={t('Summary', ns)}>
      <div style={panelBodyStyle}>
        <table style={tableStyle} className="table-bordered">
          <tbody>
            {data.map(({name, value}, i) => (
              <tr key={i}>
                <th scope="row" style={headerCellStyle}>
                  {name}
                </th>
                <td style={valueCellStyle}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

const ns = {ns: 'electrophysiology_browser'};

const panelBodyStyle: CSSProperties = {
  minHeight: '300px',
};

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
