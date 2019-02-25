<?php
/**
 * Implements the ViewDetails subpage of the dicom_archive module.
 *
 * PHP version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
*/
namespace LORIS\dicom_archive;

/**
 * Implements the ViewDetails subpage of the dicom_archive module.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class ViewDetails extends \NDB_Form
{
    /**
     * Keeps array of protocols from mri_protocol
     */
    var $protocols;

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        $user = \User::singleton();
        return $user->hasPermission('dicom_archive_view_allsites');
    }

    /**
    * Sets up main parameters
    *
    * @return void
    */
    function setup()
    {
        $this->DB = \Database::singleton();

        if ((!empty($_REQUEST['tarchiveID'])) && ($this->_hasAccess())) {
            $tarchiveID = $_REQUEST['tarchiveID'];
            $this->tpl_data['archive']        = $this->_getTarchiveData(
                $tarchiveID,
                'tarchive',
                'LastUpdate'
            );
            $this->tpl_data['archive_series'] = $this->_getTarchiveData(
                $tarchiveID,
                'tarchive_series',
                'TarchiveSeriesID'
            );
            $this->tpl_data['archive_files']  = $this->_getTarchiveData(
                $tarchiveID,
                'tarchive_files',
                'TarchiveFileID'
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
                $query,
                array(
                 'ID'     => $tarchiveID,
                 "OField" => $order,
                )
            );

            if ($this->_setProtocols()) {
                $previousSeriesDescription = '';
                $previousProtocolName      = '';
                foreach ($array as &$series) {
                    $seriesDescription = $series['SeriesDescription'];
                    // if the same series, do not compute the protocol name again,
                    // use the previous one
                    if ($previousSeriesDescription === $seriesDescription) {
                        $series['ProtocolName'] = $previousProtocolName;
                    } else {
                        $protocolName           = $this->_getProtocolName($series);
                        $series['ProtocolName'] = $protocolName;
                        $previousSeriesDescription = $seriesDescription;
                        $previousProtocolName      = $protocolName;
                    }
                }
            }
            break;
        case "tarchive_files":
            $query = "SELECT * FROM $table WHERE TarchiveID =:ID
                ORDER BY :OField";
            $array = $this->DB->pselect(
                $query,
                array(
                 'ID'     => $tarchiveID,
                 'OField' => $order,
                )
            );
            break;
        }

        return $array;
    }
    /**
    * Validates PatientName and PatientID,
    * sets INVALID-HIDDEN if not validated.
    *
    * @return null
    */
    function _validateNamesIds()
    {
        $config =& \NDB_Config::singleton();
        $dicomArchiveSettings = $config->getSetting('imaging_modules');

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
            $this->tpl_data['archive']['PatientName']      = "INVALID - HIDDEN";
        }

        if (preg_match(
            $dicomArchiveSettings['patientIDRegex'],
            $this->tpl_data['archive']['PatientID']
        )) {
            $this->tpl_data['archive']['patientIDValid'] = 1;
        } else {
            $this->tpl_data['archive']['patientIDValid'] = 0;
            $this->tpl_data['archive']['PatientID']      = "INVALID - HIDDEN";
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
        try {
            $query           = "SELECT Scan_type, TR_min, TR_max, TE_min, TE_max,
                TI_min, TI_max, slice_thickness_min, slice_thickness_max FROM
                mri_protocol";
            $this->protocols = $this->DB->pselect($query, array());
            return true;
        } catch(\LorisException $e) {
            return false;
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
            if (((! $protocol['TR_min'] && ! $protocol['TR_max'])
                || $this->_inRange($tr, $protocol['TR_min'], $protocol['TR_max']))
                && ((! $protocol['TE_min'] && ! $protocol['TE_max'])
                || $this->_inRange($te, $protocol['TE_min'], $protocol['TE_max']))
                && ((! $protocol['TI_min'] && ! $protocol['TI_max'])
                || $this->_inRange($ti, $protocol['TI_min'], $protocol['TI_max']))
                && ((! $protocol['slice_thickness_min']
                && ! $protocol['slice_thickness_max'])
                || $this->_inRange(
                    $sliceThickness,
                    $protocol['slice_thickness_min'],
                    $protocol['slice_thickness_max']
                ))) {
                return $this->_getProtocolNameFromID($protocol['Scan_type']);
            }
        }
        return "Unknown";
    }

    /**
     * Compares parameters of a series and of the protocols
     *
     * @param string $seriesRange series parameter to be compared
     * @param string $protocolMin minimum value of protocol's parameter
     *        to be compared with
     * @param string $protocolMax maximum value of protocol's parameter
     *         to be compared with
     *
     * @return bool true if series parameter is in range with
     *         the protocol's one, false otherwise
     */
    function _inRange($seriesRange, $protocolMin, $protocolMax)
    {
        if (!isset($seriesRange)) {
            return false;
        }
        if (!isset($protocolMin) && !isset($protocolMax)) {
            return true;
        } elseif (isset($protocolMin) && $protocolMax == null) {
            return $protocolMin <= $seriesRange;
        } elseif (!isset($protocolMax) && $protocolMin == null) {
            return $seriesRange <= $protocolMax;
        } else {
            return $protocolMin <= $seriesRange && $seriesRange <= $protocolMax;
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
        try {
            $query = "SELECT Scan_type FROM mri_scan_type WHERE ID=:ID";
            $array = $this->DB->pselectRow($query, array('ID' => $id));
            return $array['Scan_type'];
        } catch (\LorisException $e) {
            return "Unknown";
        }
    }

    /**
     * Adds custom CSS for the viewdetails table styling.
     *
     * @return array of CSS to include in the page
     */
    function getCSSDependencies()
    {
        $depends = parent::getCSSDependencies();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        return array_merge(
            $depends,
            [$baseURL . "/dicom_archive/css/dicom_archive.css"]
        );
    }

    /**
     * Overrides base getJSDependencies() to add additional JS files
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/dicom_archive/js/view_details_link.js",
            )
        );
    }

    /**
      * Generate a breadcrumb trail for this page.
      *
      * @return \LORIS\BreadcrumbTrail
      */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $label = ucwords(str_replace('_', ' ', $this->name));
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($label, "/$this->name"),
            new \LORIS\Breadcrumb(
                'View Details',
                "/dicom_archive/viewDetails?tarchiveID=$this->tarchiveID"
            )
        );
    }
}
?>
