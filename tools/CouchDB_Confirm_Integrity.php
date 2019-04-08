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

require_once __DIR__ . "/../vendor/autoload.php";
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
        $factory       = \NDB_Factory::singleton();
        $config        = \NDB_Config::singleton();
        $couchConfig   = $config->getSetting('CouchDB');
        $this->SQLDB   = $factory->Database();
        $this->CouchDB = $factory->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
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
        print "Sessions:\n";
        $activeExists = $this->SQLDB->prepare(
            "SELECT count(*) AS count FROM 
        candidate c LEFT JOIN session s USING (CandID) WHERE s.Active='Y' 
        AND c.Active='Y' AND c.PSCID=:PID and s.Visit_label=:VL"
        );
        foreach ($sessions as $row) {
            $pscid = $row['key'][0];
            $vl    = $row['key'][1];
            $sqlDB = $this->SQLDB->pselectRow(
                "SELECT c.*, s.Visit_label, s.Active, c.Active as cActive
                FROM candidate c
                LEFT JOIN session s USING (CandID)
                WHERE c.PSCID=:PID AND s.Visit_label=:VL",
                array(
                    "PID" => $pscid,
                    "VL" => $vl
                )
            );

            if (!empty($sqlDB) && $sqlDB['cActive'] == 'N') {
                print "PSCID $pscid is inactive but $row[id] still exists. 
                Deleting Doc.\n";

                $this->CouchDB->deleteDoc($row['id']);
            } else if (!empty($sqlDB) && $sqlDB['Active'] != 'Y') {
                $numActive = $this->SQLDB->execute(
                    $activeExists, array(
                    'PID' => $pscid,
                    'VL' => $vl)
                );

                if (!array_key_exists('count', $numActive[0])
                    || $numActive[0]['count'] == '0'
                ) {
                    print "PSCID $pscid VL $vl is cancelled and has no active "
                           . "equivalent session but $row[id] still exists.\n";

                    $this->CouchDB->deleteDoc($row['id']);
                } else {
                    print "There is an active session for $pscid $vl overriding 
                    the cancelled one. Keeping $row[id]\n";
                }
            } else if (!empty($sqlDB) && $sqlDB['PSCID'] !== $pscid) {
                print "PSCID $pscid case sensitivity mismatch for $row[id].\n";

                $this->CouchDB->deleteDoc($row['id']);
            } else if (!empty($sqlDB) && $sqlDB['Visit_label'] !== $vl) {
                print "Visit Label case sensitivity mismatch for $row[id].\n";

                $this->CouchDB->deleteDoc($row['id']);
            } else {
                print "Nothing wrong with $row[id]!\n";
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
