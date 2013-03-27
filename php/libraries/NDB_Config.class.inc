<?php
require_once "PEAR.php";
require_once "Utility.class.inc";
/**
 * provides an interface to the NeuroDB configuration
 * @access public
 * @version $Id: NDB_Config.class.inc,v 1.9 2007/03/16 20:48:33 sebas Exp $
 * @package main
 */
class NDB_Config
{
    /**
    * the raw array of settings
    * @access private
    */
    var $_settings = array();
    
    /**
    * the merged array of study and site-specific settings
    * @access private
    */
    var $_siteSettings = array();

    /**
    * an optional override for the location of the config file.  (default is ../project/config.xml)
    * @access public
    */
    var $configFilePath;
    
    /**
    * the singleton design pattern - autoloads config file
    * @return object   a NDB_Config object
    */
    static function &singleton($configFile = "../project/config.xml")
    {
        static $config = null;
        if(is_null($config)) {
            $config = new NDB_Config();
            $success = $config->load($configFile);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }

        return $config;
    }

    /**
    * loads config file
    */
    function load($configFile = "../project/config.xml")
    {
        // PEAR::Config
        require_once "Config.php";

        // load the configuration data into a global variable $config
        $configObj = new Config;
        $root =& $configObj->parseConfig($configFile, "XML");
        if(Utility::isErrorX($root)) {
            die("Config error: ".$root->getMessage());
        }
        $configObj = $root->searchPath(array('config'));
        $this->_settings = $configObj->toArray();
        $this->_settings = $this->_settings['config'];
        unset($configObj, $root);
    }

    /**
    * attempts to determine the site of the user currently logged in and uses that to get site specific settings and override study defaults, building the _siteSettings property
    */
    function mergeSettings()
    {
        // make sure this is a web client
        if(!class_exists("User") || !isset($_SESSION['State'])) {
            return;
        }

        // make sure a user has logged in
        $username = $_SESSION['State']->getUsername();
        if(empty($username)) {
            $this->_siteSettings =& $this->_settings;
        } else {
            $user =& User::singleton($username);
            $siteName = Utility::getCleanString($user->getSiteName());
            if(is_array($this->_settings['sites'][$siteName])) {
                $this->_siteSettings = $this->_settings;
                $this->_siteSettings['study'] = Utility::array_merge_recursive_overwriting($this->_settings['study'], $this->_settings['sites'][$siteName]);
                unset($this->_siteSettings['sites']);
            } else {
                $this->_siteSettings =& $this->_settings;
            }
        }
    }

    /**
    * gets a setting by node name (top level only!)
    * @return mixed     the contents of the node identified by $name
    * @param string $name   the name of the node
    */
    function getSetting($name)
    {
        
        // if we know the user
        if(class_exists("User") && isset($_SESSION['State'])) {
            if(empty($this->_siteSettings)) {
                // merge site and study settings
                $this->mergeSettings();
            }

            // look at the merged site settings
            $settingsArray =& $this->_siteSettings;
        } else {
            // by default, look at the raw settings
            $settingsArray =& $this->_settings;
        }
        
        // loop over the settings, and find the node
        foreach($settingsArray AS $key=>$value) {
            // see if they want the top level node
            if($key == $name) return $value;
            
            // look inside the top level node
            if(isset($value[$name])) return $value[$name];
        }
        
        // no nodes found - returning null
        return null;
    }
    
    function getSubprojectSettings($subprojectID){
    	// Sub Project
    	$subprojectSettings=$this->getSetting('subprojects');

    	//Loop through the subprojects to get an id out and to create the subproject drop down.
    	foreach(Utility::toArray($subprojectSettings['subproject']) AS $subproject){
    		if($subproject['id']==$subprojectID){
    			return $subproject;
    		}
    		
    	}
    	 // no nodes found - returning null
    	return null;
    }
  
}
?>
