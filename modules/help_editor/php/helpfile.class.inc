<?php
/**
 * Base class for files containing help text information
 * as well as DB wrappers for CRUD operations
 *
 * PHP Version 7
 *
 * @category Help_Editor
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\help_editor;

/**
 * Base class for files containing help text information
 * as well as DB wrappers for CRUD operations
 *
 * PHP Version 7
 *
 * @category Help_Editor
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class HelpFile
{
    /**
     * Identifies the help file
     *
     * @var    array
     * @access private
     */
    var $helpID;

    /**
     * The help file's data
     *
     * @var    array
     * @access private
     */
    var $data;

    /**
     * Constructor
     *
     * Selects and populates a help file
     *
     * @param int $helpID help file's ID
     *
     * @return HelpFile
     */
    static function &factory($helpID)
    {
        // create DB object
        $DB =& \Database::singleton();

        $obj = new HelpFile;

        // set the help ID
        $obj->helpID = $helpID;
        $result      = $DB->pselectRow(
            "SELECT helpID, parentID, hash, topic,
             content,
             created, updated FROM help WHERE helpID = :HID",
            array('HID' => $helpID)
        );
        // set the help file
        $obj->data = $result;

        return $obj;
    }


    /**
     * Inserts a help file
     *
     * @param array $set Associative array of values
     *
     * @return int  New help file's ID
     */
    static public function insert($set)
    {
        // create DB object
        $DB =& \Database::singleton();

        // insert a help file
        $DB->insert('help', $set);
        // return the help ID
        return intval($DB->lastInsertID);
    }


    /**
     * Updates a help file
     *
     * @param array $set Associative array of values
     *
     * @return void
     */
    function update($set)
    {
        // create DB object
        $DB = \Database::singleton();

        // update the help file
        $DB->update('help', $set, array('helpID' => $this->helpID));
    }

    /**
     * Returns whether or not the topic has subtopics
     *
     * @return bool
     */
    function hasChild()
    {
        // create DB object
        $DB =& \Database::singleton();

        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM help WHERE parentID = :HID",
            array('HID' => $this->helpID)
        );
        return ($result > 0);
    }


    /**
     * Returns an array of its subtopics' IDs
     *
     * @param int $stopat Stop at this depth
     * @param int $level  Depth
     *
     * @return array
     */
    function childIDs($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& \Database::singleton();

        // see if it has a child
        $hasChild = $this->hasChild();

        $childIDs = array();

        // get its children
        if ($hasChild) {
            $result = $DB->pselect(
                "SELECT helpID FROM help WHERE parentID = :HID",
                array('HID' => $this->helpID)
            );
            // add the children to the array
            $childIDs = $result;

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
     * @param int $stopat Stop at this depth
     * @param int $level  Depth
     *
     * @return array
     */
    function childData($stopat = 1, $level = 1)
    {
        // create DB object
        $DB =& \Database::singleton();

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
        $DB = \Database::singleton();

        $parentData = array();

        if ($this->data['parentID'] > 0) {
            $parentData = $DB->pselectRow(
                "SELECT helpID, topic, $level as level
                 FROM help
                 WHERE helpID = :HID",
                array('HID' => $this->data['parentID'])
            );

            // check if we're done recursing
            if (is_array($parentData) && $level != $stopat) {
                // make the parent
                $parent =& HelpFile::factory($this->data['parentID']);

                // get the parent's parent
                $grandParentData = $parent->parentData($stopat, $level + 1);

                $parentData = array_merge($parentData, $grandParentData);
            }
        }

        return $parentData ?? array();
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
    static function hashToID($hash)
    {
        // create DB object
        $DB =& \Database::singleton();

        $helpID = $DB->pselectOne(
            "SELECT helpID FROM help WHERE hash = :HID",
            array('HID' => $hash)
        );

        return $helpID;
    }
}

