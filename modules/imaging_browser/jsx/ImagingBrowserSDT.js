/**
 * Created by dblader on 7/25/17.
 */
/* exported RImagingBrowserSDT */

/**
 * This file contains React component for Static Data Table
 *
 * @author Loris Team
 * @version 1.0.0
 *
 */

/**
 * Static Data Table component
 * Displays a set of data that is receives via props.
 */
class ImagingBrowserSDT extends StaticDataTable {
//var ImagingBrowserSDT = StaticDataTable.extend({
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
