/*global self: false, Blob: false */
self.addEventListener('message', function (e) {
    "use strict";
    importScripts(e.data.BaseURL + "/js/jszip/jszip.min.js");
    var i = 0,
        FileList = e.data.Files,
        generateZip = function () {
            var zipVal, dataView, val, blobVal;
            self.postMessage({
                cmd: "CreatingZip",
                FileNo : self.FileNo
            });
            val = self.Zip.generate({
                base64: false,
                type: "arraybuffer"
            });

            self.postMessage({
                cmd : 'SaveFile',
                message : 'Done',
                buffer : val,
                Filename : "files-" + self.currentTime + "-" + self.FileNo + ".zip",
                FileNo : self.FileNo
            }, [val]);

            self.Zip = new JSZip();
            self.TotalInCurrentZip = 0;
            self.FileNo += 1;
        },
        onLoadHandler = function (File, idx) { return function (data) {
            var dataVal = this.response,
                i,
                zipVal,
                splitFile = File.split("/");

            // File is currently "files/DocID/URIEncodedFilename"
            // we want the decoded filename only, without the DocID
            self.Zip.file("files/" + decodeURIComponent(splitFile[2]), dataVal);
            self.xhrMask[idx] = true;
            self.complete += 1;

            self.TotalInCurrentZip += self.xhr[idx].response.byteLength;
            // We don't need the XMLHttpRequest object anymore, let javascript 
            // garbage collect it if it wants to.
            self.xhr[idx] = undefined;

            self.postMessage({
                cmd: 'Progress',
                Complete: self.complete,
                Total: self.xhrMask.length
            });


            // Split into 256MB chunks. Chrome doesn't seem
            // to be able to handle 512MB chunks in Blobs
            if (self.TotalInCurrentZip > (512*1024*1024)) {
                generateZip();
            }
            for (i = 0; i < self.xhrMask.length; i += 1) {
                if (self.xhrMask[i] !== true) {
                    // They aren't all finished, so don't
                    // post the message below
                    return;
                }

            }
            // Didn't return in the loop above, which means everything
            // is finished. We can save the file even if we haven't hit our
            // splitting limit.
            generateZip();
            self.postMessage({
                cmd: 'Finished',
                /* have to subtract 1 from FileNo since 
                 * it was incremented at the end of the
                 * last generateZip.. */
                NumFiles : (self.FileNo - 1)
            });
        };
    };
    self.Zip = new JSZip();
    self.xhr = [];
    self.xhrMask = [];
    self.complete = 0;
    self.FileNo = 1;
    self.TotalInCurrentZip = 0;
    self.currentTime = new Date().toISOString();

    for (i = 0; i < FileList.length; i += 1) {
        // Not finished
        self.xhrMask[i] = false;
        self.xhr[i] = new XMLHttpRequest();
        // WebWorker is in script directory, so file is up a level..
        self.xhr[i].open('GET', "/mri/jiv/get_file.php?file=" + decodeURIComponent(FileList[i].split("/")[2]));
        self.xhr[i].timeout = 1000*60*60*5; // 5 hours
        self.xhr[i].responseType = "arraybuffer";
        self.xhr[i].onload = onLoadHandler(FileList[i], i);
        //xhr[i].onloadend = function (e) { self.postMessage({ hello: e}) };
        self.xhr[i].send();

    }
});
