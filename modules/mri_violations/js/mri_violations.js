/*global document: false, $: false, window: false*/
$(document).ready(function(){
    $.getScript("js/modules/dynamic_table.table.js")
        .done(function(){
            Table.setup("content", "scrollRight", "scrollLeft");
            Table.checkOverflow("content", "scrollRight", "scrollLeft");
        });
    // checkOverflow();

   $(".mri_violations").click(function(e) {
        e.preventDefault();
        var submenu = $(this).attr('id');
        var form    = $('<form />', {
            "action" : "main.php?test_name=mri_violations&submenu="+submenu,
            "method" : "post"
        });
        var values = {
            "reset" : "true",
            "PatientName" : this.dataset.patientname,
            "SeriesUID"   : this.dataset.seriesuid,
            "filter" : "Show Data"
        }

        $.each(values, function(name, value) {
            $("<input />", {
                type: 'hidden',
                name: name,
                value: value
            }).appendTo(form);
        });

        form.appendTo('body').submit();
    });
});
$(window).resize(function(){
    Table.checkOverflow("content", "scrollRight", "scrollLeft");
    // checkOverflow();
});


// AJAX to get bar chart data
$.ajax({
    /*url: 'AjaxHelper.php?Module=mri_violations&script=get_mri_violation_chart_data.php',
    type: 'post',
    success: function(data) {
        //console.log("fetching violation data");
        var violationBarData = formatBarData(data);
        console.log(data);
        var violationBarLabels = data.labels;
        violationBarChart = c3.generate({
            bindto: '#violationBarChart',
            data: {
                columns: violationBarData,
                type: 'bar'
            },
            axis: {
                x: {
                    type : 'categorized',
                    categories: violationBarLabels
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
    }*/
});

function formatBarData(data) {
    "use strict";
    var processedData = new Array();
    var females = ['Female'];
    processedData.push(females.concat(data.datasets.female));
    var males = ['Male'];
    processedData.push(males.concat(data.datasets.male));
    return processedData;
}


// START DASHBOARD ....

/*global document: false, $: false*/

var scanLineChart, recruitmentPieChart, recruitmentBarChart, recruitmentLineChart;

// Colours for all charts broken down by only by site
var siteColours = [
    '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
    '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
    '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
];

// Colours for the recruitment bar chart: breakdown by gender
var genderColours = ['#2FA4E7', '#1C70B6'];

$(document).ready(function () {
    "use strict";
    // Turn on the tooltip for the progress bar - shows total male and female registered candidates
    $('.progress-bar').tooltip();

    // Make dashboard panels collapsible
    $('.panel-heading span.clickable').on("click", function () {
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
    $(".dropdown-menu a").click(function () {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().addClass("active");
        $($(this).parent().siblings().children("a")).each(function () {
            $(document.getElementById(this.getAttribute('data-target'))).addClass("hidden");
        });
        $(document.getElementById(this.getAttribute('data-target'))).removeClass("hidden");

        /* Make sure the chart variables are defined before resizing
         * They may not be defined on initial page load because they are created through
         * an AJAX request.
         */
        if (typeof recruitmentPieChart !== 'undefined') {
            recruitmentPieChart.resize();
        }
        if (typeof recruitmentBarChart !== 'undefined') {
            recruitmentBarChart.resize();
        }
        if (typeof recruitmentLineChart !== 'undefined') {
            recruitmentLineChart.resize();
        }
        if (typeof scanLineChart !== 'undefined') {
            scanLineChart.resize();
        }
    });

    $(".new-scans").click(function(e) {
        e.preventDefault();
        applyFilter('imaging_browser', {"Pending" : "PN"});
    });

    $(".radiological-review").click(function(e) {
        e.preventDefault();
        applyFilter('final_radiological_review', {"Review_done" : "no"});
    });

    $(".pending-accounts").click(function(e) {
        e.preventDefault();
        applyFilter('user_accounts', {"pending" : "Y"});
    });
});
