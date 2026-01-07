import {createRoot} from 'react-dom/client';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Recruitment from './widgets/recruitment';
import StudyProgression from './widgets/studyprogression';
import {fetchData} from './Fetch';
import Modal from 'Modal';
import Loader from 'Loader';

import {useTranslation} from 'react-i18next';

import '../css/WidgetIndex.css';

import {setupCharts, unloadCharts} from './widgets/helpers/chartBuilder';
import jaStrings from '../locale/ja/LC_MESSAGES/statistics.json';
import frStrings from '../locale/fr/LC_MESSAGES/statistics.json';

/**
 * WidgetIndex - the main window.
 *
 * @param  {object} props
 * @return {JSX.Element}
 */
const WidgetIndex = (props) => {
  const [recruitmentData, setRecruitmentData] = useState({});
  const [studyProgressionData, setStudyProgressionData] = useState({});
  const [modalChart, setModalChart] = useState(null);
  const {t, i18n} = useTranslation();
  useEffect( () => {
    i18n.addResourceBundle('ja', 'statistics', jaStrings);
    i18n.addResourceBundle('fr', 'statistics', frStrings);
  }, []);

  // used by recruitment.js and studyprogression.js to display each chart.
  const showChart = (section, chartID, chartDetails, setChartDetails) => {
    let {title, chartType, options} = chartDetails[section][chartID];
    return (
      <div
        className ="chart-card"
      >
        {/* Chart Title and Toggle */}
        <div className ='chart-header'>
          <h5 className ='chart-title'>{title}</h5>
          {Object.keys(chartDetails[section][chartID].options).length > 1 && (
            <div className ="chart-toggle-wrapper">
              {Object.entries(options).map(([key, value]) => (
                <button
                  key={key}
                  className={`chart-toggle-btn ${
                    chartType === value ? 'active' : ''
                  }`}
                  onClick={() => {
                    setChartDetails(
                      {
                        ...chartDetails,
                        [section]: {
                          ...chartDetails[section],
                          [chartID]: {
                            ...chartDetails[section][chartID],
                            chartType: value,
                          },
                        },
                      }
                    );
                    setupCharts(
                      t,
                      false,
                      {
                        [section]: {
                          [chartID]: {
                            ...chartDetails[section][chartID],
                            chartType: value,
                          },
                        },
                      },
                      t('Total', {ns: 'loris'}),
                    );
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Chart Canvas / Modal Trigger */}
        <div className ="chart-visual-wrapper">
          <a
            onClick ={() => {
              setModalChart(chartDetails[section][chartID]);
              setupCharts(
                t,
                true,
                {
                  [section]:
                  {[chartID]: chartDetails[section][chartID]},
                },
                t('Total', {ns: 'loris'}),
              );
            }}
            id ={chartID}
          >
            <Loader />
          </a>
        </div>
      </div>
    );
  };

  const downloadAsCSV = (data, filename, dataType, labelsLabel) => {
    const convertBarToCSV = (data) => {
      const csvRows = [];
      // Adding headers row
      const headers = [labelsLabel, ...Object.keys(data.datasets)];
      csvRows.push(headers.join(','));
      // Adding data rows
      const maxDatasetLength = Math.max(
        ...Object.values(data.datasets).map(
          (arr) => arr.length
        )
      );
      for (let i = 0; i < maxDatasetLength; i++) {
        const values = [`"${data.labels[i]}"` || '']; // Label for this row
        for (const datasetKey of Object.keys(data.datasets)) {
          const value = data.datasets[datasetKey][i];
          values.push(`"${value}"` || '');
        }
        csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
    };
    const convertPieToCSV = (data) => {
      const csvRows = [];
      const headers = Object.keys(data[0]);
      csvRows.push(headers.join(','));
      for (const row of data) {
        const values = headers.map(
          (header) => {
            const escapedValue = row[header].toString().replace(/"/g, '\\"');
            return `"${escapedValue}"`;
          }
        );
        csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
    };
    const convertLineToCSV = (data) => {
      const csvRows = [];
      // Adding headers row
      const headers = [
        t('Labels', {ns: 'statistics'}),
        ...data.datasets.map((dataset) => dataset.name),
      ];
      csvRows.push(headers.join(','));
      // Adding data rows
      for (let i = 0; i < data.labels.length; i++) {
        const values = [data.labels[i]]; // Label for this row
        for (const dataset of data.datasets) {
          values.push(dataset.data[i] || '');
        }
        csvRows.push(values.join(','));
      }
      return csvRows.join('\n');
    };
    let csvData = '';
    if (dataType == 'pie') {
      csvData = convertPieToCSV(data);
    } else if (dataType == 'bar') {
      csvData = convertBarToCSV(data);
    } else if (dataType == 'line') {
      csvData = convertLineToCSV(data);
    }
    const blob = new Blob([csvData], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // used by recruitment.js and studyprogression.js to update the filters for each chart.
  const updateFilters = (
    formDataObj,
    section,
    chartDetails,
    setChartDetails
  ) => {
    // Unload all charts in the section first
    unloadCharts(t, chartDetails, section);

    // Clear cached data from chartDetails to prevent old data from showing
    let clearedChartDetails = {...chartDetails};
    Object.keys(chartDetails[section]).forEach((chartID) => {
      clearedChartDetails[section][chartID] = {
        ...chartDetails[section][chartID],
        data: null,
        chartObject: null,
      };
    });
    setChartDetails(clearedChartDetails);

    let formObject = new FormData();
    for (const key in formDataObj) {
      if (formDataObj[key] != '' && formDataObj[key] != ['']) {
        formObject.append(key, formDataObj[key]);
      }
    }
    const queryString = '?' + new URLSearchParams(formObject).toString();
    let newChartDetails = {...clearedChartDetails};

    const chartPromises = [];
    Object.keys(chartDetails[section]).forEach(
      (chart) => {
        // update filters
        let newChart = {
          ...clearedChartDetails[section][chart],
          filters: queryString,
        };
        const chartPromise = setupCharts(
          t,
          false,
          {[section]: {[chart]: newChart}},
          t('Total', {ns: 'loris'}),
        ).then(
          (data) => {
            // update chart data
            newChartDetails[section][chart] = data[section][chart];
          }
        );
        chartPromises.push(chartPromise);
      }
    );

    Promise.all(chartPromises).then(() => {
      setChartDetails(newChartDetails);
    });
  };

  /**
   * Similar to componentDidMount and componentDidUpdate.
   */
  useEffect(
    () => {
      /**
       * setup - fetch recruitment and study progression data.
       *
       * @return {Promise<void>}
       */
      const setup = async () => {
        const data = await fetchData(
          `${props.baseURL}/Widgets`
        );
        setRecruitmentData(data);
        setStudyProgressionData(data);
      };
      setup().catch(
        (error) => {
          console.error(error);
        }
      );
    },
    []
  );

  /**
   * Renders the React component.
   *
   * @return {JSX.Element} - React markup for component.
   */
  return (
    <>
      <Modal
        show ={modalChart}
        onClose ={() => setModalChart(null)}
        width ={'1200px'}
        title ={modalChart && modalChart.title}
        throwWarning ={false}
      >
        <div
          style ={{
            margin: 'auto',
            display: 'flex',
          }}
        >
          <div
            style ={{
              margin: 'auto',
              display: 'flex',
            }}
            id ='dashboardModal'
          >
            <Loader />
          </div>
        </div>
        {modalChart && modalChart.chartType &&
            <a
              style ={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
              }}
              onClick ={() => {
                downloadAsCSV(
                  modalChart.data,
                  modalChart.title,
                  modalChart.dataType,
                  t('Labels', {ns: 'statistics'}),
                );
              }}
              className ='btn btn-info'>
              <span
                className ='glyphicon glyphicon-download'
                aria-hidden='true'/>
              {' '}{t('Download Data as CSV', {ns: 'loris'})}
            </a>
        }
        {modalChart
            && modalChart.chartType
            && modalChart.chartType !== 'line'
            && <a
              style ={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
              }}
              onClick ={() => {
                exportChartAsImage('dashboardModal');
              }}
              className ='btn btn-info'>
              <span
                className ='glyphicon glyphicon-download'
                aria-hidden ='true'
              />
              {' '}{t('Download as PNG', {ns: 'statistics'})}
            </a>
        }
      </Modal>
      <Recruitment
        data ={recruitmentData}
        baseURL ={props.baseURL}
        showChart ={showChart}
        updateFilters ={updateFilters}
      />
      <StudyProgression
        data ={studyProgressionData}
        baseURL ={props.baseURL}
        showChart ={showChart}
        updateFilters ={updateFilters}
      />
    </>
  );
};
WidgetIndex.propTypes = {
  baseURL: PropTypes.string,
};

/**
 * Render StatisticsIndex on page load.
 */
window.addEventListener(
  'load',
  () => {
    createRoot(
      document.getElementById('statistics_widgets')
    ).render(
      <WidgetIndex
        baseURL ={`${loris.BaseURL}/statistics`}
      />
    );
  }
);

/**
 * Helper function to export a chart as an image
 *
 * @param {string} chartId
 */
const exportChartAsImage = (chartId) => {
  const chartContainer = document.getElementById(chartId);

  if (!chartContainer) {
    console.error(`Chart with ID '${chartId}' not found.`);
    return;
  }

  // Get the SVG element that represents the chart
  const svgNode = chartContainer.querySelector('svg');

  // Clone the SVG node to avoid modifying the original chart
  const clonedSvgNode = svgNode.cloneNode(true);

  // Modify the font properties of the text elements
  const textElements = clonedSvgNode.querySelectorAll('text');
  textElements.forEach(
    (textElement) => {
      textElement.style.fontFamily = 'Arial, sans-serif';
      textElement.style.fontSize = '12px';
    }
  );

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Get the SVG as XML data
  const svgData = new XMLSerializer().serializeToString(clonedSvgNode);

  // Create an image that can be used as the source for the canvas
  const img = new Image();
  img.onload = () => {
    // Set the canvas size to match the chart's size
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0);

    // Export the canvas to a data URL
    const dataURL = canvas.toDataURL('image/png');

    // Create a link and trigger a download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'chart.png';
    link.click();

    // Clean up
    canvas.remove();
  };
  img.src =
  'data:image/svg+xml;base64,'
  + btoa(unescape(encodeURIComponent(svgData)));
};
