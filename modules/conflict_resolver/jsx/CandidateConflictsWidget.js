import '../../../node_modules/c3/c3.css';
import * as d3 from 'd3';
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
    useEffect(() => {
        c3.generate({
            bindto: '#conflictschart',
            data: {
                columns: getDataBreakdown(props.Conflicts),
                type: 'pie',
                onclick: function(d, el) {
                    redirectFromLabel(props, d.name);
                },
            },
            pie: {
                label: {
                    format: function(value, ratio, id) {
                        return [id, value].join(',');
                    },
                },
            },
            legend: {
                item: {
                    onclick: function(id) {
                        redirectFromLabel(props, id);
                    },
                },
            },
            onrendered: function() {
                d3.selectAll('.c3-chart-arc text').each(function(v) {
                    let label = d3.select(this);
                    let data = label._groups[0][0].innerHTML.split(',');

                    let id = data[0];
                    let value = data[1];

                    d3.select(this).text('')
                        .append('tspan')
                        .text(id)
                        .attr('dy', 0)
                        .attr('x', 0)
                        .attr('text-anchor', 'middle')
                        .append('tspan')
                        .text(value + ' conflicts')
                        .attr('dy', '1.2em')
                        .attr('x', 0)
                        .attr('text-anchor', 'middle');
                });
            },
        });
    });

    return <div id='conflictschart' />;
}

/**
 * Converts the conflict data to the representation
 * required by the C3 library.
 *
 * @param {array} conflicts - The data from the database
 *
 * @return {array} - an array suitable for an C3 data key
 */
function getDataBreakdown(conflicts) {
    let data = [];
    for (let i = 0; i < conflicts.length; i++) {
        const conflict = conflicts[i];
        data.push([
            conflict.Test_name + ' - ' + conflict.Visit_label,
            conflict.Conflicts,
        ]);
    }
    return data;
}

/**
 * Redirects to the conflict resolver based on the label displayed
 * in the C3 chart
 *
 * @param {array} props - The React props
 * @param {string} label - The label in the chart
 *
 * @return {void}
 */
function redirectFromLabel(props, label) {
    let [testname, visit] = label.split(' - ');
    window.location = props.BaseURL + '/conflict_resolver/'
        + '?visitLabel=' + visit
        + '&instrument=' + testname
        + '&candidateID=' + props.Candidate.Meta.CandID;
}
export default CandidateConflictsWidget;
