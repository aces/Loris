import '../../../node_modules/c3/c3.css';
import * as d3 from 'd3';
import c3 from 'c3';
import React, {useEffect} from 'react';

function CandidateConflictsWidget(props) {
    useEffect(() => {
        c3.generate({
            bindto: '#conflictschart',
            data: {
                columns: getDataBreakdown(props.Conflicts),
                type: 'pie',
                onclick: function(d, el) {
                    // http://localhost:8000/conflict_resolver/?visitLabel=V03&instrument=adi_r_proband
                    console.log(d, el);
                },
            },
            pie: {
                label: {
                    format: function(value, ratio, id) {
                        return [id, value].join(',');
                    },
                },
            },
            onrendered: function() {
                d3.selectAll('.c3-chart-arc text').each(function(v) {
                    let label = d3.select(this);
                    console.log(label);
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

function getDataBreakdown(conflicts) {
    let data = [];
    for (let i = 0; i < conflicts.length; i++) {
        const conflict = conflicts[i];
        data.push([conflict.Test_name + ' - ' + conflict.Visit_label, conflict.Conflicts, {'abc': 'def'}]);
    }
    return data;
}
export default CandidateConflictsWidget;
