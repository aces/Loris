<?php declare(strict_types=1);

/**
 * The timepoint list menu
 *
 * PHP Version 8
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

use \LORIS\StudyEntities\Candidate\CandID;

/**
 * The timepoint list menu
 *
 * PHP Version 8
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
    #[\Override]
    function isAccessibleBy(\User $user) : bool
    {
        $candidate = \Candidate::singleton($this->candID);

        // check user permissions
        return $user->hasPermission('access_all_profiles')
            || $candidate->isAccessibleBy($user);
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
        // FIXME: At some point this class and related classes should use a
        // Candidate object rather than passing a CandID around.
        $this->candID = new CandID($request->getAttribute('CandID'));
        return parent::process($request, $handler);
    }

    /**
     * Setup function
     *
     * @return void
     */
    function setup(): void
    {
        // create candidate object
        $candidate = \Candidate::singleton($this->candID);

        $this->tpl_data['candID']    = $this->candID;
        $this->tpl_data['PSCID']     = $candidate->getPSCID();
        $this->tpl_data['candidate'] = $candidate->getData();
        // convert DoB date to age and months and rename it to Derived Age
        $dob = $candidate->getData();
        if (isset($dob['DoB']) && is_string($dob['DoB'])) {
            $dob_date = date_create_from_format('Y-m-d', $dob['DoB']);
            if ($dob_date !== false) {
                $current_date = new \DateTime();
                $dob_year     = abs($current_date->diff($dob_date)->y);
                $dob_month    = abs($current_date->diff($dob_date)->m);
                $dob_age      = $dob_year . dgettext("timepoint_list", " y / ")
                    . $dob_month . dgettext("timepoint_list", " m");
                $this->tpl_data['dob_age'] = $dob_age;
            }

        }
        // convert EDC date to age and months and rename it to EDC Age
        $edc = $candidate->getData();
        if (isset($edc['EDC']) && is_string($edc['EDC'])) {
            $edc_date = date_create_from_format('Y-m-d', $edc['EDC']);
            if ($edc_date !== false) {
                $current_date = new \DateTime();
                $edc_year     = abs($current_date->diff($edc_date)->y);
                $edc_month    = abs($current_date->diff($edc_date)->m);
                $edc_age      = $edc_year . dgettext("timepoint_list", " y / ")
                    . $edc_month . dgettext("timepoint_list", " m");
                $this->tpl_data['edc_age'] = $edc_age;
            }
        }
        $listOfSessionIDs = $candidate->getListOfTimePoints();

        $user     = \User::singleton();
        $username = $user->getUsername();

        $feedback_select_inactive = false;
        if ($user->hasPermission('bvl_feedback')) {
            $feedback_select_inactive = true;
        }

        $listOfTimePoints = array_map(
            function ($sessionID) {
                return \TimePoint::singleton(
                    new \SessionID(strval($sessionID)),
                );
            },
            $listOfSessionIDs,
        );
        $listOfTimePoints = array_filter(
            $listOfTimePoints,
            function ($timePoint) use ($user) {
                return $timePoint->isAccessibleBy($user)
                    || $user->hasPermission('access_all_profiles');
            }
        );

        $dateFormatter = new \IntlDateFormatter(
            "",
            \IntlDateFormatter::SHORT,
            \IntlDateFormatter::NONE
        );

        /*
         * List of visits
         */
        $x = 0;

        foreach ($listOfTimePoints as $timePoint) {
            $sessionID = $timePoint->getSessionID();

            // get the first date of visit in order to
            // turn on the future time points bit if we have a date of visit
            $dateOfVisit = $timePoint->getDateOfVisit();
            if (!empty($dateOfVisit)) {
                if (empty($firstDateOfVisit)) {
                    $firstDateOfVisit = $dateOfVisit;
                }
            }

            // get timepoint data
            $this->tpl_data['timePoints'][$x]
                = $timePoint->getData();

            // get current status
            $this->tpl_data['timePoints'][$x]['currentStatus']
                = $timePoint->getCurrentStatus();
            // get current date
            $curDate = $timePoint->getCurrentDate();
            if ($curDate != null) {
                $curDate = new \DateTimeImmutable($curDate);
            }
            $this->tpl_data['timePoints'][$x]['currentDate']
                = $curDate != null ? $dateFormatter->format($curDate) : null;

            // create feedback object for the time point
            $feedback = \NDB_BVL_Feedback::singleton(
                $username,
                null,
                $sessionID
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
                [
                    null,
                    'Not Started',
                    'Visit',
                    'Screening',
                ]
            )
            ) {
                // for static stages, don't bother showing current status
                $this->tpl_data['timePoints'][$x]['staticStage'] = true;

                // get the outcome data
                $outcomeStage
                    = $this->_determinePreviousStage($sessionID);

                $getStatusMethod = 'get'.$outcomeStage.'Status';

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

            $this->tpl_data['timePoints'][$x]['language']
                = $timePoint->getLanguage();
            $x++;
        } // end list

        /*
         * List of future visits
         */
        if (isset($firstDateOfVisit)) {
            $timePoint = \TimePoint::singleton(
                new \SessionID(strval($listOfSessionIDs[0]))
            );

            $this->tpl_data['CohortID'] = $timePoint->getCohortID();

        } // end list

        $this->tpl_data['actions'] = $this->getActionButtons();
    }

    /**
     * Determining Previous Stage
     *
     * @param \SessionID $sessionID that refers to this TimePoint
     *
     * @return string
     */
    function _determinePreviousStage(\SessionID $sessionID): string
    {
        // create timepoint object
        $timePoint = \TimePoint::singleton($sessionID);

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
     * @param CandID $candID candID
     *
     * @return string
     */
    function getFeedbackPanel(CandID $candID): string
    {
        return (new \BVL_Feedback_Panel($candID))->display();
    }

    /**
     * Get Action Buttons
     *
     * @return string
     */
    function getActionButtons(): string
    {
        return (new TimePoint_List_ControlPanel($this->candID))->display();
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
                dgettext("candidate_list", 'Access Profile'),
                '/candidate_list'
            ),
            new \LORIS\Breadcrumb(
                dgettext("candidate_profile", "Candidate Profile")
                . " $candid / $pscid",
                "/$candid"
            )
        );
    }
}
