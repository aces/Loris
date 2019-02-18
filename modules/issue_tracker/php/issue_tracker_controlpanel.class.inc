<?php

/**
 * Imaging browser control panel class file
 *
 * PHP version 5
 *
 * @category Loris
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/
namespace LORIS\issue_tracker;

/**
 * Imaging browser control panel class
 *
 * This class provides the management GUI for the status flags
 * and some links of the imaging browser.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Issue_Tracker_ControlPanel
{
    /**
     * Var to store the sessionID.
     */
    var $issueID;

    /**
     * Sets up the issueID
     *
     * @param int $issueID current issueID
     *
     * @return NULL
     */
    function __construct($issueID)
    {
        $this->issueID = $issueID;
    }

    /**
     * Determine whether the user has permission to view the imaging_browser page
     *
     * @return bool whether the user hass access
     */
    function _hasAccess()
    {
        $user =& \User::singleton();
        if ($user->hasPermission('issue_tracker_reporter')
            || $user->hasPermission('issue_tracker_developer')
        ) {
                return true;
        }
        return false;
    }

    /**
    *  Gets data for the control panel template
    *
    * @return array ($subjectData array with data for the template)
    */
    function getData()
    {
        $factory = \NDB_Factory::singleton();
        $issueData['backURL'] = isset($_REQUEST['backURL']) ?
            $factory->settings()->getBaseURL()
                . "/issue_tracker/" :
            null;

        $NavBar = new IssueNavigation($this->issueID);
        if ($this->issueID != 0) {
            $issueData['nextIssue']['URL'] = $NavBar->nextLink();
            $issueData['prevIssue']['URL'] = $NavBar->prevLink();
        }
        return $issueData;
    }
    /**
     * Generates the HTML to display the set of buttons
     * for the timepoint status flags
     *
     * @return string
     * @access public
     */
    function display()
    {
        $this->tpl_data['issue'] = $this->getData();
        $smarty = new \Smarty_neurodb("issue_tracker");

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("issue_tracker_controlpanel.tpl");
        return $html;
    }
}

/**
 * IssueNavigation class
 *
 * This class provides the management of sessions
 * to navigate to the previous and/or next session.
 * Thanks to imaging browser MRINavigation class
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class IssueNavigation
{

    public $urlParams = array();

    /**
    *  Gets the session
    *
    * @param int $issueID sessionID
    *
    * @return void
    */
    function __construct($issueID = null)
    {
        $this->issueID = $issueID;
        $this->FilteredSessionList = $_SESSION['State']
            ->getProperty('issuesListed');

        if (!is_array($this->FilteredSessionList)) {
            $this->FilteredSessionList = array();
        }
        $this->currentListIndex = array_search(
            $this->issueID,
            $this->FilteredSessionList
        );
        $this->urlParams        = $this->_splitURL();
    }
    /**
    * Parses the request into hostname/params, so that it can be
    * reconstructed into a link which has the same parameters
    *
    * @return string $urlParams parameters
    */
    function _splitURL()
    {
        $linkBase      = $_SERVER['REQUEST_URI'];
        $this->bits[0] = substr($linkBase, 0, strpos($linkBase, '?'));
        $this->bits[1] = substr($linkBase, strpos($linkBase, '?')+1);
        parse_str($this->bits[1], $urlParams);
        return $urlParams;
    }
    /**
    * Gets next or previous link
    *
    * @param int $delta offset for the next/prev link
    *
    * @return string $urlParams    parameters
    */
    function _otherLink($delta)
    {
        if (isset($this->FilteredSessionList[$this->currentListIndex+$delta])) {
            $urlParams            = $this->urlParams;
            $urlParams['issueID'] = $this
                ->FilteredSessionList[$this->currentListIndex+$delta];

            $this->bits[1] = http_build_query($urlParams);

            return implode('?', $this->bits);
        }
    }
    /**
    * Sets the offset for the next link and gets the next link
    *
    * @return string $_OtherLink
    */
    function nextLink()
    {
        return $this->_otherLink(1);
    }
    /**
    * Sets the offset for the prev link and gets the prev link
    *
    * @return string $_OtherLink
    */
    function prevLink()
    {
        return $this->_otherLink(-1);
    }
}


