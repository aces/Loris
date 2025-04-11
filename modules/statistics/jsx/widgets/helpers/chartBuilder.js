/* eslint-disable */
import 'c3/c3.min.css';
import c3 from 'c3';
import {fetchData} from '../../Fetch';

const baseURL = window.location.origin;

// Colours for all charts broken down by only by site
const siteColours = [
  '#F0CC00', '#27328C', '#2DC3D0', '#4AE8C2', '#D90074', '#7900DB', '#FF8000',
  '#0FB500', '#CC0000', '#DB9CFF', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2',
  '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
];

// Colours for the recruitment bar chart: breakdown by sex
const sexColours = ['#2FA4E7', '#1C70B6'];

/**
 * onload - override link click to cancel any fetch for statistical data.
 */
window.onload = () => {
  document.body.addEventListener('click', (e) => {
    // User clicks on a link..
    if (
      e.target &&
      e.target.nodeName === 'A' &&
      e.target.hasAttribute('data-target') === false
    ) {
      window.stop();
    } else if (
      e.target &&
      e.target.nodeName === 'A' &&
      e.target.hasAttribute('data-target') === true
    ) {
      const myTimeout = setTimeout(() => {
        resizeGraphs();
        clearTimeout(myTimeout);
      }, 500);
    }
  });
};

let charts = []
const resizeGraphs = () => {
  charts.forEach((chart) => {
    if (chart !== undefined) {
      elementVisibility(chart.element, (visible) => {
        if (visible) {
          chart.resize();
        }
      })
    }
  })
};

/**
 * elementVisibility - used to resize charts when element becomes visible.
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
 * @param {object} data
 * @return {[]}
 */
const formatPieData = (data) => {
  const processedData = [];
  for (const [i] of Object.entries(data)) {
    const siteData = [data[i].label, data[i].total];
    processedData.push(siteData);
  }
  return processedData.filter((item) => item[1] > 0);
};

/**
 * formatBarData - used for the recruitment widget
 * @param {object} data
 * @return {[]}
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

const createPieChart = (columns, id, targetModal, colours) => {
  let newChart = c3.generate({
    bindto: targetModal ? targetModal : id,
    data: {
      columns: columns,
      type: 'pie',
    },
    size: {
      height: targetModal ? 700 : 350,
      width: targetModal ? 700 : 350,
    },
    color: {
      pattern: colours,
    },
    pie: {
      label: {
        format: function(value, ratio, id) {
          return value + "("+Math.round(100*ratio)+"%)";
        }
      }
    },
  });
  charts.push(newChart);
  resizeGraphs();
}

const createBarChart = (labels, columns, id, targetModal, colours, dataType) => {
  let newChart = c3.generate({
    bindto: targetModal ? targetModal : id,
    data: {
      x: dataType == 'pie' && 'x',
      columns: columns,
      type: 'bar',
      colors: dataType === 'pie' ? {
          [columns[1][0]]: function (d) {
            return colours[d.index];
          }
        } :
        {
          [columns[0][0]]: colours[0],
          [columns[1][0]]: colours[1],
        }
    },
    size: {
      width: targetModal ? 1000 : 700,
      height: targetModal ? 700 : 350,
    },
    axis: {
      x: {
        type: 'category',
        categories: labels, 
      },
      y: {
        label: {
          text: 'Candidates registered',
          position: 'inner-top'
        },
      },
    },
    color: {
      pattern: colours,
    },
    legend: dataType === 'bar' ? {
      position: 'inset',
      inset: {
        anchor: 'top-right',
        x: 20,
        y: 10,
        step: 2
      }
    } : {
      show: false
    }
  });
  charts.push(newChart);
  resizeGraphs();
}

const createLineChart = (data, columns, id, label, targetModal) => {
  let newChart = c3.generate({
    size: {
      height: targetModal && 1000,
      width: targetModal && 1000
    },
    bindto: targetModal ? targetModal : id,
    data: {
      x: 'x',
      xFormat: '%m-%Y',
      columns: columns,
      type: 'area-spline',
    },
    legend: {
      show: targetModal ? true : false,
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%m-%Y',
          rotate: -65,
          multiline: true,
        },
      },
      y: {
        max: maxY(data),
        label: label,
      },
    },
    zoom: {
      enabled: true,
    },
    color: {
      pattern: siteColours,
    },
    tooltip: {
      // hide if 0
      contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
        let $$ = this,
          config = $$.config,
          titleFormat = config.tooltip_format_title || defaultTitleFormat,
          nameFormat = config.tooltip_format_name || function (name) { return name; },
          valueFormat = config.tooltip_format_value || defaultValueFormat,
          text, i, title, value, name, bgcolor;
        for (i = 0; i < d.length; i++) {
          if (d[i] && d[i].value == 0) { continue; }

          if (! text) {
            title = titleFormat ? titleFormat(d[i].x) : d[i].x;
            text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
          }

          name = nameFormat(d[i].name);
          value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
          bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

          text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
          text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
          text += "<td class='value'>" + value + "</td>";
          text += "</tr>";
        }
        return text + "</table>";
      }

    }
  });
  charts.push(newChart);
  resizeGraphs();
}

const getChartData = async (target, filters) => {
  let query = `${baseURL}/statistics/charts/${target}`
  if (filters) {
    query = query + filters;
  }
  return await fetchData(query);
}

/**
 * setupCharts - fetch data for charts
 * If data is provided, use that instead of fetching
 * There are three types of data provided. Pie, bar and line
 * This is determined by the original chart type of the data provided from the API
 * If data was provided as a Pie, and the requested chartType is Bar, then the data will be reformatted
 */
const setupCharts = async (targetIsModal, chartDetails) => {
  const chartPromises = [];
  let newChartDetails = {...chartDetails}
  Object.keys(chartDetails).forEach((section) => {
    Object.keys(chartDetails[section]).forEach((chartID) => {
      let chart = chartDetails[section][chartID];
      let data = chart.data;
      const chartPromise = (data && !chart.filters ? Promise.resolve(data) : getChartData(chartID, chart.filters))
        .then((chartData) => {
          let columns = {};
          let labels = [];
          let colours = [];
          if (chart.dataType === 'pie') {
            columns = formatPieData(chartData);
            colours = siteColours;
            // reformating the columns for a bar chart when it was originally pie data
            if (chart.chartType == 'bar') {
              let newColumns = [['x'], [chart.label]];
              columns.forEach((column, index) => {
                newColumns[0].push(column[0]);
                newColumns[1].push(column[1]);
                labels.push(column[0]);
              });
              columns = newColumns;
            }
          } else if (chart.dataType === 'bar') {
            columns = formatBarData(chartData);
            labels = chartData.labels;
            colours = sexColours;
          } else if (chart.dataType === 'line') {
            columns = formatLineData(chartData);
            if (chart.chartType !== 'line') {
              // remove first and last (x and total)
              columns = columns.slice(1, columns.length - 1);
            }
          }
          if (chart.chartType === 'pie') {
            createPieChart(columns, `#${chartID}`, targetIsModal && '#dashboardModal', colours);
          } else if (chart.chartType === 'bar') {
            createBarChart(labels, columns, `#${chartID}`, targetIsModal && '#dashboardModal', colours, chart.dataType);
          } else if (chart.chartType === 'line') {
            createLineChart(chartData, columns, `#${chartID}`, chart.label, targetIsModal && '#dashboardModal');
          }
          newChartDetails[section][chartID].data = chartData;
        });

      chartPromises.push(chartPromise);
    });
  });

  await Promise.all(chartPromises);
  return newChartDetails;
};

/**
 * formatLineData - used for the study progression widget
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

export {
  // following used by WidgetIndex.js,
  // recruitment.js and studyProgression.js
  setupCharts,
};