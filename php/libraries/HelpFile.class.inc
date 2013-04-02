<?php
require_once 'PEAR.php';

/**
 * HelpFile class
 * @package main
 * @subpackage unused
 */
class HelpFile extends PEAR
{
    /**
     * Identifies the help file
     * @var    array
     * @access private
     */
    var $helpID;

    /**
     * The help file's data
     * @var    array
     * @access private
     */
    var $data;

    /**
     * Constructor
     *
     * Selects and populates a help file
     *
     * @param  int         Help file's ID
     * @return HelpFile
     * @throws PEAR_Error
     * @access public
     */
    function &factory($helpID)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $obj = new HelpFile;

        // set the help ID
        $obj->helpID = $helpID;

        $result = $DB->pselectRow("SELECT * FROM help WHERE helpID = :HID", array('HID' => $helpID));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // set the help file
        $obj->data = $result;

        return $obj;
    }
    

    /**
     * Inserts a help file
     *
     * @param  array       Associative array of values
     * @return int         New help file's ID
     * @throws PEAR_Error
     * @access public
     * @static
     */
    function insert($set)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // insert a help file
        $success = $DB->insert('help', $set);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }
        
        // return the help ID
        return $DB->lastInsertID;
    }
    
        
    /**
     * Updates a help file
     *
     * @param  array       Associative array of values
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function update($set)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // update the help file
        $success = $DB->update('help', $set, array('helpID' => $this->helpID));
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }
    
        
    /**
     * Adds to a help file's related links
     *
     * @param  array       Array of related help file IDs
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function addLinks($relatedIDs)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // insert all related links
        if (is_array($relatedIDs)) {
            foreach ($relatedIDs as $relatedID) {
                $success = $DB->insert('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedID));
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("DB Error: ".$success->getMessage());
                }
            }
        } else {
            $success = $DB->insert('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedIDs));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }

        return true;
    }    
        
    /**
     * Removes links from a help file's related links
     *
     * @param  array       Array of related help file IDs
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function removeLinks($relatedIDs)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // delete the links
        if (is_array($relatedIDs)) {
            foreach($relatedIDs as $relatedID) {
                $success = $DB->delete('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedID));
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("DB Error: ".$success->getMessage());
                }
                $success = $DB->delete('help_related_links', array('helpID' => $relatedID, 'relatedID' => $this->helpID));
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("DB Error: ".$success->getMessage());
                }
            }
        } else {
            $success = $DB->delete('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedIDs));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
            $success = $DB->delete('help_related_links', array('helpID' => $relatedIDs, 'relatedID' => $this->helpID));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }

        return true;
    }
    
    
    /**
     * Updates a help file's related links
     *
     * @param  array       Array of related help file IDs
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function updateLinks($relatedIDs)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // delete all related links
        $success = $DB->delete('help_related_links', array('helpID' => $this->helpID));
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }
        $success = $DB->delete('help_related_links', array('relatedID' => $this->helpID));
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        // add all the new links
        $success = $this->addLinks($relatedIDs);
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError("HelpFile::updateLinks(): ".$success->getMessage());
        }

        return true;
    }
    
        
    /**
     * Returns whether or not the topic has subtopics
     *
     * @return bool
     * @throws PEAR_Error
     * @access public
     */
    function hasChild()
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $result = $DB->pselectOne("SELECT COUNT(*) FROM help WHERE parentID = :HID", array('HID' => $this->helpID));
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
        
        return ($result > 0);
    }
    
    
    /**
     * Returns an array of its subtopics' IDs
     *
     * @param  int         Stop at this depth
     * @param  int         Depth
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function childIDs($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // see if it has a child
        $hasChild = $this->hasChild();
        if(Utility::isErrorX($hasChild)) {
            return PEAR::raiseError("HelpFile::childIDs() children: ".$hasChild->getMessage());
        }

        $childIDs = array();
        
        // get its children
        if ($hasChild) {
            $result = $DB->pselect("SELECT helpID FROM help WHERE parentID = :HID", array('HID' =>$this->helpID));
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }
        
            // add the children to the array
            $childIDs = Utility::reduce($result);

            // check if we're done recursing
            if ($level != $stopat) {
                // check all the children for more children
                foreach ($childIDs as $childID) {
                    // make the child
                    $child =& HelpFile::factory($childID);
                    if(Utility::isErrorX($child)) {
                        return PEAR::raiseError("HelpFile Error ($childID): ".$child->getMessage());
                    }

                    // get the child's children
                    $grandChildIDs = $child->childIDs($stopat, $level + 1);
                    if(Utility::isErrorX($grandChildIDs)) {
                        return PEAR::raiseError("HelpFile::childIDs() grandchildren: ".$grandChildData->getMessage());
                    }

                    // add the children to the array
                    $childIDs = array_merge($childIDs, $grandChildIDs);
                }
            }
        }
        
        return $childIDs;
    }


    /**
     * Returns an array of its subtopics's IDs and topics
     *
     * @param  int         Stop at this depth
     * @param  int         Depth
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function childData($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // see if it has a child
        $hasChild = $this->hasChild();
        if(Utility::isErrorX($hasChild)) {
            return PEAR::raiseError("HelpFile::childData() children: ".$hasChild->getMessage());
        }

        $childData = array();
        
        // get its children
        if ($hasChild) {
            $result = $DB->pselect("SELECT helpID, topic, $level as level FROM help WHERE parentID = :HID", array('HID' => $this->helpID));
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            // add the children to the array
            $childData = $result;

            // check if we're done recursing
            if ($level !== $stopat) {
                // check all the children for more children
                foreach ($childData as $row) {
                    // make the child
                    $child =& HelpFile::factory($row['helpID']);
                    if(Utility::isErrorX($child)) {
                        return PEAR::raiseError("HelpFile Error (".$row['helpID']."): ".$child->getMessage());
                    }

                    // get the child's children
                    $grandChildData = $child->childData($stopat, $level + 1);
                    if(Utility::isErrorX($grandChildData)) {
                        return PEAR::raiseError("HelpFile::childData() grandchildren: ".$grandChildData->getMessage());
                    }

                    // add the children to the array
                    $childData = array_merge($childData, $grandChildData);
                }
            }
        }
        
        return $childData;
    }


    /**
     * returns an array of its parent's IDs
     *
     * @param  int         Stop at this depth
     * @param  int         Depth
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function parentIDs($stopat = 1, $level = 1)
    {
        $parentIDs = array();
        
        if ($this->data['parentID'] > 0) {
            // add the parent to the array
            $parentIDs[] = $this->data['parentID'];

            // check if we're done recursing
            if ($level != $stopat) {
                // make the parent
                $parent =& HelpFile::factory($this->data['parentID']);
                if(Utility::isErrorX($parent)) {
                    return PEAR::raiseError("HelpFile Error (".$this->data['parentID']."): ".$parent->getMessage());
                }

                // get the parent's parent
                $grandParentIDs = $parent->parentIDs($stopat, $level + 1);
                if(Utility::isErrorX($grandParentIDs)) {
                    return PEAR::raiseError("HelpFile::parentIDs(): ".$grandParentIDs->getMessage());
                }

                // add the parents to the array
                $parentIDs = array_merge($parentIDs, $grandParentIDs);
            }
        }
        
        return $parentIDs;
    }


    /**
     * Returns an array of its parent's IDs and topics
     *
     * @param  int         Stop at this depth
     * @param  int         Depth
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function parentData($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $parentData = array();
        
        if ($this->data['parentID'] > 0) {
            $result = $DB->pselectRow("SELECT helpID, topic, $level as level FROM help WHERE helpID = :HID",
                array('HID' => $this->data['parentID']));
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }
        
            // add the parent to the array
            $parentData = $result;

            // check if we're done recursing
            if ($level != $stopat) {
                // make the parent
                $parent =& HelpFile::factory($this->data['parentID']);
                if(Utility::isErrorX($parent)) {
                    return PEAR::raiseError("HelpFile Error (".$this->data['parentID']."): ".$parent->getMessage());
                }

                // get the parent's parent
                $grandParentData = $parent->parentData($stopat, $level + 1);
                if(Utility::isErrorX($grandParentData)) {
                    return PEAR::raiseError("HelpFile::parentData(): ".$grandParentData->getMessage());
                }

                $parentData = array_merge($parentData, $grandParentData);
            }
        }

        return $parentData;
    }


    /**
     * Returns whether this topic is another's descendant
     *
     * Prevents children from having their descendants as parents
     *
     * @param  int         Ancestor's help ID
     * @return bool
     * @throws PEAR_Error
     * @access public
     */
    function isDescendant($ancestor)
    {
        if ($this->data['parentID'] == -1) {
            return FALSE;
        } elseif ($this->data['parentID'] == $ancestor) {
            return TRUE;
        } else {
            // make the parent
            $parent =& HelpFile::factory($this->data['parentID']);
            if(Utility::isErrorX($parent)) {
                return PEAR::raiseError("HelpFile Error (".$this->data['parentID']."): ".$parent->getMessage());
            }

            return $parent->isDescendant($ancestor);
        }
	
    }
    

    /**
     * Returns an array of its related link's IDs
     *
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function relationIDs()
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $result = $DB->pselect("SELECT helpID, relatedID FROM help_related_links WHERE helpID = :HID OR relatedID = :HID ", 
            array('HID' => $this->helpID));        
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // a multi-dimensional array is imploded, then exploded, and then this topic's ID is removed
        return array_diff(Utility::reduce($result), array($this->helpID));
    }


    /**
     * Returns an array of its related links' IDs and topics
     *
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function relationData()
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // get the relation IDs
        $relationIDs = $this->relationIDs();
        if(Utility::isErrorX($relationIDs)) {
            return PEAR::raiseError("HelpFile::relationData(): ".$relationIDs->getMessage());
        }

        // build the query using the IDs provided by the previous function
        $query = "SELECT helpID, topic FROM help WHERE 0";

        // add them to the query
        if (count($relationIDs) > 0) {
            $query .= " OR helpID = ".implode(" OR helpID = ", $relationIDs);
        }

        $DB->select($query, $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
        
        return $result;
    }


    /**
     * Returns an array of the IDs and topics of help files not in the "family"
     *
     * @param int          Stop finding children at this depth
     * @param int          Stop finding parents at this depth
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function strangerData($ancestor = -1, $descendant = -1)
    {
        // create DB object
        $DB =& Database::singleton();

        // make sure a Database object exists
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // get the parent IDs
        $parentIDs = $this->parentIDs($ancestor);
        if(Utility::isErrorX($parentIDs)) {
            return PEAR::raiseError("HelpFile::strangerData() parents: ".$parentIDs->getMessage());
        }

        // get the child IDs
        $childIDs = $this->childIDs($descendant);
        if(Utility::isErrorX($childIDs)) {
            return PEAR::raiseError("HelpFile::strangerData() children: ".$childIDs->getMessage());
        }

        // get all its descendants and ancestors, and I am not a stranger to myself!
        $familyIDs = array_merge($parentIDs, $childIDs, $this->helpID);

        // build the query blocking out family members
        $query = "SELECT helpID, topic FROM help WHERE 1";

        // add the family IDs to the query
        if (count($familyIDs) > 0) {
            $query .= " AND helpID != ".implode(" AND helpID != ", $familyIDs);
        }

        $DB->select($query, $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
        
        return $result;
    }


    /**
     * Returns the tree starting with this help file
     *
     * @param int          The current depth of the tree
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function tree($level = 0)
    {
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());	
        }

        // see if it has a child
        $hasChild = $this->hasChild();
        if(Utility::isErrorX($hasChild)) {
            return PEAR::raiseError("HelpFile::tree() children: ".$hasChild->getMessage());
        }

        $tree = array();

        if ($hasChild) {
            $result = $DB->pselect("SELECT helpID, topic, updated, $level as level FROM help WHERE parentID = :HID",
                array('HID' =>$this->helpID));
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            // go one-by-one
            foreach ($result as $row) {
                // add the row to the array...
                $tree[] = $row;

                // and go down another level!
                $branch =& HelpFile::factory($row['helpID']);
                if (Utility::isErrorX($branch)) {
                    return PEAR::raiseError("HelpFile Error (".$row['helpID']."): ".$result->getMessage());
                }

                $twig = $branch->tree($level + 1);
                if (Utility::isErrorX($twig)) {
                    return PEAR::raiseError("HelpFile::tree() branches: ".$twig->getMessage());
                }

                $tree = array_merge($tree, $twig);
            }
        }
        
        return $tree;
    }


    /**
     * Dumps the HelpFile as an array
     *
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function toArray()
    {
        $data = $this->data;
        $data['topic'] = stripslashes($this->data['topic']);
        $data['content'] = stripslashes($this->data['content']);

        return $data;
    }
    
    
    /**
     * Returns the ID of a given hash
     *
     * @param  string  32-character MD5 hash
     * @return int
     * @access public
     * @static
     */
    function hashToID($hash)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $helpID = $DB->pselectOne("SELECT helpID FROM help WHERE hash = :HID", array('HID' => $hash));
        if(Utility::isErrorX($helpID)) {
            return PEAR::raiseError("HelpFile::hashToID(): ".$helpID->getMessage());
        }

        return $helpID;
    }
}
?>
