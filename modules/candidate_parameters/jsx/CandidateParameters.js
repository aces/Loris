import CandidateInfo from './CandidateInfo';
import ProbandInfo from './ProbandInfo';
import FamilyInfo from './FamilyInfo';
import ParticipantStatus from './ParticipantStatus';
import ConsentStatus from './ConsentStatus';

class CandidateParameters extends React.Component {

  getTabPanes(tabList) {
    const actionURL = `${loris.BaseURL}/candidate_parameters/ajax/formHandler.php`;
    const dataURL = `${loris.BaseURL}/candidate_parameters/ajax/getData.php?candID=${this.props.candID}`;
    const tabPanes = Object.keys(tabList).map(function(key) {
      const TabContent = tabList[key].component;
      return (
        <TabPane TabId={tabList[key].id} key={key}>
          <TabContent
            actionURL={actionURL}
            dataURL={`${dataURL}&data=${tabList[key].id}`}
            tabName={tabList[key].id}
          />
        </TabPane>
      );
    });
    return tabPanes;
  }

  render() {
    let tabList = [
      {id: "candidateInfo", label: "Candidate Information", component: CandidateInfo},
      {id: "participantStatus", label: "Participant Status", component: ParticipantStatus},
      {id: "consentStatus", label: "Consent Status", component: ConsentStatus}
    ];

    if (loris.config('useFamilyID') === "true") {
      tabList.splice(1, 0, {id: "familyInfo", label: "Family Information", component: FamilyInfo});
    }

    if (loris.config('useProband') === "true") {
      tabList.splice(1, 0, {id: "probandInfo", label: "Proband Information", component: ProbandInfo});
    }

    return (
      <div>
        <a className="btn btn-sm btn-primary"
           href={loris.BaseURL + '/timepoint_list/?candID=' + this.props.candID}
           style={{marginBottom: '20px'}}
        >
          Return to timepoint list
        </a>
        <br />
        <Tabs tabs={tabList} defaultTab="candidateInfo" updateURL={true}>
          {this.getTabPanes(tabList)}
        </Tabs>
      </div>
    );
  }
}

CandidateParameters.propTypes = {};
CandidateParameters.defaultProps = {};

export default CandidateParameters;
