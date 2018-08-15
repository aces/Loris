/* exported onSort */
function onSort(sortedIndex, data, headers) {
  let sortedSessIDs = [];
  let sessIndex = headers.indexOf('SessionID');
  for (let i = 0; i < sortedIndex.length; i++) {
    sortedSessIDs.push(
      data[sortedIndex[i].RowIdx][sessIndex]
    );
  }
  let url = loris.BaseURL + '/imaging_browser/ajax/setSortedRows.php';
  $.post(url, {sortedIDs: sortedSessIDs});
}

window.onSort = onSort;
export default onSort;
