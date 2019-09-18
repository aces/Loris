import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';

/**
 * Genomic Browser.
 *
 * @description the Genomic Browser of LORIS.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class GenomicBrowser extends React.Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  /**
   * Executes after component mounts.
   */
  componentDidMount() {
    // this.fetchInitializerData();
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    return (
      <div>
        hello world.
      </div>
    );
  }
}
GenomicBrowser.propTypes = {
  dataURL: PropTypes.string,
};

/**
 * Render dashboard on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <GenomicBrowser
      dataURL={`${loris.BaseURL}/genomic_browser/AjaxGenomicBrowser`}
    />,
    document.getElementById('lorisworkspace')
  );
});
