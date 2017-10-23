import {Tabs, TabPane} from 'Tabs';
import formatColumn from './columnFormatter';

/**
 * Issue tracker app
 *
 * Display a list of issues according to the selected tab.
 *
 * @author Xavier Lecours Boucher
 * */
class IssueTrackerApp extends React.Component {

  constructor(props) {
    super(props);

    loris.hiddenHeaders = ['SessionID', 'CandID'];

    this.state = {
      data: {},
      isLoaded: false
    };

    // Bind component instance to custom methods
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    $.ajax(this.props.DataURL.concat('?format=json'), {
      method: "GET",
      dataType: 'json',
      success: function(data) {
        this.setState({
          data: data,
          isLoaded: true
        });
      }.bind(this),
      error: function(error) {
        console.error(error);
      }
    });
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate">
          </span>
        </button>
      );
    }

    const tabList = [
      {id: "issue_tracker", label: "All Active Issues"},
      {id: "resolved_issue_tracker", label: "Closed Issues"},
      {id: "my_issue_tracker", label: "My Issues"}
    ];

    const tabPanes = tabList.map(function(tab, index) {
      return (
        <TabPane key={index} TabId={tabList[index].id}>
          <DynamicDataTable
            DataURL={this.props.DataURL.concat(tab.id + '/?format=json')}
            getFormattedCell={formatColumn}
          />
        </TabPane>
      );
    }, this);

    return (
      <Tabs tabs={tabList} defaultTab="issue_tracker" updateURL={true}>
        {tabPanes}
      </Tabs>
    );
  }
}

$(function() {
  const app = (
    <IssueTrackerApp DataURL={`${loris.BaseURL}/issue_tracker/`} />
  );

  ReactDOM.render(app, document.getElementById("issue_tracker_app"));
});

