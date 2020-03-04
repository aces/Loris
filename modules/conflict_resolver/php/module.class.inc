<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Conflict_Resolver
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\conflict_resolver;

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
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Clinical";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Conflict Resolver";
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
        switch($type) {
        case 'usertasks':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();
            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "Data entry conflict",
                    $DB,
                    "SELECT COUNT(*) FROM conflicts_unresolved cu
                         LEFT JOIN flag ON (cu.CommentId1=flag.CommentID)
                         LEFT JOIN session s ON (flag.SessionID=s.ID)
                         LEFT JOIN candidate c ON (s.CandID=c.CandID)
                     WHERE s.Active='Y' AND c.Active='Y' AND
                         s.CenterID <> 1",
                    'access_all_profiles',
                    's.CenterID',
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

            $candID = $candidate->getCandID();
            $results = $DB->pselect(
                "SELECT f1.Test_name, s1.Visit_label, COUNT(*) as Conflicts
                 FROM conflicts_unresolved cu
                     LEFT JOIN flag f1 ON (f1.CommentID=cu.CommentId1)
                     LEFT JOIN flag f2 ON (f2.CommentID=cu.CommentID2)
                     LEFT JOIN session s1 ON (f1.SessionID=s1.ID)
                     LEFT JOIN session s2 ON (f2.SessionID=s2.ID)
                 WHERE (s1.CandID=:cand1 OR s2.CandID=:cand2)
                 GROUP BY f1.Test_name, s1.Visit_label",
                 ['cand1' => $candID, 'cand2' => $candID],
            );
            // Do not show the conflicts card if there are no conflicts
            if (empty($results)) {
                return [];
            }
            return [
                new \LORIS\candidate_profile\CandidateWidget(
                    "Unresolved Conflicts",
                    $baseURL . "/conflict_resolver/js/CandidateConflictsWidget.js",
                    "lorisjs.conflict_resolver.CandidateConflictsWidget.default",
                    [
                        'Conflicts' => $results,
                    ],
                    1,
                    1,
                )
            ];
        }

        return [];
    }
}
