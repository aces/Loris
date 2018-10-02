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
     * Setup variables
     *
     * @return None
     */
    function _setupVariables()
    {
        $user =& \User::singleton();

        $Factory = \NDB_Factory::singleton();
        $DB      = $Factory->Database();

        // set the class variables
        $this->columns      = array(
                               'file_name',
                               'version',
                               'upload_date',
                              );
        $this->query        = " FROM data_release dr JOIN"
                               . " data_release_permissions drp"
                               . " ON (dr.id=drp.data_release_id)"
                               . " JOIN users u ON (u.ID=drp.userid)"
                               . " WHERE u.UserID="
                               . $DB->quote($user->getUsername());
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

        $userUpload = $user->hasPermission("data_release_upload");
        $userEditAccess = $user->hasPermission("data_release_edit_file_access");

        $userids = $DB->pselectColWithIndexKey(
            "SELECT ID, UserID FROM users",
            array(),
            "ID"
        );

        $results          = $DB->pselect(
            "SELECT id, file_name, version FROM data_release",
            array()
        );
        $data_release_ids = array();
        $data_release_versions = array();
        foreach ($results as $row) {
            $data_release_ids[$row['id']]           = $row['file_name'];
            $data_release_versions[$row['version']] = $row['version'];
        }

        $results = $DB->pselect(
            "SELECT 
                DISTINCT users.UserID, 
                version 
             FROM users u
                LEFT JOIN data_release_permissions drp ON (u.ID=drp.userid) 
                LEFT JOIN data_release dr ON (drp.data_release_id=dr.id)
             ORDER BY users.UserID, 
                version",
            array()
        );
        foreach ($results as $row) {
            if (!isset($manage_permissions[$row['UserID']])) {
                $version = array();
            }
            $version[] = $row['version'];
            $manage_permissions[$row['UserID']] = $version;
        }

        $this->tpl_data['user_upload']    = $userUpload;
        $this->tpl_data['user_edit_access']      = $userEditAccess;
        $this->tpl_data['userids']          = $userids;
        $this->tpl_data['data_release_ids'] = $data_release_ids;
        $this->tpl_data['data_release_versions'] = $data_release_versions;
        $this->tpl_data['manage_permissions']    = $manage_permissions;

        return true;
    }

}

?>
