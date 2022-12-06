import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import Panel from '../Panel';

/**
 * StudyProgression - a widget containing statistics for study data.
 * @param {object} props
 * @return {JSX.Element}
 */
const StudyProgression = (props) => {
  const [loading, setLoading] = useState(true);

  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  useEffect(() => {
    setLoading(false);
  }, []);

  /**
   * Retrieve data from the provided URL and save it in state.
   */
  const fetchData = () => {
    fetch(`${props.baseURL}/Progression`,
      {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((resp) => {
      if (resp.ok) {
        resp.json().then((json) => {
          console.log('json is ');
          console.log(json);
          setLoading(false);
        });
      } else {
        // set error
        console.error(resp.statusText);
      }
    }).catch((error) => {
      // set error
      console.error(error);
    });
  };

  /**
   * Renders the React component.
   * @return {JSX.Element} - React markup for component.
   */
  return loading ? <Loader/> : (
    <Panel title='Study Progression'
           id='statistics_study_progression'
           views={[
             {visible: true, content: 'example 1', title: 'Study Progression'},
             {visible: false, content: 'example 2', title: 'example 2'},
           ]}
    />
  );
};
StudyProgression.propTypes = {
  baseURL: PropTypes.string,
};
StudyProgression.defaultProps = {
  baseURL: false,
};

export default StudyProgression;
