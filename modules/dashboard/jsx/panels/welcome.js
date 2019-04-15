import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Welcome Panel.
 *
 * @description panel for dashboard.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Welcome extends Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
  }

  /**
   * @return {DOMRect}
   */
  render() {
    if (this.props.display) {
      let links = []; // links to render.
      for (let i =0; i<this.props.data.links.length; i++) {
        links.push(
          (
            <div key={'link_' + i}>
              <a href={this.props.data.links[i].url}
                 target={this.props.data.links[i].windowName}>
                {this.props.data.links[i].label}
              </a>
              &nbsp;|
            </div>
          )
        );
      }
      return (
        <Panel
          id={'welcomePanel'}
          class={'panel panel-default'}
        >
          <h3 className='welcome'>Welcome, {this.props.data.username}</h3>
          <p className='pull-right small login-time'>
            Last login: {this.props.data.lastLogin}
          </p>
          <p className='project-description'>
            {this.props.data.projectDescription}
          </p>
          <div className='panel-footer'>
            {links}
          </div>
        </Panel>
      );
    } else {
      return null;
    }
  }
}
Welcome.defaultProps = {
  display: false,
  data: null,
};

Welcome.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default Welcome;
