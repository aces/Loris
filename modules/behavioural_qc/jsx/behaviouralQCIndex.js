import React from 'react';
import PropTypes from 'prop-types';
import {TabPane, Tabs} from 'jsx/Tabs';
import IncompleteForms from './tabs_content/incompleteForms';
import DataConflicts from './tabs_content/dataConflicts';
import BehaviouralFeedback from './tabs_content/behaviouralFeedback';

/**
 * Behavioural Quality Control.
 *
 * @description the Behavioural Quality Control of LORIS.
 * @param {object} props for the behavioural_qc
 * @return {reactElement} the tabPane of the behavioural_qc
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
const BehaviouralQC = (props) => {
  const tabList = [
    {id: 'tabIncompleteForms', label: 'Incomplete Forms'},
    {id: 'tabDataConflicts', label: 'Data Conflicts'},
    {id: 'tabBehaviouralFeedback', label: 'Behavioural Feedback'},
  ];

  /**
   * @return {React}
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
};

/**
 * Render Behavioural Quality Control on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <BehaviouralQC
      baseURL={loris.BaseURL}
    />,
    document.getElementById('lorisworkspace')
  );
});
