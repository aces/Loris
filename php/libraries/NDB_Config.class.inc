<?php declare(strict_types=1);
/**
 * Provides an interface to the NeuroDB configuration
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

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
     *
     * @access private
     */
    var $_settings = array();

    /**
     * An optional override for the location of the config file.
     * (default is ../project/config.xml)
     *
     * @access public
     */
    var $configFilePath;

    /**
     * The singleton design pattern - autoloads config file
     *
     * @param string|null $configFile the neurodb config.xml config file
     *
     * @return \NDB_Config object
     */
    static function &singleton(?string $configFile = null): \NDB_Config
    {
        static $config = null;
        if (is_null($config)) {

            $config = new NDB_Config();

            if ($configFile === null) {
                // Can't directly check !empty because of a bug
                // in PHP < 5.5, need to assign to a variable first
                $configFile = $config->configFilePath();
            }

            // Load the file
            $config->load($configFile);

            if (!empty($config->_settings['include'])) {
                // Load all includes found in the config
                $includes = Utility::asArray($config->_settings['include']);
                foreach ($includes as $path) {
                    $config->load($config->configFilePath($path));
                }
            }
        }

        return $config;
    }

    /**
     * Loads config file
     *
     * @param string $configFile the neurodb config.xml config file
     *
     * @return void (but as side-effect loads $this->_settings)
     *
     * @throws Exception
     */
    function load(string $configFile = "../project/config.xml"): void
    {
        // load the configuration data into a global variable $config
        $newroot = simplexml_load_file($configFile);

        if ($newroot === false || $newroot === null) {
            throw new Exception(
                "Could not load Loris config file $configFile"
            );
        }

        $this->_settings += NDB_Config::convertToArray($newroot);
    }

    /**
     * Takes a path and checks if file exists under all locations where config file
     * can exist.
     *
     * @param string $pathToFile relative file path or file name
     *
     * @return string  absolute path of config file
     *
     * @throws LorisException when any config file is missing
     */
    function configFilePath(string $pathToFile = "config.xml"): string
    {
        // first check for a project/config.xml, then check for the config
        // file in a standard unix filesystem location ->  /etc/loris/config.xml

        $env = getenv('LORIS_DB_CONFIG');
        if (!empty($env)) {
            $file = $env;
        } else if (file_exists(__DIR__ . "/../../project/$pathToFile")) {
            // "Classic" Loris location of project directory
            // parallel to php directory
            $file = __DIR__ . "/../../project/$pathToFile";
        } else if (file_exists("/etc/loris/$pathToFile")) {
            // Standard Unix filesystem layout
            $file = "/etc/loris/$pathToFile";
        } else if (file_exists("/usr/local/etc/loris/$pathToFile")) {
            // Standard Unix filesystem layout, option 2
            $file = "/usr/local/etc/loris/$pathToFile";
        } else if (file_exists($pathToFile)) {
            // Absolute path given
            $file = $pathToFile;
        } else {
            throw new ConfigurationException(
                "Config file $pathToFile does not exist in the defined locations."
            );
        }

        return $file;
    }


    /**
     * Converts a SimpleXMLElement to an array.
     * This is done for backwards compatibility as the old implementation
     * used an external XML library before XML parsing was built into PHP,
     * and this gets it into the same format that was previously used
     * for backwards compatibility.
     *
     * FIXME Despite the name, this function does not just return arrays, but
     * also returns a string. Crucially, this is done in the process of creating
     * a DB connection and so we cannot add a return type to this function.
     * Future refactoring should be done to better encapsulate this logic to
     * allow for strong typing.
     *
     * @param SimpleXMLElement $xml The root element of the parsed XML.
     *
     * @return array of XML configuration
     */
    static function convertToArray(SimpleXMLElement $xml)
    {
        $retVal   = array();
        $children = $xml->children();
        if ($children->count() > 0) {
            foreach ($children as $child) {
                $name      = $child->getName();
                $tagExists = isset($retVal[$name]) && is_array($retVal[$name]);
                if ($tagExists) {
                    if (!self::isNumericArray($retVal[$name])) {
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
            if ($attributes->count() > 0) {
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
     * Determine whether an array is a numeric (normal) array, i.e. its keys
     * are 0, 1, ..., n - 1.
     * If an empty array is passed as $arr, this function will return true.
     *
     * @param array $arr The array to be checked for numeric keys.
     *
     * @return boolean True if the given parameter is an array with
     *                 numeric keys, false otherwise.
     */
    static function isNumericArray(array $arr): bool
    {
        if ($arr === array()) {
            return true;
        }
        return array_keys($arr) === range(0, count($arr) - 1);
    }

    /**
     * Gets a setting from the database config tables
     *
     * FIXME This function currently returns a string, array, or null.
     * Refactoring should be done to better encapsulate the logic in this
     * function to allow for strong typing.
     *
     * @param string   $name The name of the config setting to get
     * @param int|null $id   (optional) The ID of the config setting we're
     *                       getting to avoid ambiguity.
     *
     * @return mixed The value from the database, or null if nothing found.
     */
    function getSettingFromDB(string $name, ?int $id = null)
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

        $factory = NDB_Factory::singleton();

        $db = $factory->database();
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
                $childValue       = $this->getSettingFromDB(
                    $childName,
                    intval($childID)
                );
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
     * @return array|string The value from the config.xml
     */
    function getSettingFromXML(string $name)
    {
        // loop over the settings, and find the node
        foreach ($this->_settings as $key => $value) {
            // see if they want the top level node
            if ($key == $name) {
                return $value;
            }

            // Look inside the top level node
            if (isset($value[$name])) {
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
    function getSetting(string $name)
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
     * Helper function to determine whether a setting with a boolean value is
     * enabled, i.e. equal to "true".
     * Since settings are returned as strings, this must be done as a string
     * comparison.
     *
     * @param string $name The name of the setting to retrieve. This setting
     *                      should have a boolean value in the config file or DB.
     *
     * @return bool True if the setting is equal to "true".
     */
    function settingEnabled(string $name): bool
    {
        $val = $this->getSetting($name);
        return $val === 'true' || $val === '1';
    }

    /**
     * Get list of projects for this projects, given a ProjectID.
     *
     * @param integer $ProjectID The ProjectID we want settings for
     *
     * @return ?array of settings for this project or null in case of error.
     */
    function getProjectSettings(int $ProjectID): ?array
    {
        try {
            $info = \NDB_Factory::singleton()
                ->database()
                ->pselectRow(
                    "SELECT * FROM Project WHERE ProjectID=:sp",
                    array('sp' => $ProjectID)
                );
        } catch (\DatabaseException $e) {
            return null;
        }
        //Format the result into config.xml format.
        return is_null($info) ?
            null
            : array(
                'id'                => $info['ProjectID'],
                'Name'              => $info['Name'],
                'recruitmentTarget' => $info['recruitmentTarget'],
            );
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
     * @return array of settings for this subprojectID
     */
    function getSubprojectSettings(int $subprojectID): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        $info = $DB->pselectRow(
            "SELECT * FROM subproject WHERE SubprojectID=:sp",
            array('sp' => $subprojectID)
        );
        // Format the results the same way it was formatted in config.xml
        // This variable assignment was done for phpcs... if anyone figures out
        // a way around this, please correct it
        if (!empty($info)) {
            $x = $info['WindowDifference'];
            return array(
                'id'                => $info['SubprojectID'],
                'title'             => $info['title'],
                'options'           => array(
                    'useEDC'           => $info['useEDC'],
                    'WindowDifference' => $x,
                ),
                'RecruitmentTarget' => $info['RecruitmentTarget'],
            );
        }
        return array();
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
    static function checkMenuPermission(int $menuID): bool
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        $user = $factory->user();

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
     * @param int|null $parent The parent ID of the tree. This should not
     *                         be passed. It's used to build the tree recursively
     *                         from the LorisMenu table.
     *
     * @return array          Label, Visible, Link, and ID to build the menu
     *                        for the currently logged in user
     */
    static function getMenuTabs(?int $parent = null): array
    {
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

        if ($parent === null) {
            $thisLevel = $DB->pselect(
                "SELECT Label,
                       CASE Visible WHEN 'false' THEN 0 ELSE 1 END as Visible,
                       Link,
                       ID
                  FROM LorisMenu
                  WHERE Parent IS NULL AND (Visible = 'true' OR Visible IS NULL)
                  ORDER BY OrderNumber",
                array()
            );

            foreach ($thisLevel as &$thisRow) {
                $nextLevel = NDB_Config::getMenuTabs(intval($thisRow['ID']));

                if (!empty($nextLevel)) {
                    $thisRow['subtabs'] = $nextLevel;
                }
            }

            return $thisLevel;
        } else {
            $thisLevel = $DB->pselect(
                "SELECT Label,
                        CASE Visible WHEN 'false' THEN 0 ELSE 1 END as Visible,
                        Link,
                        ID
                  FROM LorisMenu
                  WHERE Parent=:ParentID AND (Visible = 'true' OR Visible IS NULL)
                  ORDER BY OrderNumber",
                array('ParentID' => $parent)
            );

            $LevelWithPerm = array_filter(
                $thisLevel,
                function ($el) {
                    return NDB_Config::checkMenuPermission(intval($el['ID']));
                }
            );

            if (!empty($LevelWithPerm)) {
                return $LevelWithPerm;
            }
            return array();
        }
    }

    /**
     * Retrieve a set of links to display to the user
     *
     * @param string $type The type of links to show
     *
     * @return array of Label => URL
     */
    function getExternalLinks(string $type): array
    {
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        $results = $db->pselect(
            "SELECT LinkText, LinkURL
                FROM ExternalLinks l JOIN ExternalLinkTypes lt
                    ON (l.LinkTypeID=lt.LinkTypeID)
                WHERE lt.LinkType=:name",
            array('name' => $type)
        );

        $mapped = array();
        foreach ($results as $row) {
            $mapped[$row['LinkText']] = $row['LinkURL'];
        }
        return $mapped;
    }

}

