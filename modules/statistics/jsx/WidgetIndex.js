import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Recruitment from './widgets/recruitment';
import StudyProgression from './widgets/studyprogression';
import {fetchData} from './Fetch';
import {
  recruitmentCharts,
  studyProgressionCharts,
  setupFilters,
} from './widgets/chartBuilder';

/**
 * WidgetIndex - the main window.
 * @param {object} props
 * @return {JSX.Element}
 */
const WidgetIndex = (props) => {
  const [recruitmentData, setRecruitmentData] = useState({});
  const [studyProgressionData, setStudyProgressionData] = useState({});
  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  useEffect(() => {
    // fetch recruitment data.
    fetchData(
      `${props.baseURL}/Recruitment`
    ).then((json) => {
      setRecruitmentData(json);
      // Process statistics for c3.js
      recruitmentCharts();
    }).catch((error) => {
      // Error occurred.
      console.error(error);
    });
    // fetch progression data.
    fetchData(
      `${props.baseURL}/Progression`
    ).then((json) => {
      setStudyProgressionData(json);
      // Process statistics for c3.js
      studyProgressionCharts();
      setupFilters();
    }).catch((error) => {
      // Error occurred.
      console.error(error);
    });
    // todo chartBuilder code should be replaced with npmjs version.
  }, []);

  /**
   * Renders the React component.
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <>
      <Recruitment
        data={recruitmentData}
      />
      <StudyProgression
        data={studyProgressionData}
      />
    </>
  );
};
WidgetIndex.propTypes = {
  baseURL: PropTypes.string,
};

/**
 * Render StatisticsIndex on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <WidgetIndex
      baseURL={`${loris.BaseURL}/statistics`}
    />,
    document.getElementById('statistics_widgets')
  );
});
