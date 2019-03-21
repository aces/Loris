<?php declare(strict_types=1);
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category LORIS_Module
 * @package  Server
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\server_processes_manager;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category LORIS_Module
 * @package  Server
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * Handle a PSR7 Request for the serverprocessesmanager endpoint. Also calls a
     * validation function to ensure necessary configuration settings exist.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        try {
            $this->validateConfig();
        } catch (\ConfigurationException $e) {
            error_log($e->getMessage());
            return (new \LORIS\Middleware\PageDecorationMiddleware(
                $request->getAttribute("user") ?? new \LORIS\AnonymousUser()
            ))->process(
                $request,
                new \LORIS\Router\NoopResponder(
                    new \LORIS\Http\Error(
                        $request,
                        500,
                        'Required configuration settings for Server Processes ' .
                        'Manager are missing. Cannot continue.'
                    )
                )
            );
        }
        return parent::handle($request);
    }

    /**
     * Checks that the required configuration settings are properly set. Throws
     * a ConfigurationException if not.
     *
     * @return void
     *
     * @throws \ConfigurationException
     */
    function validateConfig(): void
    {
        /* Ensure that all required configuraton settings are properly set
         * before continuing.
         */
        $path = \NDB_Config::singleton()->getSetting("mriCodePath");
        if (empty($path) || !is_readable($path)) {
            throw new \ConfigurationException(
                'Config setting mriCodePath is missing or unreadable.'
            );
        }
    }
}
