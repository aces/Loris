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
     * @access public
     */
    function &factory($helpID)
    {
        // create DB object
        $DB =& Database::singleton();

        $obj = new HelpFile;

        // set the help ID
        $obj->helpID = $helpID;
        $result      = $DB->pselectRow(
            "SELECT helpID, parentID, hash, topic, COALESCE(projectContent, content) AS content,
                                   created, updated FROM help WHERE helpID = :HID", array('HID' => $helpID)
                       );
        // set the help file
        $obj->data = $result;

        return $obj;
    }


    /**
     * Inserts a help file
     *
     * @param  array       Associative array of values
     * @return int         New help file's ID
     * @access public
     * @static
     */
    function insert($set)
    {
        // create DB object
        $DB =& Database::singleton();

        // insert a help file
        $success = $DB->insert('help', $set);
        // return the help ID
        return $DB->lastInsertID;
    }


    /**
     * Updates a help file
     *
     * @param  array       Associative array of values
     * @return void
     * @access public
     */
    function update($set)
    {
        // create DB object
        $DB =& Database::singleton();

        // update the help file
        $success = $DB->update('help', $set, array('helpID' => $this->helpID));

        return true;
    }


    /**
     * Adds to a help file's related links
     *
     * @param  array       Array of related help file IDs
     * @return void
     * @access public
     */
    function addLinks($relatedIDs)
    {
        // create DB object
        $DB =& Database::singleton();

        // insert all related links
        if (is_array($relatedIDs)) {
            foreach ($relatedIDs as $relatedID) {
                $success = $DB->insert('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedID));
            }
        } else {
            $success = $DB->insert('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedIDs));
        }

        return true;
    }

    /**
     * Removes links from a help file's related links
     *
     * @param  array       Array of related help file IDs
     * @return void
     * @access public
     */
    function removeLinks($relatedIDs)
    {
        // create DB object
        $DB =& Database::singleton();

        // delete the links
        if (is_array($relatedIDs)) {
            foreach($relatedIDs as $relatedID) {
                $success = $DB->delete('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedID));
                $success = $DB->delete('help_related_links', array('helpID' => $relatedID, 'relatedID' => $this->helpID));
            }
        } else {
            $success = $DB->delete('help_related_links', array('helpID' => $this->helpID, 'relatedID' => $relatedIDs));
            $success = $DB->delete('help_related_links', array('helpID' => $relatedIDs, 'relatedID' => $this->helpID));
        }

        return true;
    }


    /**
     * Updates a help file's related links
     *
     * @param  array       Array of related help file IDs
     * @return void
     * @access public
     */
    function updateLinks($relatedIDs)
    {
        // create DB object
        $DB =& Database::singleton();

        // delete all related links
        $success = $DB->delete('help_related_links', array('helpID' => $this->helpID));
        $success = $DB->delete('help_related_links', array('relatedID' => $this->helpID));

        // add all the new links
        $success = $this->addLinks($relatedIDs);

        return true;
    }


    /**
     * Returns whether or not the topic has subtopics
     *
     * @return bool
     * @access public
     */
    function hasChild()
    {
        // create DB object
        $DB =& Database::singleton();

        $result = $DB->pselectOne("SELECT COUNT(*) FROM help WHERE parentID = :HID", array('HID' => $this->helpID));
        return ($result > 0);
    }


    /**
     * Returns an array of its subtopics' IDs
     *
     * @param  int         Stop at this depth
     * @param  int         Depth
     * @return array
     * @access public
     */
    function childIDs($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& Database::singleton();

        // see if it has a child
        $hasChild = $this->hasChild();

        $childIDs = array();

        // get its children
        if ($hasChild) {
            $result = $DB->pselect("SELECT helpID FROM help WHERE parentID = :HID", array('HID' => $this->helpID));
            // add the children to the array
            $childIDs = Utility::reduce($result);

            // check if we're done recursing
            if ($level != $stopat) {
                // check all the children for more children
                foreach ($childIDs as $childID) {
                    // make the child
                    $child =& HelpFile::factory($childID);
                    // get the child's children
                    $grandChildIDs = $child->childIDs($stopat, $level + 1);

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
     * @param  int $stopat Stop at this depth
     * @param  int $level  Depth
     *
     * @return array
     */
    function childData($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& Database::singleton();

        // see if it has a child
        $hasChild = $this->hasChild();

        $childData = array();

        // get its children
        if ($hasChild) {
            $result = $DB->pselect(
                "SELECT helpID, topic, $level as level
                FROM help
                WHERE parentID = :HID",
                array('HID' => $this->helpID)
            );

            // add the children to the array
            $childData = $result;

            // check if we're done recursing
            if ($level !== $stopat) {
                // check all the children for more children
                foreach ($childData as $row) {
                    // make the child
                    $child =& HelpFile::factory($row['helpID']);
                    // get the child's children
                    $grandChildData = $child->childData($stopat, $level + 1);

                    // add the children to the array
                    $childData = array_merge($childData, $grandChildData);
                }
            }
        }

        return $childData;
    }


    /**
     * Returns an array of its parent's IDs
     *
     * @param int $stopat Stop at this depth
     * @param int $level  Depth
     *
     * @return array
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
                // get the parent's parent
                $grandParentIDs = $parent->parentIDs($stopat, $level + 1);

                // add the parents to the array
                $parentIDs = array_merge($parentIDs, $grandParentIDs);
            }
        }

        return $parentIDs;
    }


    /**
     * Returns an array of its parent's IDs and topics
     *
     * @param int $stopat Stop at this depth
     * @param int $level  Depth
     *
     * @return array
     */
    function parentData($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& Database::singleton();

        $parentData = array();

        if ($this->data['parentID'] > 0) {
            $result = $DB->pselectRow(
                "SELECT helpID, topic, $level as level
                 FROM help
                 WHERE helpID = :HID",
                array('HID' => $this->data['parentID'])
            );

            // add the parent to the array
            $parentData = $result;

            // check if we're done recursing
            if ($level != $stopat) {
                // make the parent
                $parent =& HelpFile::factory($this->data['parentID']);

                // get the parent's parent
                $grandParentData = $parent->parentData($stopat, $level + 1);

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
     * @param int $ancestor Ancestor's help ID
     *
     * @return bool
     */
    function isDescendant($ancestor)
    {
        if ($this->data['parentID'] == -1) {
            return false;
        } elseif ($this->data['parentID'] == $ancestor) {
            return true;
        } else {
            // make the parent
            $parent =& HelpFile::factory($this->data['parentID']);

            return $parent->isDescendant($ancestor);
        }

    }


    /**
     * Returns an array of its related link's IDs
     *
     * @return array
     * @access public
     */
    function relationIDs()
    {
        // create DB object
        $DB =& Database::singleton();

        $result = $DB->pselect(
            "SELECT helpID, relatedID
            FROM help_related_links
            WHERE helpID = :HID OR relatedID = :HID ",
            array('HID' => $this->helpID)
        );

        // a multi-dimensional array is imploded, then exploded,
        // and then this topic's ID is removed
        return array_diff(Utility::reduce($result), array($this->helpID));
    }


    /**
     * Returns an array of its related links' IDs and topics
     *
     * @return array
     * @access public
     */
    function relationData()
    {
        // create DB object
        $DB =& Database::singleton();

        // get the relation IDs
        $relationIDs = $this->relationIDs();

        // build the query using the IDs provided by the previous function
        $query = "SELECT helpID, topic FROM help WHERE 0";

        // add them to the query
        if (count($relationIDs) > 0) {
            $query .= " OR helpID = ".implode(" OR helpID = ", $relationIDs);
        }

        $DB->select($query, $result);
        return $result;
    }


    /**
     * Returns an array of the IDs and topics of help files not in the "family"
     *
     * @param int $ancestor   Stop finding children at this depth
     * @param int $descendant Stop finding parents at this depth
     *
     * @return array
     */
    function strangerData($ancestor = -1, $descendant = -1)
    {
        // create DB object
        $DB =& Database::singleton();

        // get the parent IDs
        $parentIDs = $this->parentIDs($ancestor);

        // get the child IDs
        $childIDs = $this->childIDs($descendant);

        // get all its descendants and ancestors, and I am not a stranger to myself!
        $familyIDs = array_merge($parentIDs, $childIDs, $this->helpID);

        // build the query blocking out family members
        $query = "SELECT helpID, topic FROM help WHERE 1";

        // add the family IDs to the query
        if (count($familyIDs) > 0) {
            $query .= " AND helpID != ".implode(" AND helpID != ", $familyIDs);
        }

        $DB->select($query, $result);
        return $result;
    }


    /**
     * Returns the tree starting with this help file
     *
     * @param integer $level The current depth of the tree
     *
     * @return array
     */
    function tree($level = 0)
    {
        $DB =& Database::singleton();

        // see if it has a child
        $hasChild = $this->hasChild();

        $tree = array();

        if ($hasChild) {
            $result = $DB->pselect(
                "SELECT helpID, topic, updated, $level as level
                 FROM help
                 WHERE parentID = :HID",
                array('HID' => $this->helpID)
            );

            // go one-by-one
            foreach ($result as $row) {
                // add the row to the array...
                $tree[] = $row;

                // and go down another level!
                $branch =& HelpFile::factory($row['helpID']);

                $twig = $branch->tree($level + 1);

                $tree = array_merge($tree, $twig);
            }
        }

        return $tree;
    }


    /**
     * Dumps the HelpFile as an array
     *
     * @return array
     * @access public
     */
    function toArray()
    {
        $data            = $this->data;
        $data['topic']   = stripslashes($this->data['topic']);
        $data['content'] = stripslashes($this->data['content']);

        return $data;
    }


    /**
     * Returns the ID of a given hash
     *
     * @param string $hash 32-character MD5 hash
     *
     * @return integer of HelpID
     */
    function hashToID($hash)
    {
        // create DB object
        $DB =& Database::singleton();

        $helpID = $DB->pselectOne(
            "SELECT helpID FROM help WHERE hash = :HID",
            array('HID' => $hash)
        );

        return $helpID;
    }
}
?>
