import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Tabs, TabPane} from 'Tabs';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

class ImagingBrowserIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            error: false,
            isLoaded: false,
        };

        this.fetchData = this.fetchData.bind(this);
        this.formatColumn = this.formatColumn.bind(this);
    }

    componentDidMount() {
        this.fetchData()
            .then(() => this.setState({isLoaded: true}));
    }

    /**
     * Retrieve data from the provided URL and save it in state
     * Additionally add hiddenHeaders to global loris variable
     * for easy access by columnFormatter.
     *
     * @return {object}
     */
    fetchData() {
        return fetch(this.props.dataURL, {credentials: 'same-origin'})
            .then((resp) => resp.json())
            .then((data) => this.setState({data}))
            .catch((error) => {
                this.setState({error: true});
                console.error(error);
            });
    }

    /**
     * Modify behaviour of specified column cells in the Data Table component
     *
     * @param {string} column - column name
     * @param {string} cell - cell content
     * @param {object} row - row content indexed by column
     *
     * @return {*} a formated table cell for a given column
     */
    formatColumn(column, cell, row) {
        // Set class to 'bg-danger' if file is hidden.
        const style = (row['File Visibility'] === '1') ? 'bg-danger' : '';
        let result = <td className={style}>{cell}</td>;
        switch (column) {
            case 'File Name':
                if (this.props.hasPermission('media_write')) {
                    const downloadURL = loris.BaseURL + '/media/ajax/FileDownload.php?File=' +
                        encodeURIComponent(row['File Name']);
                    result = (
                        <td className={style}>
                            <a href={downloadURL} target="_blank" download={row['File Name']}>
                                {cell}
                            </a>
                        </td>
                    );
                }
                break;
            case 'Visit Label':
                if (row['CandID'] !== null && row['SessionID']) {
                    const sessionURL = loris.BaseURL + '/instrument_list/?candID=' +
                        row['CandID'] + '&sessionID=' + row['SessionID'];
                    result = <td className={style}><a href={sessionURL}>{cell}</a></td>;
                }
                break;
            case 'Edit Metadata':
                const editURL = loris.BaseURL + '/media/edit/?id=' + row['Edit Metadata'];
                result = <td className={style}><a href={editURL}>Edit</a></td>;
                break;
        }

        return result;
    }

    render() {
        // If error occurs, return a message.
        // XXX: Replace this with a UI component for 500 errors.
        if (this.state.error) {
            return <h3>An error occured while loading the page.</h3>;
        }

        // Waiting for async data to load
        if (!this.state.isLoaded) {
            return <Loader/>;
        }

        /**
         * XXX: Currently, the order of these fields MUST match the order of the
         * queried columns in _setupVariables() in media.class.inc
         */
        const options = this.state.data.fieldOptions;
        const fields = [
            {label: 'Site', show: true, filter: {
                    name: 'MRI_alias',
                    type: 'select',
                    options: options.sites,
                }},
            {label: 'PSCID', show: true, filter: {
                    name: 'PSCID',
                    type: 'text',
                }},
            {label: 'DCCID', show: true, filter: {
                    name: 'pscid',
                    type: 'text',
                }},
            {label: 'Project', show: true, filter: {
                    name: 'Project',
                    type: 'select',
                    options: options.projects,
                }},
            {label: 'Vist Label', show: true, filter: {
                    name: 'visit_label',
                    type: 'text',
        }},
            {label: 'Visit QC Status', show: true, filter: {
                    name: 'MRIQCStatus',
                    type: 'select',
                    options: options.visitQCStatus,
                }},
            {label: 'First Acquisition', show: true},
            {label: 'First Insertion', show: true},
            {label: 'Last QC', show: true},
            {label: 'New Data', show: true},
            {label: 'Links', show: true},
            {label: '', show: true, filter: {
                name: 'MRI_alias',
                type: 'select',
                options: options.sites,
            }},
        ];
        const tabs = [{id: 'browse', label: 'Browse'}];


        return (
            <Tabs tabs={tabs} defaultTab="browse" updateURL={true}>
                <TabPane TabId={tabs[0].id}>
                    <FilterableDataTable
                        name="imaging_browser"
                        data={this.state.data.Data}
                        fields={fields}
                        getFormattedCell={this.formatColumn}
                    />
                </TabPane>
            </Tabs>
        );
    }
}

ImagingBrowserIndex.propTypes = {
    dataURL: PropTypes.string.isRequired,
    hasPermission: PropTypes.func.isRequired,
};

window.addEventListener('load', () => {
    ReactDOM.render(
        <ImagingBrowserIndex
            dataURL={`${loris.BaseURL}/imaging_browser/?format=json`}
            hasPermission={loris.userHasPermission}
        />,
        document.getElementById('lorisworkspace')
    );
});
