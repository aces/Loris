/**
 * Session contents navigation for the electrophysiology viewer.
 */
import React, {useEffect, useState} from 'react';
import type {TFunction} from 'i18next';
import type {RecordingDatabaseEntry} from './RecordingSection';
import {RECORDING_VIEWER_ENABLED} from './RecordingSection';
import {hasRecordingHED} from '../utils';

type Navigation = {
  next?: string;
  previous?: string;
};

type SidebarProps = {
  navigation: Navigation;
  onNavigate: (
    targetID: string,
    viewerPanel?: 'eventList' | 'hedEndorsement'
  ) => void;
  recordings: RecordingDatabaseEntry[];
  t: TFunction;
};

type ContentsLink = {
  label: string;
  targetID: string;
  viewerPanel?: 'eventList' | 'hedEndorsement';
};

const ns = {ns: 'electrophysiology_browser'};

/** Add preferred wrap opportunities at BIDS entity separators. */
function BIDSFileName({name}: {name: string}): React.ReactElement {
  const segments = name.split('_');

  return (
    <>
      {segments.map((segment, index) => (
        <React.Fragment key={`${index}-${segment}`}>
          {index > 0 && <>_<wbr /></>}
          <span className='ephys-bids-name-segment'>{segment}</span>
        </React.Fragment>
      ))}
    </>
  );
}

/**
 * Render the collapsible table of contents for a session.
 */
export default function Sidebar({
  navigation,
  onNavigate,
  recordings,
  t,
}: SidebarProps): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTargetID, setActiveTargetID] = useState('session-summary');

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '#session-summary, [id^="recording-"] , [id^="signal-viewer-"]'
    );
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries.reduce<IntersectionObserverEntry | null>(
        (visible, entry) => entry.isIntersecting ? entry : visible,
        null
      );
      if (visibleEntry) {
        setActiveTargetID(visibleEntry.target.id);
      }
    }, {
      rootMargin: '-15% 0px -70% 0px',
      threshold: 0,
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [recordings]);

  /** Navigate to a recording section or viewer panel. */
  function navigateTo(
    event: React.MouseEvent<HTMLAnchorElement>,
    targetID: string,
    viewerPanel?: 'eventList' | 'hedEndorsement'
  ): void {
    event.preventDefault();
    setActiveTargetID(viewerPanel ?? targetID);
    onNavigate(targetID, viewerPanel);
  }

  return (
    <nav
      className={`ephys-session-sidebar${isCollapsed ? ' collapsed' : ''}`}
      aria-label={t('Session contents', ns)}
    >
      <button
        type='button'
        className='ephys-sidebar-toggle btn btn-link'
        aria-label={isCollapsed
          ? t('Expand session contents', ns)
          : t('Collapse session contents', ns)}
        aria-expanded={!isCollapsed}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span
          className={isCollapsed
            ? 'glyphicon glyphicon-chevron-right'
            : 'glyphicon glyphicon-chevron-left'}
          aria-hidden='true'
        />
      </button>

      <div className='ephys-sidebar-content'>
        <h2>{t('Session contents', ns)}</h2>

        <div className='ephys-session-navigation'>
          <a
            href={navigation.previous}
            className={navigation.previous ? '' : 'disabled'}
            aria-disabled={!navigation.previous}
            tabIndex={navigation.previous ? undefined : -1}
          >
            <span aria-hidden='true'>&#171;</span>{' '}
            {t('Previous', {ns: 'loris'})}
          </a>
          <a
            href={navigation.next}
            className={navigation.next ? '' : 'disabled'}
            aria-disabled={!navigation.next}
            tabIndex={navigation.next ? undefined : -1}
          >
            {t('Next', {ns: 'loris'})}{' '}
            <span aria-hidden='true'>&#187;</span>
          </a>
        </div>

        <ul className='ephys-session-contents'>
          <li>
            <a
              href='#session-summary'
              className={activeTargetID === 'session-summary' ? 'active' : ''}
              aria-current={activeTargetID === 'session-summary'
                ? 'location'
                : undefined}
              onClick={(event) => navigateTo(event, 'session-summary')}
            >
              {t('Session summary', ns)}
            </a>
          </li>
          {recordings.map((recording, index) => {
            const links: ContentsLink[] = [
              ...(RECORDING_VIEWER_ENABLED
                ? [
                  {
                    label: t('Signal Viewer', ns),
                    targetID: `signal-viewer-${index}`,
                  },
                  {
                    label: t('Events', ns),
                    targetID: `signal-viewer-${index}`,
                    viewerPanel: 'eventList' as const,
                  },
                  ...(hasRecordingHED(
                    recording.events,
                    recording.datasetTags
                  )
                    ? [{
                      label: t('HED Endorsements', ns),
                      targetID: `signal-viewer-${index}`,
                      viewerPanel: 'hedEndorsement' as const,
                    }]
                    : []),
                  {
                    label: t('Montage', ns),
                    targetID: `recording-montage-${index}`,
                  },
                  {
                    label: t('Summary', ns),
                    targetID: `recording-summary-${index}`,
                  },
                  {
                    label: t('Downloads', ns),
                    targetID: `recording-downloads-${index}`,
                  },
                ]
                : []),
              {
                label: t('Acquisition Details', ns),
                targetID: `recording-details-${index}`,
              },
            ];

            return (
              <li key={recording.file.id}>
                <a
                  className='ephys-recording-link'
                  href={`#recording-${index}`}
                  title={recording.file.name}
                  aria-current={activeTargetID === `recording-${index}`
                    ? 'location'
                    : undefined}
                  onClick={(event) => navigateTo(event, `recording-${index}`)}
                >
                  <BIDSFileName name={recording.file.name} />
                </a>
                <ul>
                  {links.map((link) => (
                    <li key={link.viewerPanel ?? link.targetID}>
                      <a
                        href={`#${link.targetID}`}
                        className={activeTargetID
                          === (link.viewerPanel ?? link.targetID)
                          ? 'active'
                          : ''}
                        aria-current={activeTargetID
                          === (link.viewerPanel ?? link.targetID)
                          ? 'location'
                          : undefined}
                        onClick={(event) => navigateTo(
                          event,
                          link.targetID,
                          link.viewerPanel
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
