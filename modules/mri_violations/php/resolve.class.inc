<?php
namespace LORIS\mri_violations;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Implement and endpoint to handle POST requests which resolve
 * a given violation.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Resolve extends \NDB_Page
{
    /**
     * Check if user should be allowed to see this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if the user is permitted to see violated scans
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite'
            ]
        );
    }

    /**
     * Handle an incoming request by inserting or updating the resolved violation
     * status in the backend.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute("user");
        if (!$this->_hasAccess($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden("Access denied");
        }

        $requestdata = json_decode((string) $request->getBody(), true);
        if (!is_array($requestdata)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Must submit data in JSON format"
            );
        }

        $DB   = $this->loris->getDatabaseConnection();
        $hash = $requestdata['hash'];
        $val  = $requestdata['value'];

        $row = $DB->pselectRow(
            "SELECT * FROM violations_resolved
                WHERE hash = :hash",
            ['hash' => $hash]
        );

        $response = new \LORIS\Http\Response\JSON\OK($requestdata);
        //if row is found it means that resolve status was previously assigned,
        // check the value and update if needed, else break.
        if (!empty($row)) {
            if ($row['Resolved'] !== $val) {
                // user input doesn't match DB, so we update the DB
                $DB->update(
                    'violations_resolved',
                    [
                        'Resolved'   => (string)$val,
                        'ChangeDate' => date("Y-m-d H:i:s"),
                    ],
                    ['hash' => $hash],
                );
                // Status: 200 OK
            } else {
                // Not modified
                $response = $response->withStatus(304);
            }
        } else if ($val !== 'unresolved') {
            // no need to insert to DB for Unresolved value.

            // Base of the insert
            $newlyResolved = [
                'hash'       => $hash,
                'Resolved'   => (string)$val,
                'User'       => $user->getUsername(),
                'ChangeDate' => date("Y-m-d H:i:s")
            ];

            // Figure out which table the hash is for and the primary
            // key for it.

            // Table 1: mri_protocol_violated_scans
            $ID_mri_protocol_violated_scans = $DB->pselectOne(
                "SELECT ID
                FROM mri_protocol_violated_scans
                WHERE (:hash = md5(concat_WS(
                          ':',minc_location,PatientName,SeriesUID,time_run,
                                PhaseEncodingDirection,TE_range,EchoNumber)
                               )
                )",
                ['hash' => $hash]
            );
            if (!empty($ID_mri_protocol_violated_scans)) {
                $newlyResolved['TypeTable'] = 'mri_protocol_violated_scans';
                $newlyResolved['ExtID']     = $ID_mri_protocol_violated_scans;
            }

            // Table 2: mri_violations_log
            $ID_mri_violations_log = $DB->pselectOne(
                "SELECT LogID
                FROM mri_violations_log
                WHERE (:hash = md5(concat_WS(
                                ':',MincFile,PatientName,SeriesUID,TimeRun,
                                PhaseEncodingDirection,EchoTime,EchoNumber)
                               )
                )",
                ['hash' => $hash]
            );

            if (!empty($ID_mri_violations_log)) {
                $newlyResolved['TypeTable'] = 'mri_violations_log';
                $newlyResolved['ExtID']     = $ID_mri_violations_log;
            }

            // Table 3: MRICandidateErrors
            $ID_MRICandidateErrors = $DB->pselectOne(
                "SELECT ID
                FROM MRICandidateErrors
                WHERE (:hash = md5(concat_WS(
                                ':',MincFile,PatientName,SeriesUID,TimeRun,
                                PhaseEncodingDirection,EchoTime,EchoNumber)
                               )
                )",
                ['hash' => $hash]
            );

            if (!empty($ID_MRICandidateErrors)) {
                $newlyResolved['TypeTable'] = 'MRICandidateErrors';
                $newlyResolved['ExtID']     = $ID_MRICandidateErrors;
            }
            $DB->insert('violations_resolved', $newlyResolved);

            // Created
            $response = $response->withStatus(201);
        }
        return $response;
    }
}

