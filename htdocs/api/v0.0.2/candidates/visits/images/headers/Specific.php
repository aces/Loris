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
namespace Loris\API\Candidates\Candidate\Visit\Imaging\Headers;
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
class SpecificHeader extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The file to retrieve the header for
     * @param string $Header     The header field to extract
     */
    public function __construct($method, $CandID, $VisitLabel, $Filename, $Header)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
        }

        parent::__construct($method, $CandID, $VisitLabel, $Filename);

        $this->Header = $Header;

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }

    }

    /**
     * Handles a GET request
     *
     * @return void (but populates $this->JSON)
     */
    public function handleGET()
    {

        foreach ($headersDB as $row) {
            $headers[$row['Header']] = $row['Value'];
        }
        $this->JSON = [
                       'Meta'  => [
                                   'CandID'   => $this->CandID,
                                   'Visit'    => $this->VisitLabel,
                                   'Filename' => $this->Filename,
                                   "Header"   => $this->Header,
                                  ],
                       "Value" => $this->getHeader($this->Header),
                      ];
    }

    /**
     * Calculate the ETag for this header
     *
     * @return string
     */
    public function calculateETag()
    {
        return null;
    }
}

if (isset($_REQUEST['PrintSpecificHeader'])) {
    $obj = new SpecificHeader(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename'],
        $_REQUEST['Header']
    );
    print $obj->toJSONString();
}

