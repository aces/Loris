<?php

/**
 * This class features the code for the menu portion
 * of the Loris dicom archive.
 *
 * PHP Version 7
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
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('dicom_archive_view_allsites');
    }

    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return void
     */
    function _setupVariables()
    {
        // Rest the filter because this is broken with react modules
        $this->_resetFilters();

        $this->skipTemplate = true;

        $this->columns = [];
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $provisioner = new DicomArchiveRowProvisioner();

        $user = \User::singleton();

        if ($user->hasPermission("access_all_profiles") == false) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        $provisioner = $provisioner->map(new DICOMArchiveAnonymizer());
        return $provisioner;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $table   = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisioner());
        $arr     = array_map(
            function ($row) {
                return array_values($row);
            },
            json_decode($table->toJSON(\User::singleton()), true)
        );
        $options = array('sites' => \Utility::getSiteList());
        return json_encode(
            [
                'data'         => $arr,
                'fieldOptions' => $options,
            ]
        );
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
        return json_decode($this->toJSON());
    }

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
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
                $baseURL . "/dicom_archive/js/dicom_archive.js",
            )
        );
    }
}

