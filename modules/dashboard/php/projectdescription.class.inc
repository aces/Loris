<?php declare(strict_types=1);

namespace LORIS\dashboard;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Get the project description to display in the welcome widget.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

class ProjectDescription extends \LORIS\Http\Endpoint
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
        $settings = \NDB_Factory::singleton()->settings();
        $desc     = $settings->projectDescription($request->getAttribute("user"));
        return new \LORIS\Http\Response\JSON\OK(['Description' => $desc]);
    }

    /**
     * The hasAccess call called by the Module class before loading the page.
     *
     * @param \User $user The user accessing the page
     *
     * @return bool
     */
    function _hasAccess(\User $user)
    {
        return true;
    }
}
