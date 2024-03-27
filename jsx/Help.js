import Markdown from 'jsx/Markdown';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

/**
 * Help Widget
 *
 * Display help content in a tooltip
 *
 * @param props
 * @author LORIS Team
 * @version 1.0.0
 */

/**
 * Help
 *
 * @param {object} props - React props
 * @return {JSX}
 */
const Help = (props) => {
  // If props.children is true,
  // we are using the component to preview the changes done in Help Editor
  // The Component is active (visible) on load
  const [isActive, setIsActive] = useState(props.children ? true : false);
  const [content, setContent] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  const getParams = {
    testName: props.testname,
    ...(props.subtest !== '' && {subtest: props.subtest}),
  };

  let editBtn = null;

  useEffect(() => {
    props.children && setContent(props.children);
  }, [props.children]);

  useEffect(() => {
    !props.children && fetch(
      props.baseURL
      + '/help_editor/ajax/help.php?'
      + new URLSearchParams(getParams),
      {method: 'GET'},
    ).then((response) => {
      if (!response.ok) {
        console.error(response.status);
        return;
      }
      response.json().then(
        (data) => {
          // Prevent state update after the component
          // has been unmounted
          if (!isMounted) return;

          // Render Markdown in wrap div.
          // If help content is from Markdown helpfile.
          if (data.source === 'helpfile') {
            setContent(<Markdown content={data.content}/>);
          } else {
            // If help content is from DB.
            setContent(
              <div>
                {data.topic && <h3>{data.topic}</h3>}
                <div><Markdown content={data.content}/></div>
                {data.updated && <><hr/>Last updated: {data.updated}</>}
              </div>
            );
          }

          // If help content comes from DB `help` table
          // and can be edited online.
          if (
            data.editable
            && data.source !== 'helpfile'
            && !props.children
          ) {
            editBtn = <button
              className="btn btn-default"
              style={{
                float: 'right',
                margin: '10px',
              }}
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  props.baseURL
                  + '/help_editor/edit_help_content/?section='
                  + getParams.testName
                  + '&subsection='
                  + getParams.subtest,
                  '_self'
                );
              }}
            >Edit</button>;
          }
        }
      );
    }).catch((error) => {
      // Network error
      console.error(error);
    });

    return () => setIsMounted(false);
  }, []);

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  return (
    <div>
      <button
        type="button"
        className={'help-button' + (isActive ? ' help-open' : '')}
        onClick={() => setIsActive(!isActive)}
      >
        <img width="17" src={props.baseURL + '/images/help.gif'} />
      </button>

      <div
        className="help-content"
        style={{
          display: isActive ? 'block' : 'none',
        }}
      >
        <button
          className="btn btn-default"
          style={{
            float: 'right',
            margin: '10px 10px 10px 0',
          }}
          onClick={() => setIsActive(!isActive)}
        >Close</button>
        {editBtn}
        <div className="help-wrapper">
          {content}
        </div>
      </div>
    </div>
  );
};

Help.propTypes = {
  children: PropTypes.node,
  testname: PropTypes.string,
  subtest: PropTypes.string,
  baseURL: PropTypes.string.isRequired,
};

window.RHelp = Help;

export default Help;
