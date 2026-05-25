<?php declare(strict_types=1);

namespace LORIS\configuration;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * JSON endpoint for updating configuration settings.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Setting extends \NDB_Page implements RequestHandlerInterface
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
     * Handle /configuration/setting/<name>.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($request->getMethod() !== 'PUT') {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['PUT'],
                "Only PUT is supported"
            );
        }

        $matches = [];
        $path    = trim($request->getAttribute("unhandledURI")->getPath(), "/");
        if (preg_match('/^setting\/([[:alnum:]_-]+)$/', $path, $matches) !== 1) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $requestdata = json_decode((string) $request->getBody(), true);
        if (!is_array($requestdata)) {
            return new \LORIS\Http\Response\JSON\BadRequest("Invalid input");
        }
        if (($requestdata['setting'] ?? null) !== $matches[1]) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Setting does not match URL"
            );
        }

        return $this->_saveValue($matches[1], $requestdata);
    }

    /**
     * Save a value into the database.
     *
     * @param string $setting The setting name to save
     * @param array  $input   The parsed JSON input
     *
     * @return ResponseInterface
     */
    private function _saveValue(string $setting, array $input) : ResponseInterface
    {
        $DB = $this->loris->getDatabaseConnection();

        $settingData = $DB->pselectRow(
            "SELECT ID, AllowMultiple
             FROM ConfigSettings
             WHERE Name=:setting AND Visible=1",
            ['setting' => $setting]
        );
        if ($settingData === null) {
            return new \LORIS\Http\Response\JSON\NotFound("Setting not found");
        }

        if (!empty($settingData['AllowMultiple'])) {
            if (!isset($input['values']) || !is_array($input['values'])) {
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

        if (!array_key_exists('value', $input)) {
            return new \LORIS\Http\Response\JSON\BadRequest("Missing setting value");
        }

        $valueId = $DB->pselectOne(
            "SELECT ID FROM Config WHERE ConfigID=:cid",
            ['cid' => $settingData['ID']]
        );
        if ($valueId === null) {
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
