<?php declare(strict_types=1);
/**
 * Class for managing the status of instrument flags
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

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
                              null,
                              'In Progress',
                              'Complete',
                             );

    /**
     * The set of valid options for the administration flag
     */
    var $_administrationOptions = array(
                                   null,
                                   'None',
                                   'Partial',
                                   'All',
                                  );

    /**
     * The set of valid options for the validity flag
     */
    var $_validityOptions = array(
                             null,
                             'Valid',
                             'Questionable',
                             'Invalid',
                            );

    /**
     * The set of valid options for the exclusion flag
     */
    var $_exclusionOptions = array(
                              null,
                              'Fail',
                              'Pass',
                             );

    /**
     * Loads the object with the current status of the instrument
     *
     * @param string $commentID the CommentID identifying the data to load
     *
     * @return void
     */
    function select(string $commentID): void
    {
        // set the _commentID property
        $this->_commentID = $commentID;

        $db = Database::singleton();

        // get candidate data from database
        $query = "SELECT SessionID, Data_entry, Administration, Validity, Exclusion
            FROM flag
            WHERE CommentID=:CID";
        $row   = $db->pselectRow($query, array('CID' => $this->_commentID));
        if (is_null($row)) {
            throw new \LorisException(
                'No information exists in the database for the specified '
                . 'CommentID. Cannot build InstrumentStatus object'
            );
        }

        // store the statuses into the _status property
        $this->_status = $row;
    } // end function select()

    /**
     * Gets the SessionID of the current instrument
     *
     * @return int
     * @access public
     */
    public function getSessionID(): int
    {
        return intval($this->_status['SessionID']);
    }

    /**
     * Gets the current data entry status of the instrument
     *
     * @return string|null
     */
    function getDataEntryStatus(): ?string
    {
        return $this->_status['Data_entry'];
    }

    /**
     * Gets the current administration status of the instrument
     *
     * @return string|null
     */
    function getAdministrationStatus(): ?string
    {
        return $this->_status['Administration'];
    }

    /**
     * Gets the current validity status of the instrument
     *
     * @return string|null
     */
    function getValidityStatus(): ?string
    {
        return $this->_status['Validity'];
    }

    /**
     * Gets the current exclusion status of the instrument
     *
     * @return string
     */
    function getExclusionStatus(): string
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
    function setDataEntryStatus(string $status): void
    {
        if (!isset($this->_commentID)) {
            throw new Exception("No instrument instance selected");
        }

        if (!in_array($status, $this->_dataEntryOptions)) {
            throw new Exception('Invalid data entry status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Data_entry' => $status),
            array('CommentID' => $this->_commentID)
        );

        $this->select($this->_commentID);

        // Run the ConflictDetector if the new status is Complete
        if ($status == 'Complete') {
            $principalCommentId = (strpos($this->_commentID, 'DDE') === false
                ? $this->_commentID
                : substr($this->_commentID, 4)
            );
            $DDECommentId       = 'DDE_' . $principalCommentId;

            $query = $GLOBALS['DB']->pselect(
                "SELECT Data_entry FROM flag
                WHERE CommentID=:PCID OR CommentID=:DDECID",
                array(
                 'PCID'   => $principalCommentId,
                 'DDECID' => $DDECommentId,
                )
            );

            // Run ConflictDetector if Data_entry of SDE and DDE are both Complete
            $count = 0;
            foreach ($query as $dataEntryStatus) {
                if ($dataEntryStatus['Data_entry'] == 'Complete') {
                    $count++;
                }
                if ($count > 1) {
                    $instrumentName = NDB_BVL_Battery::getInstrumentNameForCommentId(
                        $principalCommentId
                    );

                    ConflictDetector::clearConflictsForInstance($principalCommentId);
                    $diff = ConflictDetector::detectConflictsForCommentIds(
                        $instrumentName,
                        $principalCommentId,
                        $DDECommentId
                    );
                    ConflictDetector::recordUnresolvedConflicts($diff);
                }
            }
        }

        // Remove conflicts for SDE & DDE form from the
        // Conflict Resolver if new status is 'In Progress'
        if ($this->getDataEntryStatus() != null && $status == 'In Progress') {
            $deleteWhere1 = array('CommentId1' => $this->_commentID);
            $deleteWhere2 = array('CommentId2' => $this->_commentID);
            $GLOBALS['DB']->delete('conflicts_unresolved', $deleteWhere1);
            $GLOBALS['DB']->delete('conflicts_unresolved', $deleteWhere2);
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
    function setAdministrationStatus(string $status): void
    {
        if (!isset($this->_commentID)) {
            throw new Exception("No instrument instance selected");
        }

        if (!in_array($status, $this->_administrationOptions)) {
            throw new Exception('Invalid administration status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Administration' => $status),
            array('CommentID' => $this->_commentID)
        );
        $this->select($this->_commentID);
    }

    /**
     * Sets the current validity status of the instrument
     *
     * @param string $status the new status from the set
     *                       (NULL, 'Questionable', 'Invalid', 'Valid')
     *
     * @return void
     */
    function setValidityStatus(string $status): void
    {
        if (!isset($this->_commentID)) {
            throw new Exception("No instrument instance selected");
        }

        if (!in_array($status, $this->_validityOptions)) {
            throw new Exception('Invalid administration status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Validity' => $status),
            array('CommentID' => $this->_commentID)
        );
        $this->select($this->_commentID);
    }

    /**
     * Sets the current exclusion status of the instrument
     *
     * @param string $status the new status from the set (NULL, 'Fail', 'Pass')
     *
     * @return void
     */
    function setExclusionStatus(string $status): void
    {
        if (!isset($this->_commentID)) {
            throw new Exception("No instrument instance selected");
        }

        if (!in_array($status, $this->_exclusionOptions)) {
            throw new Exception('Invalid exclusion status');
        }

        $GLOBALS['DB']->update(
            'flag',
            array('Exclusion' => $status),
            array('CommentID' => $this->_commentID)
        );
        $this->select($this->_commentID);
    }

} // end of class
