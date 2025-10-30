import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import 'I18nSetup';

/**
 * React component for a widget on the candidate dashboard
 * displaying the media associated with the candidate.
 *
 * @param {array} props - The React props
 * @return {object} - The component
 */
function CandidateMediaWidget(props) {
  const {t} = useTranslation();
  const dateFormatter = new Intl.DateTimeFormat(
    loris.user.langpref.replace('_', '-'),
    {
      dateStyle: 'short',
      timeStyle: 'short',
    }
  );

  let files = [];
  for (let i = 0; i < props.Files.length; i++) {
    const file = props.Files[i];
    files.push(
      <a className="list-group-item" key={i}
        href={props.BaseURL
                    + '/media/files/'
                    + encodeURIComponent(file.Filename)}>
        <span className="pull-right text-muted small">
	    {t('Updated', {ns: 'loris'})}: {dateFormatter.format(new Date(file.LastModified))}
        </span>
        <br />
        {file.Filename}
      </a>
    );
  }
  return <div className="list-group">{files}</div>;
}
CandidateMediaWidget.propTypes = {
  BaseURL: PropTypes.string,
  Files: PropTypes.array,
};

export default CandidateMediaWidget;
