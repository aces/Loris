import FilterForm from 'FilterForm';
import {Tabs, TabPane} from 'Tabs';

class QualityControlIndex extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let uploadTab;
    let tabList = [
        {id: "behavioral", label: "Behavioral"},
        {id: "imaging", label: "Imaging"}
    ];

    return (
      <Tabs tabs={tabList} defaultTab="behavioral" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
        </TabPane>
        <TabPane TabId={tabList[1].id}>
        </TabPane>
      </Tabs>
    );
  }
}

$(function() {
  const qualityControlIndex = (
    <div className="page-qualityControl">
      <QualityControlIndex UselessURL={`${loris.BaseURL}/quality_control`}/>
    </div>
  );

  ReactDOM.render(qualityControlIndex, document.getElementById("lorisworkspace"));
});

