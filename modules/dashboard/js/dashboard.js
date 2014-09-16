/*global document: false, $: false, window: false, unescape: false, Option: false*/

// Turn on the tooltip for the progress bar - shows total male and female registered candidates
$('.progress-bar').tooltip();

// Make dashboard panels collapsible
$('.panel-heading span.clickable').on("click", function (e) {
    if ($(this).hasClass('panel-collapsed')) {
        // expand the panel
        $(this).parents('.panel').find('.panel-body').slideDown();
        $(this).removeClass('panel-collapsed');
        $(this).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    } else {
        // collapse the panel
        $(this).parents('.panel').find('.panel-body').slideUp();
        $(this).addClass('panel-collapsed');
        $(this).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
});

// Open the appropriate charts from the "views" dropdown menus
$(".dropdown-menu a").click(function() {
    $(this).parent().siblings().removeClass("active");
    $(this).parent().addClass("active");
    $($(this).parent().siblings().children("a")).each(function(i) {
        $(document.getElementById(this.getAttribute('data-target'))).addClass("hidden");
    });
    $(document.getElementById(this.getAttribute('data-target'))).removeClass("hidden");
    recruitmentPieChart.resize();
    recruitmentBarChart.resize();
    recruitmentLineChart.resize();
});

var siteColours = [
    '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000', 
    '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', 
    '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
];
var genderColours = ['#2FA4E7', '#1C70B6'];

function formatPieData(data) {
	"use strict";
    JSON.parse(data);
    var processedData = new Array();
    for (var i in data) {
        var siteData = [data[i].label, data[i].total];
        processedData.push(siteData);
    }
    return processedData;
}
function formatBarData(data) {
	"use strict";
    var processedData = new Array();
    females = ['Female'];
    processedData.push(females.concat(data.datasets.female));
    males = ['Male'];
    processedData.push(males.concat(data.datasets.male));
    return processedData;
}
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
        dataset = new Array();
        dataset.push(data.datasets[i].name);
        processedData.push(dataset.concat(data.datasets[i].data));
    }
    return processedData;
}

// AJAX to get scan line chart data
$.ajax({
    url: 'AjaxHelper.php?Module=dashboard&script=get_scan_line_data.php',
    type: 'post',
    success: function(data) {
        var scanLineData = formatLineData(data);
        var scanLineChart = c3.generate({
            bindto: '#scanChart',
            data: {
                x: 'x',
                x_format: '%m-%Y',
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

// AJAX to get pie chart data
$.ajax({
    url: 'AjaxHelper.php?Module=dashboard&script=get_recruitment_pie_data.php',
    type: 'post',
    success: function(data) {
        var recruitmentPieData = formatPieData(data);
        var recruitmentPieChart = c3.generate({
            bindto: '#recruitmentPieChart',
            data: {
                columns: recruitmentPieData,
                type : 'pie'
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

// AJAX to get bar chart data
$.ajax({
    url: 'AjaxHelper.php?Module=dashboard&script=get_recruitment_bar_data.php',
    type: 'post',
    success: function(data) {
        var recruitmentBarData = formatBarData(data);
        var recruitmentBarLabels = data.labels;
        var recruitmentBarChart = c3.generate({
            bindto: '#recruitmentBarChart',
            data: {
                columns: recruitmentBarData,
                type: 'bar'
            },
            axis: {
                x: {
                    type : 'categorized',
                    categories: recruitmentBarLabels
                },
                y: {
                    label: 'Candidates registered'
                }
            },
            color: {
                pattern: genderColours
            }
        });
    },
    error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
    }
});

// AJAX to get recruitment line chart data
$.ajax({
    url: 'AjaxHelper.php?Module=dashboard&script=get_recruitment_line_data.php',
    type: 'post',
    success: function(data) {
        var recruitmentLineData = formatLineData(data);
        var recruitmentLineChart = c3.generate({
            bindto: '#recruitmentChart',
            data: {
                x: 'x',
                x_format: '%m-%Y',
                columns: recruitmentLineData,
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
    },
    error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
    }
});