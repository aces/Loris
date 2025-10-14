import Modal from 'jsx/Modal';
import {QueryGroup, QueryTerm} from './querydef';
import {useState} from 'react';
import Papa from 'papaparse';
import swal from 'sweetalert2';
import {FileElement} from 'jsx/Form';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation('dataquery');
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
    new Promise((resolve) => {
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
        title: t('Invalid CSV', {ns: 'dataquery'}),
        text: t('Could not parse CSV file', {ns: 'dataquery'}),
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
          title: t('Invalid CSV', {ns: 'dataquery'}),
          text: t('Expected {{expectedLength}} columns in CSV. '
            +'Got {{gotLength}} on line {{line}}.', {ns: 'dataquery',
            expectedLength, gotLength: value.data[i].length, line: i+1}),
        });
        return;
      }
      if (idType === 'CandID') {
        if (candIDRegex.test(value.data[i][0]) !== true) {
          swal.fire({
            type: 'error',
            title: t('Invalid DCC ID', {ns: 'dataquery'}),
            text: t('Invalid DCC ID ({{id}}) on line {{line}}.',
              {ns: 'dataquery', id: value.data[i][0], line: i+1}),
          });
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

  return <Modal title={t('Import Population From CSV', {ns: 'dataquery'})}
    show={true}
    throwWarning={true}
    onClose={props.closeModal}
    onSubmit={submitPromise}>
    <fieldset>
      <div>
        <dl>
          <dt style={dtstyle}>{t('CSV containing list of',
            {ns: 'dataquery'})}</dt>
          <dd>
            <input type="radio" name="csvtype"
              checked={csvType == 'candidate'}
              onChange={() => setCSVType('candidate')}
            /> {t('Candidates', {ns: 'dataquery'})}
            <input type="radio" name="csvtype"
              style={{marginLeft: '1.5em'}}
              checked={csvType == 'session'}
              onChange={() => setCSVType('session')}
            /> {t('Sessions', {ns: 'dataquery'})}
          </dd>
          <dt style={dtstyle}>{t('Candidate identifier type',
            {ns: 'dataquery'})}</dt>
          <dd><input type="radio" name="candidtype"
            checked={idType == 'CandID'}
            onChange={() => setIdType('CandID')}
          /> {t('DCC ID', {ns: 'dataquery'})}
          <input type="radio" name="candidtype"
            style={{marginLeft: '1.5em'}}
            checked={idType == 'PSCID'}
            onChange={() => setIdType('PSCID')}
          /> {t('PSCID', {ns: 'dataquery'})}
          </dd>
          <dt style={dtstyle}>
            {t('Does CSV contain a header line?', {ns: 'dataquery'})}
          </dt>
          <dd><input type="radio" name="header"
            checked={csvHeader == true}
            onChange={() => setCSVHeader(true)}
          /> {t('Yes', {ns: 'dataquery'})}
          <input type="radio" name="header"
            style={{marginLeft: '1.5em'}}
            checked={csvHeader == false}
            onChange={() => setCSVHeader(false)}
          /> {t('No', {ns: 'dataquery'})}
          </dd>
          <dt style={dtstyle}>{t('CSV File', {ns: 'dataquery'})}</dt>
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
                if (csvType == 'candidate') {
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
