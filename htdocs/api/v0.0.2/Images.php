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
class Images extends APIBase
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
        $this->AllowedMethods = array(
            'GET',
        );

        $this->RequestData['since'] = $data['since'] ?? '1970-01-01 00:00:01';

        if (strtotime($this->RequestData['since']) === false) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Invalide date");
            $this->safeExit(0);
        }

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
            "SELECT MAX(InsertTime) as Time,
                    COUNT(1) as NumImages
             FROM files
             WHERE
                  InsertTime > :v_time",
            array('v_time' => strtotime($this->RequestData['since']) ?? 0)
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
               i.File
             FROM files i 
             LEFT JOIN session s
               ON (i.SessionID = s.ID)
             WHERE
                  InsertTime > :v_time",
            array('v_time' => strtotime($this->RequestData['since']) ?? 0)
        );

        $images = array_map(function($item) {
            $candid    = $item['CandID'];
            $session   = $item['Visit_label'];
            $file_name = basename($item['File']);
            $link = "/candidates/$candid/$session/images/$file_name";
            return array(
                'link' => $link,
            );
        }, $result);

        $this->JSON = ["Images" => $images];
    }
}

print (new Images($_SERVER['REQUEST_METHOD'], $_GET))->toJSONString();
