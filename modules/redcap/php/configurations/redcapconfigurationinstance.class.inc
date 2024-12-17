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
 * This reprensents a REDCap instance configuration.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfigurationInstance
{
    /**
     * General API endpoint for REDCap API access.
     *
     * @var string
     */
    const API_ENDPOINT = "api/";

    /**
     * The instance name.
     *
     * @var string
     */
    private string $_name;

    /**
     * The instance URL.
     *
     * @var string
     */
    private string $_url;

    /**
     * A list of projects accessible on this REDCap instance.
     *
     * @var array<string, RedcapConfigurationProject> The list of project-specific REDCap configurations, indexed by project ID.
     */
    private array $_projects;

    /**
     * Constructor.
     *
     * @param string $name a REDCap instance name
     * @param string $url  a REDCap isntance URL
     */
    public function __construct(string $name, string $url)
    {
        $this->_name     = $name;
        $this->_url      = self::_cleanURL($url);
        $this->_projects = [];
    }

    /**
     * Add a project in the list of project for this instance.
     *
     * @param string $pid   the project ID
     * @param string $token the project token
     *
     * @return void
     */
    public function addProject(string $pid, string $token): void
    {
        if ($this->hasProject($pid)) {
            $n = $this->_name;
            throw new \LorisException(
                "[redcap][config] project ID '$pid' already exists in instance '$n'."
            );
        }
        $this->_projects[$pid] = new RedcapConfigurationProject($pid, $token);
    }

    /**
     * Get the instance name.
     *
     * @return string
     */
    public function getName(): string
    {
        return $this->_name;
    }

    /**
     * Get the instance URL.
     *
     * @return string
     */
    public function getURL(): string
    {
        return $this->_url;
    }

    /**
     * Get the instance API URL.
     *
     * @return string
     */
    public function getAPI(): string
    {
        return $this->_url . self::API_ENDPOINT;
    }

    /**
     * Clean an given URL.
     *
     * @param string $url an URL
     *
     * @return string a cleaned URL.
     */
    private static function _cleanURL(string $url): string
    {
        // if last char is not '/', add it
        $n = $url;
        if (substr($url, -1) != '/') {
            $n .= '/';
        }

        //
        return $n;
    }

    /**
     * Get the list of project for this instance.
     *
     * @return RedcapConfigurationProject[]
     */
    public function getProjects(): array
    {
        return $this->_projects;
    }

    /**
     * Tells if this instance has projects.
     *
     * @return bool true if this instance has projects, else false.
     */
    public function hasProjects(): bool
    {
        return count($this->_projects) !== 0;
    }

    /**
     * Tells if a project ID exists in this REDCap instance.
     *
     * @param string $pid the project ID
     *
     * @return ?RedcapConfigurationProject a REDCap project if it exists, else null.
     */
    public function getProject(string $pid): ?RedcapConfigurationProject
    {
        return $this->_projects[$pid] ?? null;
    }

    /**
     * Tells if a project ID exists in this REDCap instance.
     *
     * @param string $pid the project ID
     *
     * @return bool true if the project ID exists, else false
     */
    public function hasProject(string $pid): bool
    {
        return !is_null($this->getProject($pid));
    }

    /**
     * Iterator on projects.
     *
     * @return \Iterator
     */
    public function yieldProjects(): \Iterator
    {
        yield from $this->_projects;
    }

    /**
     * Removes a project by its ID.
     *
     * @param string $pid a REDCap project ID
     *
     * @throws \LorisException
     *
     * @return void
     */
    public function removeProject(string $pid): void
    {
        if (!$this->hasProject($pid)) {
            $n = $this->_name;
            throw new \LorisException(
                "[redcap][config] project ID '$pid' does not exist in instance '$n'."
            );
        }
        unset($this->_projects[$pid]);
    }
}