<?php declare(strict_types=1);

namespace LORIS\login;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Implements the main LORIS user logout page to handle
 * logging a user out of LORIS and destroying their
 * session.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Logout extends \LORIS\Http\Endpoint
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    function isAccessibleBy(\User $user) : bool
    {
        // Logged out users can not further log out
        return !($user instanceof \LORIS\AnonymousUser);
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();
        $uri     = \GuzzleHttp\Psr7\Utils::uriFor($baseURL);

        // NDB_Client called session_write_close, so we need to re-start
        // the session in order to destroy it.
        session_start();
        session_destroy();

        return new \LORIS\Http\Response\JSON\SeeOther($uri);

    }
}
