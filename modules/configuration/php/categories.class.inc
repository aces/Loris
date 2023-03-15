<?php declare(strict_types=1);
namespace LORIS\configuration;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

class Categories extends \LORIS\Http\Endpoint {
    public function handle(ServerRequestInterface $request) : ResponseInterface {
        $path = $request->getUri()->getPath();
        if (preg_match("#^/categories(/)*$#", $path) === 1) {
            return $this->getCategoryList();
        }
        $matches = [];
        if (preg_match("#^(/categories/*)([[:alnum:]]*)$#", $path, $matches) === 1) {
            return $this->getCategory($matches[2]);
        }


        return new \LORIS\Http\Response\JSON\NotFound();
    }

    public function loadResources() {
    }
    public function _hasAccess(\User $user) : bool {
        return $user->hasPermission('config');
    }
    public function getCategoryList() : ResponseInterface {
        $DB = $this->loris->getDatabaseConnection();
        $parentConfigItems = $DB->pselect(
                "SELECT Label, Name 
                FROM ConfigSettings 
                WHERE Parent IS NULL AND Visible=1 ORDER BY OrderNumber",
                []
        );

        return new \LORIS\Http\Response\JSON\OK([
            'categories' => $parentConfigItems,
        ]);
    }
    public function getCategory(string $category) : ResponseInterface {
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
            "SELECT * FROM ConfigSettings WHERE Visible=1 AND Parent=:pid ORDER BY OrderNumber",
            ['pid' => $parentID]
        );

        $config = $this->loris->getConfiguration();

        // Check whether any setting is overwritten in the config.xml
        // Add this info to the array so form entries can be disabled in front end
        // Update the value for the setting to the value from the config.xml and the value from the database if not in the config.xml
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
                        switch(count($value)) {
                        case 0:
                            break;
                        case 1:
                            $setting['Value'] = $value[0]['Value'];
                            break;
                        default:
                            throw new \ConfigurationException("Multiple config settings for setting that does not allow multiple");
                        }
                    }
                }
            }
        }

        return new \LORIS\Http\Response\JSON\OK(['category' => $configs]);
    }
}

