/**
 * This file contains React component for the Electrophysiology module sidebar.
 */
import React from 'react';
import type {CSSProperties} from 'react';
import type {TFunction} from 'i18next';

type SidebarProps = {
  previous?: string;
  next?: string;
  t: TFunction;
};

const ns = {ns: 'electrophysiology_browser'};

const rootStyle: CSSProperties = {
  top: 0,
  bottom: 0,
  overflow: 'auto',
};

const sidebarStyle: CSSProperties = {
  top: 0,
  bottom: 0,
  zIndex: 1,
  overflowY: 'auto',
  width: 150,
  height: 'calc(100vh)',
  background: '#E4EBF2',
  border: '1px solid #C3D5DB',
  fontWeight: 200,
};

const titleStyle: CSSProperties = {
  color: '#064785',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '80px 0 0 10px',
};

const contentStyle: CSSProperties = {
  padding: '10px',
};

const previousLinkStyle: CSSProperties = {
  color: '#064785',
  fontSize: '16px',
  display: 'none',
  padding: '0 0 0 10px',
  textDecoration: 'none',
};

const nextLinkStyle: CSSProperties = {
  color: '#064785',
  fontSize: '16px',
  display: 'none',
  padding: '10px 0 0 30px',
  textDecoration: 'none',
};

/**
 * Sidebar navigation for the electrophysiology session view.
 */
export default function Sidebar({
  previous = 'previous',
  next = 'next',
  t,
}: SidebarProps): React.ReactElement {
  return (
    <div style={rootStyle} role='navigation'>
      <div style={sidebarStyle}>
        <div style={titleStyle}>
          {t('Navigation', ns)}
        </div>
        <div style={contentStyle}>
          <a
            id='nav_previous'
            href={previous}
            target='_self'
            style={previousLinkStyle}
          >
            &#171; {t('Previous', {ns: 'loris'})}
          </a>
          <a
            id='nav_next'
            href={next}
            target='_self'
            style={nextLinkStyle}
          >
            {t('Next', {ns: 'loris'})} &#187;
          </a>
        </div>
      </div>
    </div>
  );
}
