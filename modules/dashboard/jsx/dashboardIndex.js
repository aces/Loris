import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import WelcomePanel from './panels/welcome';
import RecruitmentPanel from './panels/recruitment';
import StudyProgressionPanel from './panels/studyprogression';
import MyTasksPanel from './panels/mytasks';
import DocumentRepositoryPanel from './panels/documentrepository';
import BehaviouralFeedbackPanel from './panels/behaviouralfeedback';

/**
 * Dashboard.
 *
 * @description the dashboard of LORIS.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Dashboard extends React.Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
    this.state = {
      display: {
        panel: {
          welcome: true,
          recruitment: true,
          studyProgression: true,
          myTasks: true,
          documentRepository: true,
          behaviouralFeedback: true,
        },
      },
      data: null,
    };
    // Bind component instance to custom methods
    this.fetchInitializerData = this.fetchInitializerData.bind(this);
  }

  /**
   * Executes after component mounts.
   */
  componentDidMount() {
    this.fetchInitializerData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   *
   * @return {object}
   */
  fetchInitializerData() {
    return fetch(
      window.location.origin + '/dashboard/Dashboard', {
          credentials: 'same-origin',
        }
    ).then((response) => response.json())
      .then((data) => {
        this.setState({data: data});
      })
      .catch((error) => {
        console.error(error);
        this.setState({error: true});
      });
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    // Welcome Panel
    const welcome = this.state.display.panel.welcome ? (
      <WelcomePanel
        display={true}
        data={this.state.data !== null ?
          this.state.data.welcome: null}
      />
    ) : null;
    // Recruitment Panel
    const recruitment = this.state.display.panel.recruitment ? (
      <RecruitmentPanel
        display={true}
        data={this.state.data !== null ?
          this.state.data.recruitment : null}
      />
    ) : null;
    // Study Progression Panel
    const study = this.state.display.panel.studyProgression ? (
      <StudyProgressionPanel
        display={true}
        data={this.state.data !== null ?
          this.state.data.studyProgression : null}
      />
    ) : null;
    // My Tasks Panel
    const tasks = this.state.display.panel.myTasks ? (
      <MyTasksPanel
        display={true}
        data={this.state.data !== null ?
          this.state.data.tasks : null}
      />
    ) : null;
    // Document Repository Notifications Panel
    const documentRepository = this.state.display.panel.documentRepository ? (
      <DocumentRepositoryPanel
        display={true}
        data={this.state.data !== null ?
          this.state.data.documentRepository : null}
      />
    ) : null;
    // Behavioural Feedback Panel
    const behaviouralFeedback = this.state.display.panel.behaviouralFeedback ? (
      <BehaviouralFeedbackPanel
        display={true}
        data={this.state.data !== null ?
          this.state.data.behaviouralFeedback : null}
      />
    ) : null;
    // Content to render on success.
    return (
      <div>
        <div className='row'>
          <div className='col-lg-8'>
            {welcome}
            {recruitment}
            {study}
            <small>
              <i>Note that the Recruitment and Study Progression charts
                include data from ineligible, excluded, and
                consent withdrawn candidates.</i>
            </small>
          </div>
          <div className='col-lg-4'>
            <div className='col-lg-12 col-md-6 col-sm-6 col-xs-12'>
              {tasks}
            </div>
            <div className='col-lg-12 col-md-6 col-sm-6 col-xs-12'>
              {documentRepository}
            </div>
            <div className='col-lg-12 col-md-6 col-sm-6 col-xs-12'>
              {behaviouralFeedback}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  dataURL: PropTypes.string,
};

/**
 * Render dashboard on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
      <Dashboard
        dataURL={`${loris.BaseURL}/dashboard/AjaxDashboard`}
      />,
      document.getElementById('lorisworkspace')
  );
});
