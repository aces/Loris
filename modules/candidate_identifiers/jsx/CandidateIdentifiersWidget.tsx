import React from 'react';
import {useTranslation} from 'react-i18next';

import i18n from 'I18nSetup';
import frStrings from '../locale/fr/LC_MESSAGES/candidate_identifiers.json';

i18n.addResourceBundle('fr', 'candidate_identifiers', frStrings);

type Identifier = {
  ID: number;
  Type: string;
  Value: string;
};

type Props = {
  Identifiers: Identifier[];
};

/**
 * Displays a candidate's identifiers on their profile.
 *
 * @param props Component properties
 * @return React component
 */
function CandidateIdentifiersWidget(props: Props): React.JSX.Element {
  const {Identifiers} = props;
  const {t} = useTranslation(['candidate_identifiers', 'loris']);

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

export default CandidateIdentifiersWidget;
