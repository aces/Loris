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
    public $AjaxModule = true;

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
     * Setup sets up the data access for this page.
     *
     * @return none
     */
    function setup()
    {
        // Sets up LorisForm, etc.
        $this->_setupPage($this->menu, null, null, null, 'filter');

        $this->skipTemplate = true;
        $provisioner        = new DicomArchiveRowProvisioner();

        $user =& \User::singleton();
        if ($user->hasPermission("access_all_profiles") == false) {
            $provisioner = $provisioner->Filter(new \LORIS\Data\Filters\SiteMatch());
        }

        $provisioner = $provisioner->Map(new DICOMArchiveAnonymizer());

        $this->table = (new \LORIS\Data\Table())
            ->WithDataFrom($provisioner);
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
        $d = $this->table->toArray(\User::singleton());
        return [
                'Headers' => [
                              'Patient ID',
                              'Patient Name',
                              'Gender',
                              'Date Of Birth',
                              'Acquisition',
                              'Archive Location',
                              'Metadata',
                              'MRI Browser',
                              'Site',
                              'TarchiveID',
                              'SessionID',
                             ],
                'Data'    => array_map(
                    function ($row) {
                        return array_values($row);
                    },
                    $d
                ),
               ];
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
             $baseURL . "/dicom_archive/js/dicom_archive.js",
            )
        );
    }
}
?>
