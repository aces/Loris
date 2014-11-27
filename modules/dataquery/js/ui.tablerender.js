/*global self: false */
self.addEventListener('message', function (e) {
    "use strict";
    var data = e.data;
    switch (data.cmd) {
    case 'ConvertObject':
        self.RowNum = 0;
        self.GroupLevel = parseInt(data.group_level, 10);
        self.SelectedElements = data.SelectedElements;
        self.ConvertObjectToTable(data.obj);
        break;
    case 'ConvertResults':
        //self.postMessage(CreateTableBody(data.results);
        break;
    case 'ConvertJSON':
        self.GroupLevel = parseInt(data.group_level, 10);
        self.Sessions   = data.Sessions;
        self.Elements   = data.Elements;
        self.ConvertJSON(data.data);
        break;
    default:
        self.postMessage('Unknown cmd');
        break;
    }
}, false);

self.ConvertObjectToTable = function (obj) {
    "use strict";
    var tbl = [],
        tblrow = [],
        objrow,
        columnsIdx = ['Identifier'],
        group_level = self.GroupLevel,
        Selected = self.SelectedElements,
        prefix,
        sPrefix,
        FieldName,
        i = parseInt(group_level, 10),
        j,
        idx,
        val,
        existingRows = {},
        Prefixes = [],
        numEls = Object.keys(obj).length,
        numProcessed = 0,
        numRows = Object.keys(existingRows),
        el,
        identifier,
        row,
        objcol;
    self.RowNum = 0;
    for (el in obj) {
        if (obj.hasOwnProperty(el)) {
            identifier = el.split(',');
            i = parseInt(group_level, 10);
            prefix = [];
            while (i > 0) {
                i -= 1;
                prefix.push(identifier.pop());
            }
            sPrefix = prefix.join("_").toUpperCase();
            // Create a new row. We'll initialize it to empty after we know how many columns there are,
            // which depends on how many prefixes are found in this loop.
            row = [];
            row[0] = identifier.join(",");
            existingRows[identifier.join(",")] = row;
            if (Prefixes.indexOf(sPrefix) === -1) {
                Prefixes.push(sPrefix);
            }
        }
    }
    Prefixes.sort();

    for (i = 0; i < Selected.length; i += 1) {
        for (j = 0; j < Prefixes.length; j += 1) {
            prefix = Prefixes[j];
            if (prefix) {
                columnsIdx[1 + i + (Selected.length * j)] = Prefixes[j] + "_" +  Selected[i];
            } else {
                columnsIdx[1 + i + (Selected.length * j)] = Selected[i];
            }
        }
    }
    // Instruct the main thread to create the table headers
    self.postMessage({ cmd: 'PopulateHeaders', Headers: columnsIdx});
    for (row in existingRows) {
        if (existingRows.hasOwnProperty(row)) {
            // 0 is identifier, so skip it..
            for (i = 1; i < columnsIdx.length; i += 1) {
                existingRows[row][i] = '.';
            }
        }
    }

    // Now go through the data, and convert it to rows. Join the different
    // documents together into a single array if there's multiple instruments
    // and add the prefix to put everything in its right column
    numProcessed = 0;
    //self.debug(existingRows);
    //self.debug(obj);
    for (el in obj) {
        if (obj.hasOwnProperty(el)) {
            numProcessed += 1;

            identifier = el.split(',');
            i = parseInt(group_level, 10);
            prefix = [];
            while (i > 0) {
                i -= 1;
                prefix.push(identifier.pop());
            }
            sPrefix = prefix.join("_").toUpperCase();

            tblrow = existingRows[identifier.join(",")];
            objrow = obj[el];
            for (j = 0; j < Selected.length; j += 1) {
                if (objrow.hasOwnProperty(Selected[j])) {
                    if (sPrefix) {
                        FieldName = sPrefix + "_" + Selected[j];
                    } else {
                        FieldName = Selected[j];
                    }
                    idx = columnsIdx.indexOf(FieldName);
                    val = objrow[Selected[j]];
                    if (val === undefined || val === null) {
                        tblrow[idx] = '.';
                    } else {
                        tblrow[idx] = objrow[Selected[j]];

                        if (val.IsFile === true) {
                            tblrow[idx] = '<a href="files/' +
                                val.DocID + "/" +
                                encodeURIComponent(val.TextValue) + '">' +
                                val.TextValue + '</a>';
                            if (val.TextValue !== '.') {
                                self.postMessage({ cmd: 'AddFile', Filename: "files/" + val.DocID + "/" + encodeURIComponent(val.TextValue) });
                            }
                        } else {

                            tblrow[idx] = objrow[Selected[j]].TextValue;
                            if (tblrow[idx] === undefined) {
                                // Value was undefined, make it a . so that things
                                // dont crash when processing the data
                                tblrow[idx] = ".";
                            }
                        }
                    }
                }
            }
            self.RowNum = numProcessed;
            self.postMessage({ cmd: 'Status', RowNum: numProcessed, Total: numEls });
        }
    }


    // Data has been processed, send message to begin adding it to the table. Include RowNum and
    // TotalRows so that we can update a status.
    numRows = Object.keys(existingRows).length;
    i = 1;
    for (el in existingRows) {
        if (existingRows.hasOwnProperty(el)) {
            self.postMessage({ cmd: 'AddRow', Row: existingRows[el], RowNum: i, TotalRows: numRows });
            i += 1;
        }
    }
    self.close();
};


self.ConvertJSON = function (textObject) {
    "use strict";
    var data = JSON.parse(textObject),
        i,
        j,
        row,
        prefix,
        FieldName,
        RowID,
        value,
        group_level = self.GroupLevel,
        sessions = self.Sessions,
        elements = self.Elements,
        dataRows,
        arrayClone = function (arr) {
            var a = [], i;

            for (i = 0; i < arr.length; i += 1) {
                a[i] = arr[i];
            }

            return a;
        },
        arrayContainsPrefix = function (arr, prefix) {
            var match = false, i, j;

            for (i = 0; i < arr.length; i += 1) {
                match = true;
                if (arr[i] instanceof Array) {
                    for (j = 0; j < prefix.length; j += 1) {
                        if (arr[i][j] !== prefix[j]) {
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        return true;
                    }
                }
            }
            return false;
        };

    dataRows = data.rows
    for (i = 0; i < dataRows.length; i += 1) {
        row = dataRows[i];
        RowID = row.value;
        prefix = arrayClone(row.value);
        j = group_level;
        while (j > 0) {
            j -= 1;
            prefix.pop();
        }

        if (arrayContainsPrefix(sessions, prefix)) {
            self.postMessage({
                cmd: 'AddRow',
                RowID: RowID,
                Idx: i,
                TotalRows: dataRows.length
            });

            for (j = 0; j < elements.length; j += 1) {
                FieldName = row.key[0] + "," + elements[j];
                if (row.doc.data && row.doc.data[elements[j]] !== null) {
                    value = row.doc.data[elements[j]];
                    if (value === undefined || value === null) {
                        value = '.';
                    }
                    self.postMessage({
                        cmd : 'AddValueToRow',
                        RowID : RowID,
                        Field: FieldName,
                        Column: elements[j],
                        Value: value,
                        DocID: row.id
                    });
                }

            }
        }

    }
    self.postMessage({ cmd: 'FinishedConvertJSON' });
};

self.debug = function (message) {
    "use strict";
    self.postMessage({ cmd: 'Debug', message: message });
};
