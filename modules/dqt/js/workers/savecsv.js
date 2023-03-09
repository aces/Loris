/* global self: false, Blob: false */
self.addEventListener('message', function(e) {
  'use strict';
  let i = 0;
  let data = e.data.data; // $("#data").dataTable().fnGetData(),
  let headers = e.data.headers; // $("#data thead th"),
  let identifiers = e.data.identifiers;
  let row = [];
  let content = ''; // new Blob(),
  let escapeQuote = function(val) {
    if (val) {
      return val.replace(/"/g, '""');
    }
    return val;
  };
  // let fs;
  let contentBlob;

    row = ['Identifiers'];
    row = row.concat(headers);
    row = row.map(function(val) {
      if (val) {
        return val.replace('"', '""');
      }
      return val;
    });
    content += '"' + row.join('","') + '"' + '\r\n';
    for (i = 0; i < data.length; i += 1) {
        row = [identifiers[i]];
        row = row.concat(
                data[i].map(escapeQuote)
        );
        content += '"' + row.join('","') + '"' + '\r\n';
    }
    contentBlob = new Blob([content], {
      type: 'text/csv',
    });
    // fs = saveAs(contentBlob, "data.csv");
    // fs = new FileSaverSync(contentBlob, "data.csv");
    self.postMessage({
      cmd: 'SaveCSV',
      message: contentBlob,
    });
});
