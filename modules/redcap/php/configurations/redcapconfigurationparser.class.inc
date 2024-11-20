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

use LORIS\redcap\RedcapHTTPClient;
use LORIS\redcap\configurations\RedcapConfiguration;

/**
 * This represents a REDCap configuration parser.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapConfigurationParser
{
    /**
     * REDCap configuration.
     *
     * @var RedcapConfiguration
     */
    private RedcapConfiguration $_config;

    /**
     * A Loris instance.
     *
     * @var \LORIS\LorisInstance
     */
    private \LORIS\LorisInstance $_loris;

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
        $this->_loris = $loris;
        $this->_loadREDCapConfig();
        $this->_checkAllInstances($verbose);
    }

    /**
     * Factory for singleton instance.
     *
     * @param \LORIS\LorisInstance $loris   a loris instance
     * @param bool                 $verbose verbose mode
     *
     * @return RedcapConfigurationParser
     */
    public static function &factory(
        \LORIS\LorisInstance $loris,
        bool $verbose = false
    ): RedcapConfigurationParser {
        if (!isset(self::$_instance)) {
            self::$_instance = new self($loris, $verbose);
        }
        return self::$_instance;
    }

    /**
     * Get REDCap configuration from 'config.xml' file.
     *
     * Structure:
     * assignee => \User
     * instance_name_aaa => [
     *   url     => https://someURL.com
     *   project => [
     *     111 => token_1
     *     222 => token_2
     * ]
     * instance_name_bbb => [
     *   url     => https://someOtherURL.com
     *   project => [
     *     333 => token_3
     *   ]
     * ]
     *
     * @return RedcapConfiguration
     */
    public function getConfig(): RedcapConfiguration
    {
        return $this->_config;
    }

    /**
     * Build REDCap configuration from 'config.xml' file.
     *
     * Structure:
     * assignee => \User
     * instance_name_aaa => [
     *   url     => https://someURL.com
     *   project => [
     *     111 => token_1
     *     222 => token_2
     * ]
     * instance_name_bbb => [
     *   url     => https://someOtherURL.com
     *   project => [
     *     333 => token_3
     *   ]
     * ]
     *
     * @return void
     */
    private function _loadREDCapConfig(): void
    {
        // config and db
        $config = $this->_loris->getConfiguration();
        $db     = $this->_loris->getDatabaseConnection();

        // redcap config
        $redcap = $config->getSetting("REDCap");
        if (empty($redcap)) {
            throw new \LorisException("[redcap][init] no REDCap configuration.");
        }

        // add main assignee
        $assignee = $redcap['issuesAssignee'] ?? null;
        if (!isset($assignee) || empty($assignee)) {
            throw new \LorisException(
                "[redcap][init] no REDCap 'issuesAssignee' in configuration."
            );
        }
        $assigneeUserID = $db->pselectOne(
            "SELECT u.userID
            FROM users u
                JOIN user_perm_rel upr ON (upr.userid = u.id)
                JOIN permissions p ON (p.permid = upr.permid)
            WHERE u.userID = :usid
                AND u.Active = 'Y'
                AND u.Pending_approval = 'N'
                AND p.code = 'issue_tracker_developer'
            ",
            ['usid' => $assignee]
        );
        if (is_null($assigneeUserID)) {
            throw new \LorisException(
                "[redcap][init] assignee '$assignee' does not exist"
                . " or does not have enough privilege."
            );
        }
        $u = \User::factory($assigneeUserID);
        $this->_config = new RedcapConfiguration($u);

        // no instance described
        if (!isset($redcap['instance'])) {
            throw new \LorisException(
                "[redcap][init] no REDCap instance in configuration."
            );
        }

        // multiple instances
        $instances = null;
        if (array_key_exists(0, $redcap['instance'])) {
            $instances = $redcap['instance'];
        } else if (array_key_exists('url', $redcap['instance'])) {
            // only one instances
            $instances = [$redcap['instance']];
        }

        if (is_null($instances)) {
            throw new \LorisException(
                "[redcap][init] wrong REDCap instance structure in configuration."
            );
        }

        // iterate on instances
        foreach ($instances as $instance) {
            //
            $name = $instance['name'];
            $url  = $instance['url'];

            // check name/url
            if (empty($name)) {
                throw new \LorisException(
                    "[redcap][init] wrong REDCap configuration:"
                    ." missing instance 'name'."
                );
            }
            if (empty($url)) {
                throw new \LorisException(
                    "[redcap][init] wrong REDCap configuration:"
                    ." missing instance 'url'."
                );
            }

            // multiple projects
            $projectTag = $instance['project'] ?? null;
            if (is_null($projectTag)) {
                throw new \LorisException(
                    "[redcap][init] wrong REDCap configuration:"
                    ." no projects for instance '$name'."
                );
            }

            $projects   = null;
            if (array_key_exists(0, $projectTag)) {
                $projects = $projectTag;
            } else if (array_key_exists('projectID', $projectTag)) {
                // only one projects
                $projects = [$projectTag];
            }


            // add instance
            $this->_config->addInstance($name, $url);

            // iterate on instances
            foreach ($projects as $project) {
                $pid   = $project['projectID'];
                $token = $project['token'];

                // check pid/token
                if (empty($pid)) {
                    throw new \LorisException(
                        "[redcap][init] wrong REDCap configuration:"
                        ." missing a 'projectID' for instance '$name'."
                    );
                }
                if (empty($token)) {
                    throw new \LorisException(
                        "[redcap][init] wrong REDCap configuration:"
                        ." missing a 'token' for instance '$name'."
                    );
                }

                // add the list of projects
                $this->_config->addProjectToInstance($name, $pid, $token);
            }
        }
    }

    /**
     * Test instances and remove those triggering a connction error.
     *
     * @param bool $verbose verbose mode
     *
     * @return void
     */
    private function _checkAllInstances(bool $verbose = false): void
    {
        // check all configuration instances and projects.
        foreach ($this->_config->yieldInstances() as $instance) {
            $iname = $instance->getName();
            foreach ($instance->yieldProjects() as $project) {
                $pid = $project->getProjectId();
                $url = $instance->getAPI();

                // check the connection
                $rc = new REDCapHTTPClient(
                    $this->_loris,
                    $url,
                    $pid,
                    $project->getToken(),
                    $verbose
                );

                //
                try {
                    $rc->checkConnection();
                } catch (\LorisException $le) {
                    error_log(
                        "[redcap][config] cannot connect to REDCap"
                        . " instance '$iname', project '$pid'."
                        . " Check configuration and connection."
                        . $le->getMessage()
                    );
                    $this->_config->removeProjectFromInstance($iname, $pid);
                }
            }
        }

        // check if at least one cnofiguration is accessible
        if (!$this->_config->hasInstances()) {
            throw new \LorisException(
                "[redcap][config] none of the REDCap configurations declared"
                ." in 'config.xml' file can be accessed."
            );
        }

        // log
        if ($verbose) {
            error_log("[redcap][config] can access the following REDCap projects:");
            foreach ($this->_config->yieldInstances() as $instance) {
                $iname = $instance->getName();
                foreach ($instance->yieldProjects() as $project) {
                    $pid = $project->getProjectId();
                    $url = $instance->getURL();
                    error_log(
                        "[redcap][config]  - instance '$iname'"
                        ." at '$url', project '$pid'"
                    );
                }
            }
        }
    }
}