<?php

/**
 * This class features the code for the menu portion
 * of the Loris dicom archive.
 *
 * PHP Version 5
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
 * Provides the PHP code for the menu filter for the dicom archive
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Dicom_Archive extends \NDB_Menu_Filter
{
    var $dicomArchiveSettings;

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
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return null
     */
    function _setupVariables()
    {
        $this->_setDicomArchiveSettings();

        $this->query = " FROM tarchive t
            LEFT JOIN session s ON (s.ID=t.SessionID)
            LEFT JOIN candidate c ON (c.CandID=s.CandID) WHERE 1=1";

        $colsFirst = array();

        $TransferStatus = $this->_getTransferStatusFromQuery();
        $arrayTransfer  = array($TransferStatus . " as Transfer_Status");

        $colsFirst = array_merge($colsFirst, $arrayTransfer);

        $colsLast = array(
                     't.PatientID as Patient_ID',
                     't.PatientName as Patient_Name',
                     't.PatientGender as Gender',
                     't.PatientDoB as Date_of_birth',
                     't.DateAcquired as Acquisition',
                     't.ArchiveLocation as Archive_Location',
                     "'View Details' as Metadata",
                     "'View Images' as MRI_Browser",
                     // For constructing links, not in headers array
                     "(SELECT GROUP_CONCAT(SeriesUID) FROM tarchive_series e WHERE ".
                     "e.TarchiveID=t.TarchiveID GROUP BY e.TarchiveID) as SeriesUID",
                     's.CenterID as site',
                     't.TarchiveID as TarchiveID',
                     's.ID as SessionID',
                    );

        $this->columns = array_merge($colsFirst, $colsLast);

        $this->order_by = 't.DateAcquired';

        $this->headers = [];

        if ($this->dicomArchiveSettings['showTransferStatus'] == 'true') {
            array_push($this->headers, 'Transfer_Status');
        }

        $this->headers = array_merge(
            $this->headers,
            [
             'Patient_ID',
             'Patient_Name',
             'Gender',
             'Date_of_birth',
             'Acquisition',
             'Archive_Location',
             'Metadata',
             'MRI_Browser',
             'Seriesuid',
             'Site',
             'TarchiveID',
             'SessionID',
            ]
        );

        // Set header as hidden from the data table
        $this->tpl_data['hiddenHeaders'] = json_encode(
            [
             'Seriesuid',
             'Site',
             'TarchiveID',
             'SessionID',
            ]
        );

        $this->validFilters = array(
                               'c.CenterID',
                               't.PatientID',
                               't.PatientGender',
                               't.DateAcquired',
                               't.PatientName',
                               't.PatientDoB',
                               't.ArchiveLocation',
                              );

        $this->formToFilter = array(
                               'SiteID'      => 'c.CenterID',
                               'PatientID'   => 't.PatientID',
                               'Gender'      => 't.PatientGender',
                               'Acquisition' => 't.DateAcquired',
                               'PatientName' => 't.PatientName',
                               'DoB'         => 't.PatientDoB',
                               'Location'    => 't.ArchiveLocation',
                              );

    }
    /**
    * Sets transfer status according to the data in the
    * config file.
    *
    * @return null
    */
    function _setDicomArchiveSettings()
    {
        $config =& \NDB_Config::singleton();
        $this->dicomArchiveSettings = $config->getSetting('dicom_archive');
    }

    /**
    * Retrieves Transfer status.
    * Queued if pending, date of sending if sent,
    * else not transferred
    *
    * @return string $query with a status string
    */
    function _getTransferStatusFromQuery()
    {
        if ($this->dicomArchiveSettings['showTransferStatus'] == 'true') {
            $query = "IF(
                t.PendingTransfer, 
                'Queued', 
                IF (
                    t.DateSent, 
                    CONCAT('Sent ', t.DateSent), 
                    'Not transferred'
                )
            )";
        } else {
            $query = "CONCAT(t.PendingTransfer, ' ', t.DateSent)";
        }
        return $query;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result          = $this->toArray();
        $result['Sites'] = \Utility::getSiteList();
        $result['hiddenHeaders'] = [
                                    'Seriesuid',
                                    'Site',
                                    'TarchiveID',
                                    'SessionID',
                                   ];

        return json_encode($result);
    }

    /**
     * Converts the data from the data table to an array suitable for JSON
     * serialiation. Overrides the base class in order to enforce name regex
     * rules.
     *
     * @return array of data from dicom_archive menu filter
     */
    function toArray()
    {
        $unanonymized = parent::toArray();
        $retVal       = array(
                         'Headers' => $unanonymized['Headers'],
                        );
        $data         = array();

        foreach ($unanonymized['Data'] as &$row) {
            $val = $row[2];
            if (!preg_match($this->dicomArchiveSettings['patientNameRegex'], $val)
                && !preg_match($this->dicomArchiveSettings['LegoPhantomRegex'], $val)
                && !preg_match(
                    $this->dicomArchiveSettings['LivingPhantomRegex'],
                    $val
                )
            ) {
                $row[2] = "INVALID - HIDDEN";
            }

            $val = $row[1];
            if (! preg_match($this->dicomArchiveSettings['patientIDRegex'], $val)) {
                $row[1] = 'INVALID - HIDDEN';
            }

            // remove Transfer_Status column if showTransferStatus is false
            if ($this->dicomArchiveSettings['showTransferStatus'] == 'false') {
                array_shift($row);
            }

            $data[] = $row;
        }
        return array(
                'Headers' => $unanonymized['Headers'],
                'Data'    => $data,
               );

    }

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
     *
     * @return an array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/dicom_archive/js/columnFormatter.js",
             $baseURL . "/dicom_archive/js/dicom_archive.js",
            )
        );
    }
}
?>
