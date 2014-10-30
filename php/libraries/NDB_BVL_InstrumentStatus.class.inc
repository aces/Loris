<?php
/**
 * Class for managing the status of instrument flags
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once'ConflictDetector.class.inc';

/**
 * Behavioural instrument status class
 *
 * This class provides management tools for the status flags of instruments
 * in the NeuroDB framework.
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_BVL_InstrumentStatus
{
    /**
     * Instrument instance CommentID
     */
    var $_commentID;

    /**
     * Status array
     */
    var $_status;

    /**
     * The set of valid options for the data entry flag
     */
    var $_dataEntryOptions = array(
                              null, 'In Progress', 'Complete',
                             );

    /**
     * The set of valid options for the administration flag
     */
    var $_administrationOptions = array(
                                   null, 'None', 'Partial', 'All',
                                  );

    /**
     * The set of valid options for the validity flag
     */
    var $_validityOptions = array(
                             null, 'Valid', 'Questionable', 'Invalid',
                            );

    /**
     * The set of valid options for the exclusion flag
     */
    var $_exclusionOptions = array(
                              null, 'Fail', 'Pass',
                             );


    /**
     * Loads the object with the current status of the instrument
     *
     * @param string $commentID the CommentID identifying the data to load
     *
     * @return void
     */
    function select($commentID)
    {
        // set the _commentID property
        $this->_commentID = $commentID;

        $db = Database::singleton();

        // get candidate data from database
        $query = "SELECT SessionID, Data_entry, Administration, Validity, Exclusion
            FROM flag
            WHERE CommentID=:CID";
        $row   = $db->pselectRow($query, array('CID' => $this->_commentID));

        if (Utility::isErrorX($row)) {
            print $row->getMessage();
            return PEAR::raiseError(
                "Could not retrieve instrument status data from database"
            );
        }

        // store the statuses into the _status property
        $this->_status = $row;
    } // end function select()

    /**
     * Gets the SessionID of the current instrument
     * @return int
     * @access public
     */
    function getSessionID()
    {
        return $this->_status['SessionID'];
    }

    /**
     * Gets the current data entry status of the instrument
     *
     * @return string
     */
    function getDataEntryStatus()
    {
        return $this->_status['Data_entry'];
    }

    /**
     * Gets the current administration status of the instrument
     * @return string
     */
    function getAdministrationStatus()
    {
        return $this->_status['Administration'];
    }

    /**
     * Gets the current validity status of the instrument
     *
     * @return string
     */
    function getValidityStatus()
    {
        return $this->_status['Validity'];
    }

    /**
     * Gets the current exclusion status of the instrument
     *
     * @return string
     */
    function getExclusionStatus()
    {
        return $this->_status['Exclusion'];
    }

    /**
     * Sets the current data entry status of the instrument
     *
     * @param string $status the new status from the set (NULL,
     *                       'In Progress','Not Complete','Complete')
     *
     * @return void
     */
    function setDataEntryStatus($status)
    {
        if (!isset($this->_commentID)) {
            return PEAR::raiseError("No instrument instance selected");
        }

        if (!in_array($status, $this->_dataEntryOptions)) {
            return PEAR::raiseError('Invalid data entry status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Data_entry' => $status),
            array('CommentID' => $this->_commentID)
        );
        $updateResult = $this->select($this->_commentID);
        if (Utility::isErrorX($updateResult)) {
            return PEAR::raiseError("Could not reload object data");
        }

        // Run the ConflictDetector if the new status is Complete
        if ($status == 'Complete') {
            $principalCommentId = (strpos($this->_commentID, 'DDE') === false
                ? $this->_commentID
                : substr($this->_commentID, 4)
            );

            $instrumentName = NDB_BVL_Battery::getInstrumentNameForCommentId(
                $principalCommentId
            );

            ConflictDetector::clearConflictsForInstance($principalCommentId);
            $diff = ConflictDetector::detectConflictsForCommentIds(
                $instrumentName,
                $principalCommentId,
                'DDE_'.$principalCommentId
            );
            ConflictDetector::recordUnresolvedConflicts($diff);
        }
    }

    /**
     * Sets the current administration status of the instrument
     *
     * @param string $status the new status from the set
     *                       (NULL, 'None','Partial','All')
     *
     * @return void
     */
    function setAdministrationStatus($status)
    {
        if (!isset($this->_commentID)) {
            return PEAR::raiseError("No instrument instance selected");
        }

        if (!in_array($status, $this->_administrationOptions)) {
            return PEAR::raiseError('Invalid administration status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Administration' => $status),
            array('CommentID' => $this->_commentID)
        );
        $updateResult = $this->select($this->_commentID);
        if (Utility::isErrorX($updateResult)) {
            return PEAR::raiseError("Could not reload object data");
        }
    }

    /**
     * Sets the current validity status of the instrument
     *
     * @param string $status the new status from the set
     *                       (NULL, 'Questionable', 'Invalid', 'Valid')
     *
     * @return void
     */
    function setValidityStatus($status)
    {
        if (!isset($this->_commentID)) {
            return PEAR::raiseError("No instrument instance selected");
        }

        if (!in_array($status, $this->_validityOptions)) {
            return PEAR::raiseError('Invalid administration status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Validity' => $status),
            array('CommentID' => $this->_commentID)
        );
        $updateResult = $this->select($this->_commentID);
        if (Utility::isErrorX($updateResult)) {
            return PEAR::raiseError("Could not reload object data");
        }
    }

    /**
     * Sets the current exclusion status of the instrument
     *
     * @param string $status the new status from the set (NULL, 'Fail', 'Pass')
     *
     * @return void
     */
    function setExclusionStatus($status)
    {
        if (!isset($this->_commentID)) {
            return PEAR::raiseError("No instrument instance selected");
        }

        if (!in_array($status, $this->_exclusionOptions)) {
            return PEAR::raiseError('Invalid exclusion status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Exclusion' => $status),
            array('CommentID' => $this->_commentID)
        );
        $updateResult = $this->select($this->_commentID);
        if (Utility::isErrorX($updateResult)) {
            return PEAR::raiseError("Could not reload object data");
        }
    }

} // end class
