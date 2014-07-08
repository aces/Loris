<?php
/**
 * This script deletes cancelled or incorrect data from the DQT by comparing 
 * everything in CouchDB against what's currently valid in MySQL.
 *
 * Note that if there is a duplicate Visit_label for a PSCID the script can 
 * not determine which is Active on the CouchDB end and assumes that the identifier
 * is invalid, so this should be run *before* the import scripts because it will 
 * delete both (and then the import script will reimport the correct one if run
 * in that order.)
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */


require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';

/**
 * This class compares what's in a CouchDB Loris DQT instance against the 
 * MySQL database of that Loris instance and deletes anything from CouchDB
 * that is not in MySQL.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class CouchDBIntegrityChecker
{
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler


    /**
     * Initialize references to SQL database and CouchDB wrapper 
     *
     * @return None
     */
    function __construct()
    {
        $this->SQLDB = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
    }

    /**
     * Runs the script
     *
     * @return none
     */
    function run()
    {

        $sessions = $this->CouchDB->queryView(
            "DQG-2.0",
            "sessions",
            array("reduce" => "false")
        );
        print "Sessions:";
        foreach ($sessions as $row) {
            $pscid = $row['key'][0];
            $vl    = $row['key'][1];
            $sqlDB = $this->SQLDB->pselectRow(
                "SELECT c.*, s.Visit_label, s.Active
                FROM candidate c
                LEFT JOIN session s USING (CandID)
                WHERE c.PSCID=:PID AND s.Visit_label=:VL",
                array(
                    "PID" => $pscid,
                    "VL" => $vl
                )
            );

            if ($sqlDB['Active'] != 'Y') {
                print "PSCID $pscid VL $vl is cancelled" .
                    " but $row[id] still exists.\n";
                $this->CouchDB->deleteDoc($row['id']);
            } else if ($sqlDB['PSCID'] !== $pscid) {
                print "PSCID $pscid case sensitivity mismatch for $row[id].\n";
                $this->CouchDB->deleteDoc($row['id']);
            } else if ($sqlDB['Visit_label'] !== $vl) {
                print "Visit Label case sensitivity mismatch for $row[id].\n";
                $this->CouchDB->deleteDoc($row['id']);
            }
        }


    }
}

// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new CouchDBIntegrityChecker();
    $Runner->run();
}
?>
