<?php
/**
 * Handles a request to the candidates portion of the Loris API
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';

/**
 * Class to handle a request to the candidates portion of the Loris API
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidatesExtID extends APIBase
{
    var $RequestData;

    /**
     * Create a Candidates request handler
     *
     * @param string $method The HTTP request method of the request
     * @param array  $data   The data that was POSTed to the request
     */
    public function __construct($method, $data=null)
    {
        $this->AllowedMethods = [
            'GET',
        ];
        $this->RequestData    = $data;

        parent::__construct($method);
    }

    /**
     * Calculate an ETag by taking a hash of the number of candidates in the
     * database and the time of the most recently changed one.
     *
     * @return string An ETag for ths candidates object
     */
    function calculateETag()
    {
        $ETagCriteria = $this->DB->pselectRow(
            "SELECT MAX(TestDate) as Time,
                    COUNT(DISTINCT CandID) as NumCandidates
             FROM candidate WHERE Active='Y'",
            array()
        );
        return md5(
            'Candidates:'
            . $ETagCriteria['Time']
            . ':' . $ETagCriteria['NumCandidates']
        );
    }
    /**
     * Handles a candidates GET request
     *
     * @return void but populates $this->JSON
     */
    public function handleGET()
    {
        $result = $this->DB->pselect(
            "SELECT
                c.CandID,
                ProjectID,
                PSCID,
                s.Name as Site,
                EDC,
                DoB,
                Sex,
                ses.ID as SessionID,
                ses.Visit_label as VisitLabel
              FROM candidate c
                JOIN psc s on (s.CenterID=c.RegistrationCenterID)
                LEFT JOIN session ses USING (CandID)
              WHERE c.Active='Y' AND c.Entity_type!='Scanner'",
            []
        );

        $candidates = [];
        foreach ($result as $row) {
            if (empty($candidates[$row['CandID']])) {
                $candidates[$row['CandID']] = $row;
            }
            $candidates[$row['CandID']]['SessionIDs'][$row['VisitLabel']] = $row['SessionID'];
            unset($candidates[$row['CandID']]['SessionID']);
        }

        $projects   = \Utility::getProjectList();
        $candValues = array_map(
            function ($row) use ($projects) {
                $row['Project'] = isset($projects[$row['ProjectID']])
                    ? $projects[$row['ProjectID']]
                    : "loris";
                unset($row['ProjectID']);
                return $row;
            },
            $candidates
        );

        $this->JSON = ["Candidates" => $candValues];
    }
}

if (isset($_REQUEST['PrintCandidates'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $obj = new CandidatesExtID($_SERVER['REQUEST_METHOD']);
    }
    print $obj->toJSONString();
}
