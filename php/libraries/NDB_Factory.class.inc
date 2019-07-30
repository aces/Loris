<?php
/**
 * This class defines a factory which can be used to generate other objects that
 * are usually singletons. Instead of directly calling class::singleton staticly,
 * this factory should be used so that a mock class can be subbed in for testing.
 *
 * If the Factory is in testing mode (setTesting(true) was called), a mock will
 * be returned. Otherwise, the normal NDB_ prefixed object will be returned.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * Implementation of factory class described in this file's file comment
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Factory
{
    public static $testdb = null;
    public static $db     = null;
    public static $config = null;

    private static $_couchdb    = array();
    private static $_user       = null;
    private static $_candidates = array();
    private static $_timepoints = array();

    var $Testing; // Whether or not Mock objects should be returned instead of
                  // real ones
    //

    /**
     * Settings object
     * A proxy to NDB_Config
     *
     * @var Settings object
     */
    private static $_settings = null;

    /**
     * Sets whether the factory should return real objects or testing objects
     *
     * @param boolean $val Whether testing should be enabled
     *
     * @return void
     */
    function setTesting(bool $val): void
    {
        $this->Testing = $val;
    }

    /**
     * Returns a single factory object. This must be used instead of being
     * constructed directly so that the testing suite and Loris code are
     * using the same factory.
     *
     * @return NDB_Factory A single instance of NDB_Factory
     */
    static function singleton(): \NDB_Factory
    {
        static $self = null;
        if ($self === null) {
            $self = new NDB_Factory();
        }
        return $self;
    }

    /**
     * Reset all of the private variables of the factory to the default
     * state. Used between testing runs.
     *
     * @return void
     */
    function reset(): void
    {
        self::$testdb = null;
        self::$db     = null;

        self::$_couchdb = array();
        self::$_user    = null;

        self::$config = null;

        self::$_settings = null;

        self::$_candidates = array();
        self::$_timepoints = array();
    }

    /**
     * Return either a real or mock NDB_Config object depending on testing
     * status of this factory object.
     *
     * @param string|null $configfile Location of XML file to parse config from
     *
     * @return NDB_Config A config singleton
     */
    function config(?string $configfile = "../project/config.xml"): \NDB_Config
    {
        if (self::$config !== null) {
            return self::$config;
        }
        if ($this->Testing) {
            //Mock::generate("NDB_Config");
            $config = new MockNDB_Config();
        } else {
            $config = NDB_Config::singleton($configfile);
            return $config;
        }

        self::$config = $config;
        // NDB_Config::singleton() is already loading the config file
        // in a better way. this needs to be modified
        $config->load($configfile);
        return $config;
    }

    /**
     * Set config
     * (Can used for injecting test doubles)
     *
     * @param NDB_Config $config config object
     *
     * @return NDB_Config config object which was passed in
     */
    public function setConfig(\NDB_Config $config): \NDB_Config
    {
        self::$config = $config;
        return $config;
    }

    /**
     * Return either a real or mock Loris User object.
     *
     * @return User A user singleton
     */
    function user(): \User
    {
        if (self::$_user !== null) {
            return self::$_user;
        }
        if ($this->Testing) {
            Mock::generate("User");
            $user = new MockUser();
        } else {
            $user = \User::singleton();
        }
        self::$_user = $user;
        return $user;
    }

    /**
     * Explicitly set the user singleton that is being used by the factory
     *
     * @param \User $user The user to be returned by the factory
     *
     * @return \User The same user that was passed in.
     */
    public function setUser(\User $user): \User
    {
        self::$_user = $user;
        return $user;
    }

    /**
     * Returns a connected reference to a database handler, or a Mock database
     * that acts as a connected reference to a database handler.
     *
     * @return \Database A DB reference
     */
    function database(): \Database
    {
        $db_ref = null;
        if ($this->Testing) {
            $db_ref = &self::$testdb;
            if ($db_ref !== null) {
                return $db_ref;
            }
            //Mock::generate("Database");
            self::$testdb = new MockDatabase();
        } else {
            $db_ref = &self::$db;
            if ($db_ref !== null) {
                return $db_ref;
            }
            self::$db = Database::singleton();
        }
        $config = $this->config();
        $dbc    = $config->getSetting('database');
        // This check was added to satisfy phan, our static analysis tool.
        // $db_ref should be set to either a new MockDatabase or a Database
        // singleton above.
        if ($db_ref === null) {
            throw new \ConfigurationException(
                'Could not configure database for LORIS'
            );
        }
        $db_ref->connect(
            $dbc['database'],
            $dbc['username'],
            $dbc['password'],
            $dbc['host'],
            true
        );
        return $db_ref;
    }

    /**
     * Explicitly set the database singleton that is being used by the factory
     * (Can be used for injecting test doubles)
     *
     * @param Database $db Database object
     *
     * @return Database same Database object which was passed in
     */
    public function setDatabase(\Database $db): \Database
    {
        self::$db     = $db;
        self::$testdb = $db;

        return $db;
    }

    /**
     * Returns a reference to a Loris CouchDB database wrapper.
     *
     * @param string $database The couchDB database name
     * @param string $host     The couchDB host name
     * @param int    $port     The couchDB port number
     * @param string $user     The couchDB user name
     * @param string $password The couchDB password
     *
     * @return CouchDB CouchDB singleton
     */
    function couchDB(
        string $database = "",
        string $host = "",
        int $port = 0,
        string $user = "",
        string $password = ""
    ): \CouchDB {
        if (empty($database)
            && empty($host)
            && ($port === 0)
            && empty($user)
            && empty($password)
        ) {
            // check if no parameters are passed
            // deprecated behaviour, backwards compatible until next major
            // Default to DQT
            $config      = \NDB_Config::singleton();
            $couchConfig = $config->getSetting("CouchDB");

            $database = $couchConfig['dbName'];
            $host     = $couchConfig['hostname'];
            $port     = intval($couchConfig['port']);
            $user     = $couchConfig['admin'];
            $password = $couchConfig['adminpass'];
            error_log(
                "LORIS Deprecation Warning: NDB_Factory::CouchDB() will no 
                 longer support accepting only a database name, make sure to 
                 specify all necessary parameters in the function call."
            );
        } else if (!empty($database)
            && empty($host)
            && empty($port)
            && empty($user)
            && empty($password)
        ) {
            // check if only database name given (assume the rest same as dqt)
            // deprecated behaviour, backwards compatible until next major
            // Default to DQT
            $config      = \NDB_Config::singleton();
            $couchConfig = $config->getSetting("CouchDB");

            $host     = $couchConfig['hostname'];
            $port     = intval($couchConfig['port']);
            $user     = $couchConfig['admin'];
            $password = $couchConfig['adminpass'];
            error_log(
                "LORIS Deprecation Warning: NDB_Factory::CouchDB() will no 
                 longer support accepting only a database name, make sure to 
                 specify all necessary parameters in the function call."
            );
        } else if (empty($database)
            || empty($host)
            || empty($port)
            || empty($user)
            || empty($password)
        ) {
            // check if only some parameters given but not all AND does not
            // enter any of the above IF statements. this behavior was never
            // supported and should be an error.
            throw new ConfigurationException(
                "NDB_Factory::CouchDB() requires all parameters to be supplied."
            );
        }

        if (!empty(self::$_couchdb[$database])) {
            return self::$_couchdb[$database];
        }
        if ($this->Testing) {
            Mock::generatePartial(
                'CouchDB',
                'MockCouchDBWrap',
                /* mock out the functions that make HTTP requests */
                array(
                 '_getRelativeURL',
                 '_postRelativeURL',
                 '_postURL',
                 '_getURL',
                )
            );
            self::$_couchdb[$database] = new MockCouchDBWrap();
        } else {
            self::$_couchdb[$database] = CouchDB::getInstance(
                $database,
                $host,
                $port,
                $user,
                $password
            );
        }
        return self::$_couchdb[$database];
    }

    /**
     * Explicitly set the Couch DB singleton that is being used by the factory
     * (Can be used for injecting test doubles)
     *
     * @param CouchDB $couchDB CouchDB database wrapper
     *
     * @return CouchDB
     */
    public function setCouchDB(\CouchDB $couchDB): \CouchDB
    {
        self::$_couchdb = $couchDB;
        return $couchDB;
    }

    /**
     * Returns a singleton settings object
     *
     * @param string $configfile Location of XML file to parse config from
     *
     * @return Settings setting object
     */
    public function settings(string $configfile = "../project/config.xml"): \Settings
    {
        if (self::$_settings !== null) {
            return self::$_settings;
        }
        self::$_settings = new Settings($this->config($configfile));
        return self::$_settings;
    }

    /**
     * Retrieve a Project object representing this project
     *
     * @param string $projectName The name of the project
     *
     * @return Project object
     */
    public function project(string $projectName): \Project
    {
        $project = null;

        if ($this->Testing) {
            $project = new MockProject($projectName);
        } else {
            $project = \Project::singleton($projectName);
        }

        return $project;
    }

    /**
     * Retrieve a candidate object representing this candidate
     *
     * @param CandID $CandID The CandID of the candidate
     *
     * @return Candidate object
     */
    public function candidate(CandID $CandID): \Candidate
    {
        if (isset(self::$_candidates[intval($CandID)])) {
            return self::$_candidates[$CandID];
        }
        if ($this->Testing) {
            self::$_candidates[intval($CandID)] = new MockCandidate($CandID);
        } else {
            self::$_candidates[intval($CandID)] = Candidate::singleton($CandID);
        }
        return self::$_candidates[intval($CandID)];

    }

    /**
     * Retrieve a TimePoint object representing this session
     *
     * @param integer $sessionID The sessionID of the timepoint
     *                           to retrieve
     *
     * @return TimePoint object for $sessionID
     */
    function timepoint(int $sessionID): \TimePoint
    {
        if (isset(self::$_timepoints[$sessionID])) {
            return self::$_timepoints[$sessionID];
        }
        if ($this->Testing) {
            self::$_timepoints[$sessionID] = new MockTimepoint($sessionID);
        } else {
            self::$_timepoints[$sessionID] = \TimePoint::singleton($sessionID);
        }
        return self::$_timepoints[$sessionID];
    }
}

