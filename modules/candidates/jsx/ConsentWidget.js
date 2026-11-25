import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import './translations';

/**
 * A Widget to display consent information for a candidate in
 * LORIS
 *
 * @param {array} props - The React props
 * @return {object} - The rendered widget
 */
function ConsentWidget(props) {
  const {t} = useTranslation();
  if (props.Consents.length == 0) {
    return null;
  }

  const consents = props.Consents.map((term) => consentTerm(t, term));
  return (<table className="table" style={{width: '100%'}}>
    <thead>
      <tr>
        <th>{t('Consent Type', {ns: 'candidates'})}</th>
        <th>{t('Status', {ns: 'loris'})}</th>
        <th>{t('Date', {ns: 'loris'})}</th>
      </tr>
    </thead>
    <tbody>
      {consents}
    </tbody>
  </table>);
}
ConsentWidget.propTypes = {
  Consents: PropTypes.array,
};

/**
 * Returns a rendered JSX component for a single consent type
 *
 * @param {function} t - Translation callback
 * @param {array} consent - The type of consent
 * @return {object}
 */
function consentTerm(t, consent) {
  const dateFormatter = new Intl.DateTimeFormat(
    loris.user.langpref.replace('_', '-'),
    {
      style: 'short',
      timeZone: 'UTC',

    }
  );
  let value;
  let date;
  switch (consent.Status) {
  case 'yes':
    value = t('Yes', {ns: 'loris'});
    date = consent.DateGiven;
    break;
  case 'no':
    if (consent.DateWithdrawn) {
      value = t('Withdrawn', {ns: 'loris'});
      date = consent.DateWithdrawn;
    } else {
      value = t('No', {ns: 'loris'});
    }
    break;
  default:
    value = consent.Status;
    return (<tr key={consent.ConsentID}>
      <th>{consent.Label}</th>
      <td colSpan="2" align="center">-</td>
    </tr>);
  }
  if (date) {
    date = dateFormatter.format(new Date(date));
  }
  return (<tr key={consent.ConsentID}>
    <th>{consent.Label}</th>
    <td>{value}</td>
    <td>{date}</td>
  </tr>);
}

export default ConsentWidget;
