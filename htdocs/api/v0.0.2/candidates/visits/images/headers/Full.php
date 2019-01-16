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
class Full extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The filename being retrieved
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
     * Handles a GET request
     *
     * @return void (but populates $this->JSON)
     */
    public function handleGET()
    {
        $headersDB = $this->getHeaders();

        $headers = [];
        foreach ($headersDB as $row) {
            $headers[$row['Header']] = $row['Value'];
        }
        $this->JSON = [
                       'Meta'    => [
                                     'CandID'   => $this->CandID,
                                     'Visit'    => $this->VisitLabel,
                                     'Filename' => $this->Filename,
                                    ],
                       "Headers" => $headers,
                      ];
    }

    /**
     * Retrieves all headers for this file from the database.
     *
     * @return array
     */
    protected function getHeaders()
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->Database();

        // Get all fields from parameter_type "magically created by
        // neurodb", since those are the dicom headers.
        // There's a few headers that get magically created which
        // aren't header fields, so we manually exclude them.
        // Namely:
        //
        // md5hash, tarchiveMD5, image_comments, check_pic_filename,
        // jiv_path
        return $db->pselect(
            "SELECT pt.Name as Header, Value
            FROM parameter_file pf 
                JOIN parameter_type pt USING (ParameterTypeID)
                JOIN files f USING (FileID)
                JOIN session s ON (f.SessionID=s.ID)
                JOIN candidate c ON (s.CandID=c.CandID)
            WHERE c.Active='Y' AND s.Active='Y' AND c.CandID=:CID AND 
                s.Visit_label=:VL AND f.File LIKE CONCAT('%', :Fname) 
                AND pt.Description LIKE '%magically%'
                AND pt.Name NOT IN (
                    'md5hash',
                    'tarchiveMD5',
                    'image_comments',
                    'check_pic_filename',
                    'jiv_path'
                )
                ",
            array(
             'CID'   => $this->CandID,
             'VL'    => $this->VisitLabel,
             'Fname' => $this->Filename,
            )
        );

    }

    /**
     * Calculate the entity tag for this URL
     *
     * @return ?string
     */
    public function calculateETag(): ?string
    {
        return null;
    }
}

if (isset($_REQUEST['PrintHeadersFull'])) {
    $obj = new Full(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
    print $obj->toJSONString();
}

