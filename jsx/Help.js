import RMarkdown from 'jsx/Markdown';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {createRoot} from 'react-dom/client';

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
  const [isActive, setIsActive] = useState(props.content ? true : false);
  const [format, setFormat] = useState(null);
  const [content, setContent] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  const getParams = {
    testName: loris.TestName,
    ...(loris.Subtest !== '' && {subtest: loris.Subtest}),
  };

  useEffect(() => {
    props.content && setContent(props.content);
  }, [props.content]);

  useEffect(() => {
    !props.content && fetch(
      loris.BaseURL
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
          if (!isMounted) return;
          setFormat(data.format);

          // Render Markdown in wrap div.
          // If help content is from Markdown helpfile.
          if (format === 'markdown') {
            setContent(<RMarkdown content={data.content}/>);
          } else {
            // If help content is from DB.
            setContent(
              <>
                {data.topic && <h3>{data.topic}</h3>}
                <div><RMarkdown content={data.content}/></div>
                {data.updated && <><hr/>Last updated: {data.updated}</>}
              </>
            );
          }
        }
      );
    }).catch((error) => {
      // Network error
      console.error(error);
    });

    return () => setIsMounted(false);
  }, []);

  let editBtn = null;
  // If help content comes from DB `help` table and can
  // be edited online.
  if (
    loris.userHasPermission('context_help')
    && format !== 'markdown'
    && !props.content
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
          loris.BaseURL
          + '/help_editor/edit_help_content/?section='
          + getParams.testName
          + '&subsection='
          + getParams.subtest,
          '_self'
        );
      }}
    >Edit</button>;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  return (
    <>
      <button
        type="button"
        className={'help-button' + (isActive ? ' help-open' : '')}
        onClick={() => setIsActive(!isActive)}
      >
        <img width="17" src="http://localhost/images/help.gif" />
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
    </>
  );
};

Help.propTypes = {
  content: PropTypes.element,
};

document.addEventListener('DOMContentLoaded', () => {
  const helpContainers = document.getElementsByClassName('help-container');
  for (let i = 0; i < helpContainers.length; i++) {
    const root = createRoot(helpContainers.item(i));
    root.render(
      <Help/>
    );
  }
});

export default Help;
