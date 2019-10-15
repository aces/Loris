import React from 'react';
import {TabPane, Tabs} from 'jsx/Tabs';
import IncompleteForms from './tabs_content/incompleteForms';
import DataConflicts from './tabs_content/dataConflicts';
import BehaviouralFeedback from './tabs_content/behaviouralFeedback';

/**
 * Data Team Helper.
 *
 * @description the Data Team Helper of LORIS.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class DataTeamHelper extends React.Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
  }
  /**
   * @return {DOMRect}
   */
  render() {
    const tabList = [
      {id: 'tabIncompleteForms', label: 'Incomplete Forms'},
      {id: 'tabDataConflicts', label: 'Data Conflicts'},
      {id: 'tabBehaviouralFeedback', label: 'Behavioural Feedback'},
    ];
    return (
      <div className={'col-sm-12'}>
        <div className={'row'}>
          <Tabs tabs={tabList} defaultTab='tabIncompleteForms'>
            <TabPane TabId={tabList[0].id}><IncompleteForms/></TabPane>
            <TabPane TabId={tabList[1].id}><DataConflicts/></TabPane>
            <TabPane TabId={tabList[2].id}><BehaviouralFeedback/></TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

/**
 * Render Genomic Browser on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <DataTeamHelper/>,
    document.getElementById('lorisworkspace')
  );
});
