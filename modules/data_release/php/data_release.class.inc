<?php
/**
 * This file handles the Data Release for LORIS
 *
 * PHP Version 7
 *
 * @category LORIS
 * @package  Main
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
namespace LORIS\data_release;

/**
 * Data Release Class
 *
 * This class is for the Data Release
 *
 * @category LORIS
 * @package  Main
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

class Data_Release extends \NDB_Menu_Filter
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasAnyPermission(
            array(
                'data_release_view',
                'data_release_upload',
                'data_release_edit_file_access'
            )
        );
    }

    /**
     * Setup all the class variables needed for the data release menu page
     *
     * @return void
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        $DB   = \Database::singleton();

        // set the class variables
        $this->columns = array(
            'file_name AS fileName',
            'version',
            'upload_date AS uploadDate',
        );
        $this->query   = " FROM data_release dr";

        if (!$user->hasPermission("superuser")) {
            $this->query .= " JOIN data_release_permissions drp 
            ON (dr.id=drp.data_release_id) 
            JOIN users u ON (u.ID=drp.userid) 
            WHERE u.UserID="
                . $DB->quote($user->getUsername());
        }

        $this->group_by = '';
        $this->order_by = 'uploadDate';
    }

    /**
     * Create the form for the data release menu page
     *
     * @return void
     **/
    function setup()
    {
        parent::setup();

        $DB = \Database::singleton();

        // Get list of users in the database
        $list_of_users = $this->getUsersList($DB);

        // Get list of data release versions and filenames
        $vFiles = $this->getVersionedFiles($DB);

        $filenames_options = array();
        $versions_options  = array();

        foreach ($vFiles as $versionName => $filesArray) {
            foreach ($filesArray as $fileID => $fileName) {
                $filenames_options[$fileID] = "$fileName - $versionName";
            }
            $versions_options[$versionName] = $versionName;
        }

        // Get list of permissions per data release versions
        $manage_permissions = $this->getUserVersionPermissions($vFiles, $DB);

        $this->fieldOptions = [
            'users'              => $list_of_users,
            'versions'           => $versions_options,
            'filenames'          => $filenames_options,
            'manage_permissions' => $manage_permissions,
        ];
    }


    /**
     * Greps the list of users available in the users database table.
     *
     * @param \Database $DB database handle
     *
     * @return array Array of user ID and user name
     */
    function getUsersList(\Database $DB)
    {
        $userids = $DB->pselectColWithIndexKey(
            "SELECT ID, UserID FROM users",
            array(),
            "ID"
        );

        return $userids;
    }


    /**
     * Gets the array of release versions with their corresponding files.
     *
     * This function is used for the initial load as well as for comparison upon
     * update to ensure no values are added or deleted unexpectedly.
     *
     * @param \Database $DB database handle
     *
     * @return array Associative array of $versions=>(files associate with version)
     */
    function getVersionedFiles(\Database $DB)
    {
        $versionedFiles = $DB->pselect(
            "SELECT id, file_name, version 
                  FROM data_release",
            array()
        );

        $vFFormatted = array();
        foreach ($versionedFiles as $row) {
            $version = $row['version'] === null || $row['version'] === ''
                ? 'Unversioned': $row['version'];
            //format array in the form $version=>(all files with that version)
            $vFFormatted[$version][$row['id']] = $row['file_name'];
        }

        return $vFFormatted;
    }

    /**
     * Gets the array of users with all versions they currently have access to. For
     * a user to "have access to a version" means to have viewing permissions on all
     * files tagged for said release.
     *
     * This function is used for the initial load as well as for comparison upon
     * update to ensure no values are added or deleted unexpectedly.
     *
     * @param array     $vFiles Array of $version=>(files associated with $version)
     * @param \Database $DB     database handle
     *
     * @return array Associative array of users with all release version they have
     *               access to. See "has access to" definition in this function's
     *               description.
     */
    function getUserVersionPermissions(array $vFiles, \Database $DB) : array
    {
        $userFileAccess = $DB->pselect(
            "SELECT u.UserID, drp.data_release_id, version, file_name
             FROM users u
                LEFT JOIN data_release_permissions drp ON (u.ID=drp.userid) 
                LEFT JOIN data_release dr ON (drp.data_release_id=dr.id)",
            array()
        );

        //in order to have a checked box a user must have permission to see all
        //files belonging to a release version
        //array to hold checked checkboxes in the manage permissions menu
        $uFAFormatted = array();
        foreach ($userFileAccess as $row) {
            $userID          = $row['UserID'];
            $version         = $row['version'] ?? null;
            $releaseFileID   = $row['data_release_id'] ?? null;
            $releaseFileName = $row['file_name'] ?? null;

            // 3 possible cases
            // 1. user has access to a versioned file
            // 2. user has access to a file with no associated version
            // 3. user does not have access to any files
            if (isset($releaseFileName)) {
                // check if file is versioned or not
                if (isset($version) && $version !== '') {
                    $uFAFormatted[$userID][$version][$releaseFileID]
                        = $releaseFileName;
                } else {
                    $uFAFormatted[$userID]['Unversioned'][$releaseFileID]
                        = $releaseFileName;
                }
            } else {
                $uFAFormatted[$userID] = array();
            }
        }

        //now we can compare the $uFAFormatted to $vFiles (versioned files array)
        //to identify which checkboxes should be checked
        $version_permissions = array();
        foreach ($uFAFormatted as $userID=>$userVersions) {
            if (empty($userVersions)) {
                $version_permissions[$userID] = array();
            }
            foreach ($userVersions as $versionName=>$versionFiles) {
                if (empty(array_diff($vFiles[$versionName], $versionFiles))) {
                    $version_permissions[$userID][] = $versionName;
                } else {
                    $version_permissions[$userID] = array();
                }
            }
        }

        return $version_permissions;
    }

    /**
     * Include the column formatter
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            array(
                $baseurl . "/data_release/js/dataReleaseIndex.js",
            )
        );
    }
}
