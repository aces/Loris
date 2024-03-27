<?php
/**
 * This file features the code for the form portion of the Loris issue
 * tracker.
 *
 * PHP Version 5
 *
 * @category   Loris
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\issue_tracker;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;
/**
 * Creates the form for NDB_Form_issue_tracker
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class Issue extends \NDB_Form
{
    protected $issueID;
    public $skipTemplate = true;

    /**
     * Sets up the smarty menu filter items
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $issueID = $this->issueID;
        if ((empty($issueID)
            || !isset($issueID))
            && !$user->hasAnyPermission(
                [
                    'issue_tracker_reporter',
                    'issue_tracker_developer',
                ]
            )
        ) {
            header("HTTP/1.1 403 Forbidden");
        }
    }

    /**
     * Include issue_tracker.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/issue_tracker/css/issue_tracker.css"]
        );
    }

    /**
     * Include issueIndex.js
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/issue_tracker/js/index.js"]
        );
    }

    /**
     * Checks if the user has the ability to *view* the issue page
     * Does not govern editing abilities; those are controlled by issueIndex.js
     *
     * @param \User $user User Instance
     *
     * @return bool
     *
     * @throws \ConfigurationException
     */
    function _hasAccess(\User $user) : bool
    {
        $issueID = $this->issueID;
        if (!$issueID) {
            return true;
        }
        $issueData = \NDB_Factory::singleton()->database()->pselectRow(
            "SELECT centerID FROM issues WHERE issueID=:issueID",
            ['issueID' => $issueID]
        );
        return (is_null($issueData)
            || in_array($issueData['centerID'], $user->getCenterIDs())
            || ($user->hasPermission('access_all_profiles'))
            || (empty($issueData['centerID']))
        );
    }

    /**
     * Ensure $this->issueID is set so that _hasAccess is valid
     * before calling the parent middleware.
     *
     * @param ServerRequestInterface  $request The PSR7 request being processed.
     * @param RequestHandlerInterface $handler The handler to handle the request
     *                                         after processing the middleware.
     *
     * @return ResponseInterface
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        $results = [];
        preg_match(
            '#/issue/([0-9]+|new)$#',
            $request->getURI()->getPath(),
            $results
        );
        $this->issueID = $results[1] ?? null;
        return parent::process($request, $handler);
    }

    /**
     * Handle the incoming request for an issue. This extracts URLs of the form
     * /issue_tracker/issue/3 and extracts the issueID so that it's accessible
     * from the rest of the code as a class variable.
     *
     * @param ServerRequestInterface $request The incoming client request
     *
     * @return ResponseInterface The PSR15 response.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if (empty($this->issueID) && $this->issueID != "new") {
            // Should probably be a bad request, but we don't have a 400.tpl
            // template.
            return new \Loris\Http\Error($request, 404, "Issue not found");
        }
        // FIXME: This should negotiate the content type it returns (JSON vs HTML)
        // based on the HTTP Accept header, and determine whether to update or
        // display based on whether it's a PUT or GET request in order to remove
        // the ajax/EditIssue.php hack.
        return parent::handle($request);
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $label = ucwords(str_replace('_', ' ', $this->name));
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($label, "/$this->name"),
            new \LORIS\Breadcrumb(
                'Issue',
                "/issue_tracker/issue/$this->issueID"
            )
        );
    }
}
