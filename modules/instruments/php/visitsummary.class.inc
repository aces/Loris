<?php declare(strict_types=1);

namespace LORIS\instruments;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * The VisitSummary endpoint returns a summary of instrument
 * data entry for a particular candidate's visit. This is primarily
 * to be used by the instrument list widget.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class VisitSummary extends \NDB_Page
{
    /**
     * Temp for testing.
     *
     * @param \User $user The user whose access is to be verified
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute("user");
        if ($user === null && !($user instanceof \User)) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "No valid user"
            );
        }
        if (!($this->_hasAccess($user))) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        $params = $request->getQueryParams();
        if (!isset($params['CandID'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Missing CandID query parameter"
            );
        }

        if (!isset($params['VisitLabel'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Missing VisitLabel query parameter"
            );
        }

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGet(
                new CandID($params['CandID']),
                $params['VisitLabel'],
            );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                array('GET')
            );
        }
    }

    /**
     * Helper to specifically handle PATCH HTTP methods to the endpoint.
     *
     * @param CandID $candid     The CandID for the visit.
     * @param string $visitLabel The visit label string.
     *
     * @return ResponseInterface
     */
    private function _handleGET(
        CandID $candid, string $visitLabel
    ) : ResponseInterface {
        $DB = \NDB_Factory::singleton()->database();

        $bvl_result = $DB->pselect(
            "SELECT
                f.Test_name,
                f.CommentID,
                COUNT(cu.ConflictID) AS NumOfConflict
            FROM session s
                LEFT JOIN flag f ON (s.ID = f.SessionID)
                LEFT JOIN conflicts_unresolved cu
                    ON (cu.CommentId1=f.CommentID OR cu.CommentID2=f.CommentID)
                LEFT JOIN candidate c USING (CandID)
            WHERE c.Active='Y' AND s.Active='Y' AND 
                c.CandID=:candid AND s.Visit_Label=:vl
                AND f.CommentID NOT LIKE 'DDE%'
            GROUP BY
                s.Visit_label,
                s.ID,
                s.Date_visit,
                f.Test_name,
                f.CommentID,
                s.Current_stage,
                s.Screening,
                s.Visit,
                s.Approval
            ORDER BY s.Visit_label, f.Test_name, f.CommentID",
            array('candid' => $candid, 'vl' => $visitLabel)
        );

        foreach ($bvl_result as $key => $row) {
            $testName  = $row['Test_name'];
            $commentID = $row['CommentID'];

            $instrument = \NDB_BVL_Instrument::factory(
                $testName,
                $commentID,
                '',
                false
            );
            if ($instrument === null) {
                $bvl_result[$key]['Completion'] = 0;
            } else {
                $completion = $instrument->determineDataEntryCompletionProgress();
                $bvl_result[$key]['Completion'] = $completion;
            }
        }

        return new \LORIS\Http\Response\JSON\OK($bvl_result);
    }
}
