$(document).ready(function() {

    // Colours for all charts broken down by only by site
    var siteColours = [
        '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
        '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
        '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
    ];

    // Open the appropriate charts from the "views" dropdown menus
    $(".dropdown-menu a").click(function () {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
        $($(this).parent().siblings().children("a")).each(function () {
            $(document.getElementById(this.getAttribute('data-target'))).addClass("hidden");
        });
        $(document.getElementById(this.getAttribute('data-target'))).removeClass("hidden");

        if (typeof recruitmentLineChart !== 'undefined') {
            recruitmentLineChart.resize();
        }
        if (typeof scanLineChart !== 'undefined') {
            scanLineChart.resize();
        }
    });

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
        url: loris.BaseURL + '/statistics/charts/scans_bymonth',
        type: 'get',
        success: function(data) {
            let lengendNames = [];
            for (let j=0; j<data.datasets.length; j++) {
                lengendNames.push(data.datasets[j].name);
            }
            let scanLineData = formatLineData(data);
            scanLineChart = c3.generate({
                size: {
                    height: '100%',
                },
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
            d3.select('.scanChartLegend')
              .insert('div', '.scanChart')
              .attr('class', 'legend')
              .selectAll('div').data(lengendNames).enter()
              .append('div')
              .attr('data-id', function(id) {
                return id;
              })
              .html(function(id) {
                return '<span></span>' + id;
              })
              .each(function(id) {
                d3.select(this).select('span').style('background-color', scanLineChart.color(id));
              })
              .on('mouseover', function(id) {
                scanLineChart.focus(id);
              })
              .on('mouseout', function(id) {
                scanLineChart.revert();
              })
              .on('click', function(id) {
                $(this).toggleClass("c3-legend-item-hidden")
                scanLineChart.toggle(id);
              });
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
    // AJAX to get recruitment line chart data
    $.ajax({
        url: loris.BaseURL + '/statistics/charts/siterecruitment_line',
        type: 'get',
        success: function(data) {
            let lengendNames = [];
            for (let j=0; j<data.datasets.length; j++) {
                lengendNames.push(data.datasets[j].name);
            }
            let recruitmentLineData = formatLineData(data);
            recruitmentLineChart = c3.generate({
                size: {
                    height: '100%',
                },
                bindto: '#recruitmentChart',
                data: {
                    x: 'x',
                    xFormat: '%m-%Y',
                    columns: recruitmentLineData,
                    type: 'area-spline'
                },
                legend: {
                    show: false,
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%m-%Y'
                        }
                    },
                    y: {
                        label: 'Candidates registered'
                    }
                },
                zoom: {
                    enabled: true
                },
                color: {
                    pattern: siteColours
                }
            });
            d3.select('.recruitmentChartLegend')
              .insert('div', '.recruitmentChart')
              .attr('class', 'legend')
              .selectAll('div').data(lengendNames).enter()
              .append('div')
              .attr('data-id', function(id) {
                return id;
              })
              .html(function(id) {
                return '<span></span>' + id;
              })
              .each(function(id) {
                d3.select(this).select('span').style('background-color', recruitmentLineChart.color(id));
              })
              .on('mouseover', function(id) {
                recruitmentLineChart.focus(id);
              })
              .on('mouseout', function(id) {
                recruitmentLineChart.revert();
              })
              .on('click', function(id) {
                $(this).toggleClass("c3-legend-item-hidden")
                recruitmentLineChart.toggle(id);
              });
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });

});
