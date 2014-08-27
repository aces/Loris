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

        // load the configuration data into a global variable $config
        /*
        // PEAR::Config
        require_once "Config.php";
        $configObj = new Config;
        $root =& $configObj->parseConfig($configFile, "XML");
        if(Utility::isErrorX($root)) {
            die("Config error: ".$root->getMessage());
        } 
        
        $configObj = $root->searchPath(array('config'));
        $arr = $configObj->toArray(); 
        $this->_settings = $this->_settings['config'];
         */

        $newroot = simplexml_load_file($configFile);
        //$arr2 = NDB_Config::ConvertToArray($newroot);
        $this->_settings = NDB_Config::ConvertToArray($newroot); //$this->_settings['config'];
        //unset($configObj, $root);
    }

    static function ConvertToArray(SimpleXMLElement $xml) {
        $retVal = array();
        $children = $xml->children();
        if(count($children) > 0) {
            foreach ($children as $child) {
                $name = $child->getName();
                $tagExists = isset($retVal[$name]);

                $numericArrayExists = 
                    isset($retVal[$name]) 
                    && is_array($retVal[$name])
                    && Utility::NumericArray($retVal[$name])
                    ;

                if($tagExists) {
                    if(!$numericArrayExists) {
                        // The tag is duplicated in the XML, so it should
                        // be stored in an array. Create a new array and replace
                        // the tag with what was already parsed before appending
                        // the child
                        $newArray = array();

                        $Extant = $retVal[$name];
                        $newArray [] = $Extant;
                        $retVal[$name] = $newArray;
                    } 
                    // Since the tag appears multiple times, append it to the
                    // array instead of directly assigning it.
                    $Converted = NDB_Config::ConvertToArray($child);

                    $attributes = $child->attributes();
                    if(count($attributes) > 0) {
                        if(!is_array($Converted)) {
                            $Converted = array($Converted);
                        }
                        $Converted['@'] = array();
                        foreach($attributes as $atname => $val) {
                            $Converted['@'][$atname] = $val->__toString();
                        }
                    }
                    $retVal[$name][] = $Converted;
                } else {
                    $retVal[$name] = NDB_Config::ConvertToArray($child);
                    $attributes = $child->attributes();

                    if(count($attributes) > 0) {
                        if(!is_array($retVal[$name])) {
                            $retVal[$name] = array($retVal[$name]);
                        }
                        $retVal[$name]['@'] = array();
                        foreach($attributes as $atname => $val) {
                            $retVal[$name]['@'][$atname] = $val->__toString();

                        }
                    }
                }
            }
        } else {
            $retVal = $xml->__toString();
            $attributes = $xml->attributes();
            if(count($attributes) > 0) {
                $retVal = array('#' => $retVal, '@' => array());
                foreach($attributes as $name => $val) {
                    $retVal['@'][$name] = $val->__toString();
                    
                }
            }
            return $retVal;
        }
        return $retVal;
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
            if(isset($this->_settings['sites'][$siteName]) && is_array($this->_settings['sites'][$siteName])) {
                $this->_siteSettings = $this->_settings;
                $this->_siteSettings['study'] = Utility::array_merge_recursive_overwriting($this->_settings['study'], $this->_settings['sites'][$siteName]);
                unset($this->_siteSettings['sites']);
            } else {
                $this->_siteSettings =& $this->_settings;
            }
        }
    }

    function getSettingFromDB($name, $id=null) {
        // These should never come from the DB
        switch($name) {
        case 'database':
        case 'sandbox':
        case 'showDatabaseQueries':
            return null;
        }

        if(!class_exists("Database")) {
            return null;
        }

        $db = Database::singleton();
        if (Utility::isErrorX($db) || $db->isConnected() !== true) {
            // no database connection, fall back on config.xml
            return PEAR::raiseError("No connection to database while trying to get setting $name");
        }

        // If 1 row is returned, there are no children so we just want to get the value
        // from the database.
        // If multiple rows are returned, it means that there are children for this element,
        // so we need to build the tree to be consistent with what would have come from the
        // config.xml.
        if($id === null) {
            $configSetting = $db->pselect("SELECT cs.ID as ParentID, child.ID as ChildID, cs.AllowMultiple, child.Name FROM ConfigSettings cs LEFT JOIN ConfigSettings child ON (child.Parent=cs.ID) WHERE cs.Name=:nm", array("nm" => $name));
        } else {
            $configSetting = $db->pselect("SELECT cs.ID as ParentID, child.ID as ChildID, cs.AllowMultiple, child.Name FROM ConfigSettings cs LEFT JOIN ConfigSettings child ON (child.Parent=cs.ID) WHERE cs.ID=:nm", array("nm" => $id));
        }

        if(count($configSetting) === 1) {
            // Trying to get a single value from the database.
            $configSetting = $configSetting[0];
            if($configSetting['AllowMultiple'] == '0') {
                $val = $db->pselectOne(
                    "SELECT Value FROM Config WHERE ConfigID=:CID", 
                    array('CID' => $configSetting['ParentID'])
                );
                return $val;
            } else {
                // Allows multiple, but has no child elements. Was called
                // as ie. $config->getSetting("DoubleDataEntryInstruments")
                $val = $db->pselect(
                    "SELECT Value FROM Config WHERE ConfigID=:CID", 
                    array('CID' => $configSetting['ParentID'])
                );
                $ret = array();
                foreach($val as $item) {
                    $ret[] = $item['Value'];
                }
                return $ret;
            }
        } else if(count($configSetting) > 1) {
            // This was a parent element, so construct the children.
            $tree = array();
            foreach($configSetting as $childSetting) {
                $childName = $childSetting['Name'];
                $childID   = $childSetting['ChildID'];
                $childValue = $this->getSettingFromDB($childName, $childID);
                $tree[$childName] = $childValue;
            }
            return $tree;
        }
        return null;
    }

    /**
    * gets a setting by node name (top level only!)
    * @return mixed     the contents of the node identified by $name
    * @param string $name   the name of the node
    */
    function getSetting($name)
    {
        $DBValue = $this->getSettingFromDB($name);

        if($DBValue !== null) {
            return $DBValue;
        }
        
        /*
        if(class_exists("Database")) {
            $db = Database::singleton();
            
            if(!Utility::isErrorX($db) && $db->isConnected() === true) {
                $configSetting = $this->getSettingFromDB($name);

                $configSetting = $db->pselect("SELECT cs.ID, cs.AllowMultiple FROM ConfigSettings cs WHERE Name=:nm", array("nm" => $name));

                if(count($configSettings) > 1) {
                    // It is a parent with child elements.
                    return $dbval[0]['Value'];
                } else if (count($configSettings) == 1) {
                    // It is all alone.
                }
            } 
        }
         */

        // nothing in the database, so get the value from config.xml

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

    static function CheckMenuPermission($menuID) {
        $DB = Database::singleton();
        $user = User::singleton();

        $perms = $DB->pselect(
            "SELECT code FROM LorisMenuPermissions 
                JOIN permissions using (permID) WHERE MenuID=:MID",
            array('MID' => $menuID)
        );

        if(empty($perms)) {
            return true;
        }

        foreach($perms as $perm) {
            if ($user->hasPermission($perm['code'])) {
                return true;
            }
        }
        return false;
    }
    static function GetMenuTabs($parent = null) {
        $DB = Database::singleton();
        if($parent === null) {
            $thisLevel = $DB->pselect("SELECT Label, CASE Visible WHEN 'false' THEN 0 ELSE 1 END as Visible, Link, ID FROM LorisMenu WHERE Parent IS NULL", array());
        } else {
            $thisLevel = $DB->pselect("SELECT Label, CASE Visible WHEN 'false' THEN 0 ELSE 1 END as Visible, Link, ID FROM LorisMenu WHERE Parent=:ParentID ", array('ParentID' => $parent));
            if(NDB_Config::CheckMenuPermission($thisLevel[0]['ID'])) {
                return $thisLevel;
            }
            return;
        }

        foreach($thisLevel as &$thisRow) {
            $nextLevel = NDB_Config::GetMenuTabs($thisRow['ID']);

            if(!empty($nextLevel)) {
                if(NDB_Config::CheckMenuPermission($nextLevel[0]['ID'])) {
                    $thisRow['subtabs'] = $nextLevel;
                }
            }
        }

        return $thisLevel;
    }
  
}
?>
