import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import {Icon} from './icons';

/**
 * The panel that slides over the right side of a table's rows, holding one
 * record or a form
 *
 * @param {object} props - React props
 * @param {string} props.label - names the panel for assistive technology
 * @param {ReactNode} props.title - shown in the panel's head
 * @param {ReactNode} props.tools - controls shown before the close button
 * @param {boolean} props.wide - whether the panel is wide, for a form
 * @param {Function} props.onClose - closes the panel
 * @param {ReactNode} props.children - the panel's content
 * @return {JSX.Element}
 */
function SidePanel(props: {
  label: string,
  title: ReactNode,
  tools?: ReactNode,
  wide?: boolean,
  onClose: () => void,
  children: ReactNode,
}) {
  const {t} = useTranslation(['loris']);
  return (
    <aside
      className={'rt-record' + (props.wide ? ' rt-record-wide' : '')}
      aria-label={props.label}
    >
      <div className="rt-record-head">
        <h3 className="rt-record-title">{props.title}</h3>
        {props.tools}
        <Button display="quiet" title={t('Close')} onClick={props.onClose}>
          <Icon name="close" />
        </Button>
      </div>
      {props.children}
    </aside>
  );
}

export default SidePanel;
