<?php
/**
 * Time Point status control panel class
 *
 * This class provides the management GUI for the status flags
 * (session table) of a time point in the NeuroDB framework.
 *
 * PHP Version 7
 *
 * @category Instrument_List
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\instrument_list;

/**
 * Time Point status control panel class
 *
 * This class provides the management GUI for the status flags
 * (session table) of a time point in the NeuroDB framework.
 *
 * PHP Version 7
 *
 * @category Instrument_List
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Instrument_List_ControlPanel extends \TimePoint
{
    protected array $tpl_data;

    /**
     * The LORIS Instance that this timepoint exists on
     *
     * @var \LORIS\LorisInstance $loris
     */
    protected $loris;

    /**
     * Construct function
     *
     * @param \LORIS\LorisInstance $loris     The LORIS Instance.
     * @param \SessionID           $sessionID SessionID that this control
     *                                        panel is controlling.
     *
     * @return void
     */
    function __construct(\LORIS\LorisInstance $loris, $sessionID)
    {
        $this->tpl_data = [];
        $this->loris    = $loris;

        $this->select($sessionID);
    }

    /**
     * Generates the HTML to display the set of buttons for
     * the timepoint status flags
     *
     * @return string
     * @access public
     */
    function display()
    {
        $factory = \NDB_Factory::singleton();
        $this->tpl_data['baseurl'] = $factory->settings()->getBaseURL();

        $this->tpl_data['candID']    = $this->getCandID();
        $this->tpl_data['sessionID'] = $this->getSessionID();

        // start next stage
        $this->tpl_data['access']['next_stage'] = $this->_displayStartNextStage();

        // generate the time point status buttons
        $this->tpl_data['access']['status'] = $this->_displayStatus();
        // send to DCC
        $this->tpl_data['access']['send_to_dcc'] = $this->_displaySendToDCC();
        if (!$this->tpl_data['access']['send_to_dcc']) {
            $this->tpl_data['access']['send_to_dcc_status_message']
                = $this->_getSendToDCCStatusMessage();
        }

        // BVLQC - get permission and set the tpl element
        $user = \User::singleton();
        $this->tpl_data['access']['bvl_qc']
            = $user->hasPermission('bvl_feedback');

        // BVLQCType
        $this->_displayBVLQCType();
        // BVLQCStatus
        $this->_displayBVLQCStatus();

        $smarty = new \Smarty_NeuroDB("instrument_list");
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("instrument_list_controlpanel.tpl");
        return $html;
    }

    /**
     * Saves changes to the session table based on interaction
     * with the control panel
     *
     * @return void
     */
    function save()
    {
        $currentStage  = $this->getData('Current_stage');
        $currentStatus = $this->getData($currentStage);

        // update the status of the current stage
        if (!empty($_REQUEST['setStageUpdate'])
            && $this->_hasAccessStatus()
            && in_array($_REQUEST['setStageUpdate'], $this->_statusOptions)
            && in_array($currentStage, $this->_dynamicStageOptions)
        ) {
            $this->setData(
                [
                    $currentStage        => $_REQUEST['setStageUpdate'],
                    'Date_status_change' => date('Y-m-d'),
                ]
            );
            return;
        }

        // submit to dcc (a.k.a., finalize)
        if (isset($_REQUEST['setSubmitted']) && $_REQUEST['setSubmitted'] == 'Y'
            && $this->_hasAccessSendToDCC()
            && in_array($currentStage, ['Visit', 'Screening'])
            && $currentStatus != 'In Progress'
        ) {
            $config = \NDB_Config::singleton();

            // Send to DCC - set Submitted to Y
            $this->setData(
                [
                    'Submitted' => $_REQUEST['setSubmitted'],
                ]
            );
            // move to next stage (approval or the bin)
            if ($currentStatus == 'Pass') {
                $nextStage = 'Approval';
                $isPassed  = true;
            } else {
                $nextStage = 'Recycling Bin';
                $isPassed  = false;
            }
            $this->startStage($nextStage);
            // update candidate_diagnosis_evolution_rel
            \Utility::updateDiagnosisConfirmationStatus(
                $this->getSessionID(),
                $isPassed
            );

            if ($nextStage == 'Recycling Bin') {

                $battery = new \NDB_BVL_Battery();

                // set the SessionID for the battery
                $battery->selectBattery(
                    $this->getSessionID()
                );

                // get the list of instruments
                $batteryList = $battery->getBatteryVerbose();

                // Get the list of DDE instruments
                $config         =& \NDB_Config::singleton();
                $ddeInstruments = $config->getSetting(
                    'DoubleDataEntryInstruments'
                );

                // clear the unresolved conflicts for all the instruments
                foreach ($batteryList as $instrument) {

                    // If the instrument requires double data entry, check that
                    // DDE is also done
                    if (in_array($instrument['Test_name'], $ddeInstruments)) {
                        \ConflictDetector::clearConflictsForInstance(
                            $instrument['CommentID']
                        );
                    }
                }

            }

            return;
        }
        $submitted  = $_REQUEST['setSubmitted'] ?? '';
        $condition1 = $submitted == 'N';
        $condition2 = $this->_hasAccessSendToDCC();
        $condition3 = !in_array(
            $currentStage,
            [
                null,
                'Not Started',
                'Visit',
                'Screening',
            ]
        );
        // un-submit to dcc
        if ($condition1 && $condition2 && $condition3) {

            $this->setData(
                ['Submitted' => $submitted]
            );

            // revert from approval (or the bin)
            if ($currentStage == 'Approval') {
                $this->setData(
                    [
                        'Approval'      => null,
                        'Date_approval' => null,
                    ]
                );

                // update candidate_diagnosis_evolution_rel
                \Utility::updateDiagnosisConfirmationStatus(
                    $this->getSessionID(),
                    false
                );
            }
                $previousStage = $this->_determinePreviousStage();
                $this->startStage($previousStage);

                $battery = new \NDB_BVL_Battery();
                // set the SessionID for the battery
                $battery->selectBattery(
                    $this->getSessionID()
                );
                // get the list of instruments
                $batteryList = $battery->getBatteryVerbose();
                // Get the list of DDE instruments
                $config         =& \NDB_Config::singleton();
                $ddeInstruments = $config->getSetting(
                    'DoubleDataEntryInstruments'
                );

                // detect conflicts for all the instruments

            foreach ($batteryList as $instrument) {
                // If the instrument requires double data entry,
                // detect conflicts
                if (in_array($instrument['Test_name'], $ddeInstruments)) {
                    // ConflictDetector::
                    //clearConflictsForInstance($instrument['CommentID']);
                    \ConflictDetector::clearConflictsForInstance(
                        $instrument['CommentID']
                    );
                    $diff =\ConflictDetector::detectConflictsForCommentIds(
                        $this->loris,
                        $instrument['Test_name'],
                        $instrument['CommentID'],
                        $instrument['DDECommentID']
                    );
                    \ConflictDetector::recordUnresolvedConflicts($diff);
                }
            }
            return;
        }

        // set the BVLQC flag
        $user =& \User::singleton();
        if (!empty($_REQUEST['setBVLQCStatus'])
            && $user->hasPermission('bvl_feedback')
        ) {
            // If 'setBVLQCStatus' is set and not empty,
            // update the value of 'BVLQCStatus' to what is
            // in the request.
            $this->setData(
                [
                    'BVLQCStatus' => $_REQUEST['setBVLQCStatus'],
                ]
            );
            return;
        } else if (isset($_REQUEST['setBVLQCStatus'])
            && empty($_REQUEST['setBVLQCStatus'])
        ) {
            // In order to set the 'BVLQCStatus' value as null, the
            // front-end appends 'setBVLQCStatus' to the request with
            // an empty string as value.
            //
            // If 'setBVLQCStatus' is set and empty,
            // update the value of 'BVLQCStatus' to null.
            // Otherwise, do nothing.
            $this->setData(
                ['BVLQCStatus' => null]
            );
            return;
        }
        if (!empty($_REQUEST['setBVLQCType'])
            && $user->hasPermission('bvl_feedback')
        ) {
            // If 'setBVLQCType' is set and not empty,
            // update the value of 'BVLQCType' to what is
            // in the request.
            $this->setData(
                [
                    'BVLQCType' => $_REQUEST['setBVLQCType'],
                ]
            );
            return;
        } else if (isset($_REQUEST['setBVLQCType'])
            && empty($_REQUEST['setBVLQCType'])
        ) {
            // In order to set the 'BVLQCType' value as null, the
            // front-end appends 'setBVLQCType' to the request with
            // an empty string as value.
            //
            // If 'setBVLQCType' is set and empty,
            // update the value of 'BVLQVType' to null.
            // Otherwise, do nothing.
            $this->setData(
                ['BVLQCType' => null]
            );
            return;
        }
    }
    /**
     * DeterminePreviousStage function
     *
     * @return string
     */
    function _determinePreviousStage()
    {
        // outcome stage is the last stage (approval || visit || screening
        // || not started, in that order) with a non-null status
        if ($this->getData('Approval') != null) {
            return  'Approval';
        } elseif ($this->getData('Visit') != null) {
            return  'Visit';
        } elseif ($this->getData('Screening') != null) {
            return  'Screening';
        }
        return  'Not Started';
    }


    /**
     * DisplayStatus function
     *
     * @return bool
     */
    function _displayStatus()
    {
        $currentStage  = $this->getCurrentStage();
        $currentStatus = $this->getCurrentStatus();

        $this->tpl_data['current_stage']  = $currentStage;
        $this->tpl_data['current_status'] = $currentStatus;

        // if the time point hasn't been not started,
        // do not display status options
        if (!$this->isStudyStageDynamic($currentStage)) {
            return false;
        }

        $hasAccess = $this->_hasAccessStatus();

        // check that all the instruments' Data Entry is market Complete
        $battery = new \NDB_BVL_Battery;

        // set the SessionID for the battery
        $battery->selectBattery(new \SessionID($_REQUEST['sessionID']));

        // get the list of instruments
        $batteryList = $battery->getBatteryVerbose();

        // Get the list of DDE instruments
        $config         = \NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');

        // loop the list and check the Data Entry status
        $ddeConflictDetected = false;
        $dataEntry           = '';
        foreach ($batteryList as $instrument) {
            $status = new \NDB_BVL_InstrumentStatus($this->loris);
            $status->select($instrument['CommentID']);
            $dataEntry = $status->getDataEntryStatus();
            if ($dataEntry != 'Complete') {
                break;
            }

            // If the instrument requires double data entry,
            //check that DDE is also done
            if (in_array($instrument['Test_name'], $ddeInstruments)) {
                $status = new \NDB_BVL_InstrumentStatus($this->loris);
                $status->select($instrument['DDECommentID']);
                $dataEntry = $status->getDataEntryStatus();
                if ($dataEntry != 'Complete') {
                    break;
                }

                // Pretend data entry is not complete if there are conflicts
                if (\ConflictDetector::isInstrumentInstanceInConflictState(
                    $instrument['CommentID']
                )
                ) {
                    $ddeConflictDetected =true;
                    break;
                }
            }
        }

        // loop through the options
        $i = 0;
        foreach ($this->_statusOptions AS $option) {
            // skip the null case and do not show Withdrawal option
            // for Approval stage
            if (is_null($option)
                || ($option == 'Withdrawal'
                && $currentStage == 'Approval')
            ) {
                continue;
            }

            $this->tpl_data['status'][$i]['label'] = $option;

            // highlight the current option if it's the current status
            if ($currentStatus == $option) {
                $this->tpl_data['status'][$i]['icon'] = 'far fa-check-square';
            } elseif (in_array($currentStage, $this->_dynamicStageOptions)
                && (!$this->isSubmitted()
                || ($this->isSubmitted() && $hasAccess)                )
            ) {
                // if the current stage is dynamic AND the Timepoint
                //is not sent to DCC (all PSC users can press buttons)
                // OR if the stage is dynamic (Approval),
                //the Timepoint IS submitted and the user can QC behavioural data

                if ($option == 'In Progress') {
                    $this->tpl_data['status'][$i]['showlink'] = true;
                } elseif ($option == 'Pass'
                    && $dataEntry == 'Complete'
                    && !$ddeConflictDetected
                ) {
                    $this->tpl_data['status'][$i]['showlink'] = true;
                } elseif (($option == 'Failure' || $option == 'Withdrawal')
                    && $dataEntry == 'Complete'
                ) {
                    $this->tpl_data['status'][$i]['showlink'] = true;
                } else {
                    $this->tpl_data['status'][$i]['icon'] = 'fas fa-times';
                }

            } else {
                $this->tpl_data['status'][$i]['icon'] = 'fas fa-times';
            }
            $i++;
        }

        return $hasAccess;
    }
    /**
     * DisplayStatus function
     *
     * @return bool
     */
    function _hasAccessStatus()
    {
        // get user object
        $user =& \User::singleton();

        // disable the button for all these users
        $currentStage = $this->getCurrentStage();
        if ($currentStage == "Approval") {
            return ($user->hasPermission('bvl_feedback'));
        }

        return $user->hasPermission('data_entry')
            && $user->hasCenter($this->getCenterID());
    }
    /**
     * DisplayStatus function
     *
     * @return void
     */
    function _displayBVLQCType()
    {
        // get the current bvlqc type
        $qcStatus = $this->getBVLQCStatus();

        foreach ($this->bvlQcTypes as $type) {
            $isSelected = $type == $this->getBVLQCType();
            $type       = strtolower($type ?? 'none');
            if ($isSelected) {
                $this->tpl_data['bvl_qc_type_'.$type]['icon']
                    = 'far fa-check-square';
            }

            // ensure the variable checked is set the same way as in display()
            $user =& \User::singleton();
            $this->tpl_data['access']['bvl_qc']
                = $user->hasPermission('bvl_feedback');

            //If a BVLQC status is not selected,
            // and this type is not already chosen, show the link.
            if (!$isSelected
                && empty($qcStatus)
                && $this->tpl_data['access']['bvl_qc']
            ) {
                $this->tpl_data['bvl_qc_type_'.$type]['showlink'] =true;
            }
        }
    }

    /**
     * Generates the HTML to display the set
     * of buttons for the Time Point status update
     *
     * @return void
     * @access private
     */
    function _displayBVLQCStatus()
    {
        // get the current bvlqc type
        $qcType = $this->getBVLQCType();

        foreach ($this->bvlQcStatuses as $status) {
            $isSelected = $status == $this->getBVLQCStatus();
            $status     = strtolower($status ?? 'none');
            if ($isSelected) {
                $this->tpl_data['bvl_qc_status_'.$status]['icon']
                    = 'far fa-check-square';
            }
            //If a BVLQC type is selected,
            // and this status is not already chosen, show the link.
            $user =& \User::singleton();
            $this->tpl_data['access']['bvl_qc']
                = $user->hasPermission('bvl_feedback');
            if (!empty($qcType)
                && !$isSelected
                && $this->tpl_data['access']['bvl_qc']
            ) {
                $this->tpl_data['bvl_qc_status_'.$status]['showlink'] =true;
            }
        }
    }

    /**
     * Generates the HTML to display the set of buttons
     * for the Time Point status update
     *
     * @return bool
     * @access private
     */
    function _displaySendToDCC()
    {
        $config =& \NDB_Config::singleton();
        $study  = $config->getSetting('study');

        $hasAccess = $this->_hasAccessSendToDCC();

        // This is a toggle button.
        if ($this->getData('Submitted')=='Y') {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'N';
        } elseif (isset($study['timepointFlagCheck_send2dcc'])
            && $study['timepointFlagCheck_send2dcc']
            && $this->getVisitStatus()=='Pass'
        ) {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'Check';
        } else {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'Y';
        }

        if ($this->isSubmitted()) {
            $this->tpl_data['send_to_dcc']['icon']    = 'far fa-check-square';
            $this->tpl_data['send_to_dcc']['reverse'] = 'Reverse Send To DCC';
        }

        $battery = new \NDB_BVL_Battery();

        // set the SessionID for the battery
        $battery->selectBattery($this->getSessionID());

        // get the list of instruments
        $batteryList = $battery->getBatteryVerbose();

        // Get the list of DDE instruments
        $config         =& \NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');

        // clear the unresolved conflicts for all the instruments
        $allDataEntryComplete =true;
        foreach ($batteryList as $instrument) {

            $status = new \NDB_BVL_InstrumentStatus($this->loris);
            $status->select($instrument['CommentID']);
            $dataEntry = $status->getDataEntryStatus();
            if ($dataEntry != 'Complete') {
                $allDataEntryComplete =false;
                break;
            }

            // If the instrument requires double data entry,
            // check that DDE is also done
            if (in_array($instrument['Test_name'], $ddeInstruments)) {
                $status = new \NDB_BVL_InstrumentStatus($this->loris);
                $status->select($instrument['DDECommentID']);
                $dataEntry = $status->getDataEntryStatus();
                if ($dataEntry != 'Complete') {
                    $allDataEntryComplete =false;
                    break;
                }
            }
        }

        if ($this->getData('Submitted')=='Y') {
            return $hasAccess;
        }
        return ($hasAccess && $allDataEntryComplete);
    }

    /**
     * Returns the reason why the user cannot send to dcc.
     *
     * @return string
     */
    function _getSendToDCCStatusMessage()
    {
        // create user object
        $user   = \User::singleton();
        $config = \NDB_Config::singleton();

        // get the value of the session.Scan_done field
        $scanDone = $this->getData('Scan_done');

        if (!$user->hasPermission('send_to_dcc')) {
            return "User does not have permission to send to DCC";
        }
        if (!$user->hasCenter($this->getCenterID())) {
            return "Users must belong to the same site"
                . " as the candidate to submit to DCC.";
        }
        if ($this->isSubmitted()) {
            return "This timepoint has already been sent to DCC.".
                         "  Try refreshing your page.";
        }
        if (!in_array(
            $this->getData('Current_stage'),
            [
                'Screening',
                'Visit',
            ]
        )
        ) {
            return "This stage is not a Screening or Visit stage. "
                . "Only Screening or Visit stages can be sent to DCC.";
        }
        if (in_array(
            $this->getData($this->getData('Current_stage')),
            [
                null,
                'In Progress',
            ]
        )
        ) {
            return "The status of this stage is either"
                . " In Progress or has not been set.";
        }
        if (! $config->settingEnabled("useScanDone")
            || ($this->getData('Current_stage') != 'Screening'
            && empty($scanDone))
        ) {
            return "The Scan done field must be entered for the Visit stage";
        }

        $battery = new \NDB_BVL_Battery();

        // set the SessionID for the battery
        $battery->selectBattery($this->getSessionID());

        // get the list of instruments
        $batteryList = $battery->getBatteryVerbose();

        // Get the list of DDE instruments
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');

        // clear the unresolved conflicts for all the instruments
        $allDataEntryComplete =true;
        foreach ($batteryList as $instrument) {

            $status = new \NDB_BVL_InstrumentStatus($this->loris);
            $status->select($instrument['CommentID']);
            $dataEntry = $status->getDataEntryStatus();
            if ($dataEntry != 'Complete') {
                $allDataEntryComplete = false;
                break;
            }

            // If the instrument requires double data entry,
            // check that DDE is also done
            if (in_array($instrument['Test_name'], $ddeInstruments)) {
                $status = new \NDB_BVL_InstrumentStatus($this->loris);
                $status->select($instrument['DDECommentID']);
                $dataEntry = $status->getDataEntryStatus();
                if ($dataEntry != 'Complete') {
                    $allDataEntryComplete = false;
                    break;
                }
            }
        }
        if (!$allDataEntryComplete) {
            return "All instruments must have data entry marked as complete.";
        }
    }
    /**
     * HasAccessSendToDCC function
     *
     * @return bool
     */
    function _hasAccessSendToDCC()
    {
        // create user object
        $user   =& \User::singleton();
        $config =& \NDB_Config::singleton();

        // get the value of the session.Scan_done field
        $scanDone = $this->getData('Scan_done');

        // make the option available is the Stage/Status is Sendable to DCC
        // or if its Superuser and option was Sent (to unsend i.e. set to N)

        if ($user->hasPermission('unsend_to_dcc')
            && $this->getData('Submitted')=='Y'
        ) {
            return true;
        } elseif ($user->hasPermission('send_to_dcc')
            && $user->hasCenter($this->getCenterID())
            && $this->getData('Submitted')=='N'
            && in_array(
                $this->getData('Current_stage'),
                [
                    'Screening',
                    'Visit',
                ]
            )
            && !in_array(
                $this->getData($this->getData('Current_stage')),
                [
                    null,
                    'In Progress',
                ]
            )
            && (!$config->settingEnabled("useScanDone")
            || $this->getData('Current_stage') == 'Screening'
            || !empty($scanDone))
        ) {
            return true;
        }
        return false;
    }
    /**
     * DisplayStartNextStage function
     *
     * @return bool
     */
    function _displayStartNextStage()
    {
        $this->tpl_data['next_stage'] = $this->getNextStage();

        // create user object
        $user =& \User::singleton();

        // check user permissions
        if (! $user->hasPermission('data_entry')
            || ! $user->hasCenter($this->getCenterID())
        ) {
            return false;
        }
        return $this->isStartable();
    }

}

