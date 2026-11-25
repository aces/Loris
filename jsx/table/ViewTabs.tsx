import React, {useState, useRef, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'jsx/Button';
import Textbox from 'jsx/Textbox';
import Tooltip from 'jsx/Tooltip';
import {Icon} from './icons';
import {useDismiss} from './useDismiss';
import type {TableState} from './useTableState';

type Step = 'menu' | 'new' | 'rename' | 'delete';

/**
 * A table's views as tabs: everything, the module's own views and the ones
 * the user saved. A + after the tabs saves the current state as a new view.
 * A saved view's tab opens its menu on right-click, or with the menu key:
 * save changes to it, rename it, or delete it after confirming, so a saved
 * view is never lost to a stray click. The menu opens after the tabs rather
 * than among them, so it is not clipped when the tabs scroll.
 *
 * @param props - React props
 * @param props.state - the table's state
 */
function ViewTabs<R>(props: {state: TableState<R>}) {
  const {t} = useTranslation(['loris']);
  const {
    defaultState, applyView, presets, views, activeView,
    modified, updateView, saveView, deleteView, renameView,
  } = props.state;
  const [step, setStep] = useState<Step | null>(null);
  const [target, setTarget] = useState('');
  const [viewName, setViewName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setStep(null), []);
  useDismiss(menuRef, step !== null, close);
  useEffect(() => {
    if (step === 'new' || step === 'rename') {
      menuRef.current?.querySelector<HTMLInputElement>('form input')?.focus();
    }
  }, [step]);

  const saved = views.find((v) => v.id === target);

  /**
   * Opens a step of the menu, with the name field filled for it
   *
   * @param next - the step
   */
  const open = (next: Step) => {
    setViewName(next === 'rename' && saved ? saved.name : '');
    setStep(next);
  };

  /**
   * Opens the menu of a saved view
   *
   * @param id - the view's id
   */
  const openFor = (id: string) => {
    setTarget(id);
    setStep('menu');
  };

  /**
   * Saves a new view, or renames the open one, under the name typed
   *
   * @param e - the form's submission
   */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const label = viewName.trim();
    if (!label) {
      return;
    }
    if (step === 'rename' && saved) {
      renameView(saved.id, label);
    } else {
      saveView(label);
    }
    close();
  };

  let menu: React.ReactNode = null;
  if (step === 'menu' && saved) {
    const changed = modified && activeView === saved.id;
    menu = (
      <div className="rt-menu rt-menu-start rt-view-menu" role="menu">
        <button
          type="button"
          role="menuitem"
          className="rt-menu-item"
          aria-disabled={!changed}
          onClick={() => {
            if (changed) {
              updateView();
              close();
            }
          }}
        >
          {t('Save changes to {{name}}', {name: saved.name})}
        </button>
        <button
          type="button"
          role="menuitem"
          className="rt-menu-item"
          onClick={() => open('rename')}
        >
          {t('Rename {{name}}…', {name: saved.name})}
        </button>
        <button
          type="button"
          role="menuitem"
          className="rt-menu-item rt-menu-danger"
          onClick={() => open('delete')}
        >
          {t('Delete {{name}}…', {name: saved.name})}
        </button>
      </div>
    );
  } else if (step === 'new' || step === 'rename') {
    menu = (
      <form className="rt-menu rt-menu-start" onSubmit={submit}>
        <Textbox
          label={t('View name')}
          value={viewName}
          onChange={setViewName}
        />
        {step === 'new' && (
          <p className="rt-hint">
            {t('Saves the filters, sort, grouping, layout and columns'
              + ' for you, in this browser.')}
          </p>
        )}
        <div className="rt-menu-foot">
          <Button display="quiet" onClick={close}>{t('Cancel')}</Button>
          <Button type="submit" disabled={!viewName.trim()}>
            {step === 'rename' ? t('Rename') : t('Save')}
          </Button>
        </div>
      </form>
    );
  } else if (step === 'delete' && saved) {
    menu = (
      <div className="rt-menu rt-menu-start" role="alertdialog"
        aria-label={t('Delete view')}>
        <p className="rt-menu-text">
          {t('Delete the view {{name}}? It can\'t be brought back.',
            {name: saved.name})}
        </p>
        <div className="rt-menu-foot">
          <Button display="quiet" onClick={close}>{t('Cancel')}</Button>
          <Button
            display="danger"
            onClick={() => {
              deleteView(saved.id);
              close();
            }}
          >
            {t('Delete')}
          </Button>
        </div>
      </div>
    );
  }

  /**
   * A view's tab
   *
   * @param id - the view's id, empty for everything
   * @param name - the view's name
   * @param onClick - opens the view
   */
  const tab = (id: string, name: string, onClick: () => void) => (
    <button
      key={id}
      type="button"
      role="tab"
      aria-selected={activeView === id}
      className={'rt-tab' + (activeView === id ? ' rt-tab-on' : '')}
      onClick={onClick}
    >
      {name}
    </button>
  );

  return (<>
    <div className="rt-tabs" role="tablist" aria-label={t('Views')}>
      {tab('', t('All'), () => applyView(defaultState, ''))}
      {presets.map((view) => tab(
        view.id, view.name, () => applyView(view.state, view.id)
      ))}
      {views.map((view) => (
        <span
          key={view.id}
          className="rt-tab-wrap"
          role="presentation"
          onContextMenu={(e) => {
            e.preventDefault();
            openFor(view.id);
          }}
        >
          {tab(view.id, view.name, () => applyView(view.state, view.id))}
        </span>
      ))}
    </div>
    <div className="rt-menu-anchor rt-view-save" ref={menuRef}>
      <Tooltip content={t('New view')} placement="bottom">
        <Button
          display="quiet"
          aria-label={t('New view')}
          aria-haspopup="dialog"
          aria-expanded={step === 'new'}
          onClick={() => {
            if (step === 'new') {
              close();
            } else {
              setTarget('');
              open('new');
            }
          }}
        >
          <Icon name="add" />
        </Button>
      </Tooltip>
      {menu}
    </div>
  </>);
}

export default ViewTabs;
