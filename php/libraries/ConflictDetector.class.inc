<?php
/**
 * This file implements a class used for detecting conflicts for an instrument.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Unknown(Samir?) <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Implements a serious of helper functions for detecting/creating/managing the
 * conflicts_resolved table used by Loris's conflict resolver
 *
 * @category Main
 * @package  Loris
 * @author   Unknown(Samir?) <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class ConflictDetector
{

    /**
     * Detects of there are any conflicts between 2 given CommentIDs
     *
     * @param string $instrumentName The instrument being checked
     * @param string $commentId1     The first data entry CommentID
     * @param string $commentId2     The second data entry CommentID
     *
     * @return array An array of differences between the 2 data entry
     *               points.
     */
    static function detectConflictsForCommentIds(
        string $instrumentName,
        string $commentId1,
        string $commentId2
    ): array {
        $diffResult = array();

        // Get data entry status for $commentId1
        $status = new NDB_BVL_InstrumentStatus();
        $status->select($commentId1);
        if ($status->getDataEntryStatus() != 'Complete') {
            return $diffResult;
        }

        // Get data entry status for $commentId2
        $status = new NDB_BVL_InstrumentStatus();
        $status->select($commentId2);
        if ($status->getDataEntryStatus() != 'Complete') {
            return $diffResult;
        }

        // Create the instrument instance for $commentId1
        $instance1 = NDB_BVL_Instrument::factory(
            $instrumentName,
            $commentId1,
            ''
        );

        // Create the instrument instance for $commentId2
        $instance2 = NDB_BVL_Instrument::factory(
            $instrumentName,
            $commentId2,
            ''
        );

        // Run the diff
        $diffResult = $instance1->diff($instance2);

        // Return the diff result
        return $diffResult;
    }

    /**
     * Stores unresolved conflicts into the conflicts_unresolved table
     *
     * @param array $diffResult The output of detectConflictsForCommentIds
     *
     * @return void As a side-effect inserts into database.
     */
    static function recordUnresolvedConflicts(array $diffResult): void
    {
        foreach ($diffResult as $diffLine) {
            \Database::singleton()->replace('conflicts_unresolved', $diffLine);
        }

    }

    /**
     * Removes recorded conflicts from the conflicts_unresolved table
     * for a given line. Used before recording new conflicts into the
     * table to ensure that old/resolved conflicts don't stay around.
     *
     * @param array $diffLine The row to be removed from conflicts_unresolved
     *                        table
     *
     * @return void As a side-effect deletes from database
     */
    function clearConflictsForField(array $diffLine): void
    {
        $deleteWhere = array(
                        'TableName'      => $diffLine['TableName'],
                        'ExtraKeyColumn' => $diffLine['ExtraKeyColumn'],
                        'ExtraKey1'      => $diffLine['ExtraKey1'],
                        'ExtraKey2'      => $diffLine['ExtraKey2'],
                        'FieldName'      => $diffLine['FieldName'],
                        'CommentId1'     => $diffLine['CommentId1'],
                        'CommentId2'     => $diffLine['CommentId2'],
                       );

        \Database::singleton()->delete('conflicts_unresolved', $deleteWhere);
    }

    /**
     * Removes all conflicts for a given CommentID, so that we
     * can start from a clean state when inserting new comments
     *
     * @param string $commentId The commentID to remove conflicts for
     *
     * @return void As a side-effect deletes from database
     */
    static function clearConflictsForInstance(string $commentId): void
    {
        \Database::singleton()->delete(
            'conflicts_unresolved',
            array('CommentId1' => $commentId)
        );
    }

    /**
     * Determines if there are any conflicts for the given CommentID
     *
     * @param string $commentId The CommentID to check
     *
     * @return boolean True if there are conflicts that exist, false otherwise
     */
    function isInstrumentInstanceInConflictState(string $commentId): bool
    {
        $conflictCount = \Database::singleton()->pselectOne(
            "SELECT COUNT(*) FROM conflicts_unresolved WHERE CommentId1=:CID",
            array('CID' => $commentId)
        );
        return ($conflictCount != 0);
    }

}

