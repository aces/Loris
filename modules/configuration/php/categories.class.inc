<?php declare(strict_types=1);

namespace LORIS\configuration;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * JSON endpoint for configuration categories and category settings.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Categories extends \NDB_Page implements RequestHandlerInterface
{
    /**
     * Keep JSON responses undecorated.
     *
     * @param ServerRequestInterface  $request The PSR7 request
     * @param RequestHandlerInterface $handler The request handler
     *
     * @return ResponseInterface
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

    /**
     * Returns true if user has access to this endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

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
            try {
                $valueFromXML        = $config->getSettingFromXML($setting['Name']);
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
                } else if (count($value) === 1) {
                    $setting['Value'] = $value[0]['Value'];
                } else {
                    $setting['Value'] = '';
                }
            }
        }

        return new \LORIS\Http\Response\JSON\OK(['category' => $configs]);
    }
}
