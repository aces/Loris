import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';

/**
 * Dashboard.
 *
 * @description the dashboard of LORIS.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // Bind component instance to custom methods
    this.fetchInitializerData = this.fetchInitializerData.bind(this);
  }

  /**
   * Executes after component mounts.
   */
  componentDidMount() {
    this.fetchInitializerData();
  }

  /**
   * Retrieve data from the provided URL and save it in state.
   */
  fetchInitializerData() {
    const url = this.props.dataURL + '/dashboard/AjaxDashboard';

    fetch(
      url, {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'include',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: send,
      }
    ).then((response) => response.json())
      .then(
        (data) => {
          console.log(data);
          this.setState({isLoaded: true});
        })
      .catch(
        (error) => {
          console.log(error);
          this.setState({isLoaded: true});
    });
  }

  /**
   * @return {DOMRect}
   */
  render() {
    // Waiting for async data to load.
    if (!this.state.isLoaded) {
      return <Loader/>;
    }
    if (!this.state.success) {
      return (
        <div>
          hello world
        </div>
      );
    }
  }
}
Dashboard.propTypes = {
  dataURL: PropTypes.string,
};

/**
 * Render create_timepoint on page load.
 */
window.addEventListener('load', () => {
  ReactDOM.render(
    <Dashboard
      dataURL={`${loris.BaseURL}/dashboard/AjaxDashboard`}
    />,
    document.getElementById('lorisworkspace')
  );
});
