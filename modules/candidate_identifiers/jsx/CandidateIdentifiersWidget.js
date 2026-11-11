import React from 'react';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import frStrings from '../locale/fr/LC_MESSAGES/candidate_identifiers.json';

i18n.addResourceBundle('fr', 'candidate_identifiers', frStrings);

/**
 * Displays a candidate's identifiers on their profile.
 *
 * @param {object} props Component properties
 * @return {object} React component
 */
function CandidateIdentifiersWidget(props) {
  const {t, Identifiers} = props;

  if (!Identifiers || Identifiers.length === 0) {
    return <p>{t('No identifiers found', {ns: 'candidate_identifiers'})}</p>;
  }

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>{t('Identifier Type', {ns: 'candidate_identifiers'})}</th>
          <th>{t('Identifier Value', {ns: 'candidate_identifiers'})}</th>
        </tr>
      </thead>
      <tbody>
        {Identifiers.map((identifier) => (
          <tr key={identifier.ID}>
            <td>{identifier.Type}</td>
            <td>{identifier.Value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

CandidateIdentifiersWidget.propTypes = {
  Identifiers: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['candidate_identifiers', 'loris'])(
  CandidateIdentifiersWidget
);
