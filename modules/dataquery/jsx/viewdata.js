import swal from 'sweetalert2';
import {useState, useEffect} from 'react';

import fetchDataStream from 'jslib/fetchDataStream';

import StaticDataTable from 'jsx/StaticDataTable';

function TableCell({data}) {
    try {
        const parsed = JSON.parse(data);
        if (typeof parsed === 'object') {
            // Can't include objects as react children, if we got here
            // there's probably a bug.
            return <td>{data}</td>;
        }
        return <td>{parsed}</td>;
    } catch (e) {
        return <td>{data}</td>;
    }
}
function ProgressBar({type, value, max}) {
    switch(type) {
    case 'loading':
        if (value == 0) {
            return <h2>Query not yet run</h2>;
        }
        return (<div>
                <label htmlFor="loadingprogress">Loading data:</label>
                <progress id="loadingprogress"
                    value={value} max={max}>
                    {value} of {max} candidates
                </progress>
        </div>);
    case 'headers':
        return (<div>
                <label htmlFor="loadingprogress">Organizing headers:</label>
                <progress id="loadingprogress"
                    value={value} max={max}>
                    {value} of {max} columns
                </progress>
        </div>);
    case 'dataorganization':
        return (<div>
                <label htmlFor="loadingprogress">Organizing data:</label>
                <progress id="loadingprogress"
                    value={value} max={max}>
                    {value} of {max} columns
                </progress>
        </div>);
    }
    return <h2>Invalid progress type: {type}</h2>;
}

function useRunQuery(fields, filters, onRun) {
    const [expectedResults, setExpectedResults] = useState(0);
    const [resultData, setResultData] = useState([]);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoading(true);
        const payload = calcPayload(fields, filters);
        if (payload == {}) {
            return;
        }
        fetch(
           loris.BaseURL + '/dataquery/queries',
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
                let resultbuffer = [];
                fetch(
                        loris.BaseURL + '/dataquery/queries/'
                            + data.QueryID + '/count',
                        {
                            method: 'GET',
                            credentials: 'same-origin',
                        }
                ).then((resp) => resp.json()
                ).then( (json) => {
                    setExpectedResults(json.count);
                });
                const response = fetchDataStream(
                    loris.BaseURL +
                        '/dataquery/queries/' +
                        data.QueryID + '/run',
                    (row) => {
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

                if (!response.ok) {
                    response.then(
                        (resp) => resp.json()
                    ).then(
                        (data) => {
                            swal.fire({
                                type: 'error',
                                text: data.error,
                            });
                        }
                    ).catch( () => {});
                }
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
    }
}

function useDataOrganization(queryData, visitOrganization, fields, fulldictionary) {
    const [tableData, setTableData] = useState([]);
    const [orgStatus, setOrgStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const [headers, setHeaders] = useState([]);
    useEffect( () => {
        console.log('Starting headers effect');
        if (queryData.loading == true) {
            console.log('Aborting, not finished loading');
            return;
        }
        setOrgStatus('headers');
        organizeHeaders(fields,
          visitOrganization,
          fulldictionary,
          (i) => { console.log(i); setProgress(i)},
        ).then( (headers) => {
            setHeaders(headers);
            setOrgStatus('data');

            organizeData(
                queryData.data,
                visitOrganization,
                fulldictionary,
                fields,
                (i) => {console.log(i); setProgress(i)},
            ).then ( (data) => {
                setTableData(data)
                console.log('organizing. Done');
                setOrgStatus('done');
                });
            });
    }, [visitOrganization, queryData.loading, queryData.data]);
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
 *
 * @return {ReactDOM}
 */
function ViewData(props) {
    const [visitOrganization, setVisitOrganization] = useState('raw');
    const queryData = useRunQuery(props.fields, props.filters, props.onRun);
    const organizedData = useDataOrganization(queryData, visitOrganization, props.fields, props.fulldictionary);

    let queryTable;
    if (queryData.loading) {
        queryTable = <ProgressBar type='loading' value={queryData.data.length} max={queryData.totalcount} />;
    } else {
        switch (organizedData['status']) {
        case null: 
            return queryTable = <h2>Query not yet run</h2>;
        case 'headers':
            queryTable = <ProgressBar type='headers' value={organizedData.progress} max={props.fields.length} />;
            break;
        case 'data':
            queryTable = <ProgressBar type='dataorganization' value={organizedData.progress} max={queryData.length} />;
            break;
        case 'done':
            queryTable = <StaticDataTable
                Headers={organizedData.headers}
                RowNumLabel='Row Number'
                Data={organizedData.data}
                getFormattedCell={
                     organizedFormatter(
                        queryData.data,
                        visitOrganization,
                        props.fields,
                        props.fulldictionary,
                    )
                }
                />;
            break;
        default:
            throw new Error('Unhandled organization status');
        }
    }

    return <div>
        <SelectElement
            name='visitorganization'
            options={{
                'crosssection' : 'Rows (Cross-sectional)',
                'longitudinal' : 'Columns (Longitudinal)',
                'inline'       : 'Inline values (no download)',
                'raw'          : 'Raw JSON (debugging only)'
            }}
            label='Display visits as'
            value={visitOrganization}
            multiple={false}
            emptyOption={false}
            onUserInput={ (name, value) => setVisitOrganization(value) }
            sortByValue={false}
          />
         {queryTable}
    </div>;
}

/**
 * Calculates the payload to submit to the search endpoint
 * to run the query.
 *
 * @param {array} fields - the fields to query
 * @param {QueryGroup} filters - the root of the filters
 *
 * @return {object}
 */
function calcPayload(fields, filters) {
    let payload = {
        type: 'candidates',
        fields: fields.map((val) => {
            //console.log('payload ', val);
            const payload = {
                module: val.module,
                category: val.category,
                field: val.field,
            };
            // console.log('payload visits', val.visits);
            if (val.visits) {
                payload.visits = val.visits.map( (visitOption) => visitOption.value);
            }
            return payload;
        },
        ),
    };
    if (filters.group.length > 0) {
        payload.criteria = filters;
    }
    return payload;
}

/**
 * Organize the session data into tabular data based on
 * the visit organization settings
 *
 * @param {array} resultData - The result of the query
 * @param {string} visitOrganization - The visit organization
 *                                     option selected
 * @return {array}
 */
function organizeData(resultData, visitOrganization, fulldict, fields, onProgress) {
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
            let promises = [];
            for(let candidaterow of resultData) {
                promises.push(new Promise( (resolve) => {
                    // Collect list of visits for this candidate
                    const candidatevisits = {};
                    for (let i in candidaterow) {
                        const dictionary = getDictionary(fields[i], fulldict);
                        if (dictionary && dictionary.scope == 'session') {
                            if (candidaterow[i] === null || candidaterow[i] == '') {
                                continue;
                            }
                            const cellobj = JSON.parse(candidaterow[i]);
                            for (let session in cellobj) {
                                candidatevisits[cellobj[session].VisitLabel] = true;
                            }
                        }
                    }

                    const dataRows = [];
                    for (const visit in candidatevisits) {
                        let dataRow =[];
                        dataRow.push(visit);
                        for (let i in candidaterow) {
                          const dictionary = getDictionary(fields[i], fulldict);
                          if (dictionary && dictionary.scope == 'session') {
                            if (candidaterow[i] === null || candidaterow[i] == '') {
                              dataRow.push(null);
                              continue;
                            }
                            const values = Object.values(JSON.parse(candidaterow[i])).filter( (sessionval) => {
                              return sessionval.VisitLabel == visit;
                            });
                            switch (values.length) {
                            case 0:
                              dataRow.push(null);
                              break;
                            case 1:
                              dataRow.push(values[0].value);
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
                }));
            }
            Promise.all(promises).then((values) => {
              const mappedData = [];
              for(let row of values) {
                mappedData.push(...row);
              }
              resolve(mappedData);
            });
        });
    default: throw new Error('Unhandled visit organization');
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
 *
 * @return {callback}
 */
function organizedFormatter(resultData, visitOrganization, fields, dict) {
    let callback;
    switch (visitOrganization) {
    case 'raw':
        callback = (label, cell, row) => {
            return <td>{cell}</td>;
        };
        callback.displayName = 'Raw session data';
        return callback;
    case 'inline':
        callback = (label, cell, row, headers, fieldNo) => {
            // if candidate -- return directly
            // if session -- get visits from query def, put in <divs>
            const fieldobj = fields[fieldNo];
            const fielddict = getDictionary(fieldobj, dict);
            if (fielddict.scope == 'candidate'
                    && fielddict.cardinality != 'many') {
                if (cell === '') {
                    return <td><i>(No data)</i></td>;
                }

                return <TableCell data={cell} />;
            }
            let value;
            let val;
            if (fielddict.scope == 'session') {
                let displayedVisits;
                if (fields[fieldNo] && fields[fieldNo].visits) {
                    displayedVisits = fields[fieldNo].visits.map((obj) => {
                        return obj.value;
                    });
                } else {
                    // All visits
                    displayedVisits = fielddict.visits;
                }
                val = displayedVisits.map((visit) => {
                    const visitval = (visit, cell) => {
                        if (cell === '') {
                            return <i>(No data)</i>;
                        }
                        try {
                            const json = JSON.parse(cell);
                            for (const sessionid in json) {
                                if (json[sessionid].VisitLabel == visit) {
                                    if (fielddict.cardinality === 'many') {
                                        return valuesList(json[sessionid].values);
                                    } else {
                                        return json[sessionid].value;
                                    }
                                }
                            }
                        } catch(e) {
                            return <i>(Internal error)</i>;
                        }
                        return <i>(No data)</i>;
                    };
                    return (<div key={visit} style={
                                    {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'start',
                                        // flex: 1 expanded
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
                                    {visitval(visit, cell)}
                                </div>
                            </div>);
                });
            } else {
                return <td>FIXME: {cell}</td>;
            }
            value = (<div style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                }
            } >
                    {val}
            </div>);
            return <TableCell data={value} />;
        };
        callback.displayName = 'Inline session data';
        return callback;
    case 'longitudinal':
        callback = (label, cell, row, headers, fieldNo) => {
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
            switch(fielddict.scope) {
            case 'candidate':
                if (fielddict.cardinality == 'many') {
                    return <td>FIXME: Candidate cardinality many not implemented.</td>;
                }
                return <TableCell data={cell} />;
            case 'session':
                let displayedVisits;
                if (fieldobj.visits) {
                    displayedVisits = fieldobj.visits.map((obj) => {
                        return obj.value;
                    });
                } else {
                    // All visits
                    displayedVisits = fielddict.visits;
                }
                const values = displayedVisits.map((visit) => {
                    if (!cell) {
                        return <td key={visit}><i>(No data)</i></td>;
                    }
                    try {
                        const data = JSON.parse(cell);
                        for (const session in data) {
                          if (data[session].VisitLabel == visit) {
                            return <TableCell key={visit} data={data[session].value} />;
                          }
                        }
                        return <td key={visit}><i>(No data)</i></td>;
                    } catch(e) {
                        return <td key={visit}><i>(Internal error)</i></td>;
                    }
                });
                return <>{values}</>;
            default:
                throw new Error('Invalid field scope');

            }
        };
        callback.displayName = 'Longitudinal data';
        return callback;
    case 'crosssection':
        callback = (label, cell, row) => {
            if (cell === null) {
                return <td><i>No data for visit</i></td>;
            }
            return <TableCell data={cell} />;
        };
        callback.displayName = 'Cross-sectional data';
        return callback;
    }
}

/**
 * Get the data dictionary for a specific field
 *
 * @param {object} fieldobj - The field in the format of props.fields
 * @param {object} dict - the full data dictionary
 *
 * @return {object}
 */
function getDictionary(fieldobj, dict) {
    if (!dict || !fieldobj 
        || !dict[fieldobj.module]
        || !dict[fieldobj.module][fieldobj.category]
        || !dict[fieldobj.module][fieldobj.category][fieldobj.field]
    ) {
        return {};
    }

    return dict[fieldobj.module][fieldobj.category][fieldobj.field];
}

/**
 * Return a cardinality many values field as a list
 *
 * @param {object} values - values object with keys as id
 *
 * @return {JSX}
 */
function valuesList(values) {
    if (values == '') {
        return <div></div>;
    }
    const items = Object.values(values).map((val) => {
        return <li key={val.key}>{val.value}</li>;
    });
    return (<ul>
        {items}
    </ul>);
}

/**
 * Generate the appropriate table headers based on the visit
 * organization
 *
 * @param {array} fields - the selected fields
 * @param {string} org - the visit organization
 * @param {object} fulldict - the data dictionary
 *
 * @return {array}
 */
function organizeHeaders(fields, org, fulldict, onProgress) {
    switch (org) {
    case 'raw':
        return Promise.resolve(fields.map((val, i) => {
            onProgress(i);
            return val.field;
        }));
    case 'inline':
        return Promise.resolve(fields.map((val, i) => {
            onProgress(i);
            return val.field;
        }));
    case 'longitudinal':
        let headers = [];
        let i = 0;
        for (const field of fields) {
            i++;
            const dict = getDictionary(field, fulldict);
            if (dict.scope == 'candidate') {
                headers.push(field.field);
            } else {
                for (const visit of field.visits) {
                    headers.push(field.field + ': ' + visit.label);
                }
            }
            onProgress(i);
        }
        // Split session level selections into multiple headers
        return Promise.resolve(headers);
    case 'crosssection':
        return new Promise( (resolve) => {
            resolve(['Visit Label',
                    ...fields.map((val, i) => {
                        onProgress(i);
                        return val.field;
                    })
            ]);
        });
    default: throw new Error('Unhandled visit organization');
    }
}

export default ViewData;
