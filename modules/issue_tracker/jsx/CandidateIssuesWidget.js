import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import {useTranslation} from 'react-i18next';
import 'I18nSetup';
import jaStrings from '../locale/ja/LC_MESSAGES/issue_tracker.json';
import hiStrings from '../locale/hi/LC_MESSAGES/issue_tracker.json';

/**
 * CandidateIssuesWidget represents a list of open issues to be displayed
 * for a candidate on the candidate dashboard. It's displayed as a list
 * with links to the issue tracker for each widget
 *
 * @param {array} props - the React props
 * @return {object}
 */
function CandidateIssuesWidget(props) {
  const {t, i18n} = useTranslation();
  const [reload, setReload] = useState(0);
  useEffect( () => {
    i18n.addResourceBundle('ja', 'issue_tracker', jaStrings);
    i18n.addResourceBundle('hi', 'issue_tracker', hiStrings);
    setReload(reload+1);
  }, [t]);
  const issues = props.Issues.map(function(issue) {
    let comments;
    if (issue.comments && issue.comments != '0' ) {
      comments = t(
        '({{count}} comment)',
        {ns: 'issue_tracker', count: issue.comments}
      );
    }
    return (<li key={issue.ID}>
      <a href={props.BaseURL + '/issue_tracker/issue/' + issue.ID}>
        {issue.Title}
      </a>
      {comments}
    </li>);
  });
  return <ul>{issues}</ul>;
}
CandidateIssuesWidget.propTypes = {
  Issues: PropTypes.array,
  BaseURL: PropTypes.string,
  t: PropTypes.func,
};

export default withTranslation(
  ['issue_tracker', 'loris'])(CandidateIssuesWidget);
