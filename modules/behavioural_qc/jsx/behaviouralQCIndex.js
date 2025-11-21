import {createRoot} from 'react-dom/client';
import React from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import {TabPane, Tabs} from 'jsx/Tabs';
import IncompleteForms from './tabs_content/incompleteForms';
import DataConflicts from './tabs_content/dataConflicts';
import BehaviouralFeedback from './tabs_content/behaviouralFeedback';

import hiStrings from '../locale/hi/LC_MESSAGES/behavioural_qc.json';
import jaStrings from '../locale/ja/LC_MESSAGES/behavioural_qc.json';
/**
 * Behavioural Quality Control.
 *
 * @description the Behavioural Quality Control of LORIS.
 * @param {object} props for the behavioural_qc
 * @return {JSX} the tabPane of the behavioural_qc
 * @author Alizée Wickenheiser
 * @version 1.0.0
 */
const BehaviouralQC = (props) => {
  const {t} = props;
  const tabList = [
    {id: 'tabIncompleteForms', label: t('Incomplete Forms',
      {ns: 'behavioural_qc'})},
    {id: 'tabDataConflicts', label: t('Data Conflicts',
      {ns: 'behavioural_qc'})},
    {id: 'tabBehaviouralFeedback', label: t('Behavioural Feedback',
      {ns: 'behavioural_qc'})},
  ];

  /**
   * @return {JSX}
   */
  return (
    <div className={'col-sm-12'}>
      <div className={'row'}>
        <Tabs tabs={tabList} defaultTab='tabIncompleteForms'>
          <TabPane TabId={tabList[0].id}>
            <IncompleteForms baseURL={props.baseURL}/>
          </TabPane>
          <TabPane TabId={tabList[1].id}>
            <DataConflicts baseURL={props.baseURL}/>
          </TabPane>
          <TabPane TabId={tabList[2].id}>
            <BehaviouralFeedback baseURL={props.baseURL}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
BehaviouralQC.propTypes = {
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func, // ADD THIS
};

/**
 * Render Behavioural Quality Control on page load.
 */
window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'behavioural_qc', jaStrings);
  i18n.addResourceBundle('hi', 'behavioural_qc', hiStrings);
  const Index = withTranslation(
    ['behavioural_qc', 'loris']
  )(BehaviouralQC);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <Index
      baseURL={loris.BaseURL}
    />
  );
});
