import CandidateInfo from './CandidateInfo';
import ProbandInfo from './ProbandInfo';
import FamilyInfo from './FamilyInfo';
import ParticipantStatus from './ParticipantStatus';
import ConsentStatus from './ConsentStatus';

class CandidateParameters extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let tabList = [
      {id: "candidateInfo", label: "Candidate Information"},
      {id: "probandInfo", label: "Proband Information"},
      {id: "familyInfo", label: "Family Information"},
      {id: "participantStatus", label: "Participant Status"},
      {id: "consentStatus", label: "Consent Status"}
    ];

    const actionURL = `${loris.BaseURL}/candidate_parameters/ajax/formHandler.php`;
    let dataURL = `${loris.BaseURL}/candidate_parameters/ajax/getData.php?candID=${this.props.candID}`;

    return (
      <Tabs tabs={tabList} defaultTab="candidateInfo" updateURL={true}>
        <TabPane TabId={tabList[0].id}>
          <CandidateInfo
            actionURL={actionURL}
            dataURL={`${dataURL}&data=${tabList[0].id}`}
            tabName={tabList[0].id}
          />
        </TabPane>
        <TabPane TabId={tabList[1].id}>
          <ProbandInfo
            actionURL={actionURL}
            dataURL={`${dataURL}&data=${tabList[1].id}`}
            tabName={tabList[1].id}
          />
        </TabPane>
        <TabPane TabId={tabList[2].id}>
          <FamilyInfo
            actionURL={actionURL}
            dataURL={`${dataURL}&data=${tabList[2].id}`}
            tabName={tabList[2].id}
          />
        </TabPane>
        <TabPane TabId={tabList[3].id}>
          <ParticipantStatus
            actionURL={actionURL}
            dataURL={`${dataURL}&data=${tabList[3].id}`}
            tabName={tabList[3].id}
          />
        </TabPane>
        <TabPane TabId={tabList[4].id}>
          <ConsentStatus
            actionURL={actionURL}
            dataURL={`${dataURL}&data=${tabList[4].id}`}
            tabName={tabList[4].id}
          />
        </TabPane>
      </Tabs>
    );
  }
}

CandidateParameters.propTypes = {};
CandidateParameters.defaultProps = {};

export default CandidateParameters;
