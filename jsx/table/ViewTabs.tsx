import React, {useState, useRef, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Textbox from 'jsx/Textbox';
import {Icon} from './icons';
import {useDismiss} from './useDismiss';
import type {TableState} from './useTableState';

/**
 * A table's views as tabs: everything, the module's own views and the ones
 * the user saved, with a way to save the current state as a view.
 *
 * @param {object} props - React props
 * @param {TableState} props.state - the table's state
 * @return {JSX.Element}
 */
function ViewTabs<R>(props: {state: TableState<R>}) {
  const {t} = useTranslation(['loris']);
  const {
    defaultState, applyView, presets, views, activeView, activePreset,
    modified, updateView, saveView, deleteView,
  } = props.state;
  const [saving, setSaving] = useState(false);
  const [viewName, setViewName] = useState('');
  const saveRef = useRef<HTMLDivElement>(null);
  const stopSaving = useCallback(() => setSaving(false), []);
  useDismiss(saveRef, saving, stopSaving);

  return (
    <div className="rt-tabs" role="tablist" aria-label={t('Views')}>
      <button
        type="button"
        role="tab"
        aria-selected={activeView === ''}
        className={'rt-tab' + (activeView === '' ? ' rt-tab-on' : '')}
        onClick={() => applyView(defaultState, '')}
      >
        {t('All')}
      </button>
      {presets.map((view) => (
        <button
          key={view.id}
          type="button"
          role="tab"
          aria-selected={activeView === view.id}
          className={'rt-tab' + (activeView === view.id ? ' rt-tab-on' : '')}
          onClick={() => applyView(view.state, view.id)}
        >
          {view.name}
        </button>
      ))}
      {views.map((view) => (
        <span
          key={view.id}
          className={'rt-tab'
            + (activeView === view.id ? ' rt-tab-on' : '')}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === view.id}
            className="rt-tab-label"
            onClick={() => applyView(view.state, view.id)}
          >
            {view.name}
          </button>
          <button
            type="button"
            className="rt-tab-remove"
            aria-label={t('Delete view {{name}}', {name: view.name})}
            onClick={() => deleteView(view.id)}
          >
            <Icon name="close" />
          </button>
        </span>
      ))}
      {modified && (
        <div className="rt-menu-anchor" ref={saveRef}>
          {activeView && !activePreset && (
            <Button display="quiet" onClick={updateView}>
              <Icon name="save" /> {t('Save')}
            </Button>
          )}
          <Button
            display="quiet"
            onClick={() => setSaving(!saving)}
          >
            <Icon name="add" />
            {' '}{activeView ? t('Save as new view…') : t('Save view…')}
          </Button>
          {saving && (
            <form
              className="rt-menu rt-menu-start"
              onSubmit={(e) => {
                e.preventDefault();
                const label = viewName.trim();
                if (label) {
                  saveView(label);
                  setViewName('');
                  setSaving(false);
                }
              }}
            >
              <Textbox
                label={t('View name')}
                value={viewName}
                onChange={setViewName}
              />
              <p className="rt-hint">
                {t('Saves the filters, sort, grouping, layout and columns'
                  + ' for you, in this browser.')}
              </p>
              <div className="rt-menu-foot">
                <Button type="submit" disabled={!viewName.trim()}>
                  {t('Save')}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewTabs;
