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
    /**
     * Keeps array of protocols from mri_protocol
     */
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
                ORDER BY :OField";
            $array = $this->DB->pselect(
                $query, array('ID' => $tarchiveID, "OField" => $order)
            );
            
            if ($this->_setProtocols()) {
                $previousSeriesDescription = '';
                $previousProtocolName = '';
                foreach ($array as &$item) {
                    $seriesDescription = $item['SeriesDescription'];
                    // if the same serie, do not compute the protocol name again,
                    // use the previous one
                    if ($previousSeriesDescription === $seriesDescription) {
                        $item['ProtocolName'] = $previousProtocolName;
                    } else {
                        $protocolName = $this->_getProtocolName($item);
                        $item['ProtocolName'] = $protocolName;
                        $previousSeriesDescription = $seriesDescription;
                        $previousProtocolName = $protocolName;
                    }
                }
            }
            break;
        case "tarchive_files":
            $query = "SELECT * FROM $table WHERE TarchiveID =:ID
                ORDER BY :OField";
            $array = $this->DB->pselect(
                $query, array('ID' => $tarchiveID, 'OField' => $order)
            );
            break;
        }
        
        if (Utility::isErrorX($array)) { 
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

    /**
     * Gets protocol data from mri_protocol table and 
     * registers it into class variable $protocols.
     *
     * @return bool false if couldn't retrieve data from the table, else true
     */
    function _setProtocols() 
    {
        $query = "SELECT Scan_type, TR_range, TE_range, TI_range, 
            slice_thickness_range FROM mri_protocol";
        $this->protocols = $this->DB->pselect($query, array());
        if (Utility::isErrorX($this->protocols)) { 
            return false;
        } else {
            return true;
        }
    }
    /**
     * Finds the protocol name by comparing parameters of a series.
     * 
     * @param array $series series for which the protocol is to be found
     *
     * @return string name of the protocol, "Unknown" if protocol for
     *         series parameters doesn't exist
     */
    function _getProtocolName($series)
    {
        $tr = $series['RepetitionTime'];
        $te = $series['EchoTime'];
        $ti = $series['InversionTime'];
        $sliceThickness = $series['SliceThickness'];

        foreach ($this->protocols as $protocol) {
            if ((! $protocol['TR_range'] 
                || $this->_inRange($tr, $protocol['TR_range']))
                && (! $protocol['TE_range'] 
                || $this->_inRange($te, $protocol['TE_range']))
                && (! $protocol['TI_range'] 
                || $this->_inRange($ti, $protocol['TI_range']))
                && (! $protocol['slice_thickness_range'] 
                || $this->_inRange(
                    $sliceThickness, $protocol['slice_thickness_range']
                ))) {
                return $this->_getProtocolNameFromID($protocol['Scan_type']);
            } 
        }
        return "Unknown"; 
    }

    /**
     * Compares parameters of a series and of the protocols
     * 
     * @param string $seriesRange    series parameter to be compared
     * @param string $protocolRange protocol's parameter 
     *        to be compared with
     *
     * @return bool true if series parameter is in range with 
     *         the protocol's one, false otherwise
     */
    function _inRange($seriesRange, $protocolRange) 
    {
        if (! isset($seriesRange)) {
            return false;
        } else if (! isset($protocolRange)) {
            return false;
        } else {
            $seriesRangeTrimmed = (float)trim($seriesRange);
            $protocolRanges = split(",", $protocolRange);
            
            foreach ($protocolRanges as $range) {
                $rangeTrimmed = trim($range);
                if (strpos($rangeTrimmed, "-")) { // range X-Y
                    $array = split("-", $rangeTrimmed);
                    $left = (float)trim($array[0]);
                    $right = (float)trim($array[1]);
                    if ($left <= $seriesRangeTrimmed 
                        && $seriesRangeTrimmed <= $right
                    ) {
                        return true;
                    }
                } else { // single value element
                    if ($seriesRangeTrimmed === (float)$rangeTrimmed) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    /**
     * Retrieves the protocol name given the protocol ID
     * from mri_scan_table table
     *
     * @param string $id id of the protocol
     *
     * @return string name of the protocol, "Unknown" if 
     *         protocol with the given id doesn't exist.
     */
    function _getProtocolNameFromID($id) 
    {
        $query = "SELECT Scan_type FROM mri_scan_type WHERE ID=:ID";
        $array = $this->DB->pselectRow($query, array('ID' => $id));
        if (Utility::isErrorX($array)) {
            return "Unknown";
        } else {
            return $array['Scan_type'];
        }
    }
}
?>
