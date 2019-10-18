<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Genomics
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\genomic_browser\Provisioners;

/**
 * Genomic Browser module
 *
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class ProfileProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    private $_and = '';

    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        $user = \User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            // allow only to view own site data
            $site_arr   = implode(",", $user->getCenterIDs());
            $this->_and = " AND candidate.RegistrationCenterID IN ($site_arr)";
        }
        parent::__construct(
            "
            SELECT
                psc.Name AS PSC,
                LPAD(candidate.CandID, 6, '0') AS DCCID,
                candidate.PSCID,
                candidate.Sex,
                cohort.SubprojectID AS Subproject,
                DATE_FORMAT(candidate.DoB, '%Y-%m-%d') AS DoB,
                candidate.ExternalID AS externalID,
                CASE WHEN EXISTS (
                    SELECT
                        genomicfileid
                    FROM
                        genomic_candidate_files_rel
                    WHERE
                        candid = candidate.candid) THEN
                    'Y'
                ELSE
                    'N'
                END AS File, CASE WHEN EXISTS (
                    SELECT
                        snpid
                    FROM
                        SNP_candidate_rel
                    WHERE
                        candid = candidate.candid) THEN
                    'Y'
                ELSE
                    'N'
                END AS SNP, CASE WHEN EXISTS (
                    SELECT
                        cnvid
                    FROM
                        CNV
                    WHERE
                        candid = candidate.candid) THEN
                    'Y'
                ELSE
                    'N'
                END AS CNV, CASE WHEN EXISTS (
                    SELECT
                        cpg_name
                    FROM
                        genomic_sample_candidate_rel
                    LEFT JOIN genomic_cpg USING (sample_label)
                WHERE
                    candid = candidate.candid) THEN
                    'Y'
                ELSE
                    'N'
                END AS CPG
            FROM
                candidate
                LEFT JOIN (
                    SELECT
                        s.CandID,
                        min(s.subprojectID) AS SubprojectID
                    FROM
                        session s
                    GROUP BY
                        s.CandID) AS cohort ON (cohort.CandID = candidate.CandID)
                LEFT JOIN psc ON (psc.CenterID = candidate.RegistrationCenterID)
            WHERE
                candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
                $this->_and
            ",
            array(),
            '\LORIS\genomic_browser\Models\ProfileDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return ProfileProvisioner
     */
    public function forUser(\User $user): ProfileProvisioner
    {
        $new = clone($this);
        if (!$user->hasPermission('access_all_profiles')) {
            $new = $new->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        return $new;
    }
}
