<?php
/**
 * Time Point List control panel class
 *
 * PHP version 5
 *
 * @category Main
 * @package  Timepoint_List
 * @author   zijdenbos <username@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 * @access   public
 */

/**
 * This class provides the management GUI for the status flags
 *
 * @category Main
 * @package  Timepoint_List
 * @author   zijdenbos <username@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 * @access   public
 */

Class TimePoint_List_ControlPanel extends Candidate
{
    /**
     * The template data for Smarty
     * @var    array
     * @access private
     */
    var $tpl_data;

    /**
     * Fill the candidateInfo and listOfTimePoints variables using the
     * select function provide by the Candidate class.
     *
     * @param integer $candID A 6 digit Loris CandID that matches
     * a candidate in the candidate table
     *
     * @return null As a side-effect loads candidate into current object
     */
    function __construct($candID)
    {
        $this->select($candID);
    }

    /**
     * Generates the HTML to display the set of buttons for the status flags
     *
     * @return string
     * @access public
     */
    function display()
    {
        $user =& User::singleton();

        $user_CenterID = $user->getData('CenterID');
        $cand_CenterID = $this->getData('CenterID');

        $this->tpl_data['candID'] = $this->getData('CandID');

        $this->tpl_data['isDataEntryPerson'] = $user->hasPermission('data_entry')
              && ($user_CenterID == $cand_CenterID || $user->isUserDCC());

        $this->tpl_data['candidate_parameters_view'] = $user->hasPermission('candidate_parameter_view');
        $this->tpl_data['candidate_parameters_edit'] = $user->hasPermission('candidate_parameter_edit');

        //set the baseurl of the tpl_data
        $factory  = NDB_Factory::singleton();
        $settings = $factory->settings();
        $this->tpl_data['baseurl'] = $settings->getBaseURL();

        $smarty = new Smarty_neurodb('timepoint_list');
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("timepoint_list_controlpanel.tpl");
        return $html;
    }

}
?>
