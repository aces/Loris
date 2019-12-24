$(document).ready(function() {

    // Colours for all charts broken down by only by site
    var siteColours = [
        '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
        '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
        '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
    ];


function formatLineData(data) {
    "use strict";
    var processedData = new Array();
    var labels = new Array();
    labels.push('x');
    for (var i in data.labels) {
        labels.push(data.labels[i]);
    }
    processedData.push(labels);
    for (var i in data.datasets) {
        var dataset = new Array();
        dataset.push(data.datasets[i].name);
        processedData.push(dataset.concat(data.datasets[i].data));
    }
    return processedData;
}


    // AJAX to get scan line chart data
    $.ajax({
        url: loris.BaseURL + '/statistics/charts/recruitment_bymonth',
        type: 'get',
        success: function(data) {
            var scanLineData = formatLineData(data);
            scanLineChart = c3.generate({
                bindto: '#scanChart',
                data: {
                    x: 'x',
                    xFormat: '%m-%Y',
                    columns: scanLineData,
                    type: 'area-spline'
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%m-%Y'
                        }
                    },
                    y: {
                        label: 'Scans'
                    }
                },
                zoom: {
                    enabled: true
                },
                color: {
                    pattern: siteColours
                }
            });
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
});

