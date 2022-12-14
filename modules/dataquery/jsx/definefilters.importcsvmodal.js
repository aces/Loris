import Modal from 'jsx/Modal';
import {QueryGroup} from './querydef';
import {useState} from 'react';
import Papa from 'papaparse';
import swal from 'sweetalert2';

/**
 * Render a modal window for adding a filter
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function ImportCSVModal(props) {
    const [csvFile, setCSVFile] = useState(null);
    const [csvHeader, setCSVHeader] = useState(true);
    const [csvType, setCSVType] = useState('session');
    const [idType, setIdType] = useState('PSCID');
    const submitPromise = () =>
        new Promise((resolve, reject) => {
           resolve();
        }
    );

    const candIDRegex = new RegExp('^[1-9][0-9]{5}$');

    const csvParsed = (value) => {
        // setCSVData(value.data);
        if (value.errors && value.errors.length > 0) {
            console.error(value.errors);
            swal.fire({
                type: 'error',
                title: 'Invalid CSV',
                text: 'Could not parse CSV file',
            });
        }

        // If candidates: validate 1 column
        // If sessions: validate 2 columns
        const expectedLength = (csvType === 'session' ? 2 : 1);
        const startLine = csvHeader ? 1 : 0;
        for (let i = startLine; i < value.data.length; i++) {
            if (value.data[i].length != expectedLength) {
                swal.fire({
                    type: 'error',
                    title: 'Invalid CSV',
                    text: 'Expected ' + expectedLength + ' columns in CSV.'
                        + ' Got ' + value.data[i].length + ' on line ' +
                        (i+1) + '.',
                });
                return;
            };
            if (idType === 'CandID') {
                if (candIDRegex.test(value.data[i][0]) !== true) {
                    swal.fire({
                        type: 'error',
                        title: 'Invalid DCC ID',
                        text: 'Invalid DCC ID (' + value.data[i][0]
                            + ') on line '
                            + (i+1) + '.',
                    });
                }
            }
        }

        // Now that it's been validated, build a new query
        const newQuery = new QueryGroup('or');
        for (let i = startLine; i < value.data.length; i++) {
            if (csvType === 'session') {
                const sessionGroup = new QueryGroup('and');
                sessionGroup.addTerm(
                    {
                        Module: 'candidate_parameters',
                        Category: 'Identifiers',
                        Field: idType,
                        Op: '=',
                        Value: value.data[i][0],
                    },
                    null,
                );
                sessionGroup.addTerm(
                    {
                        Module: 'candidate_parameters',
                        Category: 'Meta',
                        Field: 'VisitLabel',
                        Op: '=',
                        Value: value.data[i][1],
                    },
                    null,
                );
                newQuery.group.push(sessionGroup);
            } else {
                newQuery.addTerm(
                    {
                        Module: 'candidate_parameters',
                        Category: 'Identifiers',
                        Field: idType,
                        Op: '=',
                        Value: value.data[i],
                    },
                    null,
                );
            }
        }

        props.setQuery(newQuery);
        props.closeModal();
    };

    const dtstyle = {
        marginLeft: '1em',
        marginTop: '1em',
    };

    return <Modal title="Import Population From CSV"
       show={true}
       throwWarning={true}
       onClose={props.closeModal}
       onSubmit={submitPromise}>
            <div>
            <form>
                <fieldset>
                    <div>
                        <dl>
                            <dt style={dtstyle}>CSV containing list of</dt>
                            <dd>
                                <input type="radio" name="csvtype"
                                   checked={csvType == 'candidate'}
                                   onChange={() => setCSVType('candidate')}
                               /> Candidates
                                <input type="radio" name="csvtype"
                                   style={{marginLeft: '1.5em'}}
                                   checked={csvType == 'session'}
                                   onChange={() => setCSVType('session')}
                                /> Sessions
                                </dd>
                            <dt style={dtstyle}>Candidate identifier type</dt>
                            <dd><input type="radio" name="candidtype"
                                   checked={idType == 'CandID'}
                                   onChange={() => setIdType('CandID')}
                                /> DCC ID
                                <input type="radio" name="candidtype"
                                   style={{marginLeft: '1.5em'}}
                                   checked={idType == 'PSCID'}
                                   onChange={() => setIdType('PSCID')}
                                /> PSCID
                            </dd>
                            <dt style={dtstyle}>
                                Does CSV contain a header line?
                            </dt>
                            <dd><input type="radio" name="header"
                                   checked={csvHeader == true}
                                   onChange={() => setCSVHeader(true)}
                                /> Yes
                                <input type="radio" name="header"
                                   style={{marginLeft: '1.5em'}}
                                   checked={csvHeader == false}
                                   onChange={() => setCSVHeader(false)}
                                /> No
                            </dd>
                            <dt style={dtstyle}>CSV File</dt>
                            <dd><FileElement label='' name="csvfile"
                                value={csvFile}
                                onUserInput={(filename, file) => {
                                    setCSVFile(file);
                                    let papaparseConfig = {
                                        skipEmptyLines: true,
                                        complete: csvParsed,
                                        // Setting this to try would cause
                                        // papaparse to return an object
                                        // instead of string. We just skip
                                        // the first row if the user says
                                        // they have a header when parsing
                                        // results.
                                        header: false,
                                    };
                                    // Only 1 column, papaparse can't detect
                                    // the delimiter if it's not explicitly
                                    // specified.
                                    if (csvType == 'candidate') {
                                        papaparseConfig.delimiter = ',';
                                    }
                                    Papa.parse(file, papaparseConfig);
                                }}
                            /></dd>
                        </dl>
                    </div>
                </fieldset>
            </form>
        </div>
    </Modal>;
}

export default ImportCSVModal;
