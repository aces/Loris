<?php
/**
 * Handles a request to the project's images portion of the Loris API
 *
 * PHP Version 7
 *
 * @category Main
 * @package  API
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace Loris\API\Projects;
//Load config file and ensure paths are correct
set_include_path(get_include_path() . ":" . __DIR__ . "/../");

require_once 'APIBase.php';

/**
 * Class to handle project's images portion of the Loris API
 *
 * @category Main
 * @package  API
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Images extends \Loris\API\APIBase
{
    var $RequestData;
    private $_project;

    /**
     * Create a Candidates request handler
     *
     * @param string $method The HTTP request method of the request
     * @param array  $data   The data that was POSTed to the request
     */
    public function __construct($method, $data=null)
    {

        $this->AllowedMethods = array('GET');
        $this->AutoHandleRequestDelegation = false;

        parent::__construct($method);

        $projectName = $data['project_name'];

        try {
            $this->_project = $this->Factory->project($projectName);
        } catch (\LorisException $e) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error(['error' => 'Invalid project']);
            $this->safeExit(0);
        }

        try {
            $dateString = $data['since'] ?? '1970-01-01';
            $this->RequestData['since'] = new \DateTime($dateString);
        } catch(\Exception $e) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error(['error' => 'Invalid date']);
            $this->safeExit(0);
        }

        $this->handleRequest();

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
            "SELECT MAX(f.InsertTime) as Time,
                    COUNT(1) as NumImages
             FROM files f
             JOIN session s ON (f.SessionID = s.ID)
             JOIN candidate c USING (CandID)
             JOIN Project p USING (ProjectID)
             WHERE
                  f.InsertTime > :v_time AND
                  p.Name = :v_project_name",
            array(
             'v_time'         => $this->RequestData['since']->getTimestamp(),
             'v_project_name' => $this->_project->getName(),
            )
        );
        return md5(
            'Images:'
            . $ETagCriteria['Time']
            . ':' . $ETagCriteria['NumImages']
        );
    }
    /**
     * Handles a candidates GET request
     *
     * @return none, but populates $this->JSON
     */
    public function handleGET()
    {
        $result = $this->DB->pselect(
            "SELECT
               s.CandID,
               s.Visit_label,
               f.File,
               mst.Scan_type,
               f.InsertTime
             FROM files f 
             LEFT JOIN mri_scan_type mst
               ON (mst.ID = f.AcquisitionProtocolID)
             LEFT JOIN session s
               ON (f.SessionID = s.ID)
             WHERE
                  f.InsertTime > :v_time
             ORDER BY f.InsertTime ASC",
            array('v_time' => $this->RequestData['since']->getTimestamp())
        );

        $images = array_map(
            function ($item) {
                $candid      = $item['CandID'];
                $session     = $item['Visit_label'];
                $file_name   = basename($item['File']);
                $scan_type   = $item['Scan_type'];
                $link        = "/candidates/$candid/$session/images/$file_name";
                $insert_time = date('c', $item['InsertTime']);
                return array(
                        'Candidate'  => $candid,
                        'Visit'      => $session,
                        'ScanType'   => $scan_type,
                        'Link'       => $link,
                        'InsertTime' => $insert_time,
                       );
            },
            $result
        );

        $this->JSON = ["Images" => $images];
    }
}

$input = null;
switch ($_SERVER['REQUEST_METHOD']) {
case 'GET':
    $input = $_GET;
    break;
}
print (new Images($_SERVER['REQUEST_METHOD'], $input))->toJSONString();

