<?php declare(strict_types=1);
/**
 * This file contains a trait to provide legacy behaviour
 * (database lookup) for abstract functions getFullNames and
 * getSubtestList.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The LegacyInstrumentTrait provides implementations of
 * abstract functions in NDB_BVL_Instrument which previously
 * had implementations provided. It can be used as a mixin
 * for existing instruments as a stop-gap until the existing
 * instruments are updated.
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
trait LegacyInstrumentTrait
{
    /**
     * Return the full, human readable name for the
     * current instrument.
     *
     * @return string the full name of the instrument
     */
    public function getFullName(): string
    {
        $db = \Database::singleton();

        $success = $db->pselectOne(
            "SELECT Full_name FROM test_names WHERE Test_name=:TN",
            array('TN' => $this->testName)
        );
        return $success;
    }

    /**
     * Returns a list of subtests of the current instrument.
     * The returned array should be a list of rows where each
     * row has a key for "Name" (the subpage name) and "Description"
     * (the human readable name)
     *
     * @return array
     */
    function getSubtestList(): array
    {
        // get a database connection
        $db = \Database::singleton();

        $query = "SELECT Subtest_name AS Name, Description
            FROM instrument_subtests
            WHERE Test_name=:TN
                ORDER BY Order_number";

        $results = $db->pselect($query, array('TN' => $this->testName));

        return $results;
    }
}
