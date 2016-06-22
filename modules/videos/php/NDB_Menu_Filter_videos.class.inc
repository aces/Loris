<?php
/**
 * This file contains the NDB_Menu_Filter_videos class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Videos
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */

require_once 'NDB_Menu_Filter.class.inc';

/**
 * Main class for videos module corresponding to /video URL
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of video files and control panel to search them and upload
 * new ones.
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Videos
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Menu_Filter_videos extends NDB_Menu_Filter
{
    var $centerIDMap;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& User::singleton();
        return $user->hasPermission('video_upload');
    }

    /**
     * Create a form to filter video by various criteria
     *
     * @return bool
     * @throws ConfigurationException
     * @throws DatabaseException
     * @throws Exception
     */
    function _setFilterForm()
    {
        $user =& User::singleton();
        $db = Database::singleton();

        $siteList = Utility::getSiteList(false);
        $visitList = [null => 'Any'] + Utility::getVisitList();

        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            if (is_array($siteList)) {
                $siteList = [null => 'Any'] + $siteList;
            }
        } else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $siteList = [
                    $user->getData('CenterID') => $user->getData('Site')
                ];
            }
        }

        $instrumentList = [null => 'Any'];
        $instrumentsQuery = $db->pselect(
            "SELECT DISTINCT Instrument FROM videos", []
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Instrument']] = $instrument['Instrument'];
        }

        // Form Elements
        $this->addBasicText('PSCID', 'PSCID:', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('Instrument', 'Instrument:', $instrumentList);
        $this->addSelect('visitLabel', 'Visit Label:', $visitList);
        $this->addSelect('For_site', 'For Site:', $siteList);
        $this->addBasicText('uploaded_by', 'Uploaded By');

        return true;
    }

    /**
     * Build video list
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {
        $db =& Database::singleton();

        // create the centerID map
        $pscRows = $db->pselect("SELECT CenterID, Name FROM psc", []);
        foreach ($pscRows as $row) {
            $this->centerIDMap[$row['CenterID']] = $row['Name'];
        }

        // the base query
        $query = " FROM videos v"; // left join candidate c using(pscid) ";
        $query .= " WHERE (v.hide_video=false OR v.hide_video IS NULL)";

        // set the class variables
        $this->columns = [
            'v.File_name',
            'v.uploaded_by',
            '(SELECT Full_name FROM test_names WHERE Test_name=v.Instrument)',
            'v.PSCID',
            'v.visitLabel',
            'v.Date_taken',
            '(SELECT name FROM psc WHERE CenterID=v.For_site)',
            'substring(v.comments, 1, 50) as comments',
            'v.Date_uploaded',
            'v.record_id'
        ];

        $this->query = $query;
        $this->group_by = '';
        $this->order_by = 'v.Instrument';
        $this->headers = [
            'File_name', 'uploaded_by', 'Instrument', 'PSCID',
            'visitLabel', 'Date_Taken', 'For_site', 'comments',
            'Date_uploaded', 'Edit Metadata'
        ];
        $this->validFilters = [
            'v.PSCID', 'v.Instrument', 'v.Data_dir',
            'v.For_site', 'v.visitLabel', 'v.uploaded_by'
        ];
        $this->formToFilter = [
            'File_name'     => 'v.File_name',
            'Data_dir'      => 'v.Data_dir',
            'Instrument'    => 'v.Instrument',
            'PSCID'         => 'v.PSCID',
            'For_site'      => 'v.For_site',
            'uploaded_by'   => 'v.uploaded_by',
            'visitLabel'    => 'v.visitLabel',
            'Date_uploaded' => 'v.Date_uploaded',
            'comments'      => 'comments'
        ];

        return true;
    }

    /**
     * Include additional JS files:
     *  1. columnFormatter.js required to set links for Edit video and Download video
     *  2. uploadForm.js - reactified form to upload videos
     *
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/videos/js/columnFormatter.js",
                $baseURL . "/videos/js/uploadForm.js"
            )
        );
    }
}

