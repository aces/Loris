$(document).ready(function() {
    // Colours for all charts broken down by only by site
    var siteColours = [
        '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
        '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
        '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
    ];
    // Colours for the recruitment bar chart: breakdown by sex
    var sexColours = ['#2FA4E7', '#1C70B6'];
    $('.progress-bar').tooltip();

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
    });

    function formatPieData(data) {
        "use strict";
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
        if (data.datasets) {
            var females = ['Female'];
            processedData.push(females.concat(data.datasets.female));
            var males = ['Male'];
            processedData.push(males.concat(data.datasets.male));
        }
        return processedData;
    }
    // AJAX to get pie chart data
    $.ajax({
        url: loris.BaseURL + '/statistics/charts/siterecruitment_pie',
        type: 'get',
        success: function(jsonData) {
            var recruitmentPieData = formatPieData(jsonData);
            recruitmentPieChart = c3.generate({
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
        url: loris.BaseURL + '/statistics/charts/siterecruitment_bysex',
        type: 'get',
        success: function(data) {
            var recruitmentBarData = formatBarData(data);
                var recruitmentBarLabels = data.labels;
                var branches_canvas = document.getElementById('#recruitmentBarChart')
                                              .getContext('2d');
                var branches = new Chart(branches_canvas, {
                    type: 'bar',
                    data: {
                        labels: recruitmentBarLabels,
                        datasets: [
                        {
                            label: recruitmentBarData[1][0],
                            data: recruitmentBarData[1].slice(1),
                            backgroundColor: sexColours[1],
                            categoryPercentage: 0.6

                        },
                        {
                            label: recruitmentBarData[0][0],
                            data: recruitmentBarData[0].slice(1),
                            backgroundColor: sexColours[0],
                            categoryPercentage: 0.8
                        }
                    ],
                    },
                    options: {
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    afterBody: 
                                    (ttItem) => (`Total: 
                                        ${ttItem.reduce((acc, val) => 
                                            ((acc-'0') + (val.raw-'0')), 0)}`)
                                },
                                mode: 'index'
                            },
                        },
                        scales: {
                            x: {
                                stacked: true,
                            },
                            y: {
                                ticks: { beginAtZero:false },
                                stacked: false,
                                autoSkip:true,
                                lineHeight:2
                            }
                        },
                        aspectRatio: 0.9
                    }
                });
        },
        error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError:" + err);
        }
    });
}
);
