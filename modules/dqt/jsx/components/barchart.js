import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

const BarChart = (props) => {
  const formatBarChartData = (data) => {
    let processedData = [];
    if (data.datasets) {
      let females = ['Female'];
      processedData.push(females.concat(data.datasets.female));
      let males = ['Male'];
      processedData.push(males.concat(data.datasets.male));
    }
    return processedData;
  };

  useEffect(() => {
    let barChartData = formatBarChartData(props.data);
    c3.generate({
      size: {
        height: props.height,
        width: props.width,
      },
      bindto: `#${props.id}`,
      data: {
        columns: barChartData,
        type: 'bar',
      },
      axis: {
        x: {
          type: 'categorized',
          categories: props.data.labels,
        },
        y: {
          label: 'Candidates registered',
          show: false,
        },
      },
      color: {
        pattern: props.pattern,
      },
    });
  }, []);

  return (props.data) ? (
    <div id={props.id}
         style={props.style}
    />
  ) : (
    <>
    </>
  );
};
BarChart.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
  pattern: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number,
};
BarChart.defaultProps = {
  pattern: [
    '#f4e2f0', '#0c6db0',
  ],
  width: 400,
  height: 200,
};

export default BarChart;
