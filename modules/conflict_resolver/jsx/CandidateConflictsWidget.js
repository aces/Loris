import '../../../node_modules/c3/c3.css';
import c3 from 'c3';
import React, {useEffect} from 'react';

/**
 * Renders a representation of the candidate conflicts as a React
 * component
 *
 * @param {array} props - The React props
 *
 * @return {object}
 */
function CandidateConflictsWidget(props) {
    const visits = getVisits(props.Conflicts);
    const instruments = getInstruments(props.Conflicts);

    useEffect(() => {
        c3.generate({
            bindto: '#conflictschart',
            data: {
                columns: getDataBreakdown(visits, instruments, props.Conflicts),
                type: 'bar',
                onclick: function(d, el) {
                    // If the user clicked on a bar in the chart, redirect to
                    // the specific instrument/visit for this candid.
                    window.location = props.BaseURL + '/conflict_resolver/'
                        + '?visitLabel=' + visits[d.index]
                        + '&instrument=' + d.id
                        + '&candidateID=' + props.Candidate.Meta.CandID;
                },
            },
            axis: {
                x: {
                    type: 'category',
                    categories: visits,
                    label: {
                        text: 'Visit',
                        position: 'outer-center',
                    },
                },
                y: {
                    label: {
                        position: 'outer-middle',
                        text: 'Number of Conflicts',
                    },
                },
            },
            legend: {
                item: {
                    onclick: function(id) {
                        // If the user clicked on the legend, redirect to the
                        // conflict resolver for that instrument across all
                        // visits
                        window.location = props.BaseURL + '/conflict_resolver/'
                            + '?instrument=' + id
                            + '&candidateID=' + props.Candidate.Meta.CandID;
                    },
                },
            },
        });
    });

    return <div>
        <div id='conflictschart' />
        <ul>
            <li>
              {'Click on instrument in legend to visit conflict resolver '
                + 'for that instrument across all visits.'}
            </li>
            <li>
              {'Click on bar in graph to visit conflict resolver '
                + 'for that visit and instrument combination.'}
            </li>
        </ul>
    </div>;
}

/**
 * Get a list of unique visits in the data passed.
 *
 * @param {object} data - The summary data
 *
 * @return {array}
 */
function getVisits(data) {
    let visits = {};
    for (const row of Object.values(data)) {
        visits[row.Visit_label] = true;
    }
    return Object.keys(visits);
}

/**
 * Get a list of unique instruments in the data passed.
 *
 * @param {object} data - The summary data
 *
 * @return {array}
 */
function getInstruments(data) {
    let visits = {};
    for (const row of Object.values(data)) {
        visits[row.Test_name] = true;
    }
    return Object.keys(visits);
}

/**
 * Converts the conflict data to the representation
 * required by the C3 library.
 *
 * @param {array} visits      - An array of visit labels
 * @param {array} instruments - An array of instruments in the data
 * @param {array} conflicts   - The unprocessed data from the database
 *
 * @return {array} - an array suitable for an C3 data key
 */
function getDataBreakdown(visits, instruments, conflicts) {
    let odata = {};
    // The data needs to be in the format:
    //    ['instrument1', v1val, v2val, v3val],
    //    ['instrument2', v1val, v2val, v3val]
    // etc.
    // First we convert the conflicts from the format returned
    // from the DB of [VisitLabel, TestName, Count] (sparsely
    // populated if count is 0) into an object so we can easily
    // look up the value, then we go through the list of instruments
    // and populate an array to return to C3.
    for (let i = 0; i < conflicts.length; i++) {
        const conflict = conflicts[i];
        if (!odata[conflict.Test_name]) {
            odata[conflict.Test_name] = {};
        }
        odata[conflict.Test_name][conflict.Visit_label] = conflict.Conflicts;
    }

    let data = [];

    for (let i = 0; i < instruments.length; i++) {
        const tn = instruments[i];
        let row = [tn];
        for (let j = 0; j < visits.length; j++) {
            const visit = visits[j];
                row.push(Number(odata[tn][visit]));
        }
        data.push(row);
    }
    return data;
}

export default CandidateConflictsWidget;
