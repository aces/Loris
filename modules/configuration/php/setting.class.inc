<?php declare(strict_types=1);
namespace LORIS\configuration;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

class Setting extends \LORIS\Http\Endpoint {
    public function handle(ServerRequestInterface $request) : ResponseInterface {
        // if method != PUT BadMethod
        $path = $request->getUri()->getPath();
        if (preg_match("#^/setting(/)*$#", $path) === 1) {
            return new \LORIS\Http\Response\JSON\BadRequest("Missing setting name");
        }
        $matches = [];
        if (preg_match("#^(/setting/*)([[:alnum:]_]*)$#", $path, $matches) === 1) {
            $requestdata = json_decode((string) $request->getBody(), true);
            if ($requestdata["setting"] != $matches[2]) {
                return new \LORIS\Http\Response\JSON\BadRequest("Setting does not match URL");

            }
            return $this->saveValue($matches[2], $requestdata);
        }
        return new \LORIS\Http\Response\JSON\NotFound();
    }

    public function loadResources() {
    }
    public function _hasAccess(\User $user) : bool {
        return $user->hasPermission('config');
    }

    private function saveValue(string $setting, array $input) : ResponseInterface {
        $DB = $this->loris->getDatabaseConnection();
        $settingData = $DB->pselectRow(
                "SELECT ID, AllowMultiple
                FROM ConfigSettings 
                WHERE Name=:setting",
                ['setting' => $setting]
        );
        if ($settingData === null) {
            return new \LORIS\Http\Response\JSON\NotFound("Setting not found");
        }
        if (!empty($settingData['AllowMultiple'])) {
            // It's an AllowMultiple element type, the values are in values
            // validate input.values
            if (!isset($input['values'])) {
                return new \LORIS\Http\Response\JSON\BadRequest("Missing setting values");
            }
            $DB->beginTransaction();
            $DB->delete("Config", ['ConfigID' => $settingData['ID']]);
            foreach ($input['values'] as $value) {
                $DB->unsafeInsert(
                    "Config",
                    [
                        'ConfigID' => $settingData['ID'],
                        'Value' => $value,
                    ]
                );
            }
            $DB->commit();
            return new \LORIS\Http\Response\JSON\OK(['ok' => true]);
        }
        return new \LORIS\Http\Response\JSON\NotImplemented();
    }
}

