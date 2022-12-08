/* eslint-disable */

import c3 from 'c3';
import {select} from 'd3';

const baseURL = window.location.origin;
// API - requests to server.
const API = {
  scanLineData: `${baseURL}/statistics/charts/scans_bymonth`,
  scanLineDataRecruitment: `${baseURL}/statistics/charts/siterecruitment_line`,
  recruitmentPieData: `${baseURL}/statistics/charts/siterecruitment_pie`,
  recruitmentBarData: `${baseURL}/statistics/charts/siterecruitment_bysex`,
};
// Charts
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

/**
 * applyFilter
 * @param {string} testName
 * @param {object} filters
 */
const applyFilter = (testName, filters) => {
  const form = $('<form />', {
    'action': baseURL + '/' + testName + '/',
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
};

/**
 * formatPieData
 * @param {object} data
 * @return {*[]}
 */
const formatPieData = (data) => {
  const processedData = [];
  for (const i in data) {
    if (data.hasOwnProperty(i)) {
      const siteData = [data[i].label, data[i].total];
      processedData.push(siteData);
    }
  }
  return processedData;
};

/**
 * formatBarData
 * @param {object} data
 * @return {*[]}
 */
const formatBarData = (data) => {
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
};

/**
 * formatLineData
 * @param {object} data
 * @return {*[]}
 */
const formatLineData = (data) => {
  const processedData = [];
  const labels = [];
  labels.push('x');
  for (const i in data.labels) {
    if (data.labels.hasOwnProperty(i)) {
      labels.push(data.labels[i]);
    }
  }
  processedData.push(labels);
  for (const i in data['datasets']) {
    if (data['datasets'].hasOwnProperty(i)) {
      const dataset = [];
      dataset.push(data['datasets'][i].name);
      processedData.push(dataset.concat(data['datasets'][i].data));
    }
  }
  const totals = [];
  totals.push('Total');
  for (let j=0; j<data['datasets'][0].data.length; j++){
    let total = 0;
    for (let i=0; i<data['datasets'].length; i++){
      total += parseInt(data['datasets'][i].data[j]);
    }
    totals.push(total);
  }
  processedData.push(totals);
  return processedData;
};

/**
 * maxY
 * @param {object} data
 * @return {number}
 */
const maxY = (data) => {
  let maxi = 0;
  for(let j=0; j < data['datasets'][0].data.length; j++){
    for(let i=0; i<data['datasets'].length; i++){
      maxi = Math.max(maxi, parseInt(data.datasets[i].data[j]));
    }
  }
  return maxi;
};

/**
 * process - the chartBuilding for the widgets.
 */
function process() {
  // Updated AJAX to get scan line chart data
  fetch(
    API.scanLineData,
    {
      credentials: 'same-origin',
    }
  ).then((response) => response.json())
    .then(
      (data) => {
        let legendNames = [];
        for (let j=0; j < data['datasets'].length; j++) {
          legendNames.push(data['datasets'][j].name);
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
        select('.scanChartLegend')
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
            select(this).select('span').style(
              'background-color', scanLineChart.color(id)
            );
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
        scanLineChart.resize();
      }).catch((error) => {
        console.error(error);
      });

  // AJAX to get pie chart data
  fetch(
    API.recruitmentPieData,
    {
      credentials: 'same-origin',
    }
  ).then((response) => response.json())
    .then(
      (data) => {
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
        recruitmentPieChart.resize();
      }).catch((error) => {
        console.error(error);
      });

  // AJAX to get bar chart data
  fetch(
    API.recruitmentBarData,
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
        recruitmentBarChart.resize();
      }).catch((error) => {
        console.error(error);
      });

  // AJAX to get recruitment line chart data
  fetch(
    API.scanLineDataRecruitment,
    {
      credentials: 'same-origin',
    }
  ).then((response) => response.json())
    .then(
      (data) => {
        let legendNames = [];
        for (let j=0; j < data['datasets'].length; j++) {
          legendNames.push(data['datasets'][j].name);
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
        select('.recruitmentChartLegend')
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
            select(this).select('span').style(
              'background-color',
              recruitmentLineChart.color(id));
          })
          .on('mouseover', function(id) {
            recruitmentLineChart.focus(id);
          })
          .on('mouseout', function(id) {
            recruitmentLineChart.revert();
          })
          .on('click', function(id) {
            $(this).toggleClass('c3-legend-item-hidden');
            recruitmentLineChart.toggle(id);
          });
        recruitmentLineChart.resize();
      }).catch((error) => {
        console.error(error);
      });

  // Turn on the tooltip for the progress bar - shows total
  // male and female registered candidates
  $('.progress-bar').tooltip();

  $('.new-scans').click(function(e) {
    e.preventDefault();
    applyFilter('imaging_browser', {'Pending': 'PN'});
  });

  $('.pending-accounts').click(function(e) {
    e.preventDefault();
    applyFilter('user_accounts', {'pending': 'Y'});
  });
}

export {
  process,
};
