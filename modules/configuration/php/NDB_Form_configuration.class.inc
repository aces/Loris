<?php
/**
 * The configuration module is used to manage the configuration of Loris.
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/

require_once 'NDB_Form.class.inc';

/**
 * Admin_Config Class
 *
 * This class is to configure the system settings
 *
 * @category Behavioural
 * @package  Main
 * @author   Olga Tsibulevskaya <olgatsib@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/
class NDB_Form_Configuration extends NDB_Form
{
    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return $user->hasPermission('config');
    }

    /**
     * Constructor
     *
     * @return null
     */
    function configuration()
    {

        $config =& NDB_Config::singleton();

        $this->DB = Database::singleton();
        if (Utility::isErrorX($this->DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
            die();
        }

        $parentMenuItems = $this->DB->pselect(
            "SELECT Label, Name 
             FROM ConfigSettings 
             WHERE Parent IS NULL AND Visible=1 ORDER BY OrderNumber",
            array()
        );

        $configs = $this->DB->pselect(
            "SELECT * FROM ConfigSettings WHERE Visible=1 ORDER BY OrderNumber",
            array()
        );

        // add values
        foreach ($configs as &$tag) {
            $value = $this->DB->pselect(
                "SELECT ID, Value FROM Config WHERE ConfigID=:ID",
                array('ID' => $tag{'ID'})
            );
            if ($value) {
                foreach ($value as $subvalue) {
                    $tag['Value'][$subvalue['ID']] = $subvalue['Value'];
                }
            }
        }

        // build a tree from configs array
        foreach ($configs as &$node) {
            $node['Children']  = array();
            $tree[$node['ID']] = &$node;

        }
        foreach ($configs as &$node) {
            $tree[$node['Parent']]['Children'][] = &$node;
        }

        $instruments = Utility::getAllInstruments();
        $instruments = array_merge(array('' => ''), $instruments);

        $this->tpl_data['parentMenuItems'] = $parentMenuItems;
        $this->tpl_data['config']          = $configs;
        $this->tpl_data['instruments']     = $instruments;
        $this->tpl_data['sandbox']         = $config->getSetting("sandbox");

    }

    /**
     * Loads the subproject management submodule
     *
     * @return none
     */
    function subproject()
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $subprojectList = Utility::getSubprojectList();
        $subprojects    = array();
        foreach ($subprojectList as $subprojectID => $title) {
            $subprojects[$subprojectID]
                = $config->getSubprojectSettings($subprojectID);
        }
        $this->tpl_data['subprojects'] = $subprojects;

        $this->tpl_data['useEDCOptions']
            = array(
               '1' => 'Yes',
               '0' => 'No',
              );

        $this->tpl_data['WindowDifferenceOptions']
            = array(
               'battery' => 'Closest Test Battery',
               'optimal' => 'Optimal Visit Window for Visit Label',
              );
    }
}

?>
