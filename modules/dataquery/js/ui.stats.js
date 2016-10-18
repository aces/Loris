/*global self: false, importScripts: false, jStat: false*/
importScripts(Loris.BaseURL + "/GetJS.php?Module=dataquery&file=jstat.js");
self.addEventListener("message", function (e) {
    "use strict";
    var data = e.data,
        arrayConvertNumbers = function (arr) {
            var r = [], i;
            for (i = 0; i < arr.length; i += 1) {
                if (arr[i] instanceof Array) {
                    r[i] = arrayConvertNumbers(arr[i]);
                } else {
                    if (parseInt(arr[i], 10) == arr[i]) {
                        r[i] = parseInt(arr[i], 10);
                    } else if (parseFloat(arr[i], 10) == arr[i]) {
                        r[i] = parseFloat(arr[i], 10);
                    } else if (arr[i] === '.') {
                        r[i] = null;
                    } else {
                        r[i] = arr[i];
                    }
                }
            }
            return r;
        };
    if(self.d === undefined) {
        self.d = jStat(arrayConvertNumbers(data.Data));
    }
    switch (data.cmd) {
    case 'PopulateTable':
        self.populateStatsTable(data.Headers);
        break;
    case 'PopulateHistogram':
        self.createHistogramData(data.Columns);
        break;
    }
});

self.populateStatsTable = function (headers) {
    "use strict";
    var d = self.d,
        quartiles = d.quartiles(),
        min = d.min(),
        max = d.max(),
        stdev = d.stdev(),
        mean = d.mean(),
        meandev = d.meandev(),
        meansqerr = d.meansqerr(),
        i;

    for (i = 1; i < headers.length; i += 1) {
        quartiles = d.quartiles();
        self.postMessage({
            Cmd: 'TableAddRow',
            Header : headers[i],
            Index  : i,
            RowData: {
                'Minimum' : min[i],
                'Maximum' : max[i],
                'Standard Deviation' : stdev[i],
                'Mean' : mean[i],
                'Mean Deviation' : meandev[i],
                'Mean Squared Error' : meansqerr[i],
                'First Quartile': quartiles[i][0],
                'Second Quartile': quartiles[i][1],
                'Third Quartile': quartiles[i][2]
            }
        });
    }
    self.postMessage({
        Cmd: 'FinishedTable'
    });
};

self.createHistogramData = function (SelectedColumns) {
    var i = 0, idx, plots = [], yAxis, d = self.d, val;
    for (i = 0; i < SelectedColumns.length; i += 1) {
        idx = SelectedColumns[i];
        yAxis = [];

        // Go through each value
        for (j = 0; j < d.length; j += 1) {
            val = d[j][idx];
            
            if (yAxis[val]) {
                yAxis[val][1] += 1
            } else {
                yAxis[val] = [val, 1];
            }
        }

        plots.push({
            data: yAxis,
            stack: false,
            lines: { show: false, steps: false },
            bars: { show: true, barWidth: 0.9, align: 'center' }
        });

    }

    self.postMessage({
        Cmd: 'CreateHistogram',
        Plots: plots
    });
}
