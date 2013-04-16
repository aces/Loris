<?php
/**
 * NeuroDB client - takes care of using the configuration, creating the first database connection, and including a lot of commonly used libraries.  by default does web-appropriate setup (session management and user auth).
 * @version $Id: NDB_Client.class.inc,v 1.7 2006/04/05 17:07:42 sebas Exp $
 * @package main
 */
require_once 'Utility.class.inc';
class NDB_Client
{
    /**
    * defines whether session management and user authentication is performed
    * @access private
    */
    var $_isWebClient = true;

    /**
    * defines that the client is a command line client
    */
    function makeCommandLine()
    {
        $this->_isWebClient = false;
    }

    /**
    * initializes the environment
    */
    function initialize($configFile = "../project/config.xml")
    {
        // require all relevant OO class libraries
        require_once "NDB_Config.class.inc";
        require_once "Database.class.inc";
        require_once "SinglePointLogin.class.inc";
        require_once "State.class.inc";
        require_once "User.class.inc";
        require_once "Site.class.inc";
        require_once 'NDB_Caller.class.inc';

        require_once "Candidate.class.inc";
        require_once "NDB_BVL_Battery.class.inc";
        require_once "NDB_BVL_Instrument.class.inc";
        require_once "NDB_BVL_InstrumentStatus.class.inc";
        require_once "NDB_BVL_LogicTest.class.inc";
        require_once "TimePoint.class.inc";
        require_once "Utility.class.inc";

        require_once "NDB_BVL_Feedback.class.inc";

        $config =& NDB_Config::singleton($configFile);

		// add extra include paths
		$extLibs = $config->getSetting('extLibs');
		if(!empty($extLibs)) set_include_path($extLibs.":".get_include_path());

        // after the extra includes, as those include Smarty
        require_once "Smarty_hook.class.inc";

        /*
        * new DB Object
        */
        $dbConfig = $config->getSetting('database');
        $DB =& Database::singleton($dbConfig['database'], $dbConfig['username'], $dbConfig['password'], $dbConfig['host']);
        if(Utility::isErrorX($DB)) {
            die("Could not connect to database: ".$DB->getMessage());
        }
        $GLOBALS['DB'] =& $DB;
        
	// tell Pear to print errors if the config says so
	if($config->getSetting('showPearErrors')) PEAR::setErrorHandling(PEAR_ERROR_PRINT);
        
        // stop here if this is a command line client
        if(!$this->_isWebClient) return true;
        
        // start php session
        session_start();

        // if exiting, destroy the php session
        if(isset($_REQUEST['logout']) && $_REQUEST['logout']) {
            session_destroy();
            session_start();
        }

        /**
        * Log In procedures
        */
        if(!isset($_SESSION['State'])) {
            $_SESSION['State'] =& State::singleton();
            $login = new SinglePointLogin();
            $_SESSION['State']->setProperty('login', $login);
        } else {
            $login =& $_SESSION['State']->getProperty('login');
        }
        if (!$login->isLoggedIn()) {
            $auth = $login->authenticate();
            if(Utility::isErrorX($auth)) {
            } elseif($auth === true) {
                $error = $login->setState();
            } elseif($auth === false) {
                $login->clearState();
            }
        }
        if(!$login->isLoggedIn()) {
            // display login window
            //ob_end_clean();
            $login->showLoginScreen();
            //terminate script
            die();
        }
        
        $user =& User::singleton($_SESSION['State']->getUsername());
        if(Utility::isErrorX($user)) {
             die("Could not validate user: ".$user->getMessage());
        }

        // finished initializing
        return true;
    }
}
?>
