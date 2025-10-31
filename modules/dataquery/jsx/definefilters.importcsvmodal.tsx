import Modal from 'jsx/Modal';
import {QueryGroup, QueryTerm} from './querydef';
import {useState} from 'react';
import Papa from 'papaparse';
import swal from 'sweetalert2';
import {FileElement} from 'jsx/Form';

/**
 * Render a modal window for adding a filter
 *
 * @param {object} props - React props
 * @param {function} props.setQuery - Function to set the current criteria
 * @param {function} props.closeModal - Callback to close the current modal
 * @returns {React.ReactElement} - The import modal window
 */
function ImportCSVModal(props: {
    setQuery: (root: QueryGroup) => void,
    closeModal: () => void,
}) {
  const [csvFile, setCSVFile] = useState<string|null>(null);
  const [csvHeader, setCSVHeader] = useState<boolean>(false);
  const [csvType, setCSVType] = useState<string>('candidate');
  const [idType, setIdType] = useState<string>('PSCID');
  /**
   * Promise for handling modal closing. Always accepts.
   *
   * @returns {Promise} - a stub promise
   */
  const submitPromise = () =>
    new Promise((resolve, reject) => {
      if (!csvFile) {
        swal.fire({
          type: 'error',
          title: 'No CSV Uploaded',
          text: 'Please upload a CSV file before submitting.',
        });
        reject();
        return;
      }
      resolve(null);
    }
    );

  const candIDRegex = new RegExp('^[1-9][0-9]{5}$');

  /**
   * Callback function for after papaparse has parsed the csv
   *
   * @param {any} value - the value from papaparse callback
   */
  const csvParsed = (value: Papa.ParseResult<any>) => {
    if (value.errors && value.errors.length > 0) {
      console.error(value.errors);
      swal.fire({
        type: 'error',
        title: 'Invalid CSV',
        text: 'Could not parse CSV file',
      });
      setCSVFile(null);
      return;
    }

    // Check for empty CSV file
    const startLine = csvHeader ? 1 : 0;
    if (!value.data || value.data.length <= startLine) {
      swal.fire({
        type: 'error',
        title: 'Empty CSV',
        text: 'The uploaded CSV file is empty.',
      });
      setCSVFile(null);
      return;
    }

    // If candidates: validate 1 column
    // If sessions: validate 2 columns
    const expectedLength = (csvType === 'session' ? 2 : 1);

    for (let i = startLine; i < value.data.length; i++) {
      if (value.data[i].length != expectedLength) {
        swal.fire({
          type: 'error',
          title: 'Invalid CSV',
          text: 'Expected ' + expectedLength + ' columns in CSV.'
                        + ' Got ' + value.data[i].length + ' on line ' +
                        (i+1) + '.',
        });
        setCSVFile(null);
        return;
      }
      if (idType === 'CandID') {
        if (candIDRegex.test(value.data[i][0]) !== true) {
          swal.fire({
            type: 'error',
            title: 'Invalid DCC ID',
            text: 'Invalid DCC ID (' + value.data[i][0]
                            + ') on line '
                            + (i+1) + '.',
          });
          setCSVFile(null);
          return;
        }
      }
    }

    // Now that it's been validated, build a new query
    const newQuery = new QueryGroup('or');
    for (let i = startLine; i < value.data.length; i++) {
      if (csvType === 'session') {
        const sessionGroup = new QueryGroup('and');
        sessionGroup.addTerm(
          new QueryTerm(
            'candidate_parameters',
            'Identifiers',
            idType,
            'eq',
            value.data[i][0],
          ),
        );
        sessionGroup.addTerm(
          new QueryTerm(
            'candidate_parameters',
            'Meta',
            'VisitLabel',
            'eq',
            value.data[i][1],
          ),
        );
        newQuery.group.push(sessionGroup);
      } else {
        newQuery.addTerm(
          new QueryTerm(
            'candidate_parameters',
            'Identifiers',
            idType,
            'eq',
            value.data[i][0],
          ),
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
            onUserInput={
              (filename: string, file: string) => {
                setCSVFile(file);
                const papaparseConfig:
                                        Papa.ParseConfig<any> = {
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
                if (csvType == 'candidate' || csvType == 'session') {
                  papaparseConfig.delimiter = ',';
                }
                Papa.parse(file, papaparseConfig);
              }
            }
          /></dd>
        </dl>
      </div>
    </fieldset>
  </Modal>;
}

export default ImportCSVModal;
