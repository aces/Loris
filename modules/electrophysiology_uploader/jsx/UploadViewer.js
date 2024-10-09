import React from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * UploadViewer
 *
 * @param {array} props
 * @return {JSX}
 */
export default function UploadViewer(props) {
  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {JSX} a formated table cell for a given column
   */
  const formatColumn = (column, cell, row) => {
    switch (column) {
      case 'Upload Location':
        const downloadURL =
          loris.BaseURL
          + '/electrophysiology_uploader/upload?'
          + `upload_id=${row['Upload ID']}`;
        return (
          <td>
            <a href={downloadURL} target="_blank" download={row['File Name']}>
              {cell}
            </a>
          </td>
        );
      default:
        return <td>{cell}</td>;
    }
  };

  const fields = [
    {
      label: 'Upload ID',
      show: true,
    },
    {
      label: 'Site',
      show: true,
      filter: {
        name: 'site',
        type: 'multiselect',
        options: props.fieldOptions.sites,
      },
    },
    {
      label: 'PSCID',
      show: true,
      filter: {
        name: 'pscid',
        type: 'text',
      },
    },
    {
      label: 'Visit',
      show: true,
      filter: {
        name: 'visitLabel',
        type: 'select',
        options: props.fieldOptions.visitLabel,
      },
    },
    {
      label: 'Upload Location',
      show: true,
    },
    {
      label: 'Upload Time',
      show: false,
    },
    {
      label: 'Status',
      show: true,
    },
    {
      label: 'Uploaded By',
      show: true,
    },
  ];

  return (
    <FilterableDataTable
      name='eeg_upload_viewer'
      data={props.data}
      fields={fields}
      getFormattedCell={formatColumn}
    />
  );
}

UploadViewer.propTypes = {
  data: PropTypes.array.isRequired,
  fieldOptions: PropTypes.object.isRequired,
};
