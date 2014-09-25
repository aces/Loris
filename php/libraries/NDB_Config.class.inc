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
     * The raw array of settings
     * @access private
     */
    var $_settings = array();

    /**
     * The merged array of study and site-specific settings
     * @access private
     */
    var $_siteSettings = array();

    /**
     * An optional override for the location of the config file.
     * (default is ../project/config.xml)
     * @access public
     */
    var $configFilePath;

    /**
     * The singleton design pattern - autoloads config file
     *
     * @param string $configFile the neurodb config.xml config file
     *
     * @return NDB_Config object
     */
    static function &singleton($configFile = "../project/config.xml")
    {
        static $config = null;
        if (is_null($config)) {
            $config  = new NDB_Config();
            $success = $config->load($configFile);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }

        return $config;
    }

    /**
     * Loads config file
     *
     * @param string $configFile the neurodb config.xml config file
     *
     * @return none, but as side-effect loads $this->_settings
     */
    function load($configFile = "../project/config.xml")
    {
        // load the configuration data into a global variable $config
        $newroot         = simplexml_load_file($configFile);
        $this->_settings = NDB_Config::convertToArray($newroot);
    }

    /**
     * Converts a SimpleXMLElement to an array.
     * This is done for backwards compatibility as the old implementation
     * used an external XML library before XML parsing was built into PHP,
     * and this gets it into the same format that was previously used
     * for backwards compatibility.
     *
     * @param SimpleXMLElement $xml The root element of the parsed XML.
     *
     * @return array of XML configuration
     */
    static function convertToArray(SimpleXMLElement $xml)
    {
        $retVal   = array();
        $children = $xml->children();
        if (count($children) > 0) {
            foreach ($children as $child) {
                $name      = $child->getName();
                $tagExists = isset($retVal[$name]);

                $numericArrayExists
                    = isset($retVal[$name])
                    && is_array($retVal[$name])
                    && Utility::NumericArray($retVal[$name]);

                if ($tagExists) {
                    if (!$numericArrayExists) {
                        // The tag is duplicated in the XML, so it should
                        // be stored in an array. Create a new array and replace
                        // the tag with what was already parsed before appending
                        // the child
                        $newArray = array();

                        $Extant        = $retVal[$name];
                        $newArray[]    = $Extant;
                        $retVal[$name] = $newArray;
                    }
                    // Since the tag appears multiple times, append it to the
                    // array instead of directly assigning it.
                    $Converted = NDB_Config::convertToArray($child);

                    $attributes = $child->attributes();
                    if (count($attributes) > 0) {
                        if (!is_array($Converted)) {
                            $Converted = array($Converted);
                        }
                        $Converted['@'] = array();
                        foreach ($attributes as $atname => $val) {
                            $Converted['@'][$atname] = $val->__toString();
                        }
                    }
                    $retVal[$name][] = $Converted;
                } else {
                    $retVal[$name] = NDB_Config::convertToArray($child);
                    $attributes    = $child->attributes();

                    if (count($attributes) > 0) {
                        if (!is_array($retVal[$name])) {
                            $retVal[$name] = array($retVal[$name]);
                        }
                        $retVal[$name]['@'] = array();
                        foreach ($attributes as $atname => $val) {
                            $retVal[$name]['@'][$atname] = $val->__toString();

                        }
                    }
                }
            }
        } else {
            $retVal     = $xml->__toString();
            $attributes = $xml->attributes();
            if (count($attributes) > 0) {
                $retVal = array(
                           '#' => $retVal,
                           '@' => array()
                          );
                foreach ($attributes as $name => $val) {
                    $retVal['@'][$name] = $val->__toString();

                }
            }
            return $retVal;
        }
        return $retVal;
    }

    /**
     * Attempts to determine the site of the user currently logged in and uses
     * that to get site specific settings and override study defaults,
     * building the _siteSettings property
     *
     * @return none, but modifies $this->siteSettings
     */
    function mergeSettings()
    {
        // make sure this is a web client
        if (!class_exists("User") || !isset($_SESSION['State'])) {
            return;
        }

        // make sure a user has logged in
        $username = $_SESSION['State']->getUsername();
        if (empty($username)) {
            $this->_siteSettings =& $this->_settings;
        } else {
            $user     =& User::singleton($username);
            $siteName = Utility::getCleanString($user->getSiteName());
            if (isset($this->_settings['sites'][$siteName])
                && is_array($this->_settings['sites'][$siteName])
            ) {
                $this->_siteSettings          = $this->_settings;
                $this->_siteSettings['study']
                    = Utility::array_merge_recursive_overwriting(
                        $this->_settings['study'],
                        $this->_settings['sites'][$siteName]
                    );
                unset($this->_siteSettings['sites']);
            } else {
                $this->_siteSettings =& $this->_settings;
            }
        }
    }

    /**
     * Gets a setting from the database config tables
     *
     * @param string  $name The name of the config setting to get
     * @param integer $id   (optional) The ID of the config setting we're
     *                      getting to avoid ambiguity.
     *
     * @return string The value from the database, or null if nothing found.
     */
    function getSettingFromDB($name, $id=null)
    {
        // These should never come from the DB
        switch($name) {
        case 'database':
        case 'sandbox':
        case 'showDatabaseQueries':
            return null;
        }

        if (!class_exists("Database")) {
            return null;
        }

        $db = Database::singleton();
        if (Utility::isErrorX($db) || $db->isConnected() !== true) {
            // no database connection, fall back on config.xml
            return PEAR::raiseError(
                "No connection to database while trying to get setting $name"
            );
        }

        // Get the config setting data, either by ID or by Name depending
        // on what was passed
        if ($id === null) {
            $configSetting = $db->pselect(
                "SELECT cs.ID as ParentID, child.ID as ChildID, 
                        cs.AllowMultiple, child.Name 
                FROM ConfigSettings cs 
                    LEFT JOIN ConfigSettings child ON (child.Parent=cs.ID)
                WHERE cs.Name=:nm",
                array("nm" => $name)
            );
        } else {
            $configSetting = $db->pselect(
                "SELECT cs.ID as ParentID, child.ID as ChildID,
                        cs.AllowMultiple, child.Name
                FROM ConfigSettings cs 
                    LEFT JOIN ConfigSettings child ON (child.Parent=cs.ID)
                WHERE cs.ID=:nm",
                array("nm" => $id)
            );
        }

        // If 1 row is returned, there are no children so we just want to
        // get the value from the database.
        // If multiple rows are returned, it means that there are children
        // for this element, so we need to build the tree to be consistent
        // with what would have come from the config.xml.
        if (count($configSetting) === 1) {
            // Trying to get a single value from the database.
            $configSetting = $configSetting[0];
            if ($configSetting['AllowMultiple'] == '0') {
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
                foreach ($val as $item) {
                    $ret[] = $item['Value'];
                }
                return $ret;
            }
        } else if (count($configSetting) > 1) {
            // This was a parent element, so construct the children.
            $tree = array();
            foreach ($configSetting as $childSetting) {
                $childName        = $childSetting['Name'];
                $childID          = $childSetting['ChildID'];
                $childValue       = $this->getSettingFromDB($childName, $childID);
                $tree[$childName] = $childValue;
            }
            return $tree;
        }
        return null;
    }

    /**
     * Gets a config setting from the config.xml, bypassing
     * the database Config tables.
     *
     * @param string $name The name of the XML node to retrieve.
     *
     * @return string The value from the config.xml
     */
    function getSettingFromXML($name)
    {
        if (class_exists("User") && isset($_SESSION['State'])) {
            if (empty($this->_siteSettings)) {
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
        foreach ($settingsArray AS $key=>$value) {
            // see if they want the top level node
            if ($key == $name) {
                return $value;
            }

            // look inside the top level node
            if (isset($value[$name])) {
                return $value[$name];
            }
        }
    }

    /**
    * Gets a setting by name
    *
    * @param string $name The name of the setting to retrieve
    *
    * @return mixed The contents of the node identified by $name
    */
    function getSetting($name)
    {
        $DBValue = $this->getSettingFromDB($name);

        if ($DBValue !== null) {
            return $DBValue;
        }
        // nothing in the database, so get the value from config.xml
        return $this->getSettingFromXML($name);
    }

    /**
     * Get list of Subprojects for this project, given a subprojectID.
     * This is differentiated from the default getSetting() because
     * Subprojects will probably eventually get their own table instead
     * of coming from config.xml
     *
     * @param integer $subprojectID The subprojectID we want the settings
     *                              for
     *
     * @return associative array of settings for this subprojectID
     */
    function getSubprojectSettings($subprojectID)
    {
        // Sub Project
        $subprojectSettings =$this->getSetting('subprojects');

        //Loop through the subprojects to get an id out and to create
        //the subproject drop down.
        foreach (Utility::toArray($subprojectSettings['subproject'])
            AS $subproject
        ) {
            if ($subproject['id']==$subprojectID) {
                return $subproject;
            }
        }
        // no nodes found - returning null
        return null;
    }

    /**
     * Checks if the logged in user has permission for the given
     * $menuID, so that we can determine if the menu should show
     * up for them or not.
     *
     * @param integer $menuID The menuID to check.
     *
     * @return boolean true if the user can access the menu item
     */
    static function CheckMenuPermission($menuID)
    {
        $DB   = Database::singleton();
        $user = User::singleton();

        $perms = $DB->pselect(
            "SELECT code FROM LorisMenuPermissions
                JOIN permissions using (permID) WHERE MenuID=:MID",
            array('MID' => $menuID)
        );

        if (empty($perms)) {
            return true;
        }

        foreach ($perms as $perm) {
            if ($user->hasPermission($perm['code'])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Loads the menu tab structure into an array that can be used by
     * smarty a smarty template. This is done as a static function instead
     * of using $this->getSetting() to give more options for how to load
     * the menus, exactly (config.xml, different database tables, etc..)
     *
     * @param integer $parent The parent ID of the tree. This should not
     *                        be passed. It's used to build the tree recursively
     *                        from the LorisMenu table.
     *
     * @return An array of Label, Visible, Link, and ID to build the menu
     *         for the currently logged in user
     */
    static function GetMenuTabs($parent = null)
    {
        $DB = Database::singleton();
        if ($parent === null) {
            $thisLevel = $DB->pselect(
                "SELECT Label,
                       CASE Visible WHEN 'false' THEN 0 ELSE 1 END as Visible,
                       Link,
                       ID
                  FROM LorisMenu
                  WHERE Parent IS NULL",
                array()
            );
        } else {
            $thisLevel = $DB->pselect(
                "SELECT Label,
                        CASE Visible WHEN 'false' THEN 0 ELSE 1 END as Visible,
                        Link,
                        ID
                  FROM LorisMenu
                  WHERE Parent=:ParentID",
                array('ParentID' => $parent)
            );
            if (NDB_Config::CheckMenuPermission($thisLevel[0]['ID'])) {
                return $thisLevel;
            }
            return;
        }

        foreach ($thisLevel as &$thisRow) {
            $nextLevel = NDB_Config::GetMenuTabs($thisRow['ID']);

            if (!empty($nextLevel)) {
                if (NDB_Config::CheckMenuPermission($nextLevel[0]['ID'])) {
                    $thisRow['subtabs'] = $nextLevel;
                }
            }
        }

        return $thisLevel;
    }

}
?>
