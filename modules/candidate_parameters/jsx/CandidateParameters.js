import React, {Component} from 'react';
import CandidateInfo from './CandidateInfo';
import ProbandInfo from './ProbandInfo';
import FamilyInfo from './FamilyInfo';
import ParticipantStatus from './ParticipantStatus';
import ConsentStatus from './ConsentStatus';
import {Tabs, TabPane} from 'Tabs';

class CandidateParameters extends Component {
  constructor(props) {
    super(props);
    this.getTabPanes = this.getTabPanes.bind(this);
  }

  getTabPanes(tabList) {
    const actionURL = `${loris.BaseURL}/candidate_parameters/ajax/formHandler.php`;
    const dataURL = `${loris.BaseURL}/candidate_parameters/ajax/getData.php?candID=${this.props.candID}`;
    const tabPanes = Object.keys(tabList).map((key) => {
      const TabContent = tabList[key].component;
      return (
        <TabPane TabId={tabList[key].id} key={key}>
          <TabContent
            action={actionURL}
            dataURL={`${dataURL}&data=${tabList[key].id}`}
            tabName={tabList[key].id}
          />
        </TabPane>
      );
    });
    return tabPanes;
  }

  render() {
    const tabList = [
      {id: 'candidateInfo', label: 'Candidate Information', component: CandidateInfo},
      {id: 'participantStatus', label: 'Participant Status', component: ParticipantStatus},
    ];

    if (loris.config('useProband') === 'true') {
      tabList.push({id: 'probandInfo', label: 'Proband Information', component: ProbandInfo});
    }

    if (loris.config('useFamilyID') === 'true') {
      tabList.push({id: 'familyInfo', label: 'Family Information', component: FamilyInfo});
    }

    if (loris.config('useConsent') === 'true') {
      tabList.push({id: 'consentStatus', label: 'Consent Status', component: ConsentStatus});
    }

    return (
      <div>
        <a className='btn btn-sm btn-primary'
          href={loris.BaseURL + '/' + this.props.candID}
          style={{marginBottom: '20px'}}
        >
          Return to timepoint list
        </a>
        <br />
        <Tabs tabs={tabList} defaultTab='candidateInfo' updateURL={true}>
          {this.getTabPanes(tabList)}
        </Tabs>
      </div>
    );
  }
}

CandidateParameters.propTypes = {
  candID: PropTypes.string.isRequired,
};

/**
 * Render Candidate Parameters component on page load
 */
const args = QueryString.get(document.currentScript.src);

window.addEventListener('load', () => {
  const candidateParameters = (
    <div className="page-candidate-parameters">
      <CandidateParameters
        Module="candidate_parameters"
        candID={args.candID}
      />
    </div>
  );

  ReactDOM.render(candidateParameters, document.getElementById('lorisworkspace'));
});

