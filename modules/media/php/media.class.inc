<?php
/**
 * This file contains the NDB_Menu_Filter_media class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Media
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
namespace LORIS\media;

/**
 * Main class for media module corresponding to /media/ URL
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of media files and control panel to search them and upload
 * new ones.
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Media
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Media extends \NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $hasHidePermission  = false;
    public $AjaxModule         = true;
    public $skipTemplate       = true;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws \ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& \User::singleton();

        // Set global permission to control access to different modules of media page
        $this->hasWritePermission = $user->hasPermission('media_write');

        // Set permission to access user-hidden files, currently based on superuser
        $this->hasHidePermission = $user->hasPermission("superuser");

        return $user->hasPermission('media_read') || $this->hasWritePermission;
    }

    /**
     * Create a form to filter media by various criteria
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $user =& \User::singleton();
        $db   = \Database::singleton();

        $siteList  = array();
        $visitList = \Utility::getVisitList();

        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            $siteList = \Utility::getSiteList(false);
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            // allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site =& \Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }

        $instrumentList   = array();
        $instrumentsQuery = $db->pselect(
            "SELECT Test_name, Full_name FROM test_names ORDER BY Test_name",
            []
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Full_name']] = $instrument['Full_name'];
        }

        $fileTypeList  = array();
        $fileTypeQuery = $db->pselect("SELECT file_type FROM media", []);
        foreach ($fileTypeQuery as $filetype) {
            $fileTypeList[$filetype['file_type']] = $filetype['file_type'];
        }

        //Language selector
        $languages    = \Utility::getLanguageList();
        $languageList = array();
        foreach ($languages as $language) {
            $languageList[$language] = $language;
        }

        // Form Elements
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('fileName', 'File Name');
        $this->addSelect('fileType', 'File type', $fileTypeList);
        $this->addSelect('visitLabel', 'Visit Label', $visitList);
        $this->addSelect('site', 'For Site', $siteList);
        $this->addBasicText('uploadedBy', 'Uploaded By');
        $this->addSelect('instrument', 'Instrument', $instrumentList);
        $this->addSelect('language', 'Language', $languageList);

        // Add hidden files filter is user is admin
        if ($this->hasHidePermission) {
            // Unable to create checkbox using addCheckbox(), using addSelect for
            // the time being
            // select options
            $hiddenOptions = array(
                              ""  => 'Both',
                              "0" => 'Visible only',
                              "1" => 'Hidden only',
                             );
            $this->addSelect('hideFile', 'File Visibility', $hiddenOptions);
        }

        $this->tpl_data["hasWritePermission"] = $this->hasWritePermission;
        $this->tpl_data["hasHidePermission"]  = $this->hasHidePermission;

        return true;
    }

    /**
     * Build a list of media to display in Data Table
     *
     * @return void
     * @throws \DatabaseException
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        // the base query
        $query  = " FROM media m 
                    LEFT JOIN session s ON m.session_id = s.ID 
                    LEFT JOIN candidate c ON c.CandID=s.CandID 
                    LEFT JOIN language l USING (language_id) ";
        $query .= " WHERE 1=1 ";

        // set the class variables
        $this->columns
            = [
               'm.file_name',
               '(SELECT PSCID from candidate WHERE CandID=s.CandID) as pscid',
               's.Visit_label as visit_label',
               'l.language_label',
               '(SELECT Full_name FROM test_names WHERE Test_name=m.instrument)',
               '(SELECT name FROM psc WHERE CenterID=s.CenterID) as site',
               'm.uploaded_by',
               'm.date_taken',
               'substring(m.comments, 1, 50) as comments',
               'm.date_uploaded',
               'm.file_type',
               's.CandID as cand_id',
               's.ID as session_id',
               'm.hide_file',
               'm.id',
              ];

        $this->query = $query;

        if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND c.CenterID IN (" . $site_arr . ")";
        }

        if (!$user->hasPermission("superuser")) {
            $this->query .= " AND m.hide_file = FALSE";
        }

        $this->group_by = '';
        $this->order_by = 'm.instrument';
        $this->headers  = [
                           'File Name',
                           'PSCID',
                           'Visit Label',
                           'Language',
                           'Instrument',
                           'Site',
                           'Uploaded By',
                           'Date Taken',
                           'Comments',
                           'Date Uploaded',
                           'File Type',
                           'Cand ID',
                           'Session ID',
                           'Hide File',
                          ];

        // Add Edit field if user has permissions
        if ($this->hasWritePermission) {
            array_push($this->headers, 'Edit Metadata');
        }

        return true;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        $result['maxUploadSize'] = \Utility::getMaxUploadSize();
        return json_encode($result);
    }

    /**
     * Include additional CSS files:
     *  1. media.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/media/css/media.css"]
        );
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/media/js/mediaIndex.js",
            )
        );
    }
}

