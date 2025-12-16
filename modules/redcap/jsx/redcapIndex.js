import PropTypes from 'prop-types';
import {TabPane, Tabs} from 'jsx/Tabs';
import NotificationViewer from './tabs/notificationViewer';
import DictionaryViewer from './tabs/dictionaryViewer';
import IssuesViewer from './tabs/issuesViewer';
import {createRoot} from 'react-dom/client';


/**
 * REDCap index view
 *
 * @param {array} props
 * @return {JSX}
 */
export default function RedcapIndex(props) {
  // list of tabs
  const tabList = [
    {id: 'notificationTable', label: 'Notifications'},
    {id: 'dictionaryTable', label: 'Data Dictionary'},
    {id: 'issuesTable', label: 'Issues'},
  ];

  return (
    <>
      <Tabs tabs={tabList} defaultTab='notificationTable' updateURL={true}>

        {/* notifications */}
        <TabPane TabId={tabList[0].id}>
          <NotificationViewer baseURL={props.moduleURL} />
        </TabPane>

        {/* dictionary */}
        <TabPane TabId={tabList[1].id}>
          <DictionaryViewer baseURL={props.moduleURL} />
        </TabPane>

        {/* issues */}
        <TabPane TabId={tabList[2].id}>
          <IssuesViewer baseURL={props.baseURL} moduleURL={props.moduleURL} />
        </TabPane>

      </Tabs>
    </>
  );
}

RedcapIndex.propTypes = {
  baseURL: PropTypes.string.isRequired,
  moduleURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

/**
 * Render REDCap main page on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <RedcapIndex
      baseURL={loris.BaseURL}
      moduleURL={loris.BaseURL + '/redcap'}
      hasPermission={loris.userHasPermission}
    />
  );
});
