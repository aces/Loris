// IndexedDB variables:
let indexedDB;
let IDBTransaction;
let dbVersion = 1.0;
let request;
let db;
// Our IndexedDB functions:
let createObjectStore;
let putDataInDb;
let getData;

/**
 * setupCouchDB - called when onmessage 'setupCouchDB' event is received.
 *                Note: Should be called in componentDidMount().
 */
function setupCouchDB() {
  indexedDB = self.indexedDB = self.indexedDB ||
              self.webkitIndexedDB ||
              self.mozIndexedDB ||
              self.OIndexedDB ||
              self.msIndexedDB;
  IDBTransaction = self.IDBTransaction ||
                   self.webkitIDBTransaction ||
                   self.OIDBTransaction ||
                   self.msIDBTransaction;
  dbVersion = 1.0;

  // Create/open database
  request = indexedDB.open('lorisCouchDB', dbVersion);
  createObjectStore = function (dataBase) {
    // Create an objectStore
    console.log(`Creating objectStore`)
    dataBase.createObjectStore(`data`);
  };
  putDataInDb = function (blob) {
    console.log('Putting data in IndexedDB');

    // Open a transaction to the database
    const transaction = db.transaction(['data'], IDBTransaction.READ_WRITE);

    // Put the blob into the db
    // put overwrites.
    const put = transaction.objectStore('data').put(blob, 'image');

    // Retrieve the file that was just stored
    transaction.objectStore('data').get('image').onsuccess = function (event) {
      console.log('Retrieving data')
        const imgFile = event.target.result;
        console.log('Got data!' + imgFile);

        // Get window.URL object
        const URL = window.URL || window.webkitURL;

        // Create and revoke ObjectURL
        const imgURL = URL.createObjectURL(imgFile);

        // Set img src to ObjectURL
        const imgExample = document.getElementById('example');
        imgExample.setAttribute('src', imgURL);

        // Revoking ObjectURL
        URL.revokeObjectURL(imgURL);
    };
  };
  getData = function () {
    console.log('getData has ran!');
    // Create XHR
    let xhr = new XMLHttpRequest(),
        blob;

    xhr.open('GET', 'example.png', true);
    // Set the responseType to blob
    xhr.responseType = 'blob';

    xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
            console.log('Image retrieved');

            // Blob as response
            blob = xhr.response;
            console.log('Blob:' + blob);

            // Put the received blob into IndexedDB
            putDataInDb(blob);
        }
    }, false);
    // Send XHR
    xhr.send();
  };
  request.onerror = function (event) {
    console.log('Error creating/accessing IndexedDB database');
  };
  request.onsuccess = function (event) {
    console.log('Success creating/accessing IndexedDB database');
    let db = request.result;
    db.onerror = function (event) {
      console.log(`Error creating/accessing IndexedDB database`);
    };
    // Interim solution for Google Chrome to create an objectStore.
    // Will be deprecated.
    if (db.setVersion) {
      if (db.version !== dbVersion) {
        const setVersion = db.setVersion(dbVersion);
        setVersion.onsuccess = function () {
          createObjectStore(db);
          getData();
        };
      } else {
        getData();
      }
    } else {
      getData();
    }
  }
  // For future use. Currently only in latest Firefox versions
  request.onupgradeneeded = function (event) {
    createObjectStore(event.target.result);
  };
}

self.onmessage = async (event) => {
  if (event && event.data && event.data.msg === 'setupCouchDB') {
    setupCouchDB();
  }
  else if (event && event.data && event.data.msg === 'test') {
    const response = myTest(event.data.lastUpdate);
    self.postMessage(response);
  }
};

const myTest = (data) => {
    const date = Date.now();
    return date;
};
