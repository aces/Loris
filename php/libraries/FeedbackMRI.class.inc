<?php declare(strict_types=1);

/**
 * This file contains a wrapper around imaging comments for a session or File.
 *
 * PHP Version 7
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Class for managing MRI comments
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class FeedbackMRI
{
    /**
     * FileID from files table
     *
     * @var ?int
     */
    var $fileID;

    /**
     * ID from session table
     *
     * @var ?\SessionID
     */
    var $sessionID;

    /**
     * CommentType from feedback_mri_comment_types table (enum('visit','volume'))
     */
    var $objectType;

    /**
     * Constructor sets object parameters
     *
     * @param ?int        $fileID    The fileID that this feedback is for
     * @param ?\SessionID $sessionID The SessionID that this feedback is for
     */
    function __construct(?int $fileID=null, ?\SessionID $sessionID=null)
    {
        // set object properties
        $this->fileID    = $fileID;
        $this->sessionID = $sessionID;

        // determine object type (visit or volume)
        if (!empty($fileID)) {
            $this->objectType = 'volume';
        } else {
            $this->objectType = 'visit';
        }
    }

    /**
     * Clears all comments from the object
     *
     * @return bool
     * @access public
     */
    function clearAllComments(): bool
    {
        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        $DB->delete('feedback_mri_comments', $this->_buildWhereAssoc());
        return true;
    }

    /**
     * Sets (or adds) predefined comments to an object - does NOT clear
     * predefined comments internally
     *
     * @param array|null $predefinedCommentIDs an array of integers which are
     *                                         PredefinedCommentID from
     *                                         feedback_mri_predefined_comments table
     *
     * @return bool true if operation succeeded
     */
    function setPredefinedComments(?array $predefinedCommentIDs=null): bool
    {
        // choke if we are passed an empty array
        if (empty($predefinedCommentIDs)) {
            return false;
        }

        // add a new db entry for each comment
        foreach ($predefinedCommentIDs AS $predefinedCommentID) {
            $success = $this->_addComment('', null, $predefinedCommentID);

            // choke if it failed
            if ($success != 'true') {
                return false;
            }
        }

        return true;
    }

    /**
     * Adds a text comment to an object
     *
     * @param string $comment       the body of the message to store
     * @param int    $commentTypeID CommentTypeID from feedback_mri_comment_types
     *                              table
     *
     * @return bool true if operation succeeded
     */
    function addTextComment(string $comment, int $commentTypeID): bool
    {
        // choke if we are passed an empty comment or typeID
        if (empty($comment) || empty($commentTypeID)) {
            return false;
        }

        // add a new db entry
        $success = $this->_addComment($comment, $commentTypeID);

        // return the success
        return $success;
    }

    /**
     * Gets the comments stored for the object
     *
     * @return array|null tree: $cA[$typeID]['predefined'] is an array with integer
     *               keys (PredefinedCommentID) and boolean values (true) and
     *               $cA[$typeID]['text'] is an array of strings (free-form
     *               comments) where $typeID is always the CommentTypeID from
     *               feedback_mri_comment_types table
     */
    function getComments(): ?array
    {
        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        // start building the query
        $query = "SELECT CommentTypeID, PredefinedCommentID, Comment
                      FROM feedback_mri_comments
                  WHERE ".$this->_buildWhere();

        $result = $DB->pselect($query, []);

        $comments = [];
        // build the output array
        foreach ($result as $row) {
            $CTID         = $row['CommentTypeID'];
            $PredefinedID = $row['PredefinedCommentID'];

            if (empty($row['Comment'])) {
                $comments[$CTID]['predefined'][$PredefinedID] = true;
            } else {
                $comments[$CTID]['text'] = stripslashes($row['Comment']);
            }
        }

        // return the array
        return $comments;
    }

    /**
     * Gets the list of all predefined comments for a given type
     *
     * @param int $commentTypeID CommentTypeID from feedback_mri_comment_types
     *                           table
     *
     * @return array A two-dimensional array with key (int) PredefinedCommentID
     *               and one-element array ('Comment'=> string CommentName)
     */
    public static function getAllPredefinedComments(int $commentTypeID): array
    {
        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        // build the query
        $query = "SELECT PredefinedCommentID, Comment
                    FROM feedback_mri_predefined_comments
                  WHERE CommentTypeID=:CTID";

        $result = $DB->pselect($query, ['CTID' => $commentTypeID]);

        // build the output array
        $comments = [];
        foreach ($result as $row) {
            $PredefinedID       = $row['PredefinedCommentID'];
            $preDefinedComments = [];
            $preDefinedComments['Comment']     = stripslashes($row['Comment']);
            $preDefinedComments['FullComment'] = $row['Comment'];
            $comments[$PredefinedID]           = $preDefinedComments;
        }

        // return the output array
        return $comments;
    }

    /**
     * Gets the value of a single field in the MRI table
     *
     * @param string $fieldName field to select from in mri table
     *
     * @return string|bool value of $fieldName in mri table or false when
     *                      no information found in the database
     */
    function getMRIValue(string $fieldName)
    {
        // choke if not a volume instance
        if ($this->objectType != 'volume') {
            return false;
        }

        // create DB object
        $database = \NDB_Factory::singleton()->database();
        $DB       =& $database;

        // get the parameter type id
        $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name=:FName";

        $parameterTypeID = $DB->pselectOne($query, ['FName' => $fieldName]);
        if (empty($parameterTypeID)) {
            return false;
        }

        // build the query
        $query = "SELECT Value
                    FROM parameter_file
                  WHERE ParameterTypeID=:PTID AND FileID=:FID";

        $value = $DB->pselectOne(
            $query,
            [
                'PTID' => $parameterTypeID,
                'FID'  => $this->fileID,
            ]
        );
        if (empty($value)) {
            return false;
        }

        // return the value
        return $value;
    }

    /**
     * Sets the value of a single field in the MRI table
     *
     * @param string $fieldName field to set in mri table
     * @param string $value     value to set in $fieldName
     *
     * @return bool false on failure, true on success
     */
    function setMRIValue(string $fieldName, string $value): bool
    {
        // choke if not a volume instance
        if ($this->objectType != 'volume') {
            return false;
        }

        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        // get the parameter type id
        $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name=:FName";

        $parameterTypeID = $DB->pselectOne($query, ['FName' => $fieldName]);
        if (empty($parameterTypeID)) {
            return false;
        }

        // determine whether to insert or update
        $query = "SELECT count(*) AS UpdateNeeded
                    FROM parameter_file
                  WHERE ParameterTypeID=:PTID AND FileID=:FID";

        $updateNeeded = $DB->pselectOne(
            $query,
            [
                'PTID' => $parameterTypeID,
                'FID'  => $this->fileID,
            ]
        );

        // build the query
        if ($updateNeeded) {
            $DB->update(
                'parameter_file',
                ['Value' => $value],
                [
                    'ParameterTypeID' => $parameterTypeID,
                    'FileID'          => $this->fileID,
                ]
            );
        } else {
            $DB->insert(
                'parameter_file',
                [
                    'Value'           => $value,
                    'ParameterTypeID' => $parameterTypeID,
                    'FileID'          => $this->fileID,
                    'InsertTime'      => time(),
                ]
            );
        }

        return true;
    }

    /**
     * Gets the list of all comment types
     *
     * @return array A two-dimensional array of ints (CommentTypeID) and
     *               three-element arrays ('name'=>string CommentName,
     *               'field'=>string name of column in mri table for status,
     *               'values'=>array of possible enum values for field)
     */
    function getAllCommentTypes(): array
    {
        return self::getAllCommentTypesForObjectType($this->objectType);
    }

    /**
     * Gets the list of all comment types for a given object type.
     *
     * @param string $objectType Type of object (i.e value of column ComentType
     *                           in table feedback_mri_comment_types).
     *
     * @return array A two-dimensional array of ints (CommentTypeID) and
     *               three-element arrays ('name'=>string CommentName,
     *               'field'=>string name of column in mri table for status,
     *               'values'=>array of possible enum values for field)
     */
    public static function getAllCommentTypesForObjectType(string $objectType): array
    {
        if ($objectType != 'volume' && $objectType != 'visit') {
            throw new \LorisException("Invalid object type $objectType");
        }

        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        // build the array
        $query = "SELECT CommentTypeID, CommentName, CommentStatusField
                    FROM feedback_mri_comment_types
                  WHERE CommentType=:CT";

        $result = $DB->pselect($query, ['CT' => $objectType]);

        // build the output array and keep overall section at the end of the array
        $commentNames = [];
        $overallName  = [];
        $overallType  = null;
        foreach ($result as $row) {
            $CommentName = $row['CommentName'];
            $CTID        = $row['CommentTypeID'];
            $statusField = [];
            // deal with CommentStatusField
            if (!empty($row['CommentStatusField'])) {
                $statusField = unserialize($row['CommentStatusField']);
            }

            // if CommentName is overall, don't add them yet to
            // commentNames array we want them only at the end
            if ($CommentName == "Overall") {
                $overallType = $CTID;
                $overallName = [
                    'name'   => stripslashes($CommentName),
                    'field'  => $statusField['field'] ?? 'overall',
                    'values' => $statusField['values'] ?? '',
                ];
            } else {
                // add a row to the output array
                $commentNames[$CTID] = [
                    'name'   => stripslashes($CommentName) ?? '',
                    'field'  => $statusField['field'] ?? '',
                    'values' => $statusField['values'] ?? '',
                ];
            }

            unset($statusField);
        }

        // add overall row to the end of the output array
        if (!is_null($overallType) && !empty($overallName)) {
            $commentNames[$overallType] = $overallName;
        }

        // return the output array
        return $commentNames;
    }

    /**
     * Adds a db entry for a comment to an object
     *
     * @param string $comment             the body of the message to store
     * @param ?int   $commentTypeID       CommentTypeID from
     *                                    feedback_mri_comment_types
     *                                    table (optional if
     *                                    using
     *                                    predefinedCommentID)
     * @param ?int   $predefinedCommentID PredefinedCommentID
     *                                    from
     *                                    feedback_mri_predefined_comments
     *                                    table
     *
     * @return bool true if operation succeeded
     */
    function _addComment(
        string $comment='',
        ?int    $commentTypeID=null,
        ?int $predefinedCommentID=null
    ): bool {
        // choke if we have no data (or too much)
        if (empty($comment) && empty($predefinedCommentID)
            || (!empty($comment) && !empty($predefinedCommentID))
            || (!empty($comment) && empty($commentTypeID))
        ) {
            return false;
        }

        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        // object identifier
        $set = [];
        if ($this->objectType == 'volume') {
            // per-volume
            $set['FileID'] = $this->fileID;
            $file          = new MRIFile($this->fileID);
            $set['SeriesUID'] = $file->getParameter('series_instance_uid');
            $set['EchoTime']  = $file->getParameter('echo_time');
            $set['PhaseEncodingDirection'] = $file->getParameter(
                'PhaseEncodingDirection'
            );
            $set['EchoNumber'] = $file->getParameter('echo_numbers');
        } else {
            // per-visit
            $set['SessionID'] = $this->sessionID;
        }

        // comment type
        if (empty($commentTypeID) && !empty($predefinedCommentID)) {
            // get the commentTypeID for the entered predefinedCommentID
            $subquery = "SELECT CommentTypeID
                FROM feedback_mri_predefined_comments
                WHERE PredefinedCommentID=:PCID";

            $commentTypeID = $DB->pselectOne(
                $subquery,
                ['PCID' => $predefinedCommentID]
            );

            if (empty($commentTypeID)) {
                return false;
            }
        }
        $set['CommentTypeID'] = $commentTypeID;

        // comment itself
        if (!empty($comment)) {
            $set['Comment'] = addslashes($comment);
        } else {
            $set['PredefinedCommentID'] = $predefinedCommentID;
        }

        $DB->insert('feedback_mri_comments', $set);

        return true;
    }

    /**
     * Constructs an appropriate where expression to limit selects to the
     * current object
     *
     * @return string where string to limit selects to current object
     * @access private
     */
    function _buildWhere(): string
    {
        // build the where depending on object and subject type
        if ($this->objectType == 'volume') {
            // per-volume
            return "FileID='$this->fileID'";
        } else {
            // per-visit
            return "SessionID='$this->sessionID'";
        }
    }

    /**
     * Constructs an associative array which can be used as a where
     * argument for the Database class to limit queries to the current
     * object
     *
     * @return array  $where                  key=>value pairs
     * @access private
     */
    function _buildWhereAssoc(): array
    {
        // build the where depending on object and subject type
        if ($this->objectType == 'volume') {
            // per-volume
            $where = ['FileID' => $this->fileID];
        } else {
            // per-visit
            $where = ['SessionID' => $this->sessionID];
        }
        return $where;
    }

}

