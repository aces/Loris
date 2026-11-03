<?php declare(strict_types=1);

namespace LORIS\configuration;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * JSON endpoint for configuration categories and category settings.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Categories extends \LORIS\Http\Endpoint
{
    /**
     * Handle /configuration/categories and /configuration/categories/<name>.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path = trim($request->getAttribute("unhandledURI")->getPath(), "/");
        if ($path === '' || $path === 'categories') {
            return $this->getCategoryList();
        }

        $matches = [];
        if (preg_match('/^categories\/([[:alnum:]_]+)$/', $path, $matches) === 1) {
            return $this->getCategory($matches[1]);
        }

        return new \LORIS\Http\Response\JSON\NotFound();
    }

    /**
     * Gets a list of configuration categories and supporting option sets.
     *
     * @return ResponseInterface
     */
    public function getCategoryList() : ResponseInterface
    {
        $DB = $this->loris->getDatabaseConnection();
        $parentConfigItems = $DB->pselect(
            "SELECT Label, Name
             FROM ConfigCategories
             WHERE Visible=1
             ORDER BY OrderNumber",
            []
        );
        $parentConfigItems = iterator_to_array($parentConfigItems);
        foreach ($parentConfigItems as &$setting) {
            $setting['Label'] = dgettext('ConfigSettings', $setting['Label']);
        }

        $scans     = $DB->pselect(
            "SELECT MriScanTypeName FROM mri_scan_type",
            []
        );
        $scanTypes = ['' => ''];
        foreach ($scans as $type) {
            $val = $type['MriScanTypeName'];
            $scanTypes[$val] = $val;
        }

        $instruments     = \NDB_BVL_Instrument::getInstrumentNamesList($this->loris);
        $instruments[''] = '';

        $config       = \NDB_Config::singleton();
        $imageOptions = [];
        $imageUploadEnabled = false;
        $imageUploadError   = '';
        try {
            $lorisRoot       = $config->getSetting('base');
            $uploadDirectory = $config->getSetting('config_upload_path');
            if (!is_string($lorisRoot) || !is_string($uploadDirectory)) {
                throw new \ConfigurationException(
                    'The configuration image paths are invalid'
                );
            }
            $images       = new ImageFiles($lorisRoot, $uploadDirectory);
            $imageOptions = $images->getOptions();
            $imageUploadEnabled = $images->getUploadDirectory()->isWritable();
        } catch (\ConfigurationException $e) {
            $imageUploadError = $e->getMessage();
        }

        return new \LORIS\Http\Response\JSON\OK(
            [
                'categories'         => $parentConfigItems,
                'dateFormat'         => [
                    ''    => '',
                    'Ymd' => dgettext(
                        'configuration',
                        'Ymd (EX: 2015-12-28)'
                    ),
                    'Ym'  => dgettext('configuration', 'Ym (EX: 2015-12)'),
                ],
                'imageOptions'       => $imageOptions,
                'imageUploadEnabled' => $imageUploadEnabled,
                'imageUploadError'   => $imageUploadError,
                'instruments'        => $instruments,
                'logLevels'          => [
                    'none'      => dgettext('loris', 'None'),
                    'debug'     => dgettext('configuration', 'Debug'),
                    'info'      => dgettext('configuration', 'Info'),
                    'notice'    => dgettext('configuration', 'Notice'),
                    'warning'   => dgettext('configuration', 'Warning'),
                    'error'     => dgettext('configuration', 'Error'),
                    'critical'  => dgettext('configuration', 'Critical'),
                    'alert'     => dgettext('configuration', 'Alert'),
                    'emergency' => dgettext('configuration', 'Emergency'),
                ],
                'lookupCenter'       => [
                    ''            => '',
                    'PatientID'   => dgettext('configuration', 'PatientID'),
                    'PatientName' => dgettext('configuration', 'PatientName'),
                ],
                'sandbox'            => boolval(
                    \NDB_Config::singleton()->getSetting("sandbox")
                ),
                'scanTypes'          => $scanTypes,
            ]
        );
    }

    /**
     * Gets a category of configuration settings.
     *
     * @param string $category The category name to retrieve
     *
     * @return ResponseInterface
     */
    public function getCategory(string $category) : ResponseInterface
    {
        $DB = $this->loris->getDatabaseConnection();

        $categoryID = $DB->pselectOneInt(
            "SELECT ID
             FROM ConfigCategories
             WHERE Visible=1 AND Name=:cat",
            ['cat' => $category]
        );
        if ($categoryID === null) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        /**
         * Configuration setting rows.
         *
         * @var array<array<string, mixed>> $configs
         */
        $configs = iterator_to_array(
            $DB->pselect(
                "SELECT *
                 FROM ConfigSettings
                 WHERE Visible=1 AND CategoryID=:cid AND Parent IS NULL
                 ORDER BY OrderNumber",
                ['cid' => $categoryID]
            )
        );

        return new \LORIS\Http\Response\JSON\OK(
            ['category' => $this->_getSettings($configs)]
        );
    }

    /**
     * Load values and descendants for configuration settings.
     *
     * @param array<array<string, mixed>> $configs Configuration setting rows
     *
     * @return array<array<string, mixed>>
     */
    private function _getSettings(array $configs) : array
    {
        $DB     = $this->loris->getDatabaseConnection();
        $config = \NDB_Config::singleton();
        $lang   = \User::singleton()->getLanguageCode();
        foreach ($configs as &$setting) {
            $setting['Label']         = dgettext(
                'ConfigSettings',
                $setting['Label']
            );
            $setting['Description']   = dgettext(
                'ConfigSettings',
                $setting['Description']
            );
            $setting['AllowMultiple'] = boolval($setting['AllowMultiple']);
            $settingName = strval($setting['Name']);
            /**
             * Visible child setting rows.
             *
             * @var array<array<string, mixed>> $children
             */
            $children            = iterator_to_array(
                $DB->pselect(
                    "SELECT * FROM ConfigSettings
                     WHERE Visible=1 AND Parent=:parent
                     ORDER BY OrderNumber, ID",
                    ['parent' => $setting['ID']]
                )
            );
            $setting['Children'] = $this->_getSettings($children);
            if ($setting['DataType'] === null) {
                $setting['Disabled'] = false;
                $setting['Value']    = '';
                continue;
            }
            try {
                $valueFromXML        = $config->getSettingFromXML($settingName);
                $setting['Disabled'] = true;
                $setting['Value']    = $setting['AllowMultiple'] === true
                    ? (array) $valueFromXML
                    : $valueFromXML;
            } catch (\ConfigurationException $e) {
                $setting['Disabled'] = false;
                /**
                 * Stored configuration and mapping rows.
                 *
                 * @var array<array<string, mixed>> $value
                 */
                $value = iterator_to_array(
                    $DB->pselect(
                        "SELECT c.ID, c.Value, cm.Value AS MappedValue
                         FROM Config c
                         LEFT JOIN ConfigMappings cm ON (c.ID=cm.ConfigID)
                         WHERE c.ConfigID=:ID",
                        ['ID' => $setting['ID']]
                    )
                );

                if ($setting['DataType'] === 'mapping') {
                    $setting['Value'] = array_map(
                        static fn(array $row) => [
                            'Value'       => $row['Value'],
                            'MappedValue' => $row['MappedValue'] ?? '',
                        ],
                        $value
                    );
                } else if (!empty($setting['Multilingual'])) {
                    $setting['Value'] = $config->getMultilingualSetting(
                        $lang,
                        $settingName
                    );
                } else if ($setting['AllowMultiple']) {
                    $setting['Value'] = array_column($value, 'Value');
                } else {
                    switch (count($value)) {
                    case 0:
                        $setting['Value'] = '';
                        break;
                    case 1:
                        $setting['Value'] = $value[0]['Value'];
                        break;
                    default:
                        throw new \ConfigurationException(
                            "Multiple config settings for setting that "
                            . "does not allow multiple"
                        );
                    }
                }

                if ($setting['DataType'] === "boolean") {
                    $settingValue = $setting['Value'] ?? "false";
                    if ($settingValue === "false") {
                        $setting['Value'] = false;
                    } else if ($settingValue === "true") {
                        $setting['Value'] = true;
                    } else {
                        $setting['Value'] = $settingValue;
                    }
                }
            }
        }

        return $configs;
    }
}
