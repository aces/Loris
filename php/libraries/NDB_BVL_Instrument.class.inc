<?php declare(strict_types=1);

/**
 * Base class for all LORIS behavioural instruments.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
abstract class NDB_BVL_Instrument extends \LORIS\instruments\schematypes\PHP
{
    /**
     * Factory generates a new instrument instance of type
     * $instrument, and runs the setup() method on that new
     * instrument.
     *
     * @param \LORIS\LorisInstance $loris            The LORIS instance with the
     *                                               instrument
     * @param string               $instrument       The name of the instrument to
     *                                               use
     * @param string               $commentID        The CommentID identifying the
     *                                               data to load
     * @param string               $page             If a multipage form, the page to
     *                                               show
     * @param boolean              $guarantee_exists If true the factory will throw
     *                                               an error if the file does not
     *                                               exist, otherwise will silently
     *                                               return if the instrument is
     *                                               missing.
     *
     * @return object|null the new object of $instrument type
     * @access public
     * @throws NotFound
     * @throws Exception
     */
    public static function factory(
        \LORIS\LORISInstance $loris,
        string $instrument,
        string $commentID = '',
        string $page = '',
        bool $guarantee_exists = true
    ) {
        $class = "NDB_BVL_Instrument_$instrument";

        // Make sure the instrument class has been included/required!
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();
        $base    = $config->getSetting('base');

        // The conflict resolver doesn't care if the instrument exists or not, it
        // just tries to load, score, and save. If it doesn't exist, for instance
        // in the case of figs_year3_relatives, we shouldn't require because it
        // isn't necessarily an error.
        if (!file_exists($base."project/instruments/$class.class.inc")
            && !file_exists($base."project/instruments/$instrument.linst")
            && $guarantee_exists==false
        ) {
            return null;
        }
        if (file_exists($base."project/instruments/$instrument.linst")
        ) {
            $module = $loris->getModule("instruments");
            $module->registerAutoloader();
            $obj = new \Loris\instruments\schematypes\LINST(
                // The module directory we use for instruments is arbitrary,
                // since it isn't a real module, but it's required for the page
                // constructor.
                $loris,
                $module,
                $page,
                $commentID,
                $commentID,
            );
        } else {
            if (!class_exists($class)
                && ($guarantee_exists === true
                && !file_exists($base."project/instruments/$class.class.inc"))
            ) {
                throw new NotFound("Instrument does not exist");
            }
            if (!class_exists($class)) {
                include_once $base."project/instruments/$class.class.inc";
            }

            // Now go ahead and instantiate it
            $obj = new $class(
                $loris,
                $loris->getModule("instruments"),
                $page,
                $commentID,
                $commentID,
                'test_form'
            );
        }

        // if a script is loading this form without a commentID, display all fields
        if (!isset($commentID)) {
            $obj->displayAllFields = true;
        }

        // Set page name to testName
        $obj->name = $instrument;
        // Sets up page variables such as $this->commentID and $this->form
        $obj->setup($commentID, $page);

        if (!empty($commentID)) {
            $obj->setupCandidateInfoTables();
        }
        if (file_exists($base."project/instruments/$instrument.meta")) {
            $obj->loadInstrumentMetadata(
                $base . "project/instruments/$instrument.meta"
            );
        }
        // Adds all of the form element and form rules to the page after
        // having instantiated the form above
        $obj->loadInstrumentFile(
            $base . "project/instruments/$instrument.linst"
        );
        // Add rules only if they exist.
        $obj->loadInstrumentRules(
            $base . "project/instruments/$instrument.rules"
        );

        return $obj;
    }

    /**
     * Static function returning a full list of instruments defined in the database.
     * Only instantiable instruments are returned in the format
     * test_name => Instrument object.
     *
     * Note: An error_log entry is logged if an instrument is in the database but
     * can not be instantiated. this check should eventually be replaced with an
     * exception.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getInstrumentsList(\LORIS\LorisInstance $loris) : array
    {
        $DB          = $loris->getDatabaseConnection();
        $instruments = $DB->pselectCol("SELECT Test_name FROM test_names", []);

        $instrumentList = [];
        foreach ($instruments as $inst) {
            try {
                $instrumentList[$inst] = NDB_BVL_Instrument::factory(
                    $loris,
                    $inst,
                    "",
                    ""
                );
            } catch (Exception $e) {
                error_log(
                    "Instrument $inst does not seem to be a valid instrument."
                );
            }
        }
        return $instrumentList;
    }

    /**
     * Static function returning list of all test_names available in the database as
     * an associative array with format $testName => $fullName. Only Names of
     * instruments which are instantiable are returned, invalid instruments will not
     * appear in this list.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getInstrumentNamesList(\LORIS\LorisInstance $loris) : array
    {
        $instrumentsList = self::getInstrumentsList($loris);

        $instrumentNames = [];
        foreach ($instrumentsList as $testName => $instrument) {
            $fullName = $instrument->getFullName();
            $instrumentNames[$testName] =$fullName;
        }

        // sort array by instrument name for modules that rely on ordering
        asort($instrumentNames, SORT_STRING | SORT_FLAG_CASE | SORT_NATURAL);

        return $instrumentNames;
    }

    /**
     * Static function returning list of all test_names with Double Data Entry
     * configuration enabled in the database. The list is returned as an associative
     * array with format $testName => $fullName. Only Names of instruments which are
     * instantiable are returned, invalid instruments will not appear in this list.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getDDEInstrumentNamesList(\LORIS\LorisInstance $loris) : array
    {
        $config = $loris->getConfiguration();

        $instrumentNamesList = self::getInstrumentNamesList($loris);

        $doubleDataEntryInstruments = $config->getSetting(
            'DoubleDataEntryInstruments'
        );

        $instrumentNames = [];
        foreach ($instrumentNamesList as $testName => $fullName) {
            if (in_array($testName, $doubleDataEntryInstruments, true)) {
                $instrumentNames[$testName] = $fullName;
            }
        }

        // sort array by instrument name for modules that rely on ordering
        asort($instrumentNames, SORT_STRING | SORT_FLAG_CASE | SORT_NATURAL);

        return $instrumentNames;
    }

    /**
     * Static function returning list of all test_names with Direct Data Entry
     * configuration enabled in the database. The list is returned as an associative
     * array with format $testName => $fullName. Only Names of instruments which are
     * instantiable are returned, invalid instruments will not appear in this list.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getDirectEntryInstrumentNamesList(
        \LORIS\LorisInstance $loris
    ) : array {
        $DB = $loris->getDatabaseConnection();

        $instrumentNamesList = self::getInstrumentNamesList($loris);

        $directEntryInstruments = $DB->pselectCol(
            "SELECT Test_name FROM test_names WHERE IsDirectEntry=true",
            []
        );

        $instrumentNames = [];
        foreach ($instrumentNamesList as $testName => $instrument) {
            $fullName = $instrument->getFullName();
            if (in_array($testName, $directEntryInstruments, true)) {
                $instrumentNames[$testName] = $fullName;
            }
        }

        // sort array by instrument name for modules that rely on ordering
        asort($instrumentNames, SORT_STRING | SORT_FLAG_CASE | SORT_NATURAL);

        return $instrumentNames;
    }
}
