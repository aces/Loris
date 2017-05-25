<?php
/**
 * Entry point for module-specific API requests
 *
 * PHP Version 7
 *
 * @category Main
 * @package  API
 * @author   Jacob Penny <jpenny.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */


use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

$app    = new LorisApp();
$client = new NDB_Client;

if ($client->initialize() == false) {
    $login = $_SESSION['State']->getProperty('login');
    $login->showLoginScreen();
    return false;
}

$app->add(
    function (Request $request,
        Response $response,
        $next
    ) use ($app) {
        $moduleName = getModuleName($request);
        $module     = Module::factory($moduleName);
        $app->group(
            "/{$moduleName}/api",
            function () use ($app, $module) {
                $module->addRoutes($app);
            }
        );
        $response = $next($request, $response);
        return $response;
    }
);


/**
* Infers module name from request
*
* @param Request $request The HTTP request object
*
* @return string
*/
function getModuleName(Request $request)
{
    $path       = $request->getUri()->getPath();
    $moduleName = explode('/', $path)[1];
    return $moduleName;
}

$app->run();
