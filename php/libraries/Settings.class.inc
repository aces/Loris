<?php
/**
 * Provides an interface to LORIS configuration settings
 * Wrapper/Proxy to LORIS Config (NDB_Config)
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Wrapper/Proxy to LORIS Config (NDB_Config)
 * Allows easier/more intuitive access to configuration settings.
 *
 * @category Main
 * @package  Loris
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Settings
{
    /**
     * LORIS Configuration object
     *
     * @var NDB_Config
     */
    private $_config;

    /**
     * Database settings
     *
     * @var array containing database name, host, user name and password
     */
    private $_database;

    /**
     * Settings constructor.
     *
     * @param NDB_Config $_config config object
     */
    public function __construct(NDB_Config $_config)
    {
        $this->_config = $_config;
    }

    /**
     * Returns the base URL for LORIS to use to
     * construct URLs in the front end.
     *
     * @return string the URL that LORIS is installed at
     */
    public function getBaseURL(): string
    {
        $url = getenv("LORIS_BASEURL");
        if (!empty($url)) {
            return $url;
        }
        $www = $this->_config->getSetting('www');
        return $www['url'];
    }

    /**
     * Check if sandbox setting is true
     *
     * @return bool true if 'sandbox' config value is equivalent to true
     *              (example of sandbox config values which will
     *                return true: 1, 2 , 3, 'true')
     */
    public function isSandbox(): bool
    {
        return $this->_getBooleanSetting('sandbox');
    }

    /**
     * Get database name from config
     *
     * @return string database name
     * @throws ConfigurationException
     */
    public function dbName(): string
    {
        return $this->_getDatabaseSetting('database');
    }

    /**
     * Get database host from config
     *
     * @return string database host
     * @throws ConfigurationException
     */
    public function dbHost(): string
    {
        return $this->_getDatabaseSetting('host');
    }

    /**
     * Get database user name from config
     *
     * @return string database user name
     * @throws ConfigurationException
     */
    public function dbUserName(): string
    {
        return $this->_getDatabaseSetting('username');
    }

    /**
     * Get database password from config
     *
     * @return string database password
     * @throws ConfigurationException
     */
    public function dbPassword(): string
    {
        return $this->_getDatabaseSetting('password');
    }

    /**
     * Gets given database config
     *
     * @param string $settingName config name
     *                            'database'|'host'|'username'|'password'
     *
     * @return string database config value
     * @throws ConfigurationException
     */
    private function _getDatabaseSetting(string $settingName): string
    {
        if (empty($this->_database)) {
            $this->_database = $this->_config->getSetting('database');
        }

        if (!isset($this->_database[$settingName])) {
            throw new ConfigurationException(
                "No database setting " . $settingName . " found."
            );
        }

        return $this->_database[$settingName];
    }

    /**
     * Evaluates a configuration setting which value should be a boolean
     *
     * @param string $settingName configuration name
     *
     * @return bool true if configuration value is equivalent to true
     *              false otherwise
     */
    private function _getBooleanSetting(string $settingName): bool
    {
        $configVal = $this->_config->getSetting($settingName);

        if (is_bool($configVal) || is_numeric($configVal)) {
            return (boolean)$configVal;
        }

        if (is_string($configVal) && strtolower($configVal) == "true") {
            return true;
        }

        return false;
    }


}
