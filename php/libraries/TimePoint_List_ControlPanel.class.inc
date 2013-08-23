<?php
/**
 * Time Point List control panel class
 *
 * This class provides the management GUI for the status flags
 * 
 * @access public
 * @version $Id: TimePoint_List_ControlPanel.class.inc,v 1.11 2006/04/05 17:07:42 sebas Exp $
 * @package main
 */

Class TimePoint_List_ControlPanel extends Candidate
{
    /**
     * The template data for Smarty
     * @var    array 
     * @access private
     */
    var $tpl_data;

    function TimePoint_List_ControlPanel($candID){
    	$this->select($candID);
    }
    /**
     * generates the HTML to display the set of buttons for the status flags
     * @return string
     * @access public
     */
    function display() {
    	$user =& User::singleton();
    	
        $this->tpl_data['candID'] = $this->getData('CandID');
		$isDataEntryPerson=$user->hasPermission('data_entry') && $user->getData('CenterID') == $this->getData('CenterID');
        
        $this->tpl_data['isDataEntryPerson'] = $isDataEntryPerson;

        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("timepoint_list_controlpanel.tpl");
        return $html;
    }

}
?>
