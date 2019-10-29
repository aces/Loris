<?php
/**
 * The timepoint list menu
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Timepoint_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\timepoint_list;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * The timepoint list menu
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Timepoint_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
class Timepoint_List extends \NDB_Menu
{
    protected $candID;

    /**
     * Overloading this method to allow access to timepoint list
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $candidate =& \Candidate::singleton($this->candID);

        // check user permissions
        if ($user->hasPermission('access_all_profiles')
            || (in_array(
                $candidate->getData('RegistrationCenterID'),
                $user->getData('CenterIDs')
            ))
        ) {
            return true;
        }

        // if the candidate.RegistrationCenterID does not match the users.CenterID
        // then check if any of the timepoints belong to the user's site
        $listOfTimePoints = $candidate->getListOfTimePoints();

        foreach ($listOfTimePoints as $sessionID) {
            // create timepoint object
            $timePoint =& \TimePoint::singleton($sessionID);
            // check if at least one timepoint belongs to the user's site
            if (in_array(
                $timePoint->getData('CenterID'),
                $user->getData('CenterIDs')
            )
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Handle an incoming HTTP request. The timepoint_list overrides the default
     * handler to populate the CandID field for the page class.
     *
     * @param ServerRequestInterface  $request The incoming PSR7 request
     * @param RequestHandlerInterface $handler The PSR15 handler.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        $attribute = $request->getAttribute("CandID");
        if ($attribute !== null) {
            // FIXME: Update the code to add the singleton here, not the identifier.
            $this->candID = $attribute;
        } else {
            $gets         = $request->getQueryParams();
            $this->candID = $gets['candID'];
        }
        return parent::process($request, $handler);
    }

    /**
     * Setup function
     *
     * @return void
     */
    function setup()
    {
        // create candidate object
        $candidate =& \Candidate::singleton($this->candID);
        $DB        =& \Database::singleton();

        $numberOfVisits           = 0;
        $this->tpl_data['candID'] = $this->candID;
        $this->tpl_data['PSCID']  = $candidate->getPSCID();
        $listOfTimePoints         = $candidate->getListOfTimePoints();
        $this->tpl_data['candidate'] = $candidate->getData();

        if (!empty($listOfTimePoints)) {
            $user     =& \User::singleton();
            $username = $user->getData('UserID');

            $feedback_select_inactive = null;
            if ($user->hasPermission('bvl_feedback')) {
                $feedback_select_inactive = 'Y';
            }

            /*
             * List of visits
             */
            $x = 0;
            foreach ($listOfTimePoints as $currentTimePoint) {
                $timePoint =& \TimePoint::singleton($currentTimePoint);

                // get the first date of visit in order to
                // turn on the future time points bit if we have a date of visit
                $dateOfVisit = $timePoint->getDateOfVisit();
                if (!empty($dateOfVisit)) {
                    if (empty($firstDateOfVisit)) {
                        $firstDateOfVisit = $dateOfVisit;
                    }
                    $numberOfVisits++;
                }

                // get timepoint data
                $this->tpl_data['timePoints'][$x]
                    = $timePoint->getData();

                // get current status
                $this->tpl_data['timePoints'][$x]['currentStatus']
                    = $timePoint->getCurrentStatus();
                // get current date
                $this->tpl_data['timePoints'][$x]['currentDate']
                    =   $timePoint->getCurrentDate();

                // get Center Name
                $centerID = $timePoint->getData('CenterID');
                $center   = $DB->pselectRow(
                    "SELECT CenterID as ID, Alias FROM psc WHERE CenterID =:cid",
                    array('cid' => $centerID)
                );
                $this->tpl_data['timePoints'][$x]['CenterName']
                    = $center['Alias'] ?? '';

                // create feedback object for the time point
                $feedback = \NDB_BVL_Feedback::singleton(
                    $username,
                    null,
                    $timePoint->getData('SessionID')
                );

                $feedback_status = $feedback->getMaxThreadStatus(
                    $feedback_select_inactive
                );

                $feedback_count = $feedback->getThreadCount();

                $this->tpl_data['timePoints'][$x]['feedbackCount']
                    = (empty($feedback_count))
                       ? $feedback_status
                       : $feedback_count;

                $this->tpl_data['timePoints'][$x]['feedbackStatus']
                    = $feedback_status;

                $this->tpl_data['timePoints'][$x]['feedbackColor']
                    = $feedback->getThreadColor($feedback_status);

                if (!in_array(
                    $timePoint->getCurrentStage(),
                    array(
                        null,
                        'Not Started',
                        'Visit',
                        'Screening',
                    )
                )
                ) {
                    // for static stages, don't bother showing current status
                    $this->tpl_data['timePoints'][$x]['staticStage'] = true;

                    // get the outcome data
                    $outcomeStage
                        = $this->_determinePreviousStage($currentTimePoint);

                    $getStatusMethod
                        = 'get'.$outcomeStage.'Status';

                    $getDateMethod = 'getDateOf'.$outcomeStage;

                    // set the template data
                    $this->tpl_data['timePoints'][$x]['outcomeStage']
                        = $outcomeStage;

                    if (method_exists($timePoint, $getStatusMethod)) {
                          $this->tpl_data['timePoints'][$x]['outcomeStatus']
                              = $timePoint->$getStatusMethod();
                    }
                    if (method_exists($timePoint, $getDateMethod)) {
                        $this->tpl_data['timePoints'][$x]['outcomeDate']
                            = $timePoint->$getDateMethod();
                    }
                }
                $x++;
            } // end list

            /*
             * List of future visits
             */
            if (isset($firstDateOfVisit)) {
                $timePoint = \TimePoint::singleton($listOfTimePoints[0]);

                $this->tpl_data['SubprojectID'] = $timePoint->getSubprojectID();

            } // end list
        }

        $this->tpl_data['actions'] = $this->getActionButtons();

    }
    /**
     * Determining Previous Stage
     *
     * @param string $sessionID sessionID
     *
     * @return string
     */
    function _determinePreviousStage($sessionID)
    {
        // create timepoint object
        $timePoint =& \TimePoint::singleton($sessionID);

        // outcome stage is the last stage
        //(approval || visit || screening || not started, in that order)
        // with a non-null status
        if ($timePoint->getData('Approval') != null) {
            return  'Approval';
        } elseif ($timePoint->getData('Visit') != null) {
            return  'Visit';
        } elseif ($timePoint->getData('Screening') != null) {
            return  'Screening';
        }
        return  'Not Started';
    }
    /**
     * Used by the NDB_caller class when loading a page.
     * Call the display function of the appropriate modules feedback panel.
     *
     * @param string $candID    candID
     * @param string $sessionID sessionID
     *
     * @return string
     */
    function getFeedbackPanel($candID, $sessionID = null)
    {
        $feedbackPanel = new \BVL_Feedback_Panel($candID);
        $html          = $feedbackPanel->display();
        return $html;
    }
    /**
     * Get Action Buttons
     *
     * @return string
     */
    function getActionButtons()
    {
        $controlPanel = new TimePoint_List_ControlPanel($this->candID);
        return $controlPanel->display();
    }

    /**
     * Get dependencies to timepoint_list for image browsing link
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return $deps;
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $candid = $this->tpl_data['candID'];
        $pscid  = $this->tpl_data['PSCID'];

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                'Access Profile',
                '/candidate_list'
            ),
            new \LORIS\Breadcrumb(
                "Candidate Profile $candid / $pscid",
                "/$candid"
            )
        );
    }
}

