<?php
/**
 * This file contains a wrapper around imaging comments for a session or File.
 *
 * PHP Version 5
 *
 * @category Imaging
 * @package  Imaging
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once "MRIFile.class.inc";

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
     */
    var $fileID;

    /**
     * ID from session table
     */
    var $sessionID;

    /**
     * CommentType from feedback_mri_comment_types table (enum('visit','volume'))
     */
    var $objectType;

    /**
     * Constructor sets object parameters
     *
     * @param int $fileID    The fileID that this feedback is for
     * @param int $sessionID The SessionID that this feedback is for
     */
    function FeedbackMRI($fileID='', $sessionID='')
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
     * Clears all predefined comments from the object
     * (used prior to re-setting the list of predefined comments)
     *
     * @return bool true if operation succeeded
     */
    function clearPredefinedComments()
    {
        // start the query
        $query = "DELETE FROM feedback_mri_comments WHERE ".$this->_buildWhere();

        // limit to predefined comments
        $query .= "AND PredefinedCommentID IS NOT NULL";

        // run the query
        $success = mysql_query($query);

        // return success
        return $success;
    }

    /**
     * Clears all comments from the object
     *
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function clearAllComments()
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        $success = $DB->delete('feedback_mri_comments', $this->_buildWhereAssoc());
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }

    /**
     * Sets (or adds) predefined comments to an object - does NOT clear
     * predefined comments internally
     *
     * @param array $predefinedCommentIDs an array of integers which are
     *                                    PredefinedCommentID from
     *                                    feedback_mri_predefined_comments table
     *
     * @return bool true if operation succeeded
     */
    function setPredefinedComments($predefinedCommentIDs)
    {
        // choke if we are passed an empty array
        if (empty($predefinedCommentIDs)) {
            return false;
        }

        // add a new db entry for each comment
        foreach ($predefinedCommentIDs AS $predefinedCommentID) {
            $success = $this->_addComment('', '', $predefinedCommentID);

            // choke if it failed
            if ($success == false) {
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
    function addTextComment($comment, $commentTypeID)
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
     * @return array tree: $cA[$typeID]['predefined'] is an array with integer
     *               keys (PredefinedCommentID) and boolean values (true) and
     *               $cA[$typeID]['text'] is an array of strings (free-form
     *               comments) where $typeID is always the CommentTypeID from
     *               feedback_mri_comment_types table
     */
    function getComments()
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        // start building the query
        $query = "SELECT CommentTypeID, PredefinedCommentID, Comment
                      FROM feedback_mri_comments
                  WHERE ".$this->_buildWhere();

        $DB->select($query, $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // build the output array
        if (is_array($result)) {
            foreach ($result as $row) {
                $CTID         = $row['CommentTypeID'];
                $PredefinedID = $row['PredefinedCommentID'];

                if (empty($row['Comment'])) {
                    $comments[$CTID]]['predefined'][$PredefinedID] = true;
                } else {
                    $comments[$CTID]]['text'] = stripslashes($row['Comment']);
                }
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
     * @return array an array with key (int) PredefinedCommentID and value
     *               (string) Comment
     */
    function getAllPredefinedComments($commentTypeID)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        // build the query
        $query = "SELECT PredefinedCommentID, Comment
                    FROM feedback_mri_predefined_comments
                  WHERE CommentTypeID=:CTID";

        $result = $DB->pselect($query, array('CTID' => $commentTypeID));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // build the output array
        $comments = array();
        if (is_array($result)) {
            foreach ($result as $row) {
                $PredefinedID = $row['PredefinedCommentID'];

                $comments[$PredefinedID] = stripslashes($row['Comment']);
            }
        }

        // return the output array
        return $comments;
    }

    /**
     * Gets the value of a single field in the MRI table
     *
     * @param int $fieldName field to select from in mri table
     *
     * @return string value of $fieldName in mri table
     */
    function getMRIValue($fieldName)
    {
        // choke if not a volume instance
        if ($this->objectType != 'volume') {
            return false;
        }

        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        // get the parameter type id
        $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name=:FName";

        $parameterTypeID = $DB->pselectOne($query, array('FName' => $fieldName));
        if (Utility::isErrorX($parameterTypeID)) {
            return PEAR::raiseError("DB Error: ".$parameterTypeID->getMessage());
        } elseif (empty($parameterTypeID)) {
            return false;
        }

        // build the query
        $query = "SELECT Value
                    FROM parameter_file
                  WHERE ParameterTypeID=:PTID AND FileID=:FID";

        $value = $DB->pselectOne(
            $query,
            array(
             'PTID' => $parameterTypeID,
             'FID'  => $this->fileID,
            )
        );
        if (Utility::isErrorX($value)) {
            return PEAR::raiseError("DB Error: ".$value->getMessage());
        } elseif (empty($value)) {
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
    function setMRIValue($fieldName, $value)
    {
        // choke if not a volume instance
        if ($this->objectType != 'volume') {
            return false;
        }

        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        // get the parameter type id
        $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name=:FName";

        $parameterTypeID = $DB->pselectOne($query, array('FName' => $fieldName));
        if (Utility::isErrorX($parameterTypeID)) {
            return PEAR::raiseError("DB Error: ".$parameterTypeID->getMessage());
        } elseif (empty($parameterTypeID)) {
            return false;
        }

        // determine whether to insert or update
        $query = "SELECT count(*) AS UpdateNeeded
                    FROM parameter_file
                  WHERE ParameterTypeID=:PTID AND FileID=:FID";

        $updateNeeded = $DB->pselectOne(
            $query,
            array(
             'PTID' => $parameterTypeID,
             'FID'  => $this->fileID,
            )
        );
        if (Utility::isErrorX($updateNeeded)) {
            return PEAR::raiseError("DB Error: ".$updateNeeded->getMessage());
        }

        // build the query
        if ($updateNeeded) {
            $success = $DB->update(
                'parameter_file',
                array('Value' => $value),
                array(
                 'ParameterTypeID' => $parameterTypeID,
                 'FileID'          => $this->fileID,
                )
            );
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        } else {
            $success = $DB->insert(
                'parameter_file',
                array(
                 'Value'           => $value,
                 'ParameterTypeID' => $parameterTypeID,
                 'FileID'          => $this->fileID,
                 'InsertTime'      => time(),
                )
            );
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
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
    function getAllCommentTypes()
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        // build the array
        $query = "SELECT CommentTypeID, CommentName, CommentStatusField
                    FROM feedback_mri_comment_types
                  WHERE CommentType=:CT";

        $result = $DB->pselect($query, array('CT' => $this->objectType));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // build the output array and keep overall section at the end of the array
        $commentNames = array();
        $overallType;
        $overallName = array();
        if (is_array($result)) {
            foreach ($result as $row) {
                $CommentName = $row['CommentName'];
                $CTID        = $row['CommentTypeID'];
                // deal with CommentStatusField
                if (!empty($row['CommentStatusField'])) {
                    $statusField = unserialize($row['CommentStatusField']);
                }

                // if CommentName is overall, don't add them yet to
                // commentNames array we want them only at the end
                if ($CommentName == "Overall") {
                    $overallType = $CTID;
                    $overallName = array(
                                    'name'   => stripslashes($CommentName),
                                    'field'  => $statusField['field'],
                                    'values' => $statusField['values'],
                                   );
                } else {
                    // add a row to the output array
                    $commentNames[$CTID] = array(
                                            'name'   => stripslashes($CommentName),
                                            'field'  => $statusField['field'],
                                            'values' => $statusField['values'],
                                           );
                }

                unset($statusField);
            }
            // add overall row to the end of the output array
            if ($overallType !== '' && !empty($overallName)) {
                $commentNames[$overallType] = $overallName;
            }
        }

        // return the output array
        return $commentNames;
    }

    /**
     * Adds a db entry for a comment to an object
     *
     * @param string $comment             the body of the message to store
     * @param int    $commentTypeID       CommentTypeID from
     *                                    feedback_mri_comment_types table
     *                                    (optional if using predefinedCommentID)
     * @param int    $predefinedCommentID PredefinedCommentID
     *                                    from feedback_mri_predefined_comments
     *                                    table
     *
     * @return bool true if operation succeeded
     */
    function _addComment($comment='', $commentTypeID='', $predefinedCommentID='')
    {
        // choke if we have no data (or too much)
        if (empty($comment) && empty($predefinedCommentID)
            || (!empty($comment) && !empty($predefinedCommentID))
            || (!empty($comment) && empty($commentTypeID))
        ) {
            return false;
        }

        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        // object identifier
        if ($this->objectType == 'volume') {
            // per-volume
            $set['FileID'] = $this->fileID;
            $file          = new MRIFile($this->fileID);
            $set['SeriesUID'] = $file->getParameter('series_instance_uid');
            $set['EchoTime']  = $file->getParameter('echo_time');
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
                array('PCID' => $predefinedCommentID)
            );
            if (Utility::isErrorX($commentTypeID)) {
                return PEAR::raiseError("DB Error: ".$commentTypeID->getMessage());
            } elseif (empty($commentTypeID)) {
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

        $success = $DB->insert('feedback_mri_comments', $set);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }

    /**
     * Constructs an appropriate where expression to limit selects to the
     * current object
     *
     * @return string where string to limit selects to current object
     * @access private
     */
    function _buildWhere()
    {
        // build the where depending on object and subject type
        if ($this->objectType == 'volume') {
            // per-volume
            $where .= "FileID='$this->fileID'";
        } else {
            // per-visit
            $where .= "SessionID='$this->sessionID'";
        }
        return $where;
    }

    /**
     * Constructs an associative array which can be used as a where
     * argument for the Database class to limit queries to the current
     * object
     *
     * @return array  $where                  key=>value pairs
     * @access private
     */
    function _buildWhereAssoc()
    {
        // build the where depending on object and subject type
        if ($this->objectType == 'volume') {
            // per-volume
            $where = array('FileID' => $this->fileID);
        } else {
            // per-visit
            $where = array('SessionID' => $this->sessionID);
        }
        return $where;
    }

}
?>
