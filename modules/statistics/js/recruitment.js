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
            var m=data.datasets.male;
            var f=data.datasets.female;
            var females = ['Female'];
            processedData.push(females.concat(f));
            var males = ['Male'];
            processedData.push(males.concat(m));
            var totals=['Total'];
            for(var j=0; j<m.length; j++){
                var total=parseInt(m[j])+parseInt(f[j]);
                totals.push(total);
            }
            console.log(data)
            console.log(processedData)
            processedData.push(totals);
        }
        return processedData;
    }

    function maxYBar(data){
        var maxi=0;
        var m=data.datasets.male;
        var f=data.datasets.female;
        for(var j=0; j<m.length; j++){
            
            maxi=Math.max(parseInt(m[j])+parseInt(f[j]), maxi);
        }
        return maxi;
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
            recruitmentBarChart = c3.generate({
                bindto: '#recruitmentBarChart',
                data: {
                    columns: recruitmentBarData,
                    type: 'bar',
                    groups: ['Male', 'Female', 'Total']
                },
                axis: {
                    x: {
                        type : 'categorized',
                        categories: recruitmentBarLabels
                    },
                    y: {
                        max: maxYBar(data),
                        label: 'Candidates registered'
                    }
                },
                color: {
                    pattern: sexColours
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
