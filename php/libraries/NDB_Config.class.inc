<?php
/**
 * Provides an interface to the NeuroDB configuration
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once "PEAR.php";
require_once "Utility.class.inc";
/**
 * This class provides a generic interface to Loris configuration.
 * Generally, the way to use it is to use NDB_Config::singleton() to
 * get the config object, and then call $config->getSetting() to get
 * the variable we're interested in.
 *
 * NDB_Config will do all necessary checking of config.xml, ConfigSetting
 * table, etc to get the value of the setting.
 *
 * Some special variables that have their own database table (ie. MenuTabs
 * or Subprojects) have special static functions to get the specific settings.
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
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
    static function &singleton($configFile = null)
    {
        static $config = null;
        if (is_null($config)) {
            // If calling singleton without any parameter, first check
            // for a project/config.xml, then check for the config
            // file in a standard unix filesystem location.
            // /etc/loris/config.xml
            if ($configFile === null) {
                // Can't directly check !empty because of a bug
                // in PHP < 5.5, need to assign to a variable first
                $env = getenv('LORIS_DB_CONFIG');
                if (!empty($env)) {
                    $configFile = $env;
                } else if (file_exists(__DIR__ . "/../../project/config.xml")) {
                    // "Classic" Loris location of project directory
                    // parallel to php directory
                    $configFile = __DIR__ . "/../../project/config.xml";
                } else if (file_exists("/etc/loris/config.xml")) {
                    // Standard Unix filesystem layout
                    $configFile = "/etc/loris/config.xml";
                } else if (file_exists("/usr/local/etc/loris/config.xml")) {
                    // Standard Unix filesystem layout, option 2
                    $configFile = "/usr/local/etc/loris/config.xml";
                }
            }

            // Load the file
            $config  = new NDB_Config();
            $success = $config->load($configFile);
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
        $newroot = simplexml_load_file($configFile);

        if ($newroot === false || $newroot === null) {
            throw new Exception(
                "Could not load Loris config file $configFile"
            );
        }

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
                           '@' => array(),
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
                    = Utility::arrayMergeRecursiveOverwriting(
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
        if ($db->isConnected() !== true) {
            // no database connection, fall back on config.xml
            throw new DatabaseException(
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

            if (count($configSetting) === 0) {
                throw new ConfigurationException(
                    "Config setting $name does not exist in database"
                );
            }
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
                if (empty($val)) {
                    return null;
                }
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

            // Look inside the top level node
            // is_array is called before the isset check. This is done to
            // fix an undesirable feature of isset: it would sometimes
            // return true is $value was not an array (see isset PHP doc)
            // in PHP <= 5.3. This behavior was changed for PHP > 5.3.
            if (is_array($value) && isset($value[$name])) {
                return $value[$name];
            }
        }
        // Nothing was found, this is an error.
        throw new ConfigurationException("No setting $name in config.xml");
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
        try {
            $XMLValue = $this->getSettingFromXML($name);

            if ($XMLValue !== null) {
                return $XMLValue;
            }
        } catch(ConfigurationException $e) {
            // There was no config in the database with this
            // name. It may exist in the XML, so we handle this
            // silently.
        }

        // nothing in the config file, so get the value from the DB
        // This will throw a ConfigurationException if it does not
        // exist.
        return $this->getSettingFromDB($name);
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
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        try {
            $info = $DB->pselectRow(
                "SELECT * FROM subproject WHERE SubprojectID=:sp",
                array('sp' => $subprojectID)
            );
        } catch(DatabaseException $e) {
            return null;
        }
        // Format the results the same way it was formatted in config.xml
        return array(
                'id'      => $info['SubprojectID'],
                'title'   => $info['title'],
                'options' => array(
                              'useEDC'           => $info['useEDC'],
                              'WindowDifference' => $info['WindowDifference'],
                             ),
               );
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
    static function checkMenuPermission($menuID)
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
    static function getMenuTabs($parent = null)
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

            $LevelWithPerm = array_filter(
                $thisLevel,
                function ($el) {
                    return NDB_Config::checkMenuPermission($el['ID']);
                }
            );

            if (!empty($LevelWithPerm)) {
                return $LevelWithPerm;
            }
            return;
        }

        foreach ($thisLevel as &$thisRow) {
            $nextLevel = NDB_Config::getMenuTabs($thisRow['ID']);

            if (!empty($nextLevel)) {
                if (NDB_Config::checkMenuPermission($nextLevel[0]['ID'])) {
                    $thisRow['subtabs'] = $nextLevel;
                }
            }
        }

        return $thisLevel;
    }

}
?>
