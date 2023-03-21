<?php declare(strict_types=1);
namespace LORIS\configuration;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The categoriesclass is an endpoint that handles incoming requests
 * to /configuration/categories/* to get the settings in an organized
 * fashion.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Categories extends \LORIS\Http\Endpoint
{
    /**
     * Handle an incoming request to the /configuration/categories/* pages.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path = $request->getUri()->getPath();
        if (preg_match("#^/categories(/)*$#", $path) === 1) {
            return $this->getCategoryList();
        }
        $matches   = [];
        $doesMatch = preg_match(
            "#^(/categories/*)([[:alnum:]_]*)$#",
            $path,
            $matches
        );
        if ($doesMatch === 1) {
            return $this->getCategory($matches[2]);
        }

        return new \LORIS\Http\Response\JSON\NotFound();
    }

    /**
     * Stub function so that it's definite when module
     * loadPage calls it.
     *
     * @return void
     */
    public function loadResources()
    {
    }

    /**
     * Check the user permissions to access this page.
     *
     * @param \User $user The user accessing the page
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Gets a list of categories available in the database and generate
     * a response.
     *
     * @return ResponseInterface
     */
    public function getCategoryList() : ResponseInterface
    {
        $DB = $this->loris->getDatabaseConnection();
        $parentConfigItems = $DB->pselect(
            "SELECT Label, Name 
                FROM ConfigSettings 
                WHERE Parent IS NULL AND Visible=1 ORDER BY OrderNumber",
            []
        );

        $scans = $DB->pselect(
            "SELECT Scan_type
               FROM mri_scan_type",
            []
        );
        $scan_types = [];

        foreach ($scans as $type) {
            $val = $type['Scan_type'];
            $scan_types[$val] = $val;
        }

        return new \LORIS\Http\Response\JSON\OK(
            [
                'categories'  => $parentConfigItems,
                'instruments' => \Utility::getAllInstruments(),
                'scan_types'  => $scan_types,
            ]
        );
    }

    /**
     * Gets a category of settings from the database and returns a response
     *
     * @param string $category the category to get
     *
     * @return ResponseInterface
     */
    public function getCategory(string $category) : ResponseInterface
    {
        $DB = $this->loris->getDatabaseConnection();

        $parentID = $DB->pselectOneInt(
            "SELECT ID
                FROM ConfigSettings 
                WHERE Parent IS NULL AND Name=:cat",
            ['cat' => $category]
        );
        if ($parentID === null) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        // Get the names and meta-information for the config settings in the database
        $configs = $DB->pselect(
            "SELECT * FROM ConfigSettings
                WHERE Visible=1 AND Parent=:pid
                ORDER BY OrderNumber",
            ['pid' => $parentID]
        );

        $config = $this->loris->getConfiguration();

        // Check whether any setting is overwritten in the config.xml
        // Add this info to the array so form entries can be disabled in front end
        // Update the value for the setting to the value from the config.xml
        // and the value from the database if not in the config.xml
        foreach ($configs as &$setting) {
            if ($setting['AllowMultiple'] == "0") {
                $setting['AllowMultiple'] = false;
            } else {
                $setting['AllowMultiple'] = true;
            }

            try {
                $valueFromXML = $config->getSettingFromXML($setting['Name']);
                // Value was in config.xml and can not be edited
                // from the frontend.
                $setting['Disabled'] = true;
                if (!is_array($valueFromXML)) {
                    $setting['Value'][0] = $valueFromXML;
                } else {
                    $setting['Value'] = $valueFromXML;
                }
            } catch (\ConfigurationException $e) {
                // Could not get from the XML, so it is in the
                // database and can be edited in the frontend.
                $setting['Disabled'] = false;

                $value = $DB->pselect(
                    "SELECT ID, Value FROM Config WHERE ConfigID=:ID",
                    ['ID' => $setting['ID']]
                );
                if ($value) {
                    if ($setting['AllowMultiple']) {
                        $setting['Value'] = array_column($value, 'Value');
                    } else {
                        switch (count($value)) {
                        case 0:
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
                }
                if ($setting['DataType'] == "boolean") {
                    if ($setting['Value'] === "false") {
                        $setting['Value'] = false;
                    } else if ($setting['Value'] === "true") {
                        $setting['Value'] = true;
                    } else {
                        $setting['Value'] = !empty($setting['Value']);
                    }
                }
            }
        }

        return new \LORIS\Http\Response\JSON\OK(['category' => $configs]);
    }
}

