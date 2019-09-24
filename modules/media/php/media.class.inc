<?php declare(strict_types=1);
/**
 * This file contains the NDB_Menu_Filter_media class
 *
 * PHP Version 7
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
 * PHP Version 7
 *
 * @category Module
 * @package  Media
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Media extends \DataFrameworkMenu
{
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            array(
             'media_read',
             'media_write',
            )
        );
    }

    /**
     * {@inheritDoc}
     *
     * @return bool true
     */
    public function useSiteFilter(): bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
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

        $hiddenOptions = array();
        if (\User::singleton()->hasPermission('superuser')) {
            $hiddenOptions = array(
                              0 => 'Visible only',
                              1 => 'Hidden only',
                             );
        }

        return array(
                'fileTypes'     => $fileTypeList,
                'visits'        => $visitList,
                'sites'         => $siteList,
                'instruments'   => $instrumentList,
                'languages'     => $languageList,
                'hidden'        => $hiddenOptions,
                'maxUploadSize' => \Utility::getMaxUploadSize(),
               );
    }

    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return new MediaFileProvisioner();
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getDataProvisionerWithFilters() : \LORIS\Data\Provisioner
    {
        return parent::getDataProvisionerWithFilters()
            ->filter(new HideFileFilter());
    }

    /**
     * Include additional CSS files:
     *  1. media.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies() : array
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
    function getJSDependencies() : array
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

