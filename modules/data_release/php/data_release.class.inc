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
        return (
            $user->hasPermission('data_release_view')
            || $user->hasPermission('data_release_upload')
            || $user->hasPermission('data_release_edit_file_access')
        );
    }

    /**
     * Setup variables
     *
     * @return void
     */
    function _setupVariables()
    {
        $user =& \User::singleton();

        $Factory = \NDB_Factory::singleton();
        $DB      = $Factory->Database();

        // set the class variables
        $this->columns = array(
            'file_name',
            'version',
            'upload_date',
        );
        $this->query   = " FROM data_release dr";

        if (!$user->hasPermission("superuser")) {
            $this->query .= " JOIN data_release_permissions drp 
            ON (dr.id=drp.data_release_id) 
            JOIN users u ON (u.ID=drp.userid) 
            WHERE u.UserID="
            . $DB->quote($user->getUsername());
        }

        $this->group_by     = '';
        $this->order_by     = 'upload_date';
        $this->headers      = array(
            'file_name',
            'version',
            'upload_date',
        );
        $this->validFilters = array(
            'file_name',
            'version',
            'upload_date',
        );
        $this->formToFilter = array(
            'file_name'   => 'file_name',
            'version'     => 'version',
            'upload_date' => 'upload_date',
        );

        $userUpload     = $user->hasPermission("data_release_upload");
        $userEditAccess = $user->hasPermission("data_release_edit_file_access");

        $userids = $DB->pselectColWithIndexKey(
            "SELECT ID, UserID FROM users",
            array(),
            "ID"
        );

        $versionedFiles        = $this->getVersionedFiles($DB);
        $data_release_ids      = array();
        $data_release_versions = array();

        foreach ($versionedFiles as $versionName=>$versionFiles) {
            foreach ($versionFiles as $fileID=>$fileName) {
                $data_release_ids[$fileID] = $fileName . " - " . $versionName;
            }
            $data_release_versions[$versionName] = $versionName;

        }

        $manage_permissions = $this->getUserVersionPermissions($versionedFiles, $DB);

        $this->tpl_data['user_upload']      = $userUpload;
        $this->tpl_data['user_edit_access'] = $userEditAccess;
        $this->tpl_data['userids']          = $userids;
        $this->tpl_data['data_release_ids'] = $data_release_ids;
        $this->tpl_data['data_release_versions'] = $data_release_versions;
        $this->tpl_data['manage_permissions']    = $manage_permissions;
    }

    /**
     * Gets the array of release versions with their corresponding files.
     *
     * This function is used for the initial load as well as for comparison upon
     * update to ensure no values are added or deleted unexpectedly.
     *
     * @param \Database $DB Database to use for querying
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
     * @param \Database $DB     Database to use for querying
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
        $manage_permissions = array();
        foreach ($uFAFormatted as $userID=>$userVersions) {
            if (empty($userVersions)) {
                $manage_permissions[$userID] = array();
            }
            foreach ($userVersions as $versionName=>$versionFiles) {
                if (empty(array_diff($vFiles[$versionName], $versionFiles))) {
                    $manage_permissions[$userID][] =$versionName;
                }
            }
        }
        return $manage_permissions;
    }

}