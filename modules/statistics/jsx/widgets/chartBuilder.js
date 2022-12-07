/* eslint-disable */
/**
 * process -
 */
function process() {
  console.log('test start');
  console.log('test 0');
  const baseURL = window.location.origin;
  // AJAX to get recruitment line chart data
  const apiScanLineData =
    `${baseURL}/statistics/charts/scans_bymonth`;
  const apiScanLineDataRecruitment =
    `${baseURL}/statistics/charts/siterecruitment_line`;
  // AJAX to get pie chart data
  const apiRecruitmentPieData =
    `${baseURL}/statistics/charts/siterecruitment_pie`;
  // AJAX to get bar chart data
  const apiRecruitmentBarData =
    `${baseURL}/statistics/charts/siterecruitment_bysex`;
  let scanLineChart;
  let recruitmentPieChart;
  let recruitmentBarChart;
  let recruitmentLineChart;

  // Colours for all charts broken down by only by site
  const siteColours = [
    '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
    '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
    '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
  ];
  // Colours for the recruitment bar chart: breakdown by sex
  const sexColours = ['#2FA4E7', '#1C70B6'];

  // Turn on the tooltip for the progress bar - shows total
  // male and female registered candidates
  $('.progress-bar').tooltip();

  // Open the appropriate charts from the "views" dropdown menus
  $('.dropdown-menu a').click(function() {
    $(this).parent().siblings().removeClass('active');
    $(this).parent().addClass('active');
    $($(this).parent().siblings().children('a')).each(function() {
      $(document.getElementById(
        this.getAttribute('data-target'))
      ).addClass('hidden');
    });
    $(document.getElementById(
      this.getAttribute('data-target'))
    ).removeClass('hidden');

    /* Make sure the chart variables are defined before resizing
     * They may not be defined on initial page load because
     * they are created through an AJAX request.
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

  /**
   * applyFilter
   * @param {string} testName
   * @param {object} filters
   */
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

  /**
   * formatPieData
   * @param {object} data
   * @return {*[]}
   */
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

  /**
   * formatBarData
   * @param {object} data
   * @return {*[]}
   */
  function formatBarData(data) {
    'use strict';
    const processedData = [];
    if (data['datasets']) {
      const females = ['Female'];
      processedData.push(females.concat(data['datasets']['female']));
    }
    if (data['datasets']) {
      const males = ['Male'];
      processedData.push(males.concat(data['datasets']['male']));
    }
    return processedData;
  }

  /**
   * formatLineData
   * @param {object} data
   * @return {*[]}
   */
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
    const totals = [];
    totals.push('Total');
    for (let j=0; j<data.datasets[0].data.length; j++){
      let total = 0;
      for (let i=0; i<data.datasets.length; i++){
        total += parseInt(data.datasets[i].data[j]);
      }
      totals.push(total);
    }
    processedData.push(totals);
    return processedData;
  }

  /**
   * maxY
   * @param {object} data
   * @return {number}
   */
  function maxY(data){
    let maxi = 0;
    for(let j=0; j < data.datasets[0].data.length; j++){
      for(let i=0; i<data.datasets.length; i++){
        maxi = Math.max(maxi,parseInt(data.datasets[i].data[j]));
      }
    }
    return maxi;
  }

  // Updated AJAX to get scan line chart data
  fetch(
    apiScanLineData,
    {
      credentials: 'same-origin',
    }
  ).then((response) => response.json())
    .then(
      (data) => {
        let legendNames = [];
        for (let j=0; j < data.datasets.length; j++) {
          legendNames.push(data.datasets[j].name);
        }
        const scanLineData = formatLineData(data);
        scanLineChart = c3.generate({
          size: {
            height: '100%',
          },
          bindto: '#scanChart',
          data: {
            x: 'x',
            xFormat: '%m-%Y',
            columns: scanLineData,
            type: 'area-spline',
          },
          legend: {
            show: false,
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%m-%Y',
              },
            },
            y: {
              max: maxY(data),
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
        d3.select('.scanChartLegend')
          .insert('div', '.scanChart')
          .attr('class', 'legend')
          .selectAll('div').data(legendNames).enter()
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
            $(this).toggleClass('c3-legend-item-hidden')
            scanLineChart.toggle(id);
          });
      })
    .catch((error) => {
      console.error(error);
    });

  // AJAX to get pie chart data
  console.log('test 1 ');
  fetch(
    apiRecruitmentPieData,
    {
      credentials: 'same-origin',
    }
  ).then((response) => response.json())
    .then(
      (data) => {
        console.log('test');
        const recruitmentPieData = formatPieData(data);
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
    .catch((error) => {
      console.error(error);
    });

  // AJAX to get bar chart data
  fetch(
    apiRecruitmentBarData,
    {
      credentials: 'same-origin',
    }
  ).then((response) => response.json())
    .then(
      (data) => {
        const recruitmentBarData = formatBarData(data);
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
    .catch((error) => {
      console.error(error);
    });

  // AJAX to get recruitment line chart data
  fetch(
    apiScanLineDataRecruitment,
    {
      credentials: 'same-origin',
    }
  ).then((response) => response.json())
    .then(
      (data) => {
        let legendNames = [];
        for (let j=0; j < data.datasets.length; j++) {
          legendNames.push(data.datasets[j].name);
        }
        const recruitmentLineData = formatLineData(data);
        recruitmentLineChart = c3.generate({
          size: {
            height: '100%',
          },
          bindto: '#recruitmentChart',
          data: {
            x: 'x',
            xFormat: '%m-%Y',
            columns: recruitmentLineData,
            type: 'area-spline',
          },
          legend: {
            show: false,
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%m-%Y',
              },
            },
            y: {
              max: maxY(data),
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
        d3.select('.recruitmentChartLegend')
          .insert('div', '.recruitmentChart')
          .attr('class', 'legend')
          .selectAll('div').data(legendNames).enter()
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
            $(this).toggleClass('c3-legend-item-hidden')
            recruitmentLineChart.toggle(id);
          });
      })
    .catch((error) => {
      console.error(error);
    });
}

export {
  process,
};
