/**
 * React component for a widget on the candidate dashboard
 * displaying the media associated with the candidate.
 *
 * @param {array} props - The React props
 *
 * @return {object} - The component
 */
function CandidateMediaWidget(props) {
    let files = [];
    for (let i = 0; i < props.Files.length; i++) {
        const file = props.Files[i];
        files.push(
            <a className="list-group-item" key={i}
                href={props.BaseURL
                    + '/media/ajax/FileDownload.php?File='
                    + encodeURIComponent(file.Filename)}>
                <span className="pull-right text-muted small">
                    Uploaded: {file.UploadDate}
                </span>
                <br />
                {file.Filename}
            </a>
        );
    }
    return <div className="list-group">{files}</div>;
}

export default CandidateMediaWidget;
