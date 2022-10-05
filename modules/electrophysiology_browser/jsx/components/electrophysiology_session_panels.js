import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'jsx/Panel';

/**
 * File Panel
 *
 * This file contains React component for Electrophysiology module.
 *
 * @version 0.0.1
 */
class FilePanel extends Component {
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
        const halfSize = this.state.data.length/2;
        const columns = [
            this.state.data.slice(0, halfSize),
            this.state.data.slice(halfSize),
        ];

        return (
            <Panel id={this.props.id} title={this.props.title}>
            <div className={'container-fluid'}>
            <div className={'row'}>
            {this.props.children}
            </div>
            <Panel
        id={this.props.id + '_details'}
        title={'Acquisition Details for Recording '
            + this.props.title.split('.').slice(0, -1).join('.')
    }
    >
    <div className={'container-fluid'}>
            <div className={'row no-gutters'}>
            <div className={'no-gutters'}>
            {columns.map((column, i) => (
                    <div
                key={i}
                className={'col-md-6'}
                >
                <div className='table-responsive'>
                <table
                style={{
            background: '#fff',
                width: '100%',
        }}
        className='table-bordered'
            >
            <tbody>
            {column.map((row, j) => {
                    const {name, value} = row;
                    return (
                        <tr key={j}>
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
            </div>
    ))}
    </div>
        </div>
        </div>
        </Panel>
        </div>
        </Panel>
    );
    }
}

FilePanel.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.array,
};

FilePanel.defaultProps = {
    id: 'file_panel',
    title: 'FILENAME',
    data: [],
};

export {
    FilePanel,
};
