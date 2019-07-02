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
class Headers extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The filename whose headers we want
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
     * @return void but populates $this->JSON
     */
    public function handleGET()
    {
        $te = $this->getHeader('acquisition:echo_time');
        $tr = $this->getHeader('acquisition:repetition_time');
        $ti = $this->getHeader('acquisition:inversion_time');
        $st = $this->getHeader('acquisition:slice_thickness');

        $seriesName        =  $this->getHeader("acquisition:protocol");
        $seriesDescription = $this->getHeader("acquisition:series_description");

        $xspace = array(
                   "Length"   => $this->getHeader("xspace:length"),
                   "StepSize" => $this->getHeader("xspace:step"),
                  );
        $yspace = array(
                   "Length"   => $this->getHeader("yspace:length"),
                   "StepSize" => $this->getHeader("yspace:step"),
                  );
        $zspace = array(
                   "Length"   => $this->getHeader("zspace:length"),
                   "StepSize" => $this->getHeader("zspace:step"),
                  );
        $timeD  = array(
                   "Length"   => $this->getHeader("time:length"),
                   "StepSize" => $this->getHeader("time:step"),
                  );

        $manufacturer    = $this->getHeader("study:manufacturer");
        $model           = $this->getHeader("study:device_model");
        $softwareVersion = $this->getHeader("study:software_version");
        $serialNumber    = $this->getHeader("study:serial_no");
        $fieldStrength   = $this->getHeader("study:field_value");

        $this->JSON = array(
                       'Meta'        => array(
                                         'CandID'   => $this->CandID,
                                         'Visit'    => $this->VisitLabel,
                                         'Filename' => $this->Filename,
                                        ),
                       'Physical'    => array(
                                         "TE"             => $te,
                                         "TR"             => $tr,
                                         "TI"             => $ti,
                                         "SliceThickness" => $st,
                                        ),
                       'Description' => array(
                                         "SeriesName"        => $seriesName,
                                         "SeriesDescription" => $seriesDescription,
                                        ),
                       'Dimensions'  => array(
                                         "XSpace"        => $xspace,
                                         "YSpace"        => $yspace,
                                         "ZSpace"        => $zspace,
                                         "TimeDimension" => $timeD,
                                        ),
                       'ScannerInfo' => array(
                                         "Manufacturer"    => $manufacturer,
                                         "Model"           => $model,
                                         "SoftwareVersion" => $softwareVersion,
                                         "SerialNumber"    => $serialNumber,
                                         "FieldStrength"   => $fieldStrength,
                                        ),
                      );
    }

    /**
     * Calculate the entity tag for this URL
     *
     * @return string
     */
    public function calculateETag()
    {
        return null;
    }
}

if (isset($_REQUEST['PrintHeadersSummary'])) {
    $obj = new Headers(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
    print $obj->toJSONString();
}

