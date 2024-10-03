import 'c3/c3.min.css';
import c3 from 'c3';
import {select} from 'd3';
import {fetchData} from '../Fetch';

const baseURL = window.location.origin;

// Charts
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

/**
 * elementVisibility - used to resize charts when element becomes visible.
 *
 * @param {HTMLElement} element
 * @param {function} callback
 */
const elementVisibility = (element, callback) => {
  const options = {
    root: document.documentElement,
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      callback(entry.intersectionRatio > 0);
    });
  }, options);
  observer.observe(element);
};

/**
 * formatPieData - used for the recruitment widget
 *
 * @param {object} data
 * @return {*[]}
 */
const formatPieData = (data) => {
  const processedData = [];
  for (const [i] of Object.entries(data)) {
    const siteData = [data[i].label, data[i].total];
    processedData.push(siteData);
  }
  return processedData;
};

/**
 * formatBarData - used for the recruitment widget
 *
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
 * formatLineData - used for the study progression widget
 *
 * @param {object} data
 * @return {*[]}
 */
const formatLineData = (data) => {
  const processedData = [];
  const labels = [];
  labels.push('x');
  for (const [i] of Object.entries(data.labels)) {
    labels.push(data.labels[i]);
  }
  processedData.push(labels);
  for (const [i] of Object.entries(data['datasets'])) {
    const dataset = [];
    dataset.push(data['datasets'][i].name);
    processedData.push(dataset.concat(data['datasets'][i].data));
  }
  const totals = [];
  totals.push('Total');
  for (let j = 0; j < data['datasets'][0].data.length; j++) {
    let total = 0;
    for (let i = 0; i < data['datasets'].length; i++) {
      total += parseInt(data['datasets'][i].data[j]);
    }
    totals.push(total);
  }
  processedData.push(totals);
  return processedData;
};

/**
 * maxY - used for the study progression widget
 *
 * @param {object} data
 * @return {number}
 */
const maxY = (data) => {
  let maxi = 0;
  for (let j = 0; j < data['datasets'][0].data.length; j++) {
    for (let i = 0; i < data['datasets'].length; i++) {
      maxi = Math.max(maxi, parseInt(data['datasets'][i].data[j]));
    }
  }
  return maxi;
};

/**
 * recruitmentCharts - fetch data for recruitments
 */
const recruitmentCharts = async () => {
  // fetch data for the pie chart.
  let data = await fetchData(
    `${baseURL}/statistics/charts/siterecruitment_pie`,
  );
  const recruitmentPieData = formatPieData(data);
  recruitmentPieChart = c3.generate({
    bindto: '#recruitmentPieChart',
    size: {
      width: 227,
    },
    data: {
      columns: recruitmentPieData,
      type: 'pie',
    },
    color: {
      pattern: siteColours,
    },
  });
  elementVisibility(recruitmentPieChart.element, (visible) => {
    if (visible) {
      recruitmentPieChart.resize();
    }
  });

  // fetch data for the bar chart.
  data = await fetchData(
    `${baseURL}/statistics/charts/siterecruitment_bysex`,
  );
  const recruitmentBarData = formatBarData(data);
  const recruitmentBarLabels = data.labels;
  recruitmentBarChart = c3.generate({
    bindto: '#recruitmentBarChart',
    size: {
      width: 461,
    },
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
  elementVisibility(recruitmentBarChart.element, (visible) => {
    if (visible) {
      recruitmentBarChart.resize();
    }
  });
};

/**
 * studyProgressionCharts - fetch data for study progression
 */
const studyProgressionCharts = async () => {
  // fetch data for the line chart.
  let data = await fetchData(
    `${baseURL}/statistics/charts/scans_bymonth`,
  );
  let legendNames = [];
  for (let j = 0; j < data['datasets'].length; j++) {
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
    spline: {
      interpolation: {
        type: 'monotone',
      },
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
        'background-color', scanLineChart.color(id),
      );
    })
    .on('mouseover', function(id) {
      scanLineChart.focus(id);
    })
    .on('mouseout', function(id) {
      scanLineChart.revert();
    })
    .on('click', function(id) {
      scanLineChart.toggle(id);
    });
  elementVisibility(scanLineChart.element, (visible) => {
    if (visible) {
      scanLineChart.resize();
    }
  });
  // scanLineChart.resize();

  // fetch data for the line chart.
  data = await fetchData(
    `${baseURL}/statistics/charts/siterecruitment_line`,
  );
  legendNames = [];
  for (let j = 0; j < data['datasets'].length; j++) {
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
    spline: {
      interpolation: {
        type: 'monotone',
      },
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
      recruitmentLineChart.toggle(id);
    });
  elementVisibility(recruitmentLineChart.element, (visible) => {
    if (visible) {
      recruitmentLineChart.resize();
    }
  });
  // recruitmentLineChart.resize();
};

export {
  recruitmentCharts,
  studyProgressionCharts,
};
