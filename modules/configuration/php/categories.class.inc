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
             FROM ConfigSettings
             WHERE Parent IS NULL AND Visible=1
             ORDER BY OrderNumber",
            []
        );

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

        return new \LORIS\Http\Response\JSON\OK(
            [
                'categories'   => iterator_to_array($parentConfigItems),
                'dateFormat'   => [
                    ''    => '',
                    'Ymd' => 'Ymd (EX: 2015-12-28)',
                    'Ym'  => 'Ym (EX: 2015-12)',
                ],
                'instruments'  => $instruments,
                'logLevels'    => [
                    'none'      => 'None',
                    'debug'     => 'Debug',
                    'info'      => 'Info',
                    'notice'    => 'Notice',
                    'warning'   => 'Warning',
                    'error'     => 'Error',
                    'critical'  => 'Critical',
                    'alert'     => 'Alert',
                    'emergency' => 'Emergency',
                ],
                'lookupCenter' => [
                    ''            => '',
                    'PatientID'   => 'PatientID',
                    'PatientName' => 'PatientName',
                ],
                'sandbox'      => boolval(
                    \NDB_Config::singleton()->getSetting("sandbox")
                ),
                'scanTypes'    => $scanTypes,
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

        $parentID = $DB->pselectOneInt(
            "SELECT ID
             FROM ConfigSettings
             WHERE Parent IS NULL AND Visible=1 AND Name=:cat",
            ['cat' => $category]
        );
        if ($parentID === null) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $configs = iterator_to_array(
            $DB->pselect(
                "SELECT *
                 FROM ConfigSettings
                 WHERE Visible=1 AND Parent=:pid
                 ORDER BY OrderNumber",
                ['pid' => $parentID]
            )
        );

        $config = \NDB_Config::singleton();
        foreach ($configs as &$setting) {
            $setting['AllowMultiple'] = boolval($setting['AllowMultiple']);
            $settingName = strval($setting['Name']);
            try {
                $valueFromXML        = $config->getSettingFromXML($settingName);
                $setting['Disabled'] = true;
                $setting['Value']    = $setting['AllowMultiple'] === true
                    ? (array) $valueFromXML
                    : $valueFromXML;
            } catch (\ConfigurationException $e) {
                $setting['Disabled'] = false;
                $value = iterator_to_array(
                    $DB->pselect(
                        "SELECT ID, Value FROM Config WHERE ConfigID=:ID",
                        ['ID' => $setting['ID']]
                    )
                );

                if ($setting['AllowMultiple']) {
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

        return new \LORIS\Http\Response\JSON\OK(['category' => $configs]);
    }
}
