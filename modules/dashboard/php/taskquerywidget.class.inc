<?php
/**
 * This file contains the TaskQueryWidget class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

namespace LORIS\dashboard;

/**
 * A TaskQueryWidget is a special type of TaskWidget which gets its data from
 * a Database query.
 *
 * The query should return a single count, and the TaskQueryWidget uses it to
 * populate TaskWidget values.
 *
 * It also adds site permissions to the query if applicable.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class TaskQueryWidget extends TaskWidget
{
    /**
     * The site label to display beside the widget for which site
     * this task is for.
     *
     * @var string
     */
    protected $sitelabel;

    /**
     * Construct a TaskQueryWidget
     *
     * @param \User     $user      The user whose tasks are being displayed
     * @param string    $label     The label for the task widget. It should be
     *                             singular and phrased in a way that adding
     *                             an "s" pluralizes.
     * @param \Database $db        The database connection for the query.
     * @param string    $dbquery   The query to run to get a count.
     * @param string    $allperm   The permission to use to determine if the user
     *                             has access to all sites, or only user sites.
     *                             If the empty string, center permissions will
     *                             not be used.
     * @param string    $sitefield The field to use in the query to site-restrict
     *                             the results.
     * @param string    $link      The link for the widget to go to when clicked.
     */
    public function __construct(
        \User $user,
        string $label,
        \Database $db,
        string $dbquery,
        string $allperm,
        string $sitefield,
        string $link
    ) {
        $queryparams     = [];
        $this->sitelabel = "Site: All";
        if ($allperm != '') {
            if (!$user->hasPermission($allperm)) {
                $sites = $user->getCenterIDs();
                $queryparams['SiteID'] = implode(',', $sites);
                $dbquery        .= " AND FIND_IN_SET($sitefield, :SiteID)";
                $this->sitelabel = "Site: All User Sites";
            }
        }

        $number = (int )$db->pselectOne($dbquery, $queryparams);
        if ($number != 1) {
            $label .= "s";
        }

        parent::__construct($label, $number, $link);
    }

    /**
     * Provides a site label for this widget based on user permissions
     * and whether the task is site restricted.
     *
     * @return string
     */
    public function siteLabel() : string
    {
        return $this->sitelabel;
    }
}
