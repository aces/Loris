<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage BVL_Feedback
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\bvl_feedback;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Core
 * @package    Main
 * @subpackage BVL_Feedback
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    public function hasAccess(\User $user) : bool {
        if (parent::hasAccess($user) === false) {
            return false;
        }
        return $user->hasPermission('bvl_feedback');
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Behavioural Feedback";
    }

    public function getWidgets(string $type, \User $user) {
        switch($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB = $factory->database();

            $last_login = $user->getLastLogin($DB);

            $bvl_feedback      = $DB->pselect(
                "SELECT fbt.Name, fbe.Testdate, fbe.Comment, fbth.FieldName,
                fbth.CommentID, fbth.SessionID, fbth.CandID, fbth.Feedback_level
                FROM feedback_bvl_entry fbe
                JOIN feedback_bvl_thread fbth USING (FeedbackID)
                JOIN feedback_bvl_type fbt USING (Feedback_type)
                WHERE fbth.Status='opened' AND fbth.Active='Y'
                ORDER BY Testdate DESC LIMIT 4",
                array()
            );
            $frontend_feedback = array();
            foreach ($bvl_feedback as $row) {
                if ($row['Testdate'] > $last_login) {
                    $row['new'] = true;
                } else {
                    $row['new'] = false;
                }
                if ($row['Feedback_level'] === 'profile') {
                    $row['URL'] = '/' . $row['CandID'];
                } else if ($row['Feedback_level'] === 'visit') {
                    $row['URL'] = '/instrument_list/?candID='
                        . $row['CandID'] . '&sessionID='
                        . $row['SessionID'];
                } else if ($row['Feedback_level'] === 'instrument') {
                    $instrument = $DB->pselectOne(
                        "SELECT Test_name from flag WHERE CommentID=:cid",
                        array('cid' => $row['CommentID'])
                    );
                    if (!empty($instrument)) {
                        $row['URL'] = '/instruments/'
                            . $instrument . '/?candID='
                            . $row['CandID'] . '&sessionID='
                            . $row['SessionID'] . '&commentID='
                            . $row['CommentID'];
                    }
                }
                $frontend_feedback[] = $row;
            }
            return [
                new \LORIS\dashboard\SmartyWidget(
                    $this,
                    "dashboardwidget.tpl",
                    [
                        'baseURL' => $baseURL,
                        'notifications' => $frontend_feedback
                    ],
                    "Behavioural Feedback Notifications",
                    "small",
                )
            ];
        }
        return [];
    }
}
