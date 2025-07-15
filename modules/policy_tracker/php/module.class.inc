<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It handles the basic routing for the module.
 *
 * PHP Version 8
 *
 * @category   API
 * @package    Main
 * @subpackage Login
 * @author     Saagar Arya <saagar.arya@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\policy_tracker;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Core
 * @package    Main
 * @subpackage Login
 * @author     Saagar Arya <saagar.arya@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    /**
     * Implements the PSR15 RequestHandler interface for this module. The API
     * module does some preliminary verification of the request, converts the
     * version from the URL to a request attribute, and then falls back on the
     * default LORIS page handler.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $body = json_decode($request->getBody()->getContents(), true);
        switch ($request->getMethod()) {
        case 'POST':
            $module = $this->loris->getModule($body['ModuleName'] ?? '');
            $page   = new \NDB_Page(
                $this->loris,
                $module,
                '',
                '',
                '',
            );
            $page->saveUserPolicyDecision(
                $this->loris,
                $body['PolicyName'] ?? '',
                $body['decision'] ?? ''
            );
            return new \LORIS\Http\Response\JSON\OK(
                ['message' => 'Policy decision saved successfully']
            );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
        }
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("policy_tracker", "Policy Tracker");
    }
}
