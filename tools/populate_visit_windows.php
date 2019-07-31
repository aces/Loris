<?php
/**
 * This script populates the Visit_Windows table based on the config.xml.
 * This should usually be run on a one time basis, and then the Visit_Windows
 * table should be kept up to date manually, though the script will only
 * insert new visits, so it can be run multiple times if need be.
 *
 * The Visit_Windows table should be kept up to date so that places that
 * don't have access to the config.xml (ie. the MRI pipeline scripts) can
 * still check if a visit is valid. It's also used by the Utility::getVisits
 * utility function in PHP, so if the table is not up to date some drop downs
 * may not appear correctly.
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
require_once 'Database.class.inc';
require_once 'Utility.class.inc';

/**
 * Class to implement logic which populates table.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class VisitWindowPopulator
{
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $Config;

    /**
     * Constructor function. Instantiates references to database and
     * config class.
     *
     * @return VisitWindowPopulator
     */
    function __construct()
    {
        $this->DB     = Database::singleton();
        $this->Config = NDB_Config::singleton();
    }

    /**
     * Checks if a Visit_label is already in the Visit_Windows table and
     * if not, populate it with null windows.
     *
     * @param string $visit The Visit label to insert
     *
     * @return none, but as a side-effect potentially inserts into database
     */
    function insertIfMissing($visit)
    {
        $verify = $this->DB->pselectOne(
            "SELECT 'x' FROM Visit_Windows WHERE Visit_label=:VL",
            array('VL' => $visit)
        );
        if ($verify === 'x') {
            return;
        }
        print "Inserting $visit\n";
        $x = $this->DB->insert("Visit_Windows", array('Visit_label' => $visit));
    }

    /**
     * Runs the logic of the script.
     *
     * @return none
     */
    function run()
    {
        // Can't use Utility::getVisits() because that uses the Visit_Window table..
        $vls = $this->Config->getSetting("visitLabel");
        foreach (Utility::associativeToNumericArray($vls) as $visits) {
            foreach (
                Utility::associativeToNumericArray($visits['labelSet']['item'])
                as $item
            ) {
                $visit = $item['@']['value'];
                if (!empty($visit)) {
                    $this->insertIfMissing($visit);
                }

            };
        }
    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new VisitWindowPopulator();
    $Runner->run();
}

