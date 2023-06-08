<?php
namespace LORIS\dashboard;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Get the project description to display in the welcome widget.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

class ProjectDescription extends \LORIS\Http\Endpoint
{
    public function handle(ServerRequestInterface $request) : ResponseInterface {
        $desc = $this->loris->getConfiguration()->getSetting('projectDescription');
        return new \LORIS\Http\Response\JSON\OK(['Description' => $desc]);
    }
    public function _hasAccess(\User $user) {
        return true;
    }
}
