<?php declare(strict_types=1);

namespace LORIS;

/**
 * A LorisInstance represents an installed instance of a LORIS
 * project.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class LorisInstance
{
    protected $modulesDirs;
    /**
     * An object representing configuration settings for this LORIS instance.
     *
     * @var \NDB_Config
     */
    private $config;
    private $DB;

    /**
     * Construct a LORISInstance for the install connected to $db
     * which uses modules from $moduleDirs.
     *
     * @param \Database $db         A database connection to this
     *                              instance.
     * @param \NDB_Config $config   A set of configuration settings used by this
     *                              instance.
     * @param string[]  $moduleDirs A list of directories that may
     *                              contain modules for this instance.
     */
    public function __construct(
        \Database $db,
        \NDB_Config $config,
        array $modulesDirs
    ) {
        $this->DB          = $db;
        $this->config      = $config;
        $this->modulesDirs = $modulesDirs;
    }

    /**
     * Return an active database connection to this instance.
     *
     * @return \Database
     */
    public function getDatabaseConnection() : \Database
    {
        return $this->DB;
    }

    /**
     * Return a list of directories on the filesystem which
     * may contain modules.
     *
     * @return string[]
     */
    private function getModulesDirs() : array
    {
        return $this->modulesDirs;
    }

    /**
     * Retrieve all active module descriptors from the given database.
     *
     * @return \Module[]
     */
    public function getActiveModules(): array
    {
        $mnames = $this->getDatabaseConnection()->pselectCol(
            "SELECT Name FROM modules WHERE Active='Y'",
            []
        );

        $modules = [];
        foreach ($mnames as $name) {
            try {
                $modules[] = \Module::factory($name);
            } catch (\LorisModuleMissingException $e) {
                error_log($e->getMessage() . " " . $e->getTraceAsString());
            }
        }
        return $modules;
    }

    /**
     * Return true if the LORISInstance has a module named
     * $name. To be installed it must be both available on
     * the filesystem and active in the modules table.
     *
     * @param string $name The name of a LORIS module.
     *
     * @return bool
     */
    public function hasModule(string $name) : bool
    {
        $dirs  = $this->getModulesDirs();
        $found = false;
        foreach ($dirs as $subdir) {
            if (is_dir($subdir . "/" . $name)) {
                $found = true;
                break;
            }
        }

        if ($found === false) {
            return false;
        }

        foreach ($this->getActiveModules() as $module) {
            if ($module->getName() == $name) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns an NDB_Config object used for interacting with configuration
     * settings for this instance.
     *
     * @return \NDB_Config
     */
    public function getConfiguration(): \NDB_Config
    {
        return $this->config;
    }
}
