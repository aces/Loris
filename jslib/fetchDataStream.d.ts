/**
 * fetchDataStream fetches a data stream from dataURL where
 * rows are denoted by the byte 0x1f, columns by 0x1e, and
 * the stream is terminated by 0x04.
 *
 * @param dataURL   - the URL of the stream to fetch
 * @param rowcb   - A callback to call for each row
 * @param chunkcb - A callback to call for each chunk
 *                             read from the stream.
 * @param endstreamcb - A callback to call when the final
 *                             byte is read from the stream.
 * @param method    - the HTTP method to use for the request
 */
async function fetchDataStream(
    dataURL: string,
    rowcb: (row: string[]) => void,
    chunkcb: () => void,
    endstreamcb: () => void,
    method: string
);

export default fetchDataStream;
