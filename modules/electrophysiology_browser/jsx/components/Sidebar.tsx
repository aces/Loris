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

type ActiveTarget = {
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
  const [activeTarget, setActiveTarget] = useState<ActiveTarget>({
    targetID: 'session-summary',
  });

  useEffect(() => {
    const targetIDs = [
      'session-summary',
      ...recordings.flatMap((_recording, index) => [
        ...(RECORDING_VIEWER_ENABLED
          ? [
            `signal-viewer-${index}`,
            `recording-montage-${index}`,
            `recording-summary-${index}`,
            `recording-downloads-${index}`,
          ]
          : []),
        `recording-details-${index}`,
      ]),
    ];
    const targets = targetIDs
      .map((targetID) => document.getElementById(targetID))
      .filter((target): target is HTMLElement => target !== null);
    let animationFrame = 0;

    /** Select the navigable panel at the viewport's reading position. */
    const updateActiveTarget = (): void => {
      animationFrame = 0;
      const viewportHeight = document.documentElement.clientHeight;
      const anchorY = viewportHeight * 0.15;
      const candidates = targets.map((target) => {
        const bounds = target.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(bounds.bottom, viewportHeight) - Math.max(bounds.top, 0)
        );
        const anchorDistance = anchorY < bounds.top
          ? bounds.top - anchorY
          : anchorY > bounds.bottom
            ? anchorY - bounds.bottom
            : 0;

        return {
          targetID: target.id,
          visibleHeight,
          anchorDistance,
          topDistance: Math.abs(bounds.top - anchorY),
        };
      }).filter((candidate) => candidate.visibleHeight > 0);

      if (candidates.length === 0) {
        return;
      }

      candidates.sort((left, right) =>
        left.anchorDistance - right.anchorDistance
        || left.topDistance - right.topDistance
      );
      const best = candidates[0];

      setActiveTarget((current) => {
        // Several compact panels can occupy the same grid row. Keep the
        // user's selected sibling while it is tied with the best candidate.
        const currentCandidate = candidates.find(
          (candidate) => candidate.targetID === current.targetID
        );
        if (currentCandidate
          && Math.abs(currentCandidate.anchorDistance - best.anchorDistance)
            < 1
          && Math.abs(currentCandidate.topDistance - best.topDistance) < 1) {
          return current;
        }

        return current.targetID === best.targetID
          ? current
          : {targetID: best.targetID};
      });
    };

    /** Coalesce scroll events into one layout read per animation frame. */
    const scheduleUpdate = (): void => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateActiveTarget);
      }
    };

    updateActiveTarget();
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    targets.forEach((target) => resizeObserver.observe(target));
    window.addEventListener('scroll', scheduleUpdate, {passive: true});
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [recordings]);

  /** Navigate to a recording section or viewer panel. */
  function navigateTo(
    event: React.MouseEvent<HTMLAnchorElement>,
    targetID: string,
    viewerPanel?: 'eventList' | 'hedEndorsement'
  ): void {
    event.preventDefault();
    setActiveTarget({targetID, viewerPanel});
    onNavigate(targetID, viewerPanel);
  }

  /** Test whether a navigation link is the active destination. */
  function isActive(
    targetID: string,
    viewerPanel?: 'eventList' | 'hedEndorsement'
  ): boolean {
    return activeTarget.targetID === targetID
      && activeTarget.viewerPanel === viewerPanel;
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
              className={'ephys-session-summary-link'
                + (isActive('session-summary') ? ' active' : '')}
              aria-current={isActive('session-summary')
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
                  aria-current={isActive(`recording-${index}`)
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
                        className={isActive(link.targetID, link.viewerPanel)
                          ? 'active'
                          : ''}
                        aria-current={isActive(link.targetID, link.viewerPanel)
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
