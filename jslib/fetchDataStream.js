/**
 * Process as many rows as possible from a data stream.
 *
 * @param {binary} data - a chunk of data read from the data stream
 * @param {function} rowcb - The row callback function
 * @param {function} endstreamcb - The stream termination callback
 * function
 *
 * @return {object} An object containing keys "remainder" which is
 * a slice of any unprocessed data, and a key "eos" which is a boolean
 * indicating whether the end of the stream has been reached.
 */
async function processLines(data, rowcb, endstreamcb) {
    const utf8Decoder = new TextDecoder('utf-8');
    let row = [];
    let colStart = -1;
    let rowStart = 0;
    for (let i = 0; i < data.length; i++) {
        switch (data[i]) {
            case 0x1e: // end of column
                const rowdata = data.slice(colStart+1, i);
                const encoded = utf8Decoder.decode(rowdata);
                colStart = i;
                row.push(encoded);
                continue;
            case 0x1f: // end of row
                const rowdata2 = data.slice(colStart+1, i);
                const encoded2 = utf8Decoder.decode(rowdata2);
                row.push(encoded2);

                rowcb(row);

                rowStart = i+1;
                colStart = i;
                row = [];
                continue;
            case 0x04: // end of stream
                rowcb(row);
                endstreamcb(row);
                return {remainder: [], eos: true};
        }
    }
    return {remainder: data.slice(rowStart), eos: false};
};

/**
 * fetchDataStream fetches a data stream from dataURL where
 * rows are denoted by the byte 0x1f, columns by 0x1e, and
 * the stream is terminated by 0x04.
 *
 * @param {string} dataURL   - the URL of the stream to fetch
 * @param {function} rowcb   - A callback to call for each row
 * @param {function} chunkcb - A callback to call for each chunk
 *                             read from the stream.
 * @param {function} endstreamcb - A callback to call when the final
 *                             byte is read from the stream.
 */
async function fetchDataStream(dataURL, rowcb, chunkcb, endstreamcb) {
    const response = await fetch(
        dataURL,
        {credentials: 'same-origin'},
    );

    const reader = response.body.getReader();

    let remainder = [];
    let doneLoop = false;
    while (!doneLoop) {
        await reader.read().then(({done, value}) => {
            let combined;
            if (remainder.length == 0) {
                combined = value;
            } else {
                combined = new Uint8Array(
                    value.length + remainder.length
                );
                for (let i = 0; i < remainder.length; i++) {
                    combined[i] = remainder[i];
                }
                for (let i = 0; i < value.length; i++) {
                    combined[i+remainder.length] = value[i];
                }
            }
            return processLines(combined, rowcb, endstreamcb);
        }).then(({remainder: rem, eos}) => {
            chunkcb(eos);
            doneLoop = eos;
            remainder = rem;
        }).catch((err) => {
            console.error(err);
            doneLoop = true;
        });
    };
};

export default fetchDataStream;
