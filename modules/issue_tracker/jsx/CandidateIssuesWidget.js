/**
 * CandidateIssuesWidget represents a list of open issues to be displayed
 * for a candidate on the candidate dashboard. It's displayed as a list
 * with links to the issue tracker for each widget
 *
 * @param {array} props - the React props
 *
 * @return {object}
 */
function CandidateIssuesWidget(props) {
    const issues = props.Issues.map(function(issue) {
        let comments;
        if (issue.comments && issue.comments != '0' ) {
            comments = ' ('+ issue.comments + ' comment';
            if (issue.comments != '1') {
                comments += 's';
            };
            comments += ')';
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

export default CandidateIssuesWidget;
