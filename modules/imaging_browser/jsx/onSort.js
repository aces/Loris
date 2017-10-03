/* exported onSort */
function onSort(sortedIndex, data, headers) {
  var sortedSessIDs = [];
  var sessIndex = headers.indexOf('SessionID');
  for (var i = 0; i < sortedIndex.length; i++) {
    sortedSessIDs.push(
      data[sortedIndex[i].RowIdx][sessIndex]
    );
  }
  var url = loris.BaseURL + '/imaging_browser/ajax/setSortedRows.php';
  $.post(url, {sortedIDs: sortedSessIDs});
}

window.onSort = onSort;
export default onSort;
