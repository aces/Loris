import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';

/**
 * Summary Panel
 *
 * This file contains React component for Electrophysiology module.
 *
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
    const {t} = this.props;
    return (
      <div className="summary-panel">
        <Panel
          id={this.props.id}
          title={t('Summary', {ns: 'electrophysiology_browser'})}
        >
          <div
            style={{
              minHeight: '300px',
            }}
          >
            <table
              style={{
                background: '#fff',
                width: '100%',
              }}
              className='table-bordered'
            >
              <tbody>
                {this.state.data.map((row, i) => {
                  const {name, value} = row;
                  return (
                    <tr key={i}>
                      <th
                        scope='row'
                        style={{
                          color: '#074785',
                          padding: '5px 10px',
                          wordWrap: 'break-word',
                          width: '200px',
                        }}
                      >{name}</th>
                      <td style={{
                        padding: '5px 10px',
                        wordWrap: 'break-word',
                      }}>{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    );
  }
}

SummaryPanel.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
  t: PropTypes.func,
};

SummaryPanel.defaultProps = {
  data: [],
};

export {
  SummaryPanel,
};
