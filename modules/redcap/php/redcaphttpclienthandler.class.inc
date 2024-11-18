<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

use LORIS\redcap\REDCapHTTPClient;
use LORIS\redcap\configurations\RedcapConfiguration;
use LORIS\redcap\configurations\RedcapConfigurationParser;
use LORIS\redcap\configurations\RedcapConfigurationInstance;


/**
 * This reprensents a REDCap client handler.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapHTTPClientHandler
{
    /**
     * A Loris instance
     *
     * @var \LORIS\LorisInstance
     */
    private \LORIS\LorisInstance $_loris;

    /**
     * Verbose mode.
     *
     * @var bool
     */
    private bool $_verbose;

    /**
     * Instances defined in configuration.
     *
     * @var RedcapConfiguration
     */
    private RedcapConfiguration $_config;

    /**
     * REDCap HTTP Client instances, linked to connection.
     * Organized by instance name, and project ID.
     *
     * @var array
     */
    private array $_clientInstances;

    /**
     * Singleton.
     *
     * @var
     */
    private static $_instance;

    /**
     * Constructor.
     *
     * @param \LORIS\LorisInstance $loris   a loris instance
     * @param bool                 $verbose verbose mode
     */
    private function __construct(
        \LORIS\LorisInstance $loris,
        bool $verbose = false
    ) {
        $this->_loris           = $loris;
        $this->_verbose         = $verbose;
        $this->_clientInstances = [];

        $rc            = RedcapConfigurationParser::factory(
            $loris,
            $verbose
        );
        $this->_config = $rc->getConfig();
    }

    /**
     * Factory for singleton instance.
     *
     * @param \LORIS\LorisInstance $loris   a loris instance
     * @param bool                 $verbose verbose mode
     *
     * @return RedcapHTTPClientHandler
     */
    public static function &factory(
        \LORIS\LorisInstance $loris,
        bool $verbose = false
    ): RedcapHTTPClientHandler {
        if (!isset(self::$_instance)) {
            self::$_instance = new self($loris, $verbose);
        }
        return self::$_instance;
    }

    /**
     * Get the REDCap assignee from the configuration.
     *
     * @return \User
     */
    public function getAssignee(): \User
    {
        return $this->_config->getAssignee();
    }

    /**
     * Tells if an instance name and project ID exist and are linked.
     *
     * @param string $redcapName a REDCap instance name
     * @param string $pid        a REDCap project ID
     *
     * @return bool true if they exist and are linked, else false
     */
    public function hasInstanceProjectByName(
        string $redcapName,
        string $pid
    ): bool {
        $redcapInstance = $this->_config->getInstanceByName($redcapName);
        return !is_null($redcapInstance)
            && $redcapInstance->hasProject($pid);
    }

    /**
     * Tells if an instance URL and project ID exist and are linked.
     *
     * @param string $redcapURL a REDCap instance URL
     * @param string $pid       a REDCap project ID
     *
     * @return bool true if they exist and are linked, else false
     */
    public function hasInstanceProjectByURL(
        string $redcapURL,
        string $pid
    ): bool {
        $redcapInstance = $this->_config->getInstanceByURL($redcapURL);
        return !is_null($redcapInstance)
            && $redcapInstance->hasProject($pid);
    }

    /**
     * Get a REDCapHTTPClient from the configuration based on the instance URL.
     *
     * @param string $redcapInstanceURL a REDCap instance URL
     * @param string $pid               a project ID accessible in the instance
     *
     * @throws \LorisException
     *
     * @return REDCapHTTPClient
     */
    public function getClientByURL(
        string $redcapInstanceURL,
        string $pid
    ): REDCapHTTPClient {
        // checks
        $redcapInstance = $this->_config->getInstanceByURL($redcapInstanceURL);
        if (is_null($redcapInstance)) {
            throw new \LorisException(
                "[redcap] no instance found with URL '$redcapInstanceURL'."
            );
        }
        return $this->_getClient($redcapInstance, $pid);
    }

    /**
     * Get a REDCapHTTPClient from the configuration based on the instance name.
     *
     * @param string $redcapInstanceName a REDCap instance URL
     * @param string $pid                a project ID accessible in the instance
     *
     * @throws \LorisException
     *
     * @return REDCapHTTPClient
     */
    public function getClientByName(
        string $redcapInstanceName,
        string $pid
    ): REDCapHTTPClient {
        // checks
        $redcapInstance = $this->_config->getInstanceByName($redcapInstanceName);
        if (is_null($redcapInstance)) {
            throw new \LorisException(
                "[redcap] no instance found with URL '$redcapInstanceName'."
            );
        }
        return $this->_getClient($redcapInstance, $pid);
    }

    /**
     * Build a REDCap HTTP Client from configurations.
     *
     * @param RedcapConfigurationInstance $redcapInstance a redcap instance
     * @param string                      $pid            a project ID
     *
     * @throws \LorisException
     *
     * @return REDCapHTTPClient
     */
    private function _getClient(
        RedcapConfigurationInstance $redcapInstance,
        string $pid
    ): REDCapHTTPClient {
        $iname         = $redcapInstance->getName();
        $redcapProject = $redcapInstance->getProject($pid);
        if (is_null($redcapProject)) {
            throw new \LorisException(
                "[redcap] no project '$pid' found for instance '$iname'."
            );
        }

        // check if the client instance exists, if not create it.
        $rc = $this->_clientInstances[$iname][$pid] ?? null;
        if (is_null($rc)) {
            // create new REDCap client instance
            if (!isset($this->_clientInstances[$iname])) {
                $this->_clientInstances[$iname] = [];
            }

            // add instance project client
            $rc = new REDCapHTTPClient(
                $this->_loris,
                $redcapInstance->getAPI(),
                $pid,
                $redcapProject->getToken(),
                false
            );

            // duplicate the client
            $this->_clientInstances[$iname][$pid] = $rc;
        }
        return $rc;
    }
}