import swal from 'sweetalert2';
import {useState, useEffect, ReactNode} from 'react';

import fetchDataStream from 'jslib/fetchDataStream';

import DataTable from 'jsx/DataTable';
import {SelectElement, CheckboxElement} from 'jsx/Form';
import {APIQueryField, APIQueryObject} from './types';
import {QueryGroup} from './querydef';
import {FullDictionary, FieldDictionary} from './types';
import {calcPayload} from './calcpayload';
import getDictionaryDescription from './getdictionarydescription';

type TableRow = (string|null)[];

type SessionRowCell = {
    VisitLabel: string;
    value?: string
    values?: {[keyid: string]: string}
};


/**
 * Convert a piece of data from JSON to the format to be displayed
 * in the cell. Used for either CSV or frontend display.
 *
 * @param {string} data - the raw, unparsed string data.
 * @returns {string} the non-JSON value
 */
function cellValue(data: string) {
    try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object') {
            // Can't include objects as react children, if we got here
            // there's probably a bug.
            return data;
        }
        return parsed;
    } catch (e) {
        return data;
    }
}

/**
 * Renders a single table cell value, converting from JSON string to
 * normal string if necessary.
 *
 * @param {object} props - React props
 * @param {string} props.data - The JSON string to display
 * @returns {React.ReactElement} - the Table Cell
 */
function TableCell(props: {data: string}) {
    return <td>{cellValue(props.data)}</td>;
}

enum EnumDisplayTypes {
    EnumLabel,
    EnumValue
}

/**
 * Returns the value to display for a field.
 *
 * @param {object} props - React props
 * @param {any} props.value - the value to be formatted
 * @param {FieldDictionary} props.dictionary - The field's dictionary
 * @param {EnumDisplayTypes} props.enumDisplay - The format to display enums
 * @returns {React.ReactElement} - the mapped value
 */
function DisplayValue(props: {
    value: any,
    dictionary: FieldDictionary,
    enumDisplay: EnumDisplayTypes}
) {
    let display = props.value;
    switch (props.enumDisplay) {
    case EnumDisplayTypes.EnumLabel:
        if (props.dictionary.labels && props.dictionary.options) {
                for (let i = 0; i < props.dictionary.options.length; i++) {
                    if (props.dictionary.options[i] == props.value) {
                        display= props.dictionary.labels[i];
                        break;
                    }
                }
            }
        break;
    }

    if (props.value === true) {
        return 'True';
    } else if (props.value === false) {
        return 'False';
    }

    if (props.dictionary.type == 'URI') {
        display = (
                <a href={props.value}>
                {display}
                </a>
                );
    }
    return display;
}

/**
 * Display a progress bar.
 *
 * @param {object} props - React props
 * @param {string} props.type - the type of progress being displayed
 * @param {number} props.value - The current value
 * @param {number} props.max - The maximum value
 * @returns {React.ReactElement} - The ProgressBar element
 */
function ProgressBar(props: {type: string, value: number, max: number}) {
    switch (props.type) {
    case 'loading':
        if (props.value == 0) {
            return <h2>Query not yet run</h2>;
        }
        return (<div>
                <label htmlFor="loadingprogress">Loading data:</label>
                <progress id="loadingprogress"
                    value={props.value} max={props.max}>
                    {props.value} of {props.max} candidates
                </progress>
        </div>);
    case 'headers':
        return (<div>
                <label htmlFor="loadingprogress">Organizing headers:</label>
                <progress id="loadingprogress"
                    value={props.value} max={props.max}>
                    {props.value} of {props.max} columns
                </progress>
        </div>);
    case 'dataorganization':
        return (<div>
                <label htmlFor="loadingprogress">Organizing data:</label>
                <progress id="loadingprogress"
                    value={props.value} max={props.max}>
                    {props.value} of {props.max} columns
                </progress>
        </div>);
    }
    return <h2>Invalid progress type: {props.type}</h2>;
}

type RunQueryType = {
  loading: boolean,
  data: string[][],
  totalcount: number,
};
/**
 * React hook to run a given query.
 *
 * @param {APIQueryField[]} fields - The fields selected
 * @param {QueryGroup} filters - The filters selected
 * @param {function} onRun - Callback to call when the query is run
 * @returns {RunQueryType} - a description of the status of the loading and the loaded values
 */
function useRunQuery(
    fields: APIQueryField[],
    filters: QueryGroup,
    onRun: () => void
): RunQueryType {
    const [expectedResults, setExpectedResults] = useState<number>(0);
    const [resultData, setResultData] = useState<string[][]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const payload: APIQueryObject = calcPayload(fields, filters);
        fetch(
           '/dataquery/queries',
           {
             method: 'post',
             credentials: 'same-origin',
             body: JSON.stringify(payload),
           },
        ).then(
           (resp) => {
               if (!resp.ok) {
                   throw new Error('Error creating query.');
               }
               return resp.json();
           }
        ).then(
            (data) => {
                const resultbuffer: any[] = [];
                fetch(
                        '/dataquery/queries/'
                            + data.QueryID + '/count',
                        {
                            method: 'GET',
                            credentials: 'same-origin',
                        }
                ).then((resp) => resp.json()
                ).then( (json) => {
                    setExpectedResults(json.count);
                });
                fetchDataStream(
                    '/dataquery/queries/' + data.QueryID + '/run',
                    (row: any) => {
                        resultbuffer.push(row);
                    },
                    () => {
                        if (resultbuffer.length % 10 == 0) {
                            setResultData([...resultbuffer]);
                        }
                    },
                    () => {
                        setResultData([...resultbuffer]);
                        setLoading(false);
                    },
                    'post',
                );
                onRun(); // forces query list to be reloaded
            }
        ).catch(
            (msg) => {
                swal.fire({
                    type: 'error',
                    text: msg,
                });
            }
        );
    }, [fields, filters]);
    return {
        loading: loading,
        data: resultData,
        totalcount: expectedResults,
    };
}

type DataOrganizationType = {
    headers: string[],
    data: TableRow[],
    status: 'headers'|'data'|'done'|null,
    progress: number,
    }
/**
 * Hook to re-organize tabulated data returned from the API into the format selected by the user
 *
 * @param {RunQueryType} queryData - The data returned by the API
 * @param {string} visitOrganization - The type of data organization selected by the user
 * @param {string} headerDisplay - The display to use for the headers
 * @param {APIQueryField[]} fields - The fields that need to be organized
 * @param {FullDictionary} fulldictionary - The full dictionary of all selected modules
 * @returns {object} - the headers and data re-organised according to the user's selection
 */
function useDataOrganization(
    queryData: RunQueryType,
    visitOrganization: VisitOrgType,
    headerDisplay: HeaderDisplayType,
    fields: APIQueryField[],
    fulldictionary: FullDictionary
) : DataOrganizationType {
    const [tableData, setTableData] = useState<TableRow[]>([]);
    const [orgStatus, setOrgStatus]
        = useState<'headers'|'data'|'done'|null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [headers, setHeaders] = useState<string[]>([]);
    useEffect( () => {
        if (queryData.loading == true) {
            return;
        }
        setOrgStatus('headers');
        organizeHeaders(fields,
          visitOrganization,
          headerDisplay,
          fulldictionary,
          (i) => setProgress(i),
        ).then( (headers: string[]) => {
            setHeaders(headers);
            setOrgStatus('data');

            organizeData(
                queryData.data,
                visitOrganization,
                fulldictionary,
                fields,
                (i) => setProgress(i),
            ).then((data: TableRow[]) => {
                setTableData(data);
                setOrgStatus('done');
                });
            });
    }, [visitOrganization, headerDisplay, queryData.loading, queryData.data]);
    return {
       'headers': headers,
       'data': tableData,

       'status': orgStatus,
       'progress': progress,
    };
}

/**
 * The View Data tab
 *
 * @param {object} props - React props
 * @param {APIQueryField[]} props.fields - The selected fields
 * @param {QueryGroup} props.filters - The selected filters
 * @param {object} props.fulldictionary - the data dictionary
 * @param {function} props.onRun - Callback for when the query is run
 * @returns {React.ReactElement} - The ViewData tab
 */
function ViewData(props: {
    fields: APIQueryField[],
    filters: QueryGroup,
    onRun: () => void
    fulldictionary: FullDictionary,
}) {
    const [visitOrganization, setVisitOrganization]
        = useState<VisitOrgType>('inline');
    const [headerDisplay, setHeaderDisplay]
        = useState<HeaderDisplayType>('fieldnamedesc');
    const [enumDisplay, setEnumDisplay]
        = useState<EnumDisplayTypes>(EnumDisplayTypes.EnumLabel);
    const queryData = useRunQuery(props.fields, props.filters, props.onRun);
    const organizedData = useDataOrganization(
        queryData,
        visitOrganization,
        headerDisplay,
        props.fields,
        props.fulldictionary
    );
    const [emptyVisits, setEmptyVisits] = useState<boolean>(true);

    let queryTable;
    if (queryData.loading) {
        queryTable = <ProgressBar
            type='loading'
            value={queryData.data.length}
            max={queryData.totalcount} />;
    } else {
        switch (organizedData['status']) {
        case null:
            return queryTable = <h2>Query not yet run</h2>;
        case 'headers':
            queryTable = <ProgressBar
                type='headers'
                value={organizedData.progress}
                max={props.fields.length} />;
            break;
        case 'data':
            queryTable = <ProgressBar
                type='dataorganization'
                value={organizedData.progress}
                max={queryData.data.length} />;
            break;
        case 'done':
            try {
                queryTable = <DataTable
                    rowNumLabel="Row Number"
                    fields={organizedData.headers.map(
                      (val: string) => {
                          return {show: true, label: val};
                      })
                    }
                    data={organizedData.data}
                    getMappedCell={
                        organizedMapper(
                            visitOrganization,
                            props.fields,
                            props.fulldictionary,
                        )
                    }
                    getFormattedCell={
                         organizedFormatter(
                            queryData.data,
                            visitOrganization,
                            props.fields,
                            props.fulldictionary,
                            emptyVisits,
                            enumDisplay,
                        )
                    }
                    hide={
                        {
                            rowsPerPage: false,
                            defaultColumn: true,
                            downloadCSV: visitOrganization == 'inline',
                        }
                    }
                />;
            } catch (e) {
                // OrganizedMapper/Formatter can throw an error
                // before the loading is complete
                return <div>Loading..</div>;
            }
            break;
        default:
            throw new Error('Unhandled organization status');
        }
    }

    const emptyCheckbox = (visitOrganization === 'inline' ?
          <CheckboxElement
             name="emptyvisits"
             value={emptyVisits}
             label="Display empty visits?"
             onUserInput={
                 (name: string, value: boolean) =>
                     setEmptyVisits(value)
             }
         />
         : <div />);
    return <div>
        <SelectElement
            name='headerdisplay'
            options={{
                'fieldname': 'Field Name',
                'fielddesc': 'Field Description',
                'fieldnamedesc': 'Field Name: Field Description',
            }}
            label='Header Display Format'
            value={headerDisplay}
            multiple={false}
            emptyOption={false}
            onUserInput={
                (name: string, value: HeaderDisplayType) =>
                    setHeaderDisplay(value)
            }
            sortByValue={false}
          />
        <SelectElement
            name='visitorganization'
            options={{
                'crosssection': 'Rows (Cross-sectional)',
                'longitudinal': 'Columns (Longitudinal)',
                'inline': 'Inline values (no download)',
                'raw': 'Raw JSON (debugging only)',
            }}
            label='Display visits as'
            value={visitOrganization}
            multiple={false}
            emptyOption={false}
            onUserInput={
                (name: string, value: VisitOrgType) =>
                    setVisitOrganization(value)
            }
            sortByValue={false}
          />
        <SelectElement
            name='enumdisplay'
            options={{
                'labels': 'Labels',
                'values': 'Values',
            }}
            label='Display options as'
            value={enumDisplay == EnumDisplayTypes.EnumLabel
                ? 'labels'
                : 'values'}
            multiple={false}
            emptyOption={false}
            onUserInput={
                (name: string, value: string) => {
                    if (value == 'labels') {
                        setEnumDisplay(EnumDisplayTypes.EnumLabel);
                    } else {
                        setEnumDisplay(EnumDisplayTypes.EnumValue);
                    }
                }
            }
            sortByValue={false}
          />
          {emptyCheckbox}
         {queryTable}
    </div>;
}

/**
 * Organize the session data into tabular data based on
 * the visit organization settings
 *
 * @param {array} resultData - The result of the query as returned by the API
 * @param {string} visitOrganization - The visit organization
 *                                     option selected
 * @param {FullDictionary} fulldict - the full data dictionary
 * @param {APIQueryField[]} fields - the selected fields from the query.
 * @param {function} onProgress - Callback to update progress status display.
 * @returns {string[][]} - The data organized into a tabulated form
 *    such that the result matches the visual table shown by the
 *    frontend cell-for-cell. This may involve adding rows or columns
 *    for the sessions or headers.
 */
function organizeData(
    resultData: string[][],
    visitOrganization: VisitOrgType,
    fulldict: FullDictionary,
    fields: APIQueryField[],
    onProgress: (i: number) => void
) : Promise<TableRow[]> {
    switch (visitOrganization) {
    case 'raw':
        return Promise.resolve(resultData);
    case 'inline':
        // Organize with flexbox within the cell by the
        // formatter
        return Promise.resolve(resultData);
    case 'longitudinal':
        // the formatter splits into multiple cells
        return Promise.resolve(resultData);
    case 'crosssection':
        return new Promise((resolve) => {
            let rowNum = 0;
            const promises: Promise<TableRow[]>[] = [];
            for (const candidaterow of resultData) {
                promises.push(new Promise<TableRow[]>((resolve) => {
                    // Collect list of visits for this candidate
                    setTimeout( () => {
                    const candidatevisits: {[visit: string]: boolean} = {};
                    for (const i in candidaterow) {
                        if (!candidaterow.hasOwnProperty(i)) {
                            continue;
                        }
                        const dictionary = getDictionary(fields[i], fulldict);
                        if (dictionary && dictionary.scope == 'session') {
                            if (candidaterow[i] === null
                                || candidaterow[i] == '') {
                                continue;
                            }
                            const cellobj: any = JSON.parse(candidaterow[i]);
                            for (const session in cellobj) {
                                if (!cellobj.hasOwnProperty(session)
                                   || session === 'keytype') {
                                    continue;
                                }
                                const vl: string = cellobj[session].VisitLabel;
                                candidatevisits[vl] = true;
                            }
                        }
                    }

                    const dataRows: TableRow[] = [];
                    for (const visit in candidatevisits) {
                        if (!candidatevisits.hasOwnProperty(visit)) {
                            continue;
                        }
                        const dataRow: TableRow = [];
                        dataRow.push(visit);
                        for (let i = 0; i < candidaterow.length; i++) {
                          const dictionary = getDictionary(fields[i], fulldict);
                          if (dictionary && dictionary.scope == 'session') {
                            if (candidaterow[i] === null
                                || candidaterow[i] == '') {
                              dataRow.push(null);
                              continue;
                            }
                            const allCells: SessionRowCell[] = Object.values(
                                JSON.parse(candidaterow[i]));
                            const values: SessionRowCell[] = allCells.filter(
                                (sessionval: SessionRowCell) => {
                                  return sessionval.VisitLabel == visit;
                                }
                            );
                            switch (values.length) {
                            case 0:
                              dataRow.push(null);
                              break;
                            case 1:
                              switch (dictionary.cardinality) {
                              case 'many':
                                if (typeof values[0].values === 'undefined') {
                                  dataRow.push(null);
                                } else {
                                    const thevalues = values[0].values;
                                    // I don't think this if statement should be required because of the
                                    // above if statement, but without it typescript gives an error
                                    // about Object.keys on possible type undefined.
                                    if (!thevalues) {
                                        dataRow.push(null);
                                    } else {
                                      const mappedVals = Object.keys(thevalues)
                                        .map(
                                            (key) => key + '=' + thevalues[key]
                                        )
                                        .join(';');
                                      dataRow.push(mappedVals);
                                    }
                                }
                                break;
                              default:
                                if (typeof values[0].value === 'undefined') {
                                  dataRow.push(null);
                                } else {
                                  dataRow.push(values[0].value);
                                }
                                break;
                              }
                              break;
                            default:
                              throw new Error('Too many visit values');
                            }
                          } else {
                            dataRow.push(candidaterow[i]);
                          }
                        }
                        dataRows.push(dataRow);
                    }
                    onProgress(rowNum++);
                    resolve(dataRows);
                    });
                }));
            }

            Promise.all(promises).then((values: TableRow[][]) => {
              const mappedData: TableRow[] = [];
              for (const row of values) {
                mappedData.push(...row);
              }
              resolve(mappedData);
            });
        });
    default: throw new Error('Unhandled visit organization');
    }
}

/**
 * Return a cell formatter specific to the options chosen for a CSV
 *
 * @param {string} visitOrganization - The visit organization
 *                                     option selected
 * @param {array} fields - The fields selected
 * @param {array} dict - The full dictionary
 * @returns {function} - the appropriate column formatter for this data organization
 */
function organizedMapper(
    visitOrganization: VisitOrgType,
    fields: APIQueryField[],
    dict: FullDictionary
) {
    switch (visitOrganization) {
    case 'raw':
        return (fieldlabel: string, value: string|null): string => {
            if (value === null) {
                return '';
            }
            return value;
        };
    case 'crosssection':
        return (fieldlabel: string, value: string|null): string => {
            if (value === null) {
                return '';
            }

            return cellValue(value);
        };
    case 'longitudinal':
        return (label: string,
                value: string|null,
                row: TableRow,
                headers: string[],
                fieldNo: number): (string|null)[]|string|null => {
            if (value === null) {
                return '';
            }
            const cells = expandLongitudinalCells(value, fieldNo, fields, dict);
            if (cells === null) {
                return null;
            }
            return cells.map( (cell: LongitudinalExpansion): string => {
                if (cell.value === null) {
                    return '';
                }
                return cellValue(cell.value);
            });
        };
    default: return (): string => 'error';
    }
}

type LongitudinalExpansion = {
    value: string|null,
    dictionary: FieldDictionary
}
/**
 * Takes a longitudinal cell with n visits and convert it to
 * n cells to be displayed in the longitudinal display, for either
 * CSV or display.
 *
 * @param {string|null} value - The raw cell value
 * @param {number} fieldNo - the raw index of the field
 * @param {array} fields - The fields selected
 * @param {array} dict - The full dictionary
 * @returns {(LongitudinalExpansion)|null} - Expanded array of cells mapped
 *     to display value. Null in an array of LongitudinalExpansion[] implies
 *     the cell has no data. null being returned directly implies that
 *     there are no table cells to be added based on this data.
 */
function expandLongitudinalCells(
    value: string|null,
    fieldNo: number,
    fields: APIQueryField[],
    dict: FullDictionary
): LongitudinalExpansion[]|null {
    // We added num fields * num visits headers, but
    // resultData only has numFields rows. For each row
    // we add multiple table cells for the number of visits
    // for that fieldNo. ie. we treat cellPos as fieldNo.
    // This means we need to bail once we've passed the
    // number of fields we have in resultData.
    if (fieldNo >= fields.length) {
        return null;
    }
    // if candidate -- return directly
    // if session -- get visits from query def, put in <divs>
    const fieldobj = fields[fieldNo];
    const fielddict = getDictionary(fieldobj, dict);
    if (fielddict === null) {
        return null;
    }
    switch (fielddict.scope) {
    case 'candidate':
        if (fielddict.cardinality == 'many') {
            throw new Error('Candidate cardinality many not implemented');
        }
        return [{value: value, dictionary: fielddict}];
    case 'session':
        let displayedVisits: string[];
        if (fieldobj.visits) {
            displayedVisits = fieldobj.visits;
        } else {
            // All visits
            if (fielddict.visits) {
                displayedVisits = fielddict.visits;
            } else {
                displayedVisits = [];
            }
        }
        if (!displayedVisits) {
            displayedVisits = [];
        }
        let celldata: {[sessionid: string]: SessionRowCell};
        try {
            celldata = JSON.parse(value || '{}');
        } catch (e) {
            // This can sometimes happen when we go between Cross-Sectional
            // and Longitudinal and the data is in an inconsistent state
            // between renders, so instead of throwing an error (which crashes
            // the whole app), we just log to the console and return null.
            console.error('Internal error parsing: "' + value + '"');
            return null;
        }
        const values = displayedVisits.map((visit): LongitudinalExpansion => {
            if (!value) {
                return {value: null, dictionary: fielddict};
            }
            for (const session in celldata) {
                if (celldata[session].VisitLabel == visit) {
                    const thissession: SessionRowCell = celldata[session];
                    switch (fielddict.cardinality) {
                    case 'many':
                        if (thissession.values === undefined) {
                            return {value: null, dictionary: fielddict};
                        }
                        const thevalues = thissession.values;
                        return {value: Object.keys(thevalues)
                           .map( (key) => key + '=' + thevalues[key])
                           .join(';'), dictionary: fielddict};
                    default:
                       if (thissession.value !== undefined) {
                           return {
                             value: thissession.value,
                             dictionary: fielddict,
                           };
                       }
                       throw new Error('Value was undefined');
                    }
                }
            }
            return {value: null, dictionary: fielddict};
        });
        return values;
    }
}

/**
 * Return a cell formatter specific to the options chosen
 *
 * @param {array} resultData - The result of the query
 * @param {string} visitOrganization - The visit organization
 *                                     option selected
 * @param {array} fields - The fields selected
 * @param {array} dict - The full dictionary
 * @param {boolean} displayEmptyVisits - Whether visits with
                                 no data should be displayed
 * @param {EnumDisplayTypes} enumDisplay - The format to display
                                           enum values
 * @returns {function} - the appropriate column formatter for
                         this data organization
 */
function organizedFormatter(
    resultData: string[][],
    visitOrganization: VisitOrgType,
    fields: APIQueryField[],
    dict: FullDictionary,
    displayEmptyVisits: boolean,
    enumDisplay: EnumDisplayTypes,
) {
    let callback;
    switch (visitOrganization) {
    case 'raw':
        /**
         * Callback to return the raw JSON data as returned by the API, in
         * table form for the DataTable
         *
         * @param {string} label - The table header
         * @param {string} cell - The cell value
         * @returns {React.ReactElement} - The table cell
         */
        callback = (label: string, cell: string): ReactNode => {
            return <td>{cell}</td>;
        };
        return callback;
    case 'inline':
        /**
         * Callback to format the data as inline data, with a list for each
         * session inside of a cell for the candidate.
         *
         * @param {string} label - The table header
         * @param {string} cell - The cell value
         * @param {string[]} row - The entire row
         * @param {string[]} headers - The entire row's headers
         * @param {number} fieldNo - the cell index
         * @returns {React.ReactElement} - The table cell
         */
        callback = (
            label: string,
            cell: string,
            row: TableRow,
            headers: string[],
            fieldNo: number
        ): ReactNode => {
            // if candidate -- return directly
            // if session -- get visits from query def, put in <divs>
            const fieldobj = fields[fieldNo];
            const fielddict = getDictionary(fieldobj, dict);
            if (fielddict === null) {
                return null;
            }
            if (fielddict.scope == 'candidate') {
                if (cell === '') {
                    return <td><i>(No data)</i></td>;
                }
                switch (fielddict.cardinality) {
                case 'many':
                    return <td><i>(Not implemented)</i></td>;
                case 'single':
                case 'unique':
                case 'optional':
                    return <TableCell data={cell} />;
                default:
                    return (<td>
                        <i>(Internal Error. Unhandled cardinality:
                            {fielddict.cardinality})
                        </i>
                    </td>);
                }
            }
            let val: React.ReactNode;
            if (fielddict.scope == 'session') {
                let displayedVisits: string[];
                if (fields[fieldNo] && fields[fieldNo].visits) {
                    // need to explicitly tell typescript it's defined otherwise
                    // it thinks visits is string[]|undefined
                    displayedVisits = fields[fieldNo].visits as string[];
                } else {
                    // All visits
                    if (fielddict.visits) {
                       displayedVisits = fielddict.visits;
                    } else {
                       displayedVisits = [];
                    }
                }
                switch (fielddict.cardinality) {
                case 'many':
                    val = displayedVisits.map((visit): React.ReactNode => {
                        let hasdata = false;
                        /**
                         * Map the JSON string from the cell returned by the
                         * API to a string to display to the user in the
                         * frontend for this visit.
                         *
                         * @param {string} visit - The visit being displayed
                         * @param {string} cell - The raw cell value
                         * @returns {string|null} - the display string
                         */
                        const visitval = (visit: string, cell: string) => {
                            if (cell === '') {
                                return null;
                            }

                            try {
                                const json = JSON.parse(cell);
                                for (const sessionid in json) {
                                    if (json[sessionid].VisitLabel == visit) {
                                        const values = json[sessionid].values;
                                        return (<dl>{
                                            Object.keys(values).map(
                                                (keyid: string):
                                                  React.ReactNode => {
                                                    const val = values[keyid];
                                                    if (val === null) {
                                                        return;
                                                    }
                                                    hasdata = true;
                                                    // Workarounds for line length
                                                    const f = fielddict;
                                                    const e = enumDisplay;
                                                    const dval = (
                                                        <DisplayValue
                                                           value={val}
                                                           dictionary={f}
                                                           enumDisplay={e}
                                                         />
                                                    );

                                                    return (
                                                        <div style={{
                                                            margin: '1ex',
                                                          }}>
                                                            <dt>{keyid}</dt>
                                                            <dd>{dval}</dd>
                                                        </div>
                                                    );
                                                })
                                        }
                                        </dl>);
                                    }
                                }
                                return null;
                            } catch (e) {
                                console.error(e);
                                return <i>(Internal error)</i>;
                            }
                        };
                        let theval = visitval(visit, cell);
                        if (!displayEmptyVisits && !hasdata) {
                            return <div key={visit} />;
                        }
                        if (theval === null) {
                            theval = <i>(No data)</i>;
                        }
                        return (<div key={visit} style={
                                        {
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'start',
                                            flexGrow: 1,
                                            flexShrink: 1,
                                            flexBasis: 0,
                                            borderBottom: 'thin dotted black',
                                        }
                                }>
                                   <div style={
                                            {
                                                fontWeight: 'bold',
                                                padding: '1em',
                                            }
                                        }
                                    >{visit}
                                    </div>
                                   <div style={
                                        {padding: '1em'}
                                    }>
                                        {theval}
                                    </div>
                        </div>);
                    });
                    break;
                default:
                    val = displayedVisits.map((visit) => {
                    let hasdata = false;
                    /**
                     * Maps the JSON value from the session to a list of
                     * values to display to the user
                     *
                     * @param {string} visit - The visit label
                     * @param {string} cell - The JSON returned by the API
                     *                        for this cell
                     * @returns {React.ReactElement} - The HTML list react element
                     */
                    const visitval = (visit: string, cell: string) => {
                        if (cell === '') {
                            return null;
                        }
                        try {
                            const json = JSON.parse(cell);
                            for (const sessionid in json) {
                                if (json[sessionid].VisitLabel == visit) {
                                    hasdata = true;
                                    return <DisplayValue
                                              value={json[sessionid].value}
                                              dictionary={fielddict}
                                              enumDisplay={enumDisplay} />;
                                }
                            }
                        } catch (e) {
                            return <i>(Internal error)</i>;
                        }
                        return null;
                    };
                    let theval = visitval(visit, cell);
                    if (!displayEmptyVisits && !hasdata) {
                        return <div key={visit} />;
                    }
                    if (theval === null) {
                        theval = <i>(No data)</i>;
                    }
                    return (<div key={visit} style={
                                    {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'start',
                                        flexGrow: 1,
                                        flexShrink: 1,
                                        flexBasis: 0,
                                        borderBottom: 'thin dotted black',
                                    }
                            }>
                               <div style={
                                        {
                                            fontWeight: 'bold',
                                            padding: '1em',
                                        }
                                    }
                                >{visit}
                                </div>
                               <div style={
                                    {padding: '1em'}
                                }>
                                    {theval}
                                </div>
                            </div>);
                });
                }
            }
            const value = (<div style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                }
            } >
                    {val}
            </div>);
            return <td>{value}</td>;
        };
        return callback;
    case 'longitudinal':
        /**
         * Callback to organize this data longitudinally
         *
         * @param {string} label - The header label
         * @param {string} cell - the JSON value of the cell
         * @param {string[]} row - the entire row
         * @param {string[]} headers - the headers for the table
         * @param {number} fieldNo - The field number of this cell
         * @returns {React.ReactElement} - The table cell
         */
        callback = (
            label: string,
            cell: string,
            row: TableRow,
            headers: string[],
            fieldNo: number
        ): ReactNode => {
            const cells = expandLongitudinalCells(cell, fieldNo, fields, dict);
            if (cells === null) {
                return null;
            }
            return <>{cells.map((cell: LongitudinalExpansion) => {
                if (cell.value === null) {
                    return <td><i>(No data)</i></td>;
                }

                return (<td>
                            <DisplayValue
                                value={cellValue(cell.value)}
                                dictionary={cell.dictionary}
                                enumDisplay={enumDisplay} />
                    </td>);
            })}</>;
        };
        return callback;
    case 'crosssection':
        /**
         * Callback that organizes data cross-sectionally
         *
         * @param {string} label - The header label
         * @param {string} cell - the JSON value of the cell
         * @param {string[]} row - the entire row
         * @param {string[]} headers - the headers for the table
         * @param {number} fieldNo - The field number of this cell
         * @returns {React.ReactElement} - The table cell for this cell.
         */
        callback = (
            label: string,
            cell: string,
            row: TableRow,
            headers: string[],
            fieldNo: number
        ): ReactNode => {
            if (cell === null) {
                return <td><i>No data for visit</i></td>;
            }
            if (fieldNo == 0) {
                // automatically added Visit column
                return <TableCell data={cell} />;
            }

            const fieldobj = fields[fieldNo-1];
            const fielddict = getDictionary(fieldobj, dict);

            return fielddict === null
                ? <TableCell data={cell} />
                : (<td>
                    <DisplayValue
                        value={cellValue(cell)}
                        dictionary={fielddict}
                        enumDisplay={enumDisplay}
                    />
                  </td>);
        };
        return callback;
    }
}

/**
 * Get the data dictionary for a specific field
 *
 * @param {APIQueryField} fieldobj - The field in the format of props.fields
 * @param {FullDictionary} dict - the full data dictionary
 * @returns {FieldDictionary?} - The field dictionary for this field
 */
function getDictionary(
    fieldobj: APIQueryField,
    dict: FullDictionary,
): FieldDictionary|null {
    if (!dict || !fieldobj
        || !dict[fieldobj.module]
        || !dict[fieldobj.module][fieldobj.category]
        || !dict[fieldobj.module][fieldobj.category][fieldobj.field]
    ) {
        return null;
    }
    return dict[fieldobj.module][fieldobj.category][fieldobj.field];
}

type VisitOrgType = 'raw' | 'inline' | 'longitudinal' | 'crosssection';
type HeaderDisplayType = 'fieldname' | 'fielddesc' | 'fieldnamedesc';
/**
 * Generate the appropriate table headers based on the visit
 * organization
 *
 * @param {array} fields - the selected fields
 * @param {string} org - the visit organization
 * @param {string} display - the header display format
 * @param {object} fulldict - the data dictionary
 * @param {function} onProgress - Callback to indicate progress in processing
 * @returns {array} - A promise which resolves to the array of headers to display
 *                    in the frontend table
 */
function organizeHeaders(
    fields: APIQueryField[],
    org: VisitOrgType,
    display: HeaderDisplayType,
    fulldict: FullDictionary,
    onProgress: (i: number) => void): Promise<string[]> {
    /**
     * Format a header according to the selected display type
     *
     * @param {APIQueryField} header - The header to format
     * @returns {string} - The string to display to the user
     */
    const formatHeader = (header: APIQueryField): string => {
        switch (display) {
            case 'fieldname': return header.field;
            case 'fielddesc': return getDictionaryDescription(
                header.module,
                header.category,
                header.field,
                fulldict
            );
           case 'fieldnamedesc': return header.field +
                ': ' + getDictionaryDescription(
                    header.module,
                    header.category,
                    header.field,
                    fulldict
            );
           default:
                throw new Error('Unhandled field display type');
        }
    };
    switch (org) {
    case 'raw':
        return Promise.resolve(fields.map((val, i) => {
            onProgress(i);
            return formatHeader(val);
        }));
    case 'inline':
        return Promise.resolve(fields.map((val, i) => {
            onProgress(i);
            return formatHeader(val);
        }));
    case 'longitudinal':
        const headers: string[] = [];
        let i = 0;
        for (const field of fields) {
            i++;
            const dict = getDictionary(field, fulldict);

            if (dict === null) {
                headers.push('Internal Error');
            } else if (dict.scope == 'candidate') {
                headers.push(formatHeader(field));
            } else {
                if (typeof field.visits !== 'undefined') {
                    for (const visit of field.visits) {
                        headers.push(formatHeader(field) + ': ' + visit);
                    }
                }
            }
            onProgress(i);
        }
        // Split session level selections into multiple headers
        return Promise.resolve(headers);
    case 'crosssection':
        return new Promise( (resolve) => {
            setTimeout( () => {
                resolve(['Visit Label',
                        ...fields.map((val, i) => {
                            onProgress(i);
                            return formatHeader(val);
                        }),
                ]);
            });
        });
    default: throw new Error('Unhandled visit organization');
    }
}

export default ViewData;
