<?php
/**
 * form_dicom_archive class file
 *
 * PHP version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    Loris License
 * @link       https://github.com/aces/Loris-Trunk
*/

require_once 'NDB_Form.class.inc';

/**
 * NDB_Form_Dicom_Archive Class
 *
 * This class is dicom archive Form
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    Loris License
 * @link       https://github.com/aces/Loris-Trunk
*/

class NDB_Form_Dicom_Archive extends NDB_Form
{
    var $protocols;
    /**
    * Sets up main parameters
    *
    * @return NULL
    */
    function viewDetails()
    {
        $this->DB = Database::singleton();
        if (Utility::isErrorX($DB)) {
            print "Could not connect to database: ".$DB->getMessage()."<br>\n";
            die();
        }

        if (!empty($_REQUEST['tarchiveID'])) {
            $tarchiveID = $_REQUEST['tarchiveID'];
            $this->tpl_data['archive'] = $this->_getTarchiveData(
                $tarchiveID, 'tarchive'
            );
            $this->tpl_data['archive_series'] = $this->_getTarchiveData(
                $tarchiveID, 'tarchive_series', 'TarchiveSeriesID'
            );
            $this->tpl_data['archive_files'] = $this->_getTarchiveData(
                $tarchiveID, 'tarchive_files', 'TarchiveFileID'
            );

            $this->_validateNamesIDs();
        }
    }
    /**
    * Retrieves data for the template from the database
    * 
    * @param int    $tarchiveID tarchiveID
    * @param string $table      name of the table to retrieve the data from
    * @param string $order      column by which to order the query
    * 
    * @return array $array contains all data
    */
    function _getTarchiveData($tarchiveID, $table, $order) 
    {
        switch ($table) {
        case "tarchive":
            $query = "SELECT * FROM $table WHERE TarchiveID =:ID";
            $array = $this->DB->pselectRow($query, array('ID' => $tarchiveID));
            break;
        case "tarchive_series":
            $query = "SELECT * FROM $table WHERE TarchiveID =:ID 
                ORDER BY $order";
            $array = $this->DB->pselect($query, array('ID' => $tarchiveID));
            
            if ($this->_setProtocols()) {
                $previousSerieDescription = '';
                $previousProtocolName = '';
                foreach ($array as &$serie) {
                    $serieDescription = $serie['SeriesDescription'];
                    // if the same serie, do not compute the protocol name again,
                    // use the previous one
                    if ($previousSerieDescription === $serieDescription) {
                        $serie['ProtocolName'] = $previousProtocolName;
                    } else {
                        $protocolName = $this->_getProtocolName($serie);
                        $serie['ProtocolName'] = $protocolName;
                        $previousSerieDescription = $serieDescription;
                        $previousProtocolName = $protocolName;
                    }
                }
            }
            break;
        case "tarchive_files":
            $query = "SELECT * FROM $table WHERE TarchiveID =:ID
                ORDER BY $order";
            $array = $this->DB->pselect($query, array('ID' => $tarchiveID));
            break;
        }
        
        if (Utility::isErrorX($array)) { 
            print $array->getMessage()."\n";
            return null;
        } else {
            return $array;
        }
    }
    /**
    * Validates PatientName and PatientID,
    * sets INVALID-HIDDEN if not validated.
    *
    * @return null
    */
    function _validateNamesIds() 
    {
        $config =& NDB_Config::singleton();
        $dicomArchiveSettings = $config->getSetting('dicom_archive');
        
        if ((preg_match(
            $dicomArchiveSettings['patientNameRegex'], 
            $this->tpl_data['archive']['PatientName']
        )) || (preg_match(
            $dicomArchiveSettings['LegoPhantomRegex'],
            $this->tpl_data['archive']['PatientName']
        )) || (preg_match(
            $dicomArchiveSettings['LivingPhantomRegex'],
            $this->tpl_data['archive']['PatientName']
        ))) {
            $this->tpl_data['archive']['patientNameValid'] = 1;
        } else {
            $this->tpl_data['archive']['patientNameValid'] = 0;
            $this->tpl_data['archive']['PatientName'] = "INVALID - HIDDEN";
        }
        
        if (preg_match(
            $dicomArchiveSettings['patientIDRegex'],
            $this->tpl_data['archive']['PatientID']
        )) {
            $this->tpl_data['archive']['patientIDValid'] = 1;
        } else {
            $this->tpl_data['archive']['patientIDValid'] = 0;
            $this->tpl_data['archive']['PatientID'] = "INVALID - HIDDEN";
        }
    }

    function _setProtocols() {
        $query = "SELECT Scan_type, TR_range, TE_range, TI_range, 
            slice_thickness_range FROM mri_protocol";
        $this->protocols = $this->DB->pselect($query);
        if (Utility::isErrorX($this->protocols)) { 
            print $array->getMessage()."\n";
            return 0;
        } else {
            return 1;
        }
    }

    function _getProtocolName($serie)
    {
        $tr = $serie['RepetitionTime'];
        $te = $serie['EchoTime'];
        $ti = $serie['InversionTime'];
        $sliceThickness = $serie['SliceThickness'];

        foreach ($this->protocols as $protocol) {
            if (
                (! $protocol['TR_range'] || $this->_inRange($tr, $protocol['TR_range']))
                && (! $protocol['TE_range'] || $this->_inRange($te, $protocol['TE_range']))
                && (! $protocol['TI_range'] || $this->_inRange($ti, $protocol['TI_range']))
                && (
                    ! $protocol['slice_thickness_range'] 
                    || $this->_inRange($sliceThickness, $protocol['slice_thickness_range'])
                )
            ) {
                return $this->_getProtocolNameFromID($protocol['Scan_type']);
            } 
        }
        return "Unknown"; 
    }

    function _inRange($serieRange, $protocolRange) {
        if (! isset($serieRange)) {
            return 0;
        } else if (! isset($protocolRange)) {
            return 0;
        } else {
            $serieRangeTrimmed = (int)trim($serieRange);
            $protocolRanges = split(",", $protocolRange);
            
            foreach ($protocolRanges as $range) {
                $rangeTrimmed = trim($range);
                if (strpos($rangeTrimmed, "-")) { // range X-Y
                    $array = split("-", $rangeTrimmed);
                    $left = (int)trim($array[0]);
                    $right = (int)trim($array[1]);
                    if ($left <= $serieRangeTrimmed && $serieRangeTrimmed <= $right) {
                        return 1;
                    }
                } else { // single value element
                    if ($serieRangeTrimmed === (int)$rangeTrimmed) {
                        return 1;
                    }                                                                                 
                }
            }
            return 0;
        }
    }

    function _getProtocolNameFromID($id) {
        $query = "SELECT Scan_type FROM mri_scan_type WHERE ID=:ID";
        $array = $this->DB->pselectRow($query, array('ID' => $id));
        if (Utility::isErrorX($array)) {
            print $array->getMessage()."\n";
            return "Unknown";
        } else {
            return $array['Scan_type'];
        }
    }
}
?>
