import {createRoot} from 'react-dom/client';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Recruitment from './widgets/recruitment';
import StudyProgression from './widgets/studyprogression';
import {fetchData} from './Fetch';
import {
  recruitmentCharts,
  studyProgressionCharts,
} from './widgets/chartBuilder';

/**
 * WidgetIndex - the main window.
 *
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
    /**
     * setup - fetch recruitment and study progression data.
     *
     * @return {Promise<void>}
     */
    const setup = async () => {
      const data = await fetchData(
        `${props.baseURL}/Widgets`
      );
      setRecruitmentData(data);
      setStudyProgressionData(data);
      // setup statistics for c3.js charts.
      await studyProgressionCharts();
      await recruitmentCharts();
    };
    setup().catch((error) => {
      console.error(error);
    });
  }, []);

  /**
   * Renders the React component.
   *
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
  createRoot(
    document.getElementById('statistics_widgets')
  ).render(
    <WidgetIndex
      baseURL={`${loris.BaseURL}/statistics`}
    />
  );
});
