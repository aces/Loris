<?php
/**
 * This file handles the Data Release for LORIS
 *
 * PHP Version 5
 *
 * @category LORIS
 * @package  Main
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

require_once 'NDB_Menu_Filter.class.inc';

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

class NDB_Menu_Filter_Data_Release extends NDB_Menu_Filter
{
    /**
     * Setup variables
     *
     * @return None
     */
    function _setupVariables()
    {
        $user =& User::singleton();

        // set the class variables
        $this->columns      = array(
                               'file_name',
                               'version',
                               'upload_date',
                              );
        $this->query        = " FROM data_release WHERE id IN"
                              . " (SELECT data_release_id FROM"
                              . " data_release_permissions WHERE"
                              . " userid=(SELECT ID FROM users WHERE"
                              . " UserID='{$user->getUsername()}'))";
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

        $Factory = NDB_Factory::singleton();
        $DB      = $Factory->Database();

        $user_ID   = $DB->pselectOne(
            "SELECT ID FROM users WHERE userid='{$user->getUsername()}'",
            array()
        );
        $superuser = $DB->pselectOne(
            "SELECT true FROM users WHERE ID IN "
            . "(SELECT userid FROM user_perm_rel WHERE "
            . "userid='{$user_ID}' AND permid=1)",
            array()
        );

        $results = $DB->pselect(
            "SELECT ID, UserID FROM users",
            array()
        );
        $userids = array();
        foreach ($results as $row) {
            $userids[$row['ID']] =$row['UserID'];
        }

        $results          = $DB->pselect(
            "SELECT id, file_name FROM data_release",
            array()
        );
        $data_release_ids = array();
        foreach ($results as $row) {
            $data_release_ids[$row['id']] =$row['file_name'];
        }

        $this->tpl_data['superuser']        = $superuser;
        $this->tpl_data['userids']          = $userids;
        $this->tpl_data['data_release_ids'] = $data_release_ids;

        return true;
    }

}

?>
