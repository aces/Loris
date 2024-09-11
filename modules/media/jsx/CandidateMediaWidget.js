import React from 'react';
import PropTypes from 'prop-types';

/**
 * React component for a widget on the candidate dashboard
 * displaying the media associated with the candidate.
 *
 * @param {array} props - The React props
 * @return {object} - The component
 */
function CandidateMediaWidget(props) {
    let files = [];
    for (let i = 0; i < props.Files.length; i++) {
        const file = props.Files[i];
        files.push(
            <a className="list-group-item" key={i}
                href={props.BaseURL
                    + '/media/files/'
                    + encodeURIComponent(file.Filename)}>
                <span className="pull-right text-muted small">
                    Last modified : {file.LastModified}
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
