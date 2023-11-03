import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

/**
 * Roles Index Component.
 *
 * This Component fetches the role data from the server and feeds it to
 * the Filterable Datatable component to be formated, filtered and sorted.
 *
 * When clicking on the Add Role button or a Role, this component redirects
 * the role to a form that allows them to add or edit a role.
 */
class RolesIndex extends Component {
    /**
     * {@inheritdoc}
     */
    constructor()
    {
        super();

        this.state = {
            data: {},
            error: false,
            isLoaded: false,
        };

        this.fetchData = this.fetchData.bind(this);
        this.formatColumn = this.formatColumn.bind(this);
        this.editRole = this.editRole.bind(this);
    }

    /**
     * {@inheritdoc}
     */
    componentDidMount()
    {
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
    fetchData()
    {
        return fetch(this.props.dataURL, {credentials: 'same-origin'})
            .then((resp) => resp.json())
            .then((data) => this.setState({data}))
            .catch(
                (error) => {
                    this.setState({error: true});
                    console.error(error);
                }
            );
    }

    /**
     * Modify behaviour of specified column cells in the Data Table component
     *
     * @param  {string} column - column name
     * @param  {string} cell - cell content
     * @param  {object} row - row content indexed by column
     * @return {*} a formated table cell for a given column
     */
    formatColumn(column, cell, row)
    {
        let url;
        let result = <td>{cell}</td>;
        switch (column) {
            case 'Code':
                url = loris.BaseURL + '/roles/edit_role/' + row.Code;
                result = <td><a href ={url}>{cell}</a></td>;
                break;
        }
        return result;
    }

    /**
     * Changes url to be able to add or edit a Role.
     */
    editRole()
    {
        location.href='/roles/edit_role/';
    }

    /**
     * {@inheritdoc}
     *
     * @return {object}
     */
    render()
    {
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
         * queried columns in _setupVariables() in userAccounts.class.inc
         */
        const fields = [
            {
                label: 'Code',
                show: true,
                filter: {
                    name: 'code',
                    type: 'text',
                },
            },
            {
                label: 'Name',
                show: true,
                filter: {
                    name: 'name',
                    type: 'text',
                },
            },
            {
                label: 'Description',
                show: true,
                filter: {
                    name: 'description',
                    type: 'text',
                },
            },
        ];

        const actions = [
            {label: 'Add Role', action: this.editRole},
        ];

        return (
            <FilterableDataTable
                name="roles"
                title='Roles'
                data={this.state.data.Data}
                fields={fields}
                getFormattedCell={this.formatColumn}
                actions={actions}
            />
        );
    }
}

RolesIndex.propTypes = {
    dataURL: PropTypes.string.isRequired,
    hasPermission: PropTypes.func.isRequired,
};

window.addEventListener(
    'load', () => {
        const root = createRoot(document.getElementById('lorisworkspace'));
    root.render(
            <RolesIndex
            dataURL={`${loris.BaseURL}/roles/?format=json`}
            hasPermission={loris.userHasPermission}
            />
        );
    }
);