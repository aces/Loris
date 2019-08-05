<?php
/**
 * The forms for the start next stage menu
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\next_stage;
/**
 * The forms for the start next stage menu
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Next_Stage extends \NDB_Form
{
    /**
     * The timePoint to affect
     *
     * @var \TimePoint
     */
    protected $timepoint;

    /**
     * The timepoint's candidate
     *
     * @var \Candidate
     */
    protected $candidate;

    /**
     * Tie the access to a data_entry permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess(\User $user) : bool
    {
        $timePoint =& \TimePoint::singleton($this->identifier);

        // check user permissions
        if (!$user->hasPermission('data_entry')
            || !in_array(
                $timePoint->getData('CenterID'),
                $user->getData('CenterIDs')
            )
        ) {
            return false;
        }
        return $timePoint->isStartable();
    }

    /**
     * Processes the values and saves to database
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values)
    {
        $timePoint =& \TimePoint::singleton($this->identifier);

        // figure out what the next stage should be
        $newStage = $timePoint->getNextStage();

        // start that stage
        $timePoint->startStage($newStage);

        // set the date for the new stage
        $timePoint->setData(
            array(
                "Date_".$newStage => $values['date1'],
            )
        );

        // set SubprojectID if applicable
        if (isset($values['SubprojectID'])) {
            $timePoint->setData(
                array(
                    'SubprojectID' => $values['SubprojectID'],
                )
            );
        }

        // set scan done if applicable
        if (isset($values['scan_done'])) {
            $timePoint->setData(
                array(
                    'Scan_done' => $values['scan_done'],
                )
            );
        }

        // create a new battery object && new battery
        $battery   = new \NDB_BVL_Battery;
        $candidate =& \Candidate::singleton($timePoint->getCandID());

        $firstVisit = false;
         //get first visit for candidate
        $vLabel = $candidate->getFirstVisit();
         //if current visit label is same as
         // visit label returned must be first visit
        if ($vLabel ==  $timePoint->getVisitLabel()) {
            $firstVisit = true;
        }

         // select a specific time point (sessionID) for the battery
        $battery->selectBattery($timePoint->getData('SessionID'));

        // add instruments to the time point (lower case stage)
        $battery->createBattery(
            $timePoint->getSubprojectID(),
            $newStage,
            $timePoint->getVisitLabel(),
            $timePoint->getCenterID(),
            $firstVisit
        );

        //------------------------------------------------------------

        $this->tpl_data['success']   = true;
        $this->tpl_data['sessionID'] = $this->identifier;
        $this->tpl_data['candID']    = $timePoint->getCandID();

    }
    /**
     * Add elements to the page (after LorisForm has been
     * initialized in the parent.)
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $this->timepoint = \TimePoint::singleton($this->identifier);
        $this->candidate = \Candidate::singleton($this->timepoint->getCandID());

        $timePoint =& \TimePoint::singleton($this->identifier);
        $config    =& \NDB_Config::singleton();

        $dateOptions = array(
            'language'       => 'en',
            'format'         => 'YMd',
            'addEmptyOption' => true,
            'minYear'        => $config->getSetting('startYear'),
            'maxYear'        => $config->getSetting('endYear'),
        );

        $this->addHidden('candID', $timePoint->getData('CandID'));
        $this->addHidden('sessionID', $timePoint->getData('SessionID'));

        $stage = $timePoint->getNextStage();
        $this->tpl_data['stage'] = $stage;

        // add form elements
        if ($stage == 'Visit' && $config->getSetting('useScanDone')!='false') {
            $this->addSelect(
                'scan_done',
                'Scan Done',
                array(
                    null => null,
                    'Y'  => 'Yes',
                    'N'  => 'No',
                )
            );
            $this->addRule('scan_done', 'Scan done is required', 'required');
        }

        $dateAttributes = ['class' => 'form-control input-sm input-date'];

        // add dates
        $this->addBasicDate(
            'date1',
            "Date of $stage",
            $dateOptions,
            $dateAttributes
        );
        $this->addBasicDate(
            'date2',
            "Retype Date of $stage",
            $dateOptions,
            $dateAttributes
        );

        // let user select subproject *only* if subprojectid is not > 0
        if (!($timePoint->getSubprojectID() > 0)) {
            $list_of_objectives = \Utility::getSubprojectList();
            $this->addSelect(
                'SubprojectID',
                'Objective',
                array('' => '') + $list_of_objectives
            );
            $this->addRule('SubprojectID', 'Required', 'required');
        }

        // add date rules
        $this->addRule('date1', 'Date is required', 'required');
        $this->addRule(array('date1', 'date2'), 'Date fields must match', 'compare');

        $this->form->addFormRule(array(&$this, '_validate'));
    }
    /**
     * Validate function
     *
     * @param array $values the value
     *
     * @return array|bool
     */
    function _validate($values)
    {
        $config =& \NDB_Config::singleton();

        $timePoint =& \TimePoint::singleton($this->identifier);
        $candID    = $timePoint->getCandID();

        $candidate =& \Candidate::singleton($candID);

        $errors = array();
        /* Check that dates are present. Return early as there is no point
         * doing further processing otherwise.
         */
        if (!isset($values['date1'], $values['date2'])
            || is_null($values['date1'])
            || is_null($values['date2'])
        ) {
            $errors['date1'] .= "Both date fields are required.";
            return $errors;
        }
        // check date pairs
        if (empty($values['date1'])) {
            $errors['date1'] .= "Date is required. \n";
        }

        if ($values['date1'] != $values['date2']) {
            $errors['date1'] .= "Both Date fields must match. \n";
        }

        // get candidate's DOB or EDC according to SubprojectID
        $candidateBirthDate = $timePoint->getEffectiveDateOfBirth();

        //Determine the next stage, and validate accordingly
        $stage = $timePoint->getNextStage();
        if ($stage == 'Visit') {
            // compare the dates date of MRI
            // must be > DOB - ONLY WHEN starting Visit stage
            $date = $values['date1'] ?? '';

            if (empty($values['scan_done'])
                && $config->getSetting('useScanDone')!='false'
            ) {
                $errors['scan_done'] = 'Scan done is required';
            }
            if ($config->getSetting('useScreening')=="true"
                && $config->getSetting('screeningAfterVisit')!="true"
                && strcmp($date, $timePoint->getData('Date_screening')) < 0
            ) {
                $errors['date1'] .= "Date of Visit is less than".
                                    " Date of Screening. \n";
            }
            if ($config->getSetting('allowPrenatalTimepoints')!="true"
                && strcmp($date, $candidateBirthDate) < 1
            ) {
                $errors['date1'] .= "Date of Visit is less than ".
                                    "Date of Birth/EDC. \n";
            }
        }

        if (empty($errors)) {
             return true;
        }
        return $errors;
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $candid     = $this->candidate->getCandID();
        $pscid      = $this->candidate->getPSCID();
        $sessionid  = $this->timepoint->getSessionID();
        $visitlabel = $this->timepoint->getVisitLabel();

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                'Access Profile',
                '/candidate_list'
            ),
            new \LORIS\Breadcrumb(
                'Candidate Profile ' . $candid . ' / ' . $pscid,
                "/$candid"
            ),
            new \LORIS\Breadcrumb(
                "TimePoint $visitlabel Details",
                "/instrument_list/?candID=$candid&sessionID=$sessionid"
            ),
            new \LORIS\Breadcrumb(
                'Start Next Stage',
                "/next_stage/?candID=$candid&sessionID=$sessionid" .
                "&identifier=$sessionid"
            )
        );
    }

}
