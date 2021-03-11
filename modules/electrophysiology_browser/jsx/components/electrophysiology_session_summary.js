import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';

/**
 * Summary Panel
 *
 * This file contains React component for Electrophysiology module.
 *
 * @author Alizée Wickenheiser.
 * @version 0.0.1
 */
class SummaryPanel extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const styles = {
      table: {
        header: {
            color: '#074785',
            padding: '5px 10px',
            wordWrap: 'break-word',
            width: '200px',
        },
        style: {
            background: '#fff',
            width: '100%',
        },
        data: {
            padding: '5px 10px',
            wordWrap: 'break-word',
        },
      },
    };

    return (
      <div className="summary-panel">
        <Panel
          id={this.props.id}
          title="Summary"
        >
          <div
            style={{
              height: '300px',
            }}
          >
            <table
              style={styles.table.style}
              className='table-bordered'
            >
              <tbody>
                <tr>
                  <th scope='row' style={styles.table.header}>
                  Sampling Frequency
                  </th>
                  <td style={styles.table.data}>
                  {this.state.data.task.frequency.sampling}
                  </td>
                </tr>
                <tr>
                  <th scope='row' style={styles.table.header}>
                  {this.state.data.task.channel[0].name}
                  </th>
                  <td style={styles.table.data}>
                  {this.state.data.task.channel[0].value}
                  </td>
                </tr>
                <tr>
                  <th scope='row' style={styles.table.header}>
                  {this.state.data.task.channel[1].name}
                  </th>
                  <td style={styles.table.data}>
                  {this.state.data.task.channel[1].value}
                  </td>
                </tr>
                <tr>
                  <th scope='row' style={styles.table.header}>
                  {this.state.data.task.channel[2].name}
                  </th>
                  <td style={styles.table.data}>
                  {this.state.data.task.channel[2].value}
                  </td>
                </tr>
                <tr>
                  <th scope='row' style={styles.table.header}>
                  {this.state.data.task.channel[3].name}
                  </th>
                  <td style={styles.table.data}>
                  {this.state.data.task.channel[3].value}
                  </td>
                </tr>
                <tr>
                  <th scope='row' style={styles.table.header}>
                  EEG Reference
                  </th>
                  <td style={styles.table.data}>
                  {this.state.data.task.reference}
                  </td>
                </tr>
                <tr>
                  <th scope='row' style={styles.table.header}>
                  Powerline Frequency
                  </th>
                  <td style={styles.table.data}>
                  {this.state.data.task.frequency.powerline}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    );
  }
}

SummaryPanel.propTypes = {
  data: PropTypes.object,
};

SummaryPanel.defaultProps = {
  data: {},
};

export {
  SummaryPanel,
};
