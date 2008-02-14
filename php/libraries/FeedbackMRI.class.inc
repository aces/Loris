<?
/**
 * class for managing MRI comments
 * @package mri
 * @access public
 */
class FeedbackMRI {
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
     * constructor sets object parameters
     *
     * @param     int     $fileID
     * @param     int     $sessionID
     * @access    private
     * @return    none
     */
    function FeedbackMRI($fileID='', $sessionID='')
    {
        // set object properties
        $this->fileID = $fileID;
        $this->sessionID = $sessionID;

        // determine object type (visit or volume)
        if (!empty($fileID)) {
            $this->objectType = 'volume';
        } else {
            $this->objectType = 'visit';
        }
    }

    /**
     * clears all predefined comments from the object (used prior to re-setting the list of predefined comments)
     *
     * @return    bool    if operation succeeded
     * @access    public
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
     * clears all comments from the object
     *
     * @return    void
     * @throws    PEAR_Error
     * @access    public
     */
    function clearAllComments()
    {
        // create DB object
        $DB =& Database::singleton();
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $success = $DB->delete('feedback_mri_comments', $this->_buildWhereAssoc());
        if (PEAR::isError($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }
        
        return true;
    }

    /**
     * sets (or adds) predefined comments to an object - does NOT clear predefined comments internally
     *
     * @param     array   $predefinedCommentIDs   an array of integers which are PredefinedCommentID from feedback_mri_predefined_comments table
     * @return    bool    $success                if operation succeeded
     * @access    public
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
     * adds a text comment to an object
     *
     * @param     string  $comment                the body of the message to store
     * @param     int     $commentTypeID          CommentTypeID from feedback_mri_comment_types table
     * @return    bool    $success                if operation succeeded
     * @access    public
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
     * gets the comments stored for the object
     *
     * @return    array   $comments               tree: $cA[$typeID]['predefined'] is an array with integer keys (PredefinedCommentID) and boolean values (true) and $cA[$typeID]['text'] is an array of strings (free-form comments) where $typeID is always the CommentTypeID from feedback_mri_comment_types table
     * @throws    PEAR_Error
     * @access    public
     */
    function getComments()
    {
        // create DB object
        $DB =& Database::singleton();
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // start building the query
        $query = "SELECT CommentTypeID, PredefinedCommentID, Comment FROM feedback_mri_comments WHERE ".$this->_buildWhere();

        $DB->select($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // build the output array
        if (is_array($result)) {
            foreach ($result as $row) {
                if (empty($row['Comment'])) {
                    $comments[$row['CommentTypeID']]['predefined'][$row['PredefinedCommentID']] = true;
                } else {
                    $comments[$row['CommentTypeID']]['text'] = stripslashes($row['Comment']);
                }
            }
        }

        // return the array
        return $comments;
    }

    /**
     * gets the list of all predefined comments for a given type
     * 
     * @param     int     $commentTypeID          CommentTypeID from feedback_mri_comment_types table
     * @return    array   $comments               an array with key (int) PredefinedCommentID and value (string) Comment
     * @throws    PEAR_Error
     * @access    public
     */
    function getAllPredefinedComments($commentTypeID)
    {
        // create DB object
        $DB =& Database::singleton();
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // build the query
        $query = "SELECT PredefinedCommentID, Comment FROM feedback_mri_predefined_comments WHERE CommentTypeID='$commentTypeID'";

        $DB->select($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // build the output array
        $comments = array();
        if (is_array($result)) {
            foreach ($result as $row) {
                $comments[$row['PredefinedCommentID']] = stripslashes($row['Comment']);
            }
        }

        // return the output array
        return $comments;
    }

    /**
     * gets the value of a single field in the MRI table
     * 
     * @param     int     $fieldName              field to select from in mri table
     * @return    string  $value                  value of $fieldName in mri table
     * @throws    PEAR_Error
     * @access    public
     */
    function getMRIValue($fieldName)
    {
        // choke if not a volume instance
        if ($this->objectType != 'volume') {
            return false;
        }

        // create DB object
        $DB =& Database::singleton();
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // get the parameter type id
        $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name='$fieldName'";
        
        $parameterTypeID = $DB->selectOne($query);
        if (PEAR::isError($parameterTypeID)) {
            return PEAR::raiseError("DB Error: ".$parameterTypeID->getMessage());
        } elseif (empty($parameterTypeID)) {
            return false;
        }

        // build the query
        $query = "SELECT Value FROM parameter_file WHERE ParameterTypeID=$parameterTypeID AND FileID='$this->fileID'";
        
        $value = $DB->selectOne($query);
        if (PEAR::isError($value)) {
            return PEAR::raiseError("DB Error: ".$value->getMessage());
        } elseif (empty($value)) {
            return false;
        }

        // return the value
        return $value;
    }

    /**
     * sets the value of a single field in the MRI table
     * 
     * @param     string  $fieldName              field to set in mri table
     * @param     string  $value                  value to set in $fieldName
     * @return    bool    
     * @throws    PEAR_Error
     * @access    public
     */
    function setMRIValue($fieldName, $value)
    {
        // choke if not a volume instance
        if ($this->objectType != 'volume') {
            return false;
        }

        // create DB object
        $DB =& Database::singleton();
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // get the parameter type id
        $query = "SELECT ParameterTypeID FROM parameter_type WHERE Name='$fieldName'";

        $parameterTypeID = $DB->selectOne($query);
        if (PEAR::isError($parameterTypeID)) {
            return PEAR::raiseError("DB Error: ".$parameterTypeID->getMessage());
        } elseif (empty($parameterTypeID)) {
            return false;
        }

        // determine whether to insert or update
        $query = "SELECT count(*) AS UpdateNeeded FROM parameter_file WHERE ParameterTypeID=$parameterTypeID AND FileID='$this->fileID'";


        $updateNeeded = $DB->selectOne($query);
        if (PEAR::isError($updateNeeded)) {
            return PEAR::raiseError("DB Error: ".$updateNeeded->getMessage());
        }
        
        // build the query
        if($updateNeeded) {
            $success = $DB->update('parameter_file', array('Value' => $value), array('ParameterTypeID' => $parameterTypeID, 'FileID' => $this->fileID));
            if (PEAR::isError($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        } else {
            $success = $DB->insert('parameter_file', array('Value' => $value, 'ParameterTypeID' => $parameterTypeID, 'FileID' => $this->fileID, 'InsertTime' => time()));
            if (PEAR::isError($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }

        return true;
    }

    /**
     * gets the list of all comment types
     * 
     * @return    array   $commentNames           a two-dimensional array of ints (CommentTypeID) and three-element arrays ('name'=>string CommentName, 'field'=>string name of column in mri table for status, 'values'=>array of possible enum values for field)
     * @access    public
     */
    function getAllCommentTypes()
    {
        // create DB object
        $DB =& Database::singleton();
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // build the array
        $query = "SELECT CommentTypeID, CommentName, CommentStatusField FROM feedback_mri_comment_types WHERE CommentType='$this->objectType'";
        
        $DB->select($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // build the output array
        $commentNames = array();
        if (is_array($result)) {
            foreach ($result as $row) {
                // deal with CommentStatusField
                if(!empty($row['CommentStatusField'])) {
                    $statusField = unserialize($row['CommentStatusField']);
                }

                // add a row to the output array
                $commentNames[$row['CommentTypeID']] = array('name'   => stripslashes($row['CommentName']),
                                                             'field'  => $statusField['field'],
                                                             'values' => $statusField['values']);

                unset($statusField);
            }
        }

        // return the output array
        return $commentNames;
    }

    /**
     * adds a db entry for a comment to an object
     *
     * @param     string  $comment                the body of the message to store
     * @param     int     $commentTypeID          CommentTypeID from feedback_mri_comment_types table (optional if using predefinedCommentID)
     * @param     int     $predefinedCommentID    PredefinedCommentID from feedback_mri_predefined_comments table
     * @return    bool    $success                if operation succeeded
     * @access    private
     */
    function _addComment($comment='', $commentTypeID='', $predefinedCommentID='')
    {
        // choke if we have no data (or too much)
        if (empty($comment) && empty($predefinedCommentID)           // no comment of either type
            || (!empty($comment) && !empty($predefinedCommentID))    // both comment types
            || (!empty($comment) && empty($commentTypeID))           // text comment with no typeID
            ) {
            return false;
        }

        // create DB object
        $DB =& Database::singleton();
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // object identifier
        if ($this->objectType == 'volume') {
            // per-volume
            $set['FileID'] = $this->fileID;
        } else {
            // per-visit
            $set['SessionID'] = $this->sessionID;
        }

        // comment type
        if (empty($commentTypeID) && !empty($predefinedCommentID)) {
            // get the commentTypeID for the entered predefinedCommentID
            $subquery = "SELECT CommentTypeID FROM feedback_mri_predefined_comments WHERE PredefinedCommentID='$predefinedCommentID'";

            $commentTypeID = $DB->selectOne($subquery, $result);
            if (PEAR::isError($commentTypeID)) {
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
        if (PEAR::isError($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }

    /**
     * constructs an appropriate where expression to limit selects to the current object
     *
     * @return    string  $where                  where string to limit selects to current object
     * @access    private
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
     * constructs an associative array which can be used as a where
     * argument for the Database class to limit queries to the current
     * object
     *
     * @return    array  $where                  key=>value pairs
     * @access    private
     */
    function _buildWhereAssoc()
    {
        // build the where depending on object and subject type
        if ($this->objectType == 'volume') {
            // per-volume
            $where = array('FileID'=>$this->fileID);
        } else {
            // per-visit
            $where = array('SessionID'=>$this->sessionID);
        }
        return $where;
    }

}
?>