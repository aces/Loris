<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
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
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) && $user->hasPermission('bvl_feedback');
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return dgettext("bvl_feedback", "Behavioural Feedback");
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
    public function getWidgets(string $type, \User $user, array $options)
    {
        switch ($type) {
        case 'dashboard':
            $factory = \NDB_Factory::singleton();
            $baseURL = $factory->settings()->getBaseURL();
            $DB      = $factory->database();

            $last_login = $user->getLastLogin($DB);

            // Base query
            $query = "SELECT fbt.Name, fbe.Testdate, fbe.Comment, fbth.FieldName,
                fbth.CommentID, fbth.SessionID, c.CandID, fbth.Feedback_level
                FROM feedback_bvl_entry fbe
                JOIN feedback_bvl_thread fbth USING (FeedbackID)
                JOIN feedback_bvl_type fbt USING (Feedback_type)
                JOIN session s ON s.ID=fbth.SessionID
                JOIN candidate c ON s.CandidateID=c.ID
                WHERE fbth.Status='opened' AND fbth.Active='Y'";

            // Add centerID restriction if needed
            if (!$user->hasPermission('access_all_profiles')) {
                $site_arr = implode(",", $user->getCenterIDs());
                $query   .= " AND s.CenterID IN ({$site_arr}) ";
            }

            // Add project restriction & order BY
            $project_arr = implode(",", $user->getProjectIDs());
            $query      .= " AND s.ProjectID IN ({$project_arr})
                ORDER BY Testdate DESC LIMIT 4";

            $bvl_feedback = $DB->pselect(
                $query,
                []
            );

            $frontend_feedback = [];

            $dateformatter = new \IntlDateFormatter(
                "",
                \IntlDateFormatter::SHORT,
                \IntlDateFormatter::SHORT
            );

            foreach ($bvl_feedback as $row) {
                $row['Testdate'] = new \DateTime($row['Testdate']);
                if ($row['Testdate'] > $last_login) {
                    $row['new'] = true;
                } else {
                    $row['new'] = false;
                }
                $row['Testdate'] = $dateformatter->format($row['Testdate']);
                $url = '';
                switch ($row['Feedback_level']) {
                case 'profile':
                    $url = '/' . $row['CandID'];
                    break;
                case 'visit':
                    $url = '/instrument_list/'
                        . '?candID=' . $row['CandID']
                        . '&sessionID='. $row['SessionID'];
                    break;

                case 'instrument':
                    $instrument = $DB->pselectOne(
                        "SELECT Test_name from flag f
			    	JOIN test_names tn ON (f.TestID=tn.ID)
			    	WHERE CommentID=:cid",
                        ['cid' => $row['CommentID']]
                    );
                    if (!empty($instrument)) {
                        $url = '/instruments/'. $instrument
                            . '/?candID=' . $row['CandID']
                            . '&sessionID=' . $row['SessionID']
                            . '&commentID=' . $row['CommentID'];
                    }
                    break;
                }
                $row['URL']          = $url;
                $frontend_feedback[] = $row;
            }
            return [
                new \LORIS\dashboard\Widget(
                    new \LORIS\dashboard\WidgetContent(
                        dgettext(
                            "bvl_feedback",
                            "Behavioural Feedback Notifications"
                        ),
                        $this->renderTemplate(
                            "dashboardwidget.tpl",
                            [
                                'baseURL'       => $baseURL,
                                'notifications' => $frontend_feedback
                            ]
                        ),
                        ""
                    ),
                    new \LORIS\dashboard\WidgetDisplayProps("small"),
                )
            ];
        }
        return [];
    }
}
