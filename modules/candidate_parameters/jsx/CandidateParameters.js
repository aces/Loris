import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CandidateInfo from './CandidateInfo';
import ProbandInfo from './ProbandInfo';
import FamilyInfo from './FamilyInfo';
import ParticipantStatus from './ParticipantStatus';
import ConsentStatus from './ConsentStatus';
import CandidateDOB from './CandidateDOB';
import CandidateDOD from './CandidateDOD';
import DiagnosisEvolution from './DiagnosisEvolution';
import {Tabs, TabPane} from 'Tabs';

/**
 * Candidate parameters component
 */
class CandidateParameters extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.getTabPanes = this.getTabPanes.bind(this);
  }

  /**
   * Get tab panes
   *
   * @param {object} tabList
   * @return {JSX} - React markup for the component
   */
  getTabPanes(tabList) {
    const actionURL = loris.BaseURL
                      + '/candidate_parameters/ajax/formHandler.php';
    const dataURL = loris.BaseURL
                    + '/candidate_parameters/ajax/getData.php'
                    + '?candID='
                    + this.props.candID;
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

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    let tabList = [
      {
        id: 'candidateInfo',
        label: 'Candidate Information',
        component: CandidateInfo,
      },
      {
        id: 'participantStatus',
        label: 'Participant Status',
        component: ParticipantStatus,
      },
      {
        id: 'candidateDOB',
        label: 'Date of Birth',
        component: CandidateDOB,
      },
      {
        id: 'candidateDOD',
        label: 'Date of Death',
        component: CandidateDOD,
      },
      {
        id: 'diagnosisEvolution',
        label: 'Diagnosis Evolution',
        component: DiagnosisEvolution,
      },
    ];

    if (loris.config('useProband') === 'true') {
      tabList.push({
        id: 'probandInfo',
        label: 'Proband Information',
        component: ProbandInfo,
      });
    }

    if (loris.config('useFamilyID') === 'true') {
      tabList.push({
        id: 'familyInfo',
        label: 'Family Information',
        component: FamilyInfo,
      });
    }

    if (loris.config('useConsent') === 'true') {
      tabList.push({
        id: 'consentStatus',
        label: 'Consent Status',
        component: ConsentStatus,
      });
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
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <div className="page-candidate-parameters">
      <CandidateParameters
        Module="candidate_parameters"
        candID={args.candID}
      />
    </div>
  );
});

