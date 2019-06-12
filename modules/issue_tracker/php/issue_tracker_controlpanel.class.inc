<?php

/**
 * Issue Tracker control panel class file
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
 * Issue Tracker control panel class
 *
 * This class provides the management GUI for navigation of issueIDs
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
     * Var to store the issueID.
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
     * Determine whether the user has permission to view the issue_tracker page
     *
     * @param \User $user The user whose access in being checked
     *
     * @return bool if the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            array(
             'issue_tracker_reporter',
             'issue_tracker_developer',
            )
        );
    }

    /**
    *  Gets data for the control panel template
    *
    * @return array $issueData array with data for the template
    */
    function getData() : array
    {
        $factory = \NDB_Factory::singleton();
        $issueData['backURL'] = $factory->settings()->getBaseURL()
                . '/issue_tracker/';

        $NavBar = new IssueNavigation($this->issueID);
        if ($this->issueID != 0) {
            $issueData['nextIssue']['URL'] = $NavBar->nextLink();
            $issueData['prevIssue']['URL'] = $NavBar->prevLink();
        }
        return $issueData;
    }
    /**
     * Generates the HTML to display the set of buttons
     * for the issue navigation
     *
     * @return string
     * @access public
     */
    function display() : string
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
 * This class provides the management of issues
 * to navigate to the previous and/or next issue.
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
    var $issueID;
    var $filteredIssueList = array();
    var $currentListIndex;

    /**
    *  Gets the issue
    *
    * @param int $issueID issueID
    *
    * @return void
    */
    function __construct($issueID = null)
    {
        $this->issueID = $issueID;

        $user    = \User::singleton();
        $table   = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisioner());
        $dataArr = $table->toArray($user);
        foreach ($dataArr as $data) {
            array_push($this->filteredIssueList, $data['issueID']);
        }

        $this->currentListIndex = array_search(
            $this->issueID,
            $this->filteredIssueList
        );
    }

    /**
     * Gets the data source for this navigation
     *
     * @return \LORIS\Data\Provisioner
     */
    function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        $provisioner = new IssueRowProvisioner();

        $user = \User::singleton();

        if ($user->hasPermission('access_all_profiles') === false) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        $provisioner = $provisioner->map(new IssueWatcherMapper());
        return $provisioner;
    }

    /**
    * Gets next or previous link
    *
    * @param int $delta offset for the next/prev link
    *
    * @return string|null the next/previous issueID
    */
    function _otherLink($delta) : ?string
    {
        return $this->filteredIssueList[$this->currentListIndex+$delta] ?? null;
    }
    /**
    * Sets the offset for the next link and gets the next link
    *
    * @return string|null $_otherLink
    */
    function nextLink() : ?string
    {
        return $this->_otherLink(1);
    }
    /**
    * Sets the offset for the prev link and gets the prev link
    *
    * @return string|null $_otherLink
    */
    function prevLink() : ?string
    {
        return $this->_otherLink(-1);
    }
}
