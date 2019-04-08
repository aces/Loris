/* global self: false, Blob: false */
self.addEventListener('message', function(e) {
  'use strict';
  let i = 0;
  const data = e.data.data; // $("#data").dataTable().fnGetData()
  const headers = e.data.headers; // $("#data thead th")
  const identifiers = e.data.identifiers;
  let content = ''; // new Blob(),
  const escapeQuote = function(val) {
    if (val && typeof val === 'string') {
      return val.replace(/"/g, '""');
    } else if (val && typeof val === 'object' && val.type === 'a') {
      return val.props.children;
    }
    return val;
  };
  // var fs;

  let row = (identifiers) ? ['Identifiers'] : [];
  row = row.concat(headers);
  row = row.map(function(val) {
    if (val) {
      return val.replace('"', '""');
    }
    return val;
  });
  content += '"' + row.join('","') + '"\r\n';
  for (i = 0; i < data.length; i += 1) {
    row = (identifiers) ? [identifiers[i]] : [];
    row = row.concat(
        data[i].map(escapeQuote)
    );
    content += '"' + row.join('","') + '"\r\n';
  }
  const contentBlob = new Blob([content], {type: 'text/csv'});
  // fs = saveAs(contentBlob, "data.csv");
  // fs = new FileSaverSync(contentBlob, "data.csv");
  self.postMessage({cmd: 'SaveCSV', message: contentBlob});
});
