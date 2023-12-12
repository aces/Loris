<?php declare(strict_types=1);
namespace LORIS\configuration;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The setting class is an endpoint that handles incoming requests
 * to /configuration/setting/* to manage updating settings.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Setting extends \LORIS\Http\Endpoint
{
    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // if method != PUT BadMethod
        $path = $request->getUri()->getPath();
        if (preg_match("#^/setting(/)*$#", $path) === 1) {
            return new \LORIS\Http\Response\JSON\BadRequest("Missing setting name");
        }
        $matches = [];
        if (preg_match("#^(/setting/*)([[:alnum:]_]*)$#", $path, $matches) === 1) {
            $requestdata = json_decode((string) $request->getBody(), true);
            if (!is_array($requestdata)) {
                return new \LORIS\Http\Response\JSON\BadRequest("Invalid input");
            }
            if ($requestdata["setting"] != $matches[2]) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    "Setting does not match URL"
                );

            }
            return $this->_saveValue($matches[2], $requestdata);
        }
        return new \LORIS\Http\Response\JSON\NotFound();
    }

    /**
     * Function called by Module::loadPage. A stub is required for the
     * endpoint to load.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return void
     */
    public function loadResources(
        \User $user,
        ServerRequestInterface $request
    ) : void {
    }

    /**
     * Determine access to the page for Module::loadPage
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('config');
    }

    /**
     * Save a value into the database.
     *
     * @param string $setting The setting name to be saved
     * @param array  $input   The parsed JSON object submitted by the user
     *
     * @return ResponseInterface
     */
    private function _saveValue(string $setting, array $input) : ResponseInterface
    {
        $DB = $this->loris->getDatabaseConnection();

        $settingData = $DB->pselectRow(
            "SELECT ID, AllowMultiple FROM ConfigSettings 
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
                return new \LORIS\Http\Response\JSON\BadRequest(
                    "Missing setting values"
                );
            }
            $DB->beginTransaction();
            $DB->delete("Config", ['ConfigID' => $settingData['ID']]);
            foreach ($input['values'] as $value) {
                $DB->unsafeInsert(
                    "Config",
                    [
                        'ConfigID' => $settingData['ID'],
                        'Value'    => $value,
                    ]
                );
            }
            $DB->commit();
            return new \LORIS\Http\Response\JSON\OK(['ok' => true]);
        }
        $valueId = $DB->pselectOne(
            "SELECT ID FROM Config WHERE ConfigID=:cid",
            ['cid' => $settingData['ID']]
        );
        if ($valueId=== null) {
            $DB->unsafeInsert(
                "Config",
                ['ConfigID' => $settingData['ID'], 'Value' => $input['value']]
            );
        } else {
            $DB->unsafeUpdate(
                "Config",
                ['Value' => $input['value']],
                ['ID' => $valueId]
            );
        }
        return new \LORIS\Http\Response\JSON\OK(['ok' => true]);
    }
}

