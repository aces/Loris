<?php
/**
 * This script was written to transfer the reliability instruments present in
 * the config.xml to the reliability_instruments table in the database.
 *
 * The config.xml current tags are <Testname>, <Threshold> and <Displayname>.
 * Only the first two will be transfered to the table and the Displayname will
 * be fetched from the test_names table (decoupling test ID and name). Testname
 * will also be changed to TestID and a standard 10% will be assigned to
 * all reliability ratios.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.abou-haidar@mail.mcgill.ca>
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
class ReliabilityInstrumentsPopulator
{
    var $SQLDB; // reference to the database handler, store here instead
    // of using Database::singleton in case it's a mock.
    var $Config;

    /**
     * Constructor function. Instantiates references to database and
     * config class.
     *
     * @return ReliabilityInstrumentsPopulator
     */
    function __construct()
    {
        $this->DB = Database::singleton();
        $this->Config = NDB_Config::singleton();

        print "This tool will populate the reliability_instruments table with ".
            "threshold and table information from project/config.xml and will ".
            "set all other values to either NULL or a default value\n ".
            "Default values used are:\n".
            "Target_scope = Within\n".
            "Reliability_ratio = 0.1\n".
            "ProjectID = NULL\n".
            "Visit_label = NULL\n";
        //print "These values can be changed from the Config module in LORIS\n ";
    }

    /**
     * Check if instrument already in the table by using the test name. This is
     * a very basic check as the config.xml does not allow for more complex
     * combinations
     *
     * @param integer $testID Thetest to add the entry for
     * @param float $Threshold The threshold associated with the reliability pass/fail
     *
     * @return none, but as a side-effect potentially inserts into database
     */
    function insertIfMissing($testID, $Threshold)
    {
        $verify = $this->DB->pselectOne(
            "SELECT 'x' FROM reliability_instruments WHERE TestID=:tID",
            array('tID'=>$testID)
        );
        if ($verify === 'x') {
            return;
        }
        print "Inserting for test $testID\n";
        $x = $this->DB->insert("reliability_instruments",
            array(
                'TestID'=>$testID,
                'Target_scope' => 'Within',
                'Threshold' => $Threshold,
                'Reliability_ratio'=> 0.1)
        );
    }

    /**
     * Runs the logic of the script.
     *
     * @return none
     */
    function run()
    {
        // Can't use Utility::getVisits() because that uses the Visit_Window table..
        $reliabilityInstruments = $this->Config->getSetting("ReliabilityInstruments");
        foreach (Utility::toArray($reliabilityInstruments) as $rel_instr) {
            foreach (Utility::toArray($rel_instr['Instrument']) as $item) {
                $TestID = self::getTestID($item['Testname']);
                $Threshold = $item['Threshold'];
                if (!empty($TestID) && !empty($Threshold)) {
                    $this->insertIfMissing($TestID,$Threshold);
                }


            };
        }
    }

    /**
     * function getting the test name associated with a test ID
     *
     * @param $testID Id of the test for which the name is wanted
     *
     * @return array rows of the reliability_instruments table
     */
    static function getTestID($testname)
    {
        $DB    =& Database::singleton();
        $query = "SELECT ID FROM test_names WHERE Test_name=:tn";

        $result = $DB->pselectOne($query, array('tn' => $testname));

        return $result;
    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new ReliabilityInstrumentsPopulator();
    $Runner->run();
}
?>