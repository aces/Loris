import '../../../node_modules/c3/c3.css';
import c3 from 'c3';
import React, {useEffect} from 'react';

/**
 * A CandidateScanQCSummaryWidget is a type of React widget
 * used to summarize a candidate's imaging scans QC status
 * on the candidate profile.
 *
 * @param {object} props - React props
 *
 * @return {*} - rendered React component
 */
function CandidateScanQCSummaryWidget(props) {
    useEffect(() => {
        const modalities = getModalities(props.Files);
        const data = getDataObject(modalities, props.Files);
        const visits = getVisits(props.Files);
        c3.generate({
            bindto: '#imagebreakdownchart',
            data: {
                columns: getDataBreakdown(data, modalities, visits),
                type: 'bar',
                groups: getDataGroups(modalities),
                colors: getColorFuncs(modalities),
                onclick: function(d, el) {
                    const vl = visits[d.index];
                    window.location = props.BaseURL
                        + '/imaging_browser/viewSession'
                        + '?sessionID=' + props.VisitMap[vl];
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
                        text: 'Number of Scans',
                    },
                },
            },
            legend: {
                show: false,
            },
        });
    });

    return <div>
        <div id='imagebreakdownchart' />
            <ul>
              <li>Red bar denotes number of failed QC scans.</li>
              <li>Green bar denotes number of passed QC scans.</li>
              <li>Grey bar denotes other QC statuses.</li>
            </ul>
            <p>
              Different shades represent different modalities.
              Only native modalities are displayed in results.
            </p>
            <p>
              Hover over any visit to see detailed modality breakdown for visit,
              click to go to imaging browser.
            </p>
        </div>;
}

/**
 * Get a list of unique modalities in the files passed.
 *
 * @param {object} files - The files table summary data
 *
 * @return {array}
 */
function getModalities(files) {
    let modalities = {};
    for (const row of Object.values(files)) {
        modalities[row.Scan_type] = true;
    }
    return Object.keys(modalities).sort();
}

/**
 * Get a list of unique visits in the data passed.
 *
 * @param {object} files - The files table summary data
 *
 * @return {array}
 */
function getVisits(files) {
    let visits = {};
    for (const row of Object.values(files)) {
        visits[row.Visit_label] = true;
    }
    return Object.keys(visits);
}

/**
 * Convert the data to a format required for the C3
 * `columns` array.
 *
 * In order to be rendered per visit on the X axis,
 * this must be an array of equally sized arrays where
 * each index represents a specific visit.
 *
 * The columns represent visits, the rows represent
 * the modality/pass fail status which are then used
 * for grouping purposes to create a stacked bar graph.
 *
 * @param {object} data - The unprocessed data
 * @param {array} modalities - A list of modality strings
 * @param {array} visits - A list of visit strings
 *
 * @return {array}
 */
function getDataBreakdown(data, modalities, visits) {
    let rv = [];
    for (const modality of modalities) {
        let pass = [modality + ' - Pass'];
        let fail = [modality + ' - Fail'];
        let other = [modality + ' - Other'];
        for (const visit of visits) {
            if (data[modality].Pass[visit]) {
                pass.push(data[modality].Pass[visit]);
            } else {
                pass.push(0);
            }
            if (data[modality].Fail[visit]) {
                fail.push(data[modality].Fail[visit]);
            } else {
                fail.push(0);
            }
            if (data[modality].Other[visit]) {
                other.push(data[modality].Other[visit]);
            } else {
                other.push(0);
            }
        }
        rv.push(pass);
        rv.push(fail);
        rv.push(other);
    }
    return rv;
}

/**
 * Convert the data from the database query into a
 * hierarchical object which is easier to work with.
 *
 * @param {array} modalities - a list of modalities
 * @param {array} files - the raw results of the DB
 *                        query
 *
 * @return {object}
 */
function getDataObject(modalities, files) {
    let data = {};
    for (const modality of modalities) {
        data[modality] = {
            'Pass': {},
            'Fail': {},
            'Other': {},
        };
    }
    for (let i = 0; i < files.length; i++) {
        const session = files[i];
        const QC = session.QC == '' ? 'Other' : session.QC;
        data[session.Scan_type][QC][session.Visit_label] = session.nfiles;
    }
    return data;
}

/**
 * Create a list of data groups to be passed to
 * the C3 library.
 *
 * @param {array} modalities - the list of modalities
 *
 * @return {array}
 */
function getDataGroups(modalities) {
    let pgroup = [];
    let fgroup = [];
    let ogroup = [];
    for (const modality of modalities) {
        pgroup.push(modality + ' - Pass');
        fgroup.push(modality + ' - Fail');
        ogroup.push(modality + ' - Other');
    }
    return [pgroup, fgroup, ogroup];
}

/**
 * Manually specify the colours to use for each group
 * instead of using C3's autogenerated colours. This is
 * done to ensure red means fail and green means pass.
 *
 * Then we generate a new colour with different red or green intensities
 * for each modality based on the number of modalities in
 * the results. This is arbitrarily clipped to the 100-200
 * range to avoid overpoweringly strong colours.
 *
 * @param {array} modalities - list of modalities in data
 *
 * @return {object}
 */
function getColorFuncs(modalities) {
    const obj = {};
    const n = modalities.length;
    const step = 100 / n;
    for (let i = 0; i < modalities.length; i++) {
        let mlabel = modalities[i] + ' - Pass';
        obj[mlabel] = 'rgb(46, ' + (200 - (step*i)) + ', 80)';

        mlabel = modalities[i] + ' - Fail';
        obj[mlabel] = 'rgb(' + (200 - (step*i)) + ', 20, 60)';

        mlabel = modalities[i] + ' - Other';
        obj[mlabel] = 'rgb('
                      + (200 - (step*i))
                      + ', '
                      + (200 - (step*i))
                      + ', '
                      + (200 - (step*i))
                      + ')';
    }
    return obj;
}

export default CandidateScanQCSummaryWidget;
