<?php
namespace LORIS\brainbrowser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The ImageInfo class implements an endpoint for brainbrowser to
 * use to extract all the information that brainbrowser needs to
 * display a file. It takes a list of IDs, passed in a "files"
 * query param and converts it to a JSON response of the format
 * [{
 *    'type': 'minc|nifti",
 *    'URL': 'raw file URL',
 *    'Filename': 'file name for display',
 *    'FileID': 'backend numeric ID'
 *  }, ...]
 *
 * This information can then be used to build the display and
 * pass any required information on to the BrainBrowser library.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ImageInfo extends \NDB_Page
{
    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $fileids  = $this->_parseFileIDs(
            $request->getQueryParams()['fileids'] ?? ""
        );
        $fileurls = $this->_parseParams(
            $request->getQueryParams()['fileurls'] ?? ""
        );
        $response = [];

        if (count($fileids) > 0) {
            $db = $this->loris->getDatabaseConnection();

            $queryparams = [];
            $query       = $this->_buildQuery($fileids, $queryparams);
            $dbfiles     = $db->pselect(
                $query,
                $queryparams
            );

            if (count($fileids) != count($dbfiles)) {
                $missing = count($fileids) - count($dbfiles);
                return new \LORIS\Http\Response\JSON\NotFound(
                    "$missing file(s) not found"
                );
            }

            $response = $this->_generateResults($dbfiles);
        }

        if (count($fileurls) > 0) {
            foreach ($fileurls as $fileurl) {
                if (preg_match('/nii(\.gz)?/i', $fileurl)) {
                    $type = 'nifti1';
                } else if (preg_match('/mnc/', $fileurl)) {
                    $type = 'minc';
                } else {
                    $type = 'unknown';
                }

                $file = [
                    'type'     => $type,
                    'URL'      => $fileurl,
                    'Filename' => basename($fileurl),
                    'FileID'   => null,
                ];
                if ($type == 'nifti1' && strpos($fileurl, '.gz') !== false) {
                    $file['compressed'] = true;
                }
                $response[] = $file;
            }
        }

        return new \LORIS\Http\Response\JSON\OK($response);
    }

    /**
     * The incoming request sends the list of files ID in the files
     * query parameter, as a comma-separated string.
     *
     * This converts it from a string into an array.
     *
     * @param string $files_str The raw value of the query param
     *
     * @return array
     */
    private function _parseParams(string $files_str) : array
    {
        if ($files_str === "") {
            return [];
        }

        // Split on ',' if case an array was passed.
        return explode(',', $files_str);
    }

    /**
     * The incoming request sends the list of files ID in the files
     * query parameter, as a comma-separated string.
     * The IDs have an unusual encoding where FileIDs from
     * the imaging browser are normal ideas, while IDs from the
     * mri violations module are encoded as a number followed by "l"
     * followed by the id. The number indicates the source within
     * the mri violations module.
     *
     * This converts it from a string into a more useable array rather
     * than a string. Each value within the array is an associative array
     * with a 'Type' key of either the string 'ProtocolViolation',
     * 'CheckViolation','CandidateError', or 'ImagingBrowser' depending on
     * the source of the ID, and a key 'FileID' which denotes the
     * ID, context sensitive to the appropriate type.
     *
     * These can later be used to build the SQL query to generate
     * results.
     *
     * @param string $files_str The raw value of the query param
     *
     * @return array
     */
    private function _parseFileIDs(string $files_str) : array
    {
        $files     = $this->_parseParams($files_str);
        $parsedIDs = [];
        foreach ($files as $file) {
            if (strpos($file, 'l') == 1) {
                // MRI Violation lookup, 3 cases come from old ajax script.
                $type = $file[0];
                $id   = substr($file, 2);
                switch ($type) {
                case 1:
                    $parsedIDs[] = ['Type' => 'ProtocolViolation', 'FileID' => $id];
                    break;
                case 2:
                    $parsedIDs[] = ['Type' => 'CheckViolation', 'FileID' => $id];
                    break;
                case 3:
                    $parsedIDs[] = ['Type' => 'CandidateError', 'FileID' => $id];
                    break;
                default:
                    // FIXME: Bad request
                    throw new \Exception("Not implemented");

                }
            } else {
                // Normal files table lookup
                $parsedIDs[] = ['Type' => 'ImagingBrowser', 'FileID' => $file];
            }
        }
        return $parsedIDs;
    }

    /**
     * Builds a query for the files and populates the appropriate
     * bind parameters in $queryparams.
     *
     * @param iterable $files       The list of files to be queried
     * @param array    $queryparams An array to store the parameters
     *                              that must be bound for the query
     *                              to be valid.
     *
     * @return string
     */
    private function _buildQuery(iterable $files, array &$queryparams) : string
    {
        // Different sources that the ID could have come from
        $querytypes = [];

        // Partition the results into an array of the form
        // ['Image Source' => [fileids, ..]]

        foreach ($files as $i => $file) {
            $querytypes[$file['Type']][] = ":file$i";
            $queryparams["file$i"]       = $file['FileID'];
        }

        $queries = [];
        // For each source, generate the query to union
        foreach ($querytypes as $qtype => $params) {
            switch ($qtype) {
            case 'ImagingBrowser':
                $queries[] = "SELECT 'ImagingBrowser' as Source,
                                     c.CandID,
                                     s.Visit_label,
                                     f.File,
                                     f.FileID as FileID
                             FROM files f
                                JOIN session s ON (f.SessionID=s.ID)
                                JOIN candidate c ON (s.CandID=c.CandID)
                            WHERE FileID IN (" . join(",", $params) .  ")";
                break;
            case 'ProtocolViolation':
                $queries[] = "SELECT 'ProtocolViolation' as Source,
                                     '' as CandID,
                                     '' as Visit_label,
                                     minc_location as File,
                                     ID as FileID
                              FROM mri_protocol_violated_scans
                              WHERE ID IN (" . join(",", $params) .")";
                break;
            case 'CheckViolation':
                $queries[] = "SELECT 'CheckViolation' as Source,
                                     '' as CandID,
                                     '' as Visit_label,
                                     MincFile as File,
                                     LogID as FileID
                              FROM mri_violations_log
                              WHERE LogID IN (" . join(",", $params) .")";
                break;
            case 'CandidateError':
                $queries[] = "SELECT 'CandidateError' as Source,
                                     '' as CandID,
                                     '' as Visit_label,
                                     MincFile as File,
                                     ID as FileID
                             FROM MRICandidateErrors
                             WHERE ID IN (" . join(",", $params) . ")";
                break;
            default:
                throw new \Exception("Invalid query type");

            }
        }

        // UNION all the sources into a single query.
        return join(" UNION ", $queries);
    }

    /**
     * Formulate the database results into an appropriate JSON format
     * and return the response.
     *
     * @param iterable $dbfiles The results of the database query
     *
     * @return Array
     */
    private function _generateResults(iterable $dbfiles) : Array
    {
        $baseurl  = \NDB_Factory::singleton()->settings()->getBaseURL();
        $response = [];
        foreach ($dbfiles as $row) {
            $filename = basename($row['File']);
            switch ($row['Source']) {
            case 'ImagingBrowser':
                $url = $baseurl . "/api/v0.0.3/candidates/"
                    . $row['CandID'] . "/"
                    . $row['Visit_label']
                    . "/images/"
                    . $filename;
                break;
            case 'ProtocolViolation':
            case 'CheckViolation':
            case 'CandidateError':
                $url = $baseurl
                       . "/mri_violations/file/"
                       . strtolower($row['Source'])
                       . "/" . $row['FileID'];
                break;
            default:
                throw new \Exception("Invalid Source");
            }

            if (preg_match('/nii(\.gz)?/i', $filename)) {
                $type = 'nifti1';
            } else if (preg_match('/mnc/', $filename)) {
                $type = 'minc';
            } else {
                $type = 'unknown';
            }

            $file = [
                'type'     => $type,
                'URL'      => $url,
                'Filename' => $filename,
                'FileID'   => $row['FileID'],
            ];
            if ($type == 'nifti1' && strpos($filename, '.gz') !== false) {
                $file['compressed'] = true;
            }
            $response[] = $file;
        }
        return $response;
    }
}

