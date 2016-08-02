<?php

/**
 * Imaging browser control panel class file
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/

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

class issue_tracker_ControlPanel
{
    /**
     * Var to store the sessionID.
     */
    var $sessionID;

    /**
     * Sets up the sessionID
     *
     * @param int $sessionID current sessionID
     *
     * @return NULL
     */
    function __construct($sessionID)
    {
        $this->sessionID = $sessionID;
    }

    /**
     * Determine whether the user has permission to view the imaging_browser page
     *
     * @return bool whether the user hass access
     */
    function _hasAccess()
    {
        $user =& User::singleton();
        return $user->hasPermission('issue_tracker_can_assign');
    }

    /**
    *  Gets data for the control panel template
    *
    * @return $subjectData array with data for the template
    */
    function getData()
    {
	return null;
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
        $this->tpl_data['subject'] = $this->getData();

        $smarty = new Smarty_neurodb("issue_tracker");

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("issue_tracker_controlpanel.tpl");
        return $html;
    }
}

/**
 * MRINavigatoin class
 *
 * This class provides the management of sessions
 * to navigate to the previous and/or next session.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class MRINavigation
{
    /**
    *  Gets the session
    *
    * @param int $sessionID sessionID
    *
    * @return NULL
    */
    function __construct($sessionID = null)
    {
        $this->sessionID           = $sessionID;
        $this->FilteredSessionList = $_SESSION['State']
            ->getProperty('mriSessionsListed');

        if (!is_array($this->FilteredSessionList)) {
            $this->FilteredSessionList = array();
        }
        $this->currentListIndex = array_search(
            $this->sessionID,
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
            $urlParams = $this->urlParams;
            $urlParams['sessionID'] = $this
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

?>
