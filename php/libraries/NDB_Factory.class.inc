<?php
require_once 'NDB_Factory.class.inc';
require_once 'User.class.inc';
require_once 'NDB_Config.class.inc';
require_once 'Database.class.inc';
//require_once 'CouchDB.class.inc';


class NDB_Factory {
    private static $testdb = null;
    private static $db = null;

    private static $couchdb = null;
    private static $user = null;
    var $Testing; // Whether or not Mock objects should be returned instead of
                  // real ones
    function setTesting($val) {
        $this->Testing = $val;
    }

    static function singleton() {
        static $self = null;
        if($self === null) {
            $self = new NDB_Factory();
        }
        return $self;
    }

    function reset() {
        self::$testdb = null;
        self::$db= null;

        self::$couchdb = null;
        self::$user = null;
    }
    function Config() {
        if($this->Testing) {
            Mock::generate("NDB_Config");
            $config = new MockNDB_Config();
        } else {
            $config = new NDB_Config();
        }

        $config->load();
        return $config;
    }

    function User() {
        if(self::$user !== null) {
            return self::$user;
        }
        if($this->Testing) {
            Mock::generate("User");
            $user = new MockUser();
        } else {
            $user = User::singleton();
        }
        self::$user = $user;
        return $user;
    }

    function setUser($user) {
        self::$user = $user;
        return $user;
    }

    function Database() {
        $db_ref = null;
        if($this->Testing) {
            $db_ref = &self::$testdb;
            if($db_ref !== null) {
                return $db_ref;
            }
            Mock::generate("Database");
            self::$testdb = new MockDatabase();
        } else {
            $db_ref = &self::$db;
            if($db_ref !== null) {
                return $db_ref;
            }
            self::$db = new Database();
        }
        $config = $this->Config();
        $dbc = $config->getSetting('database');
        $db_ref->connect($dbc['database'], $dbc['username'], $dbc['password'], $dbc['host'], true);
        return $db_ref;
    }

    function CouchDB() {
        if(self::$couchdb !== null) {
            return self::$couchdb;
        }
        if($this->Testing) {
            Mock::generatePartial('CouchDB', 'MockCouchDBWrap', array('_getRelativeURL', '_postRelativeURL', '_postURL'));
            self::$couchdb = new MockCouchDBWrap();
        } else {
            self::$couchdb = CouchDB::singleton(); //new CouchDB();
        }
        return self::$couchdb;
    }
}
?>
