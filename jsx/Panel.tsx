import React, {
  CSSProperties,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';

export type PanelFrameProps = PropsWithChildren<{
  header?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  id?: string;
  className?: string;
  panelSize?: CSSProperties['height'];
  maxHeight?: CSSProperties['maxHeight'];
}>;

/**
 * Structural panel component on which panels with different headers and bodies
 * can be built.
 */
export function PanelFrame({
  header,
  collapsible = false,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  id = 'default-panel',
  className = 'panel-primary',
  panelSize,
  maxHeight,
  children,
}: PanelFrameProps): ReactElement {
  const [internalCollapsed, setInternalCollapsed] = useState(
    defaultCollapsed
  );
  const {t} = useTranslation();
  const collapsed = controlledCollapsed ?? internalCollapsed;

  /** Collapse the panel. */
  const toggleCollapsed = () => {
    if (!collapsible) return;

    const nextCollapsed = !collapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(nextCollapsed);
    }
    onCollapsedChange?.(nextCollapsed);
  };

  return (
    <div className={`panel ${className}`}
      style={{height: panelSize, maxHeight}}>
      {header != null || collapsible ? (
        <div className='panel-heading'>
          {header}
          {collapsible
            ? <button
              type='button'
              onClick={toggleCollapsed}
              aria-controls={id}
              aria-expanded={!collapsed}
              aria-label={collapsed
                ? t('Expand', {ns: 'loris'})
                : t('Collapse', {ns: 'loris'})}
              style={{
                background: 'none',
                border: 0,
                color: 'inherit',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span
                aria-hidden='true'
                className={collapsed
                  ? 'glyphicon glyphicon-chevron-down'
                  : 'glyphicon glyphicon-chevron-up'}
              />
            </button>
            : null}
        </div>
      ) : null}
      <div id={id}
        className={collapsed
          ? 'panel-collapse collapse'
          : 'panel-collapse collapse in'}
        aria-hidden={collapsed}
        style={{height: 'calc(100% - 3em)'}}>
        {children}
      </div>
    </div>
  );
}

export type PanelProps = Omit<PanelFrameProps, 'header'> & {
  title?: ReactNode;
  height?: CSSProperties['height'];
  style?: CSSProperties;
};

/** A panel with conventional title and body styling. */
function Panel({
  title,
  height = '100%',
  style,
  children,
  ...frameProps
}: PanelProps): ReactElement {
  const header = title != null
    ? <h3 className='panel-title'>{title}</h3>
    : undefined;

  return (
    <PanelFrame {...frameProps} header={header}>
      <div className='panel-body' style={{...style, height}}>
        {children}
      </div>
    </PanelFrame>
  );
}

export type PanelView = {
  title: ReactNode;
  subtitle?: ReactNode;
  content: ReactNode;
};

export type PanelViewsProps = Omit<PanelProps, 'children' | 'title'> & {
  views: [PanelView, ...PanelView[]];
  onChangeView?: (index: number) => void;
};

/** A panel that lets the user switch between multiple titled views. */
export function PanelViews({
  views,
  onChangeView,
  height = '100%',
  style,
  id = 'default-panel',
  ...frameProps
}: PanelViewsProps): ReactElement {
  const [activeView, setActiveView] = useState(0);
  const {t} = useTranslation();
  const selectedIndex = activeView < views.length ? activeView : 0;
  const selectedView = views[selectedIndex];

  useEffect(() => {
    if (activeView !== selectedIndex) {
      setActiveView(selectedIndex);
    }
  }, [activeView, selectedIndex]);

  /** A view is clicked. */
  const viewClicked = (index: number) => {
    setActiveView(index);
    onChangeView?.(index);
  };

  const header = (
    <>
      <h3 className='panel-title'>
        {selectedView.title}
        {selectedView.subtitle != null
          && <span> | {selectedView.subtitle}</span>}
      </h3>
      {views.length > 1 && (
        <div className='btn-group views'>
          <button type='button'
            className='btn btn-default btn-xs dropdown-toggle'
            data-toggle='dropdown'
            aria-haspopup='menu'>
            {t('Views', {ns: 'loris'})}<span className='caret'/>
          </button>
          <ul className='dropdown-menu pull-right' role='menu'>
            {views.map((view, index) => {
              const contentId = `${id}-view-${index}`;
              return (
                <li key={index}
                  className={index === selectedIndex ? 'active' : undefined}>
                  <a href={`#${contentId}`}
                    role='menuitem'
                    aria-current={index === selectedIndex ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      viewClicked(index);
                    }}>
                    {view.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );

  return (
    <PanelFrame {...frameProps} id={id} header={header}>
      <div className='panel-body' style={{...style, height}}>
        {views.map((view, index) => (
          <div key={index}
            id={`${id}-view-${index}`}
            hidden={index !== selectedIndex}>
            {view.content}
          </div>
        ))}
      </div>
    </PanelFrame>
  );
}

export default Panel;
