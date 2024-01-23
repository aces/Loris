<?php declare(strict_types=1);

namespace LORIS\redcap;

/**
 * This represents a REDCap importer
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedcapConfig
{
    private string $project;
    private string $configFilePath;
    private array  $import_config;

    function __construct($project)
    {
        $this->configFilePath = __DIR__ . "redcap_config_$project.json";
        $this->import_config = $this->_load();
    }

    private function _load(): array
    {
        return json_decode($file_get_contents($this->configFilePath), true);
    }

    function getImportConfig(): array
    {
        return $this->import_config;
    }
}
