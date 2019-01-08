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
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
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
    function getOptions()
    {
        $user = \User::singleton();
        $db   = \Database::singleton();

        $siteList  = array();
        $visitList = \Utility::getVisitList();

        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            $siteList = \Utility::getSiteList(false);
        } else {
            // allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site = \Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$val] = $site->getCenterName();
                }
            }
        }

        $instrumentList   = [];
        $instrumentsQuery = $db->pselect(
            "SELECT Test_name, Full_name FROM test_names ORDER BY Test_name",
            []
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Full_name']] = $instrument['Full_name'];
        }

        $fileTypeList  = [];
        $fileTypeQuery = $db->pselect("SELECT file_type FROM media", []);
        foreach ($fileTypeQuery as $filetype) {
            $fileTypeList[$filetype['file_type']] = $filetype['file_type'];
        }

        //Language selector
        $languages    = \Utility::getLanguageList();
        $languageList = [];
        foreach ($languages as $language) {
            $languageList[$language] = $language;
        }

        $hiddenOptions = [];
        if ($this->hasHidePermission) {
            $hiddenOptions = array(
                              0 => 'Visible only',
                              1 => 'Hidden only',
                             );
        }

        return [
                'fileTypes'   => $fileTypeList,
                'visits'      => $visitList,
                'sites'       => $siteList,
                'instruments' => $instrumentList,
                'languages'   => $languageList,
                'hidden'      => $hiddenOptions,
                'maxUploadSize' => \Utility::getMaxUploadSize(),
               ];
    }

    // MAKE FILTER FOR THIs
    //    if (!$user->hasPermission("superuser")) {
    //        $this->query .= " AND m.hide_file = FALSE";
    //    }
    //
    // 

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $provisioner = new MediaFileProvisioner();

        $user = \User:: singleton();

        if ($user->hasPermission("access_all_profiles") == false) {
            $provisioner = $provisioenr->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        if ($user->hasPermission("superuser")) {
            $provisioner = $provisioner->filter(
                new HideFileFilter()
            );
        }
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
        $table = (new \LORIS\Data\Table())                                      
            ->withDataFrom($this->getDataProvisioner());                        
        $arr   = array_map(                                                     
            function ($row) {                                                   
                return array_values($row);                                      
            },                                                                  
            json_decode($table->toJSON(\User::singleton()), true)               
        );                                                                      
        $options = $this->getOptions();                   
        return json_encode(                                                     
            [                                                                   
             'data'         => $arr,                                            
             'fieldOptions' => $options,                                        
            ]
        );    
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

