<?php
/**
 * Handles API requests for the candidate's DICOM files
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Mouna Safi-Harab <mouna.safiharab@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates\Candidate\Visit;
require_once '../Visit.php';

/**
 * Handles API requests for the candidate's DICOM files. Extends
 * Visit so that the constructor will validate the candidate
 * and visit_label portion of the URL automatically.
 *
 * @category Main
 * @package  API
 * @author   Mouna Safi-Harab <mouna.safiharab@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Dicoms extends \Loris\API\Candidates\Candidate\Visit
{
    /**
     * Construct a Dicoms class object to serialize candidate visit DICOMs
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     */
    public function __construct($method, $CandID, $VisitLabel)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;

        parent::__construct($method, $CandID, $VisitLabel);

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
        $this->JSON = [
                       'Meta' => [
                                  'CandID' => $this->CandID,
                                  'Visit'  => $this->VisitLabel,
                                 ],
                      ];
        $this->JSON['DicomTars'] = $this->getVisitDicoms();

    }

    /**
     * Gets a list of DICOM archives (.tar) for this visit. Tarname only.
     *
     * @return array of strings of Tarnames
     */
    function getVisitDicoms()
    {
        $factory   = \NDB_Factory::singleton();
        $DB        = $factory->database();
        $cand_info = $DB->pselectRow(
            "SELECT c.PSCID, c.Entity_type
                FROM candidate c
                    JOIN session s ON (c.CandID=s.CandID)
                WHERE c.Active='Y' AND s.Active='Y'
                AND c.CandID=:CID
                AND s.Visit_label=:VL",
            [
             'CID' => $this->CandID,
             'VL'  => $this->VisitLabel,
            ]
        );
        if ($cand_info['Entity_type'] == 'Scanner') {
            $ID = ":PVL";
            $params['PCandID'] = $this->CandID;
            $params['PVL']     = $this->VisitLabel;
        } else {
            $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            $params['PPSCID']  = $cand_info['PSCID'];
            $params['PCandID'] = $this->CandID;
            $params['PVL']     = $this->VisitLabel;
        }

        $query = "SELECT SUBSTRING_INDEX(ArchiveLocation, '/', -1) as Tarname,
           ts.SeriesDescription as SeriesDescription,
           ts.SeriesNumber as SeriesNumber,
           ts.EchoTime as EchoTime,
           ts.RepetitionTime as RepetitionTime,
           ts.InversionTime as InversionTime,
           ts.SliceThickness as SliceThickness,
           ts.Modality as Modality,
           ts.SeriesUID as SeriesUID
           FROM tarchive t
           JOIN session s ON (t.SessionID=t.SessionID)
           JOIN candidate c ON (s.CandID=c.CandID)
           JOIN tarchive_series ts ON (ts.TarchiveID=t.TarchiveID)
           WHERE t.PatientName LIKE $ID
           AND c.Active='Y' AND s.Active='Y' 
           AND c.CandID=:PCandID AND s.Visit_label=:PVL
           GROUP BY t.TarchiveID, ts.SeriesDescription, ts.SeriesNUmber,
           ts.EchoTime, ts.RepetitionTime, ts.InversionTime, ts.SliceThickness,
           ts.Modality, ts.SeriesUID
           ORDER BY Tarname";

        $rows = $DB->pselect($query, $params);

        $result = array();
        $entry  = array();

        // The following loop will create the DicomTar object, formatted
        // according to:
        // [{"Tarname1" :"DCM_yyyy-mm-dd_ImagingUpload-hh-mm-abc123.tar",
        // "SeriesInfo1":[{"Series1Field1":"Value", "Series1Field2":"Value", ...},
        //                {"Series2Field1":"Value", "Series1Field2":"Value", ...},
        //                ...}],
        // },
        // ... as Multiple TarNames/SeriesInfo can be present here
        // ]
        foreach ($rows as $row) {
            if (empty($entry)) {
                $entry['Tarname']    = $row['Tarname'];
                $entry['SeriesInfo'] = array();
            } else if ($entry['Tarname'] !== $row['Tarname']) {
                $result[] = $entry;
                unset($entry);
                $entry['Tarname']    = $row['Tarname'];
                $entry['SeriesInfo'] = array();
            }
            unset($row['Tarname']);
            $entry['SeriesInfo'][] = $row;
        }

        $result[] = $entry;
        return $result;
    }
}

if (isset($_REQUEST['PrintDicoms'])) {
    $obj = new Dicoms(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel']
    );
    print $obj->toJSONString();
}

