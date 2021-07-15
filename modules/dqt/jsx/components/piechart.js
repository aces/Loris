import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

const PieChart = (props) => {
  const formatPieChartData = (data) => {
    let processedData = [];
    for (let i in data) {
      if (data.hasOwnProperty(i)) {
        const siteData = [data[i].label, data[i].total];
        processedData.push(siteData);
      }
    }
    return processedData;
  };

  useEffect(() => {
    let pieChartData = formatPieChartData(props.data);
    c3.generate({
      size: {
        height: props.height,
        width: props.width,
      },
      bindto: `#${props.id}`,
      data: {
        columns: pieChartData,
        type: 'pie',
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
PieChart.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
  pattern: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number,
  style: PropTypes.object,
};
PieChart.defaultProps = {
  pattern: [
    '#f4e2f0', '#0c6db0',
  ],
  width: 200,
  height: 200,
};

export default PieChart;
