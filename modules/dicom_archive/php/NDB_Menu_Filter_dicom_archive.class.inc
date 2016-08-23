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
 * @license    @GPLv3
 * @link       https://www.github.com/olgatsib/Loris-Trunk/
 */

/**
 * Provides the PHP code for the menu filter for the dicom archive
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license    @GPLv3
 * @link       https://www.github.com/olgatsib/Loris-Trunk/
 */
class NDB_Menu_Filter_Dicom_Archive extends NDB_Menu_Filter
{
    var $dicomArchiveSettings;

    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        $user = User::singleton();
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

        $colsFirst = array(
        );

        $TransferStatus = $this->_getTransferStatusFromQuery();
        $arrayTransfer = array($TransferStatus . " as Transfer_Status");

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
            't.TarchiveID as TarchiveID',
            's.ID as SessionID'
        );

        $this->columns = array_merge($colsFirst, $colsLast);

        $this->order_by = 't.DateAcquired';

        $this->headers
            = ($this->dicomArchiveSettings['showTransferStatus'] == 'true') ?
            array(
                'Transfer_Status',
                'Patient_ID',
                'Patient_Name',
                'Gender',
                'Date_of_birth',
                'Acquisition',
                'Archive_Location',
                'Metadata',
                'MRI_Browser'
            ) :
            array(
                'Patient_ID',
                'Patient_Name',
                'Gender',
                'Date_of_birth',
                'Acquisition',
                'Archive_Location',
                'Metadata',
                'MRI Browser'
            );

        $this->validFilters = array(
            'c.CenterID',
            't.PatientID',
            't.PatientGender',
            't.DateAcquired',
            't.PatientName',
            't.PatientDoB',
            't.ArchiveLocation'
        );

        $this->formToFilter = array(
            'SiteID' => 'c.CenterID',
            'PatientID' => 't.PatientID',
            'Gender'=> 't.PatientGender',
            'Acquisition' => 't.DateAcquired',
            'PatientName' => 't.PatientName',
            'DoB' => 't.PatientDoB',
            'Location' => 't.ArchiveLocation'
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
        $config =& NDB_Config::singleton();
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
     * Setup $this->tpl_data for use by Smarty
     *
     * @return null
     */
    function _setFilterForm()
    {
        $list_of_sites = array('' => 'All');
        $sitesList = Utility::getSiteList();

        foreach ($sitesList as $key=>$value) {
            $list_of_sites[$key]= $value;
        }
        ksort($list_of_sites);

        $this->tpl_data['Sites'] = $list_of_sites;
        $this->addSelect('SiteID', 'Site', $list_of_sites);
        $this->addBasicText(
            'PatientID', 'PatientID', array('size' => 10, 'maxlength' => 25)
        );
        $this->addBasicText(
            'Gender', 'Gender', array('size' => 10, "maxlength" => 25)
        );
        $this->addBasicText(
            'Acquisition',
            'Acquisition Date',
            array('size' => 10, "maxlength" => 25)
        );
        $this->addBasicText(
            'PatientName',
            'Patient Name',
            array('size' => 10, "maxlength" => 25)
        );
        $this->addBasicText(
            'DoB', 'Date of Birth', array('size' => 10, "maxlength" => 25)
        );
        $this->addBasicText(
            'Location',
            'Archive Location',
            array('size' => 10, "maxlength" => 25)
        );

        $this->tpl_data['filterValuesJSON'] = json_encode($this->_getFilterValues());

        $this->tpl_data['backURL'] = $_SERVER['REQUEST_URI'];
    }

    /**
     * Setup table rows for the template
     *
     * @param int $count number
     *
     * @return null
     */

    function _setDataTableRows($count)
    {
        $x = 0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $i = 1;

            // remove Transfer_Status column if showTransferStatus is false
            if ($this->dicomArchiveSettings['showTransferStatus'] == 'false') {
                unset($item['Transfer_Status']);
            }

            // set sessionID and remove the column
            $sessionID = $item['SessionID'];
            unset($item['SessionID']);

            // set tarchiveID and remove the column
            $tarchiveID = $item['TarchiveID'];
            unset($item['TarchiveID']);

            foreach ($item as $key => $val) {
                if ($key == 'Transfer_Status') {
                    switch ($val) {
                    case 'Queued':
                        $this->tpl_data['items'][$x][$i]['class']
                            = "tarchivePendingTransfer";
                        break;
                    case 'Not Transferred':
                        $this->tpl_data['items'][$x][$i]['class']
                            = "tarchiveNotTransferred";
                        break;
                    default:
                        $this->tpl_data['items'][$x][$i]['class']
                            = "tarchiveTransferred";
                    }
                }
                if ($key == 'Metadata') {
                    $this->tpl_data['items'][$x][$i]['tarchiveID'] = $tarchiveID;
                }
                if ($key == 'MRI_Browser') {
                    $this->tpl_data['items'][$x][$i]['sessionID'] = $sessionID;
                }


                // check if names and ids are valid
                if ($key == 'Patient_ID') {
                    $regex = 'patientIDRegex';
                }

                if ($key == 'Patient_ID') {
                    if (! preg_match($this->dicomArchiveSettings[$regex], $val)) {
                        $this->tpl_data['items'][$x][$i]['class'] = "error";
                        $this->tpl_data['items'][$x][$i]['value']
                            = "INVALID - HIDDEN";
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = $val;
                    }
                } elseif ($key == 'Patient_Name'){
                   if (!preg_match($this->dicomArchiveSettings['patientNameRegex'], $val) &&
                       !preg_match($this->dicomArchiveSettings['LegoPhantomRegex'], $val) &&
                       !preg_match($this->dicomArchiveSettings['LivingPhantomRegex'], $val)) {
                        $this->tpl_data['items'][$x][$i]['class'] = "error";
                        $this->tpl_data['items'][$x][$i]['value']
                            = "INVALID - HIDDEN";
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = $val;
                    }

                } elseif ($key == 'Gender') {
                    if ($val != 'M' && $val != 'F') {
                        $this->tpl_data['items'][$x][$i]['value'] = 'N/A';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = $val;
                    }
                } else {
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $i++;
            }
            $x++;
        }
        $this->tpl_data['numTimepoints'] = $this->TotalItems;

        return true;
    }

    function toArray() {
        $unanonymized = parent::toArray();
        $retVal = array(
            'Headers' => $unanonymized['Headers'],
        );
        $data = array();

        foreach ($unanonymized['Data'] as &$row) {
            $val = $row[2];
            if (!preg_match($this->dicomArchiveSettings['patientNameRegex'], $val) &&
                !preg_match($this->dicomArchiveSettings['LegoPhantomRegex'], $val) &&
                !preg_match($this->dicomArchiveSettings['LivingPhantomRegex'], $val)
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
            'Data' => $data,
        );

    }
    function getJSDependencies() {
        $factory = NDB_Factory::singleton();
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
