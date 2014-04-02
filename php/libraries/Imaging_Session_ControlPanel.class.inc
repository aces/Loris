<?php
require_once "NDB_BVL_Battery.class.inc";
/**
 * Time Point status control panel class
 *
 * This class provides the management GUI for the status flags
 * (session table) of a time point in the NeuroDB framework.
 * @package behavioural
 * @access public
 */

class Imaging_Session_ControlPanel
{
    function Imaging_Session_ControlPanel($sessionID) {
    }
    /**
     * generates the HTML to display the set of buttons for the timepoint status flags
     * @return string
     * @access public
     * @throws PEAR_Error
     */
    function display()
    {
        $this->tpl_data['candID'] = 'abc';
        
        $smarty = new Smarty_neurodb;
        $smarty->ModuleName = "imaging_browser";

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("imaging_session_controlpanel.tpl");
        return $html;
   }
}
?>
