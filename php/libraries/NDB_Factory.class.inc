<?php
/**
 * This class defines a factory which can be used to generate other objects that
 * are usually singletons. Instead of directly calling class::singleton staticly,
 * this factory should be used so that a mock class can be subbed in for testing.
 *
 * If the Factory is in testing mode (setTesting(true) was called), a mock will
 * be returned. Otherwise, the normal NDB_ prefixed object will be returned.
 *
 * PHP Version 5
 *
 *  @category Main
 *  @package  Main
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once 'NDB_Factory.class.inc';
require_once 'User.class.inc';
require_once 'NDB_Config.class.inc';
require_once 'Database.class.inc';
require_once 'CouchDB.class.inc';

/**
 * Implementation of factory class described in this file's file comment
 *
 *  @category Main
 *  @package  Main
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Factory
{
    private static $_testdb = null;
    private static $_db = null;

    private static $_couchdb = null;
    private static $_user = null;
    var $Testing; // Whether or not Mock objects should be returned instead of
                  // real ones
    //
    private static $_config = null;

    /**
     * Sets whether the factory should return real objects or testing objects
     *
     * @param boolean $val Whether testing should be enabled
     *
     * @return none
     */
    function setTesting($val)
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
    static function singleton()
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
     * @return none
     */
    function reset()
    {
        self::$_testdb = null;
        self::$_db= null;

        self::$_couchdb = null;
        self::$_user = null;

        self::$_config = null;
    }

    /**
     * Return either a real or mock NDB_Config object.
     *
     * @return NDB_Config A config singleton
     */
    function config()
    {
        if (self::$_config !== null) {
            return self::$_config;
        }
        if ($this->Testing) {
            Mock::generate("NDB_Config");
            $config = new MockNDB_Config();
        } else {
            $config = new NDB_Config();
        }

        self::$_config = $config;
        $config->load();
        return $config;
    }

    /**
     * Return either a real or mock Loris User object.
     *
     * @return User A user singleton
     */
    function user()
    {
        if (self::$_user !== null) {
            return self::$_user;
        }
        if ($this->Testing) {
            Mock::generate("User");
            $user = new MockUser();
        } else {
            $user = User::singleton();
        }
        self::$_user = $user;
        return $user;
    }

    /**
     * Explicitly set the user singleton that is being used by the factory
     *
     * @param User $user The user to be returned by the factory
     * 
     * @return User The same user that was passed in.
     */
    function setUser($user)
    {
        self::$_user = $user;
        return $user;
    }

    /**
     * Returns a connected reference to a database handler, or a Mock database
     * that acts as a connected reference to a database handler.
     *
     * @return Database A DB reference
     */
    function database()
    {
        $db_ref = null;
        if ($this->Testing) {
            $db_ref = &self::$_testdb;
            if ($db_ref !== null) {
                return $db_ref;
            }
            Mock::generate("Database");
            self::$_testdb = new MockDatabase();
        } else {
            $db_ref = &self::$_db;
            if ($db_ref !== null) {
                return $db_ref;
            }
            self::$_db = new Database();
        }
        $config = $this->config();
        $dbc = $config->getSetting('database');
        $db_ref->connect(
            $dbc['database'],
            $dbc['username'],
            $dbc['password'],
            $dbc['host'], true
        );
        return $db_ref;
    }

    /**
     * Returns a reference to a Loris CouchDB database wrapper.
     *
     * @return CouchDB CouchDB singleton
     */
    function couchDB()
    {
        if (self::$_couchdb !== null) {
            return self::$_couchdb;
        }
        if ($this->Testing) {
            Mock::generatePartial(
                'CouchDB',
                'MockCouchDBWrap',
                /* mock out the functions that make HTTP requests */
                array('_getRelativeURL', '_postRelativeURL', '_postURL', '_getURL')
            );
            self::$_couchdb = new MockCouchDBWrap();
        } else {
            self::$_couchdb = CouchDB::singleton(); //new CouchDB();
        }
        return self::$_couchdb;
    }
}
?>
