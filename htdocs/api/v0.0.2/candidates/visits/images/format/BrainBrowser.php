<?php
/**
 * Handles API requests for the candidate's visit
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates\Candidate\Visit\Imaging\Format;
require_once __DIR__ . '/../Image.php';
/**
 * Handles API requests for the candidate's visit. Extends
 * Candidate so that the constructor will validate the candidate
 * portion of URL automatically.
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class BrainBrowser extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The filename whose brainbrowser data we want
     */
    public function __construct($method, $CandID, $VisitLabel, $Filename)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                     'PUT',
                                     'PATCH',
                                    ];
        }

        parent::__construct($method, $CandID, $VisitLabel, $Filename);

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }

    }

    /**
     * Helper function for handleGET to retrieve a dimension.
     *
     * @param string $dim The dimension to extract the headers for
     *
     * @return array
     */
    private function _getDimension($dim)
    {
        return [
                'start'        => $this->getHeader("$dim:start"),
                'space_length' => $this->getHeader("$dim:length"),
                'step'         => $this->getHeader("$dim:step"),
               ];
    }

    /**
     * Handles a GET request
     *
     * @return void (but populates $this->JSON)
     */
    public function handleGET()
    {
        $order      = $this->getHeader("image:dimorder");
        $orderArray = explode(",", $order);
        $this->JSON = [
                       'xspace' => $this->_getDimension("xspace"),
                       'yspace' => $this->_getDimension("yspace"),
                       "zspace" => $this->_getDimension("zspace"),
                      ];
        if (count($orderArray) === 4) {
            $this->JSON['time'] = $this->_getDimension("time");
        }
        $this->JSON['order'] = $orderArray;
    }

    /**
     * Extracts a header for this image from the database
     *
     * @param string $headerName The name of the header to extract
     *
     * @return string The Header value
     */
    protected function getHeader($headerName)
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->Database();

        return $db->pselectOne(
            "SELECT Value
            FROM parameter_file pf 
                JOIN parameter_type pt USING (ParameterTypeID)
                JOIN files f USING (FileID)
                JOIN session s ON (f.SessionID=s.ID)
                JOIN candidate c ON (s.CandID=c.CandID)
            WHERE c.Active='Y' AND s.Active='Y' 
                AND c.CandID=:CID and s.Visit_label=:VL
                AND f.File LIKE CONCAT('%', :Fname) AND pt.Name = :Header",
            array(
             'CID'    => $this->CandID,
             'VL'     => $this->VisitLabel,
             'Fname'  => $this->Filename,
             'Header' => $headerName,
            )
        );

    }

    /**
     * Calculate the entity tag for this URL.
     *
     * @return string
     */
    public function calculateETag()
    {
        return null;
    }

}

if (isset($_REQUEST['PrintBBFormat'])) {
    $obj = new BrainBrowser(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
    print $obj->toJSONString();
}

