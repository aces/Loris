import swal from 'sweetalert2';
import {useState, useEffect} from 'react';

import fetchDataStream from 'jslib/fetchDataStream';

import StaticDataTable from 'jsx/StaticDataTable';

/**
 * The View Data tab
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function ViewData(props) {
    const [resultData, setResultData] = useState([]);
    const [loading, setLoading] = useState(null);
    const [visitOrganization, setVisitOrganization] = useState('raw');
    useEffect(() => {
        setLoading(true);
        const payload = calcPayload(props.fields, props.filters);
        if (payload == {}) {
            return;
        }
        fetch(
           loris.BaseURL + '/dataquery/queries',
           {
             method: 'POST',
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
                const response = fetchDataStream(
                    loris.BaseURL +
                        '/dataquery/queries/' +
                        data.QueryID + '/run',
                    (row) => {
                        resultbuffer.push(row);
                    },
                    () => {
                        if (resultbuffer.length % 1000 == 0) {
                            setResultData([...resultbuffer]);
                        }
                    },
                    () => {
                        setResultData([...resultbuffer]);
                        setLoading(false);
                    },
                );
                props.onRun(); // forces query list to be reloaded

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
    }, [props.fields, props.filters]);
    const queryTable = loading ? (
        <div>
            <h2>Query not yet run</h2>
        </div>
        ) : (
        <StaticDataTable
            Headers={
                organizeHeaders(
                    props.fields,
                    visitOrganization,
                    props.fulldictionary,
                )
            }
            RowNumLabel='Row Number'
            Data={organizeData(resultData, visitOrganization)}
            getFormattedCell={
                 organizedFormatter(
                    resultData,
                    visitOrganization,
                    props.fields,
                    props.fulldictionary,
                )
            }
            />
        );
    return <div>
        <h2>Display visits as:</h2>
         <ul>
            <li>Cross-sectional (not implemented, rows)</li>
            <li onClick={
                () => setVisitOrganization('longitudinal')
            }
            >Columns (Longitudinal)</li>
            <li onClick={
                () => setVisitOrganization('inline')
            }>Inline values (no download)</li>
            <li onClick={
                () => setVisitOrganization('raw')
            }>Raw JSON</li>
         </ul>

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
            return {
                module: val.module,
                category: val.category,
                field: val.field,
            };
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
function organizeData(resultData, visitOrganization) {
    switch (visitOrganization) {
    case 'raw':
        return resultData;
    case 'inline':
        // Organize with flexbox within the cell by the
        // formatter
        return resultData;
    case 'longitudinal':
        // the formatter splits into multiple cells
        return resultData;
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
        callback = (label, cell, row, cellPos, fieldNo) => {
            // if candidate -- return directly
            // if session -- get visits from query def, put in <divs>
            const fieldobj = fields[fieldNo];
            const fielddict = getDictionary(fieldobj, dict);
            if (fielddict.scope == 'candidate'
                    && fielddict.cardinality != 'many') {
                return <td>{cell}</td>;
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
            return <td>{value}</td>;
        };
        callback.displayName = 'Inline session data';
        return callback;
    case 'longitudinal':
        callback = (label, cell, row, cellPos, fieldNo) => {
            // if candidate -- return directly
            // if session -- get visits from query def, put in <divs>
            const fieldobj = fields[fieldNo];
            const fielddict = getDictionary(fieldobj, dict);
            if (fielddict.scope == 'candidate'
                    && fielddict.cardinality != 'many') {
                return <td>{cell}</td>;
            }
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
                    return <><td>1</td><td>2</td></>;
                });
                return val;
            } else {
                return <td>{cell}</td>;
            }
        };
        callback.displayName = 'Longitudinal data';
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
    if (!dict
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
function organizeHeaders(fields, org, fulldict) {
    switch (org) {
    case 'raw':
        return fields.map((val) => {
            return val.field;
        });
    case 'inline':
        return fields.map((val) => {
            return val.field;
        });
        // Organize with flexbox within the cell by the
        // formatter
    case 'longitudinal':
        let headers = [];
        for (const field of fields) {
            const dict = getDictionary(field, fulldict);
            if (dict.scope == 'candidate') {
                headers.push(field.field);
            } else {
                headers.push(field.field + 'v1');
                headers.push(field.field + 'v1');
            }
        }
        // Split session level selections into multiple headers
        return headers;
    default: throw new Error('Unhandled visit organization');
    }
}

export default ViewData;
