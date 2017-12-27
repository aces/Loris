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

        $Factory = NDB_Factory::singleton();
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

        $user_ID   = $DB->pselectOne(
            "SELECT ID FROM users WHERE userid=:UserID",
            array('UserID' => $user->getUsername())
        );
        $superuser = $DB->pselectOne(
            "SELECT true FROM users WHERE ID IN "
            . "(SELECT userid FROM user_perm_rel WHERE "
            . "permid=1 AND userid=:UserID)",
            array('UserID' => $user_ID)
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
