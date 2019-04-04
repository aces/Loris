/* exported formatAcknowledgementsColumn */

import React from 'react';

/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of headers for the table
 * @return {*} a formated table cell for a given column
 */
function formatAcknowledgementsColumn(column, cell, rowData, rowHeaders) {
  return <td>{cell}</td>;
}

window.formatAcknowledgementsColumn = formatAcknowledgementsColumn;

