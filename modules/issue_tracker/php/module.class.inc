<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\issue_tracker;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * The default handler for a module routes to a page of the first component of
     * the URL's name, or the same name as the module if serving the root of the
     * module.
     *
     * Modules extend PrefixRouter, so that the parent handler knows that the
     * css, static, and js routes should be routed through the file system to
     * retrieve the files before trying to load any specific pages.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface the outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path = trim($request->getURI()->getPath(), '/');
        switch ($path) {
        case 'Attachment':
            \Module::factory('api');
            $handler = new endpoints\Attachment();
            break;
        default:
            return parent::handle($request);
        }
        $user = $request->getAttribute('user');
        if (!($this->hasAccess($user))) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }
        return $handler->process($request, $handler);
    }

    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'issue_tracker_reporter',
                    'issue_tracker_developer'
                ]
            );
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Tools";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Issue Tracker";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type The type of widgets to get
     * @param \User  $user The user widgets are being retrieved for.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user) : array
    {
        switch($type) {
        case 'usertasks':
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $baseURL = $factory->settings()->getBaseURL();
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "Your assigned issue",
                    $DB,
                    "SELECT COUNT(*) FROM issues
                     WHERE status != 'closed' AND assignee="
                     . $DB->quote($user->getData('UserID')),
                    '',
                    '',
                    $baseURL . "/issue_tracker/?#My%20Issues",
                    "issue_tracker"
                )
            ];
        }
        return [];

    }
}
