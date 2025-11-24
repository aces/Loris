<?php declare(strict_types=1);

/**
 * Base class for files containing help text information
 * as well as DB wrappers for CRUD operations
 *
 * PHP Version 8
 *
 * @category Help_Editor
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\help_editor;
require __DIR__ . '/../../../tools/generic_includes.php';

/**
 * Base class for files containing help text information
 * as well as DB wrappers for CRUD operations
 *
 * PHP Version 8
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
     * @var    ?int
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
        $DB = \NDB_Factory::singleton()->database();

        $obj = new HelpFile;

        // set the help ID
        $obj->helpID = $helpID;
        $result      = $DB->pselectRow(
            "SELECT helpID, hash, topic, content,
             created, updated FROM help WHERE helpID = :HID",
            ['HID' => $helpID]
        );

        // get instrument  test_name
        $instruments = $DB->pselect("SELECT * FROM test_names", []);
        foreach ($instruments as $item) {
            if ($result !== null && md5($item['Test_name']) === $result['hash']) {

                $result['instrument_full_name'] = $item['Full_name'];
                $result['instrument']           = $item['Test_name'];
                break;
            }
        }

        // set the help file
        $obj->data = $result ?? [];

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
        $DB = \NDB_Factory::singleton()->database();

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
     * @return true
     */
    function update($set)
    {
        // update the help file
        \NDB_Factory::singleton()->database()
            ->update('help', $set, ['helpID' => $this->helpID]);

        return true;
    }

    /**
     * Dumps the HelpFile as an array
     *
     * @return array
     * @access public
     */
    function toArray()
    {
        $data          = $this->data;
        $data['topic'] = stripslashes($this->data['topic'] ?? '');

        $data['content'] = stripslashes($this->data['content'] ?? '');

        $data['instrument'] = stripslashes($this->data['instrument'] ?? '');

        return $data;
    }

    /**
     * Returns the ID of a given hash
     *
     * @param string $hash 32-character MD5 hash
     *
     * @return integer of HelpID
     */
    static function hashToID($hash): int
    {
        $id = \NDB_Factory::singleton()->database()->pselectOneInt(
            "SELECT helpID FROM help WHERE hash = :HID",
            ['HID' => $hash]
        );
        if (is_null($id)) {
            throw new \NotFound();
        }
        return $id;
    }
}
