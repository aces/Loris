import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Recruitment from './widgets/recruitment';
import StudyProgression from './widgets/studyprogression';
import * as chartBuilder from './widgets/chartBuilder';

/**
 * WidgetIndex - the main window.
 * @param {object} props
 * @return {JSX.Element}
 */
const WidgetIndex = (props) => {
  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  useEffect(() => {
    // Process statistics for c3.js
    // todo chartBuilder code should be replaced with npmjs version.
    chartBuilder.process();
  }, []);
  /**
   * Renders the React component.
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <>
      <Recruitment baseURL={props.baseURL}/>
      <StudyProgression baseURL={props.baseURL}/>
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
