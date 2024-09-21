<?php declare(strict_types=1);
/**
 * This class defines a factory which can be used to generate other objects that
 * are usually singletons. Instead of directly calling class::singleton staticly,
 * this factory should be used so that a mock class can be subbed in for testing.
 *
 * Mocks are injected using the setDatabase/setConfig/etc methods.
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

    private static $_couchdb    = [];
    private static $_user       = null;
    private static $_candidates = [];
    private static $_timepoints = [];

    private $_baseURL = "";

    /**
     * Settings object
     * A proxy to NDB_Config
     *
     * @var ?\Settings
     */
    private static $_settings = null;

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

        self::$_couchdb = [];
        self::$_user    = null;

        self::$config = null;

        self::$_settings = null;

        self::$_candidates = [];
        self::$_timepoints = [];

        $this->_baseURL = "";
    }

    /**
     * Return either a real or mock NDB_Config object depending on testing
     * status of this factory object.
     *
     * @param string|null $configfile Location of XML file to parse config from
     *
     * @return NDB_Config A config singleton
     */
    function config(?string $configfile = '../project/config.xml'): \NDB_Config
    {
        $config = self::$config;
        if ($config !== null) {
            return $config;
        }

        $config = NDB_Config::singleton($configfile);

        self::$config = $config;
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
        $user = self::$_user;
        if ($user !== null) {
            return $user;
        }
        $user        = \User::singleton();
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
        $db_ref = &self::$db;
        if ($db_ref !== null) {
            return $db_ref;
        }

        $settings = $this->settings();

        // Pass the credentials in environment variables, so that they
        // don't potentially show up in a stack trace if something goes
        // wrong.
        $dbname = $settings->dbName();
        putenv("LORIS_{$dbname}_USERNAME=" . $settings->dbUserName());
        putenv("LORIS_{$dbname}_PASSWORD=" . $settings->dbPassword());
        putenv("LORIS_{$dbname}_HOST=" . $settings->dbHost());

        $db_ref = new Database();
        $db_ref->connect(
            $settings->dbName(),
            true,
        );

        // Unset the variables now that they're no longer needed.
        putenv("LORIS_{$dbname}_USERNAME=");
        putenv("LORIS_{$dbname}_PASSWORD=");
        putenv("LORIS_{$dbname}_HOST=");

        self::$db = $db_ref;

        $config   = \NDB_Config::singleton();
        $loglevel = $config->getLogSettings()->getDatabaseLogLevel();
        if ($loglevel !== "none") {
            $db_ref->setLogger(new \LORIS\Log\ErrorLogLogger($loglevel));
        }
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
            // enter any of the above IF statements. this behaviour was never
            // supported and should be an error.
            throw new ConfigurationException(
                "NDB_Factory::CouchDB() requires all parameters to be supplied."
            );
        }

        if (!empty(self::$_couchdb[$database])) {
            return self::$_couchdb[$database];
        }

        $couch = CouchDB::getInstance(
            $database,
            $host,
            $port,
            $user,
            $password
        );
        self::$_couchdb[$database] = $couch;
        return $couch;
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
     * Sets the baseURL that the settings object return by settings()
     * should return when calling getBaseURL().
     *
     * @param string $baseURL The URL to be returned by the Settings object.
     *
     * @return void
     */
    public function setBaseURL(string $baseURL)
    {
        // Reset static settings object so that the base URL can be properly set
        self::$_settings = null;
        $this->_baseURL  = $baseURL;
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
        // self::$_settings needs to be put into a simple var because of
        // phan/phan#4169, otherwise we get a false positive warning about
        // how it may return null inside of the if.
        $settings = self::$_settings;
        if ($settings !== null) {
            return $settings;
        }
        self::$_settings = new Settings($this->config($configfile), $this->_baseURL);
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
        return \Project::singleton($projectName);
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
        $key = (string) $CandID;
        if (isset(self::$_candidates[$key])) {
            return self::$_candidates[$key];
        }
        self::$_candidates[$key] = Candidate::singleton($CandID);
        return self::$_candidates[$key];

    }

    /**
     * Retrieve a TimePoint object representing this session
     *
     * @param SessionID $sessionID The sessionID of the timepoint
     *                             to retrieve
     *
     * @return TimePoint object for $sessionID
     */
    function timepoint(SessionID $sessionID): \TimePoint
    {
        if (isset(self::$_timepoints[(string) $sessionID])) {
            return self::$_timepoints[(string) $sessionID];
        }
        self::$_timepoints[(string) $sessionID] = \TimePoint::singleton(
            $sessionID
        );
        return self::$_timepoints[(string) $sessionID];
    }
}

