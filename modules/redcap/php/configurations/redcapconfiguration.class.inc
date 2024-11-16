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

namespace LORIS\redcap\configurations;


/**
 * This represents a REDCap configuration.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfiguration
{
    /**
     * A LORIS User object.
     *
     * @var \User
     */
    private \User $_assignee;

    /**
     * A list of REDCap instances.
     *
     * @var RedcapConfigurationInstance[]
     */
    private array $_instances;

    /**
     * Constructor.
     *
     * @param \User $user a LORIS User
     */
    public function __construct(\User $user)
    {
        $this->_assignee  = $user;
        $this->_instances = [];
    }

    /**
     * Get the main assignee for all issues.
     *
     * @return \User
     */
    public function getAssignee(): \User
    {
        return $this->_assignee;
    }

    /**
     * Add a new REDCap instance.
     *
     * @param string $name the instance name
     * @param string $url  the instance url
     *
     * @return void
     */
    public function addInstance(string $name, string $url): void
    {
        if ($this->hasInstanceName($name)) {
            throw new \LorisException(
                "[redcap][config] instance '$name' already exists."
            );
        }
        $this->_instances[$name] = new RedcapConfigurationInstance($name, $url);
    }

    /**
     * Get a REDCap instance by name.
     *
     * @param string $instanceName the instance name
     *
     * @return ?RedcapConfigurationInstance a REDCap instance or null.
     */
    public function getInstanceByName(
        string $instanceName
    ): ?RedcapConfigurationInstance {
        return $this->_instances[$instanceName] ?? null;
    }

    /**
     * Get a REDCap instance by URL.
     *
     * @param string $instanceURL the instance URL
     *
     * @return ?RedcapConfigurationInstance a REDCap instance or null.
     */
    public function getInstanceByURL(
        string $instanceURL
    ): ?RedcapConfigurationInstance {
        // normalize the given URL
        $searchedURL = self::_normalizeURL($instanceURL);
        $i           = null;
        foreach ($this->_instances as $instance) {
            // normalize instance URL
            $iURL = self::_normalizeURL($instance->getURL());
            // compare
            if ($iURL === $searchedURL) {
                $i = $instance;
                break;
            }
        }
        return $i;
    }

    /**
     * Normalize URL by removing the trailing slash.
     *
     * @param string $url URL to normalize
     *
     * @return string normalized URL
     */
    private static function _normalizeURL(string $url): string
    {
        return str_ends_with($url, '/') ? substr($url, 0, strlen($url)-1) : $url;
    }

    /**
     * Tells if a REDCap instance name exists.
     *
     * @param string $instanceName the instance name
     *
     * @return bool true if the instance exists, else false.
     */
    public function hasInstanceName(string $instanceName): bool
    {
        return !is_null($this->getInstanceByName($instanceName));
    }

    /**
     * Add a REDCap proejct to a REDCap instance.
     *
     * @param string $instanceName a REDCap instance name
     * @param string $projectID    a REDCap project ID
     * @param string $projectToken a REDCap project token
     *
     * @throws \LorisException
     *
     * @return void
     */
    public function addProjectToInstance(
        string $instanceName,
        string $projectID,
        string $projectToken
    ): void {
        if (!$this->hasInstanceName($instanceName)) {
            throw new \LorisException(
                "[redcap][config] instance '$instanceName' does not exist."
            );
        }
        $this->_instances[$instanceName]->addProject($projectID, $projectToken);
    }

    /**
     * Iterator on REDCap instances.
     *
     * @return \Iterator
     */
    public function yieldInstances(): \Iterator
    {
        yield from $this->_instances;
    }

    /**
     * Tells if at least one instance is defined.
     *
     * @return bool true if at least one instance is defined, else false.
     */
    public function hasInstances(): bool
    {
        return count($this->_instances) !== 0;
    }

    /**
     * Removes an instance by its name.
     *
     * @param string $instanceName an instance name
     *
     * @return void
     */
    public function removeInstance(string $instanceName): void
    {
        if (!$this->hasInstanceName($instanceName)) {
            throw new \LorisException(
                "[redcap][config] instance '$instanceName' does not exist."
            );
        }
        // cannot remove an instance with projects
        if ($this->_instances[$instanceName]->hasProjects()) {
            throw new \LorisException(
                "[redcap][config] cannot remove instance"
                ." '$instanceName' because it has projects."
            );
        }
        unset($this->_instances[$instanceName]);
    }

    /**
     * Removes a project from an instance. If the instance is empty after
     * removing the project, the instance is also removed.
     *
     * @param string $instanceName an instance name
     * @param string $projectID    a project ID
     *
     * @throws \LorisException
     *
     * @return void
     */
    public function removeProjectFromInstance(
        string $instanceName,
        string $projectID
    ): void {
        if (!$this->hasInstanceName($instanceName)) {
            throw new \LorisException(
                "[redcap][config] instance '$instanceName' does not exist."
            );
        }

        //
        $this->_instances[$instanceName]->removeProject($projectID);

        // if no project left in instance, remove the instance.
        if (!$this->_instances[$instanceName]->hasProjects()) {
            $this->removeInstance($instanceName);
        }
    }
}