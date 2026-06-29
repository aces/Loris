<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Conflict_Resolver
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\conflict_resolver;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Conflict_Resolver
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
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
            $user->hasPermission('conflict_resolver');
    }

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
        $path = trim($request->getAttribute("unhandledURI")->getPath(), "/");
        switch ($path) {
        case 'unresolved':
            $handler = new Endpoints\Unresolved($this->loris);
            break;
        case 'resolved':
            $handler = new Endpoints\Resolved($this->loris);
            break;
        default:
            return parent::handle($request);
        }

        return $handler->process($request, $handler);
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Clinical");
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("conflict_resolver", "Conflict Resolver");
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        switch ($type) {
        case 'usertasks':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    new \LORIS\GUI\LocalizableString(
                        "conflict_resolver",
                        "Data entry conflict",
                        "Data entry conflicts",
                    ),
                    $DB,
                    "SELECT COUNT(*) FROM conflicts_unresolved cu
                         LEFT JOIN flag ON (cu.CommentId1=flag.CommentID)
                         LEFT JOIN session s ON (flag.SessionID=s.ID)
                         LEFT JOIN candidate c ON (s.CandidateID=c.ID)
                     WHERE s.Active='Y' AND c.Active='Y' AND
                         s.CenterID <> 1",
                    'access_all_profiles',
                    's.CenterID',
                    's.ProjectID',
                    $baseURL . '/' . $this->getName(),
                    'conflict_resolver'
                )
            ];
        case 'candidate':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();

            $candidate = $options['candidate'];
            if ($candidate === null) {
                return [];
            }

            $candID  = $candidate->getCandID();
            $results = $DB->pselect(
                "SELECT tn.Test_name, s1.Visit_label, COUNT(*) as Conflicts
                 FROM conflicts_unresolved cu
                     LEFT JOIN flag f1 ON (f1.CommentID=cu.CommentId1)
                     JOIN test_names tn ON (f1.TestID=tn.ID)
                     LEFT JOIN flag f2 ON (f2.CommentID=cu.CommentID2)
                     LEFT JOIN session s1 ON (f1.SessionID=s1.ID)
                     LEFT JOIN session s2 ON (f2.SessionID=s2.ID)
                     JOIN candidate c1 ON (s1.CandidateID=c1.ID)
                     JOIN candidate c2 ON (s2.CandidateID=c2.ID)
                 WHERE (c1.CandID=:cand1 OR c2.CandID=:cand2)
                 GROUP BY tn.Test_name, s1.Visit_label
                 ORDER BY s1.Visit_label, tn.Test_name",
                ['cand1' => $candID, 'cand2' => $candID],
            );
            // Do not show the conflicts card if there are no conflicts
            if (count($results) === 0) {
                return [];
            }

            $width = 1;
            if (count($results) > 10) {
                $width = 2;
            }
            return [
                new \LORIS\candidate_profile\CandidateWidget(
                    dgettext("conflict_resolver", "Unresolved Conflicts"),
                    $baseURL . "/conflict_resolver/js/CandidateConflictsWidget.js",
                    "lorisjs.conflict_resolver.CandidateConflictsWidget.default",
                    [
                        'Conflicts' => iterator_to_array($results),
                    ],
                    $width,
                    1,
                )
            ];
        case 'study-progression':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();

            $query  = "SELECT
                    p.ProjectID,
                    CAST(ROUND(
                        100 * SUM(
                            CASE WHEN conflict_status.status = 'resolved'
                                THEN 1
                                ELSE 0
                            END
                        ) / COUNT(*)
                    ) AS SIGNED) AS count,
                    CONCAT('$baseURL/conflict_resolver/?Project=', p.Name)
                    AS url,
                    p.Name AS ProjectName
                FROM (
                    SELECT CommentId1, 'unresolved' AS status
                    FROM conflicts_unresolved
                    UNION ALL
                    SELECT CommentId1, 'resolved' AS status
                    FROM conflicts_resolved
                ) conflict_status
                    LEFT JOIN flag f ON (conflict_status.CommentId1=f.CommentID)
                    LEFT JOIN session s ON (f.SessionID=s.ID)
                    LEFT JOIN candidate c ON (s.CandidateID=c.ID)
                    LEFT JOIN Project p ON (s.ProjectID=p.ProjectID)
                WHERE s.Active='Y'
                    AND c.Active='Y'
                    AND s.CenterID <> 1";
            $params = [];

            if (!$user->hasPermission('access_all_profiles')) {
                $siteIDs    = array_map(
                    fn($centerID) => (string)$centerID,
                    $user->getCenterIDs()
                );
                $projectIDs = array_map(
                    fn($projectID) => (string)$projectID,
                    $user->getProjectIDs()
                );

                if (count($siteIDs) === 0 || count($projectIDs) === 0) {
                    return [];
                }

                $sitePlaceholders = [];
                foreach ($siteIDs as $index => $siteID) {
                    $placeholder          = "site$index";
                    $sitePlaceholders[]   = ':' . $placeholder;
                    $params[$placeholder] = $siteID;
                }

                $projectPlaceholders = [];
                foreach ($projectIDs as $index => $projectID) {
                    $placeholder           = "project$index";
                    $projectPlaceholders[] = ':' . $placeholder;
                    $params[$placeholder]  = $projectID;
                }

                $query .= "
                    AND s.CenterID IN (" . implode(', ', $sitePlaceholders) . ")
                    AND s.ProjectID IN ("
                    . implode(', ', $projectPlaceholders)
                    . ")";
            }

            $query .= "
                GROUP BY p.ProjectID, p.Name";

            $data = $DB->pselectWithIndexKey(
                $query,
                $params,
                'ProjectID'
            );

            return [
                new \LORIS\dashboard\DataWidget(
                    new \LORIS\GUI\LocalizableString(
                        "conflict_resolver",
                        "% conflict resolved",
                        "% conflicts resolved"
                    ),
                    $data,
                    "",
                    'rgb(255, 235, 235)',
                )
            ];
        }

        return [];
    }

    /**
     * {@inheritDoc}
     *
     * @return bool Whether an api schema is available fro this module.
     */
    public function hasAPISpecification(): bool
    {
        return true;
    }
}
