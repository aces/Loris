function process() {
  $(document).ready(function() {
    let scanLineChart;
    let recruitmentPieChart;
    let recruitmentBarChart;
    let recruitmentLineChart;

    // Colours for all charts broken down by only by site
    const siteColours = [
      '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
      '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
      '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
    ];

    // Colours for the recruitment bar chart: breakdown by sex
    const sexColours = ['#2FA4E7', '#1C70B6'];

    $(document).ready(function() {
      'use strict';
      // Turn on the tooltip for the progress bar - shows total male and female registered candidates
      $('.progress-bar').tooltip();

      // Open the appropriate charts from the "views" dropdown menus
      $('.dropdown-menu a').click(function() {
        $(this).parent().siblings().removeClass('active');
        $(this).parent().addClass('active');
        $($(this).parent().siblings().children('a')).each(function() {
          $(document.getElementById(this.getAttribute('data-target'))).addClass('hidden');
        });
        $(document.getElementById(this.getAttribute('data-target'))).removeClass('hidden');

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

      $('.new-scans').click(function(e) {
        e.preventDefault();
        applyFilter('imaging_browser', {'Pending': 'PN'});
      });

      $('.pending-accounts').click(function(e) {
        e.preventDefault();
        applyFilter('user_accounts', {'pending': 'Y'});
      });
    });

    function applyFilter(testName, filters) {
      const form = $('<form />', {
        'action': loris.BaseURL + '/' + testName + '/',
        'method': 'post',
      });

      const values = {
        'reset': 'true',
        'filter': 'Show Data',
      };

      $.extend(values, filters);

      $.each(values, function(name, value) {
        $('<input />', {
          type: 'hidden',
          name: name,
          value: value,
        }).appendTo(form);
      });

      form.appendTo('body').submit();
    }

    function formatPieData(data) {
      'use strict';
      const processedData = [];
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const siteData = [data[i].label, data[i].total];
          processedData.push(siteData);
        }
      }
      return processedData;
    }

    function formatBarData(data) {
      'use strict';
      const processedData = [];
      const females = ['Female'];
      if (data.datasets) {
        processedData.push(females.concat(data.datasets.female));
      }
      const males = ['Male'];
      if (data.datasets) {
        processedData.push(males.concat(data.datasets.male));
      }
      return processedData;
    }

    function formatLineData(data) {
      'use strict';
      const processedData = [];
      const labels = [];
      labels.push('x');
      for (const i in data.labels) {
        if (data.labels.hasOwnProperty(i)) {
          labels.push(data.labels[i]);
        }
      }
      processedData.push(labels);
      for (const i in data.datasets) {
        if (data.datasets.hasOwnProperty(i)) {
          const dataset = [];
          dataset.push(data.datasets[i].name);
          processedData.push(dataset.concat(data.datasets[i].data));
        }
      }
      return processedData;
    }

    /**
     * Used with sending POST data to the server.
     * @param {object} json - json object converted for POST.
     * @return {string} send in POST to server.
     */
    function urlSearchParams(json) {
      return Object.keys(json).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      }).join('&');
    }


    // Updated AJAX to get scan line chart data
    fetch(
      window.location.origin + '/dashboard/AjaxChartHelper', {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlSearchParams({
          command: 'get_scan_line_data',
        }),
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          const scanLineData = formatLineData(data.scanData);
          scanLineChart = c3.generate({
            bindto: '#scanChart',
            data: {
              x: 'x',
              xFormat: '%m-%Y',
              columns: scanLineData,
              type: 'area-spline',
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%m-%Y',
                },
              },
              y: {
                label: 'Scans',
              },
            },
            zoom: {
              enabled: true,
            },
            color: {
              pattern: siteColours,
            },
          });
        })
      .catch(
        (error) => {
          console.error(error);
        });

    // AJAX to get pie chart data
    fetch(
      window.origin + '/dashboard/AjaxChartHelper', {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlSearchParams({
          command: 'get_recruitment_pie_data',
        }),
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          const jsonData = data.recruitmentBySiteData;
          const recruitmentPieData = formatPieData(jsonData);
          recruitmentPieChart = c3.generate({
            bindto: '#recruitmentPieChart',
            data: {
              columns: recruitmentPieData,
              type: 'pie',
            },
            color: {
              pattern: siteColours,
            },
          });
        })
      .catch(
        (error) => {
          console.error(error);
        });

    // AJAX to get bar chart data
    fetch(
      window.origin + '/dashboard/AjaxChartHelper', {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlSearchParams({
          command: 'get_recruitment_bar_data',
        }),
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          const recruitmentBarData = formatBarData(data.sexData);
          const recruitmentBarLabels = data.labels;
          recruitmentBarChart = c3.generate({
            bindto: '#recruitmentBarChart',
            data: {
              columns: recruitmentBarData,
              type: 'bar',
            },
            axis: {
              x: {
                type: 'categorized',
                categories: recruitmentBarLabels,
              },
              y: {
                label: 'Candidates registered',
              },
            },
            color: {
              pattern: sexColours,
            },
          });
        })
      .catch(
        (error) => {
          console.error(error);
        });

    // AJAX to get recruitment line chart data
    fetch(
      window.origin + '/dashboard/AjaxChartHelper', {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlSearchParams({
          command: 'get_scan_line_data',
        }),
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          const recruitmentLineData = formatLineData(data);
          recruitmentLineChart = c3.generate({
            bindto: '#recruitmentChart',
            data: {
              x: 'x',
              xFormat: '%m-%Y',
              columns: recruitmentLineData,
              type: 'area-spline',
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%m-%Y',
                },
              },
              y: {
                label: 'Candidates registered',
              },
            },
            zoom: {
              enabled: true,
            },
            color: {
              pattern: siteColours,
            },
          });
        })
      .catch(
        (error) => {
          console.error(error);
        });
  });
}

export {
  process,
};
