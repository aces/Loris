/**
 * Need to override static data table in order to maintain sorting order
 * from the menu filter in imaging viewer
 */
class ImagingBrowserSDT extends StaticDataTable {
  componentDidUpdate() {
    if (jQuery.fn.DynamicTable) {
      if (this.props.freezeColumn) {
        $("#dynamictable").DynamicTable({
          freezeColumn: this.props.freezeColumn
        });
      } else {
        $("#dynamictable").DynamicTable();
      }
    }

    // Start Imaging Browser 17.1 Quickfix
    var index = this.getSortedRows();

    var sortedSessIDs = [];
    var sessIndex = this.props.Headers.indexOf('SessionID');
    for (var i = 0; i < index.length; i++) {
      sortedSessIDs.push(
        this.props.Data[index[i].RowIdx][sessIndex]
      );
    }
    var url = loris.BaseURL + '/imaging_browser/ajax/setSortedRows.php';
    $.post(url, {sortedIDs: sortedSessIDs});
    // End Imaging Browser 17.1 Quickfix
  }
}

var RImagingBrowserSDT = React.createFactory(ImagingBrowserSDT);

window.ImagingBrowserSDT = ImagingBrowserSDT;
window.RImagingBrowserSDT = RImagingBrowserSDT;

export default ImagingBrowserSDT;
