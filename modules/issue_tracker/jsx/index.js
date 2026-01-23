import IssueForm from './IssueForm';
import {createRoot} from 'react-dom/client';
import React from 'react';
import i18n from 'I18nSetup';
import hiStrings from '../locale/hi/LC_MESSAGES/issue_tracker.json';
import jaStrings from '../locale/ja/LC_MESSAGES/issue_tracker.json';
import frStrings from '../locale/fr/LC_MESSAGES/issue_tracker.json';

/**
 * Render IssueForm on page load
 */
window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'issue_tracker', hiStrings);
  i18n.addResourceBundle('ja', 'issue_tracker', jaStrings);
  i18n.addResourceBundle('fr', 'issue_tracker', frStrings);

  const id = location.href.split('/issue/')[1];
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <IssueForm
      Module='issue_tracker'
      DataURL={loris.BaseURL
        + '/issue_tracker/Edit/?issueID='
              + id}
      action={loris.BaseURL
        + '/issue_tracker/Edit/'}
      issue={id}
      baseURL={loris.BaseURL}
      userHasPermission={loris.userHasPermission('issue_tracker_all_issue')}
    />
  );
});
