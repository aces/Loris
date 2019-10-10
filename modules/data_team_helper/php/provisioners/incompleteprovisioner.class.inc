<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category DataTeamHelper
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\data_team_helper\Provisioners;

/**
 * Data Team Helper module
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
class IncompleteProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            '
            SELECT psc.Name AS PSC, 
                   LPAD(candidate.CandID, 6, "0") AS DCCID, 
                   candidate.PSCID, 
                   candidate.Sex, 
                   cohort.SubprojectID as Subproject, 
                   DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB, 
                   candidate.ExternalID as externalID, 
          CASE WHEN EXISTS (
            select genomicfileid
            from genomic_candidate_files_rel
            where candid = candidate.candid
          ) THEN \'Y\' ELSE \'N\' END
         as File, 
          CASE WHEN EXISTS (
            select snpid
            from SNP_candidate_rel
            where candid = candidate.candid
          ) THEN \'Y\' ELSE \'N\' END
         as SNP, 
          CASE WHEN EXISTS (
            select cnvid
            from CNV
            where candid = candidate.candid
          ) THEN \'Y\' ELSE \'N\' END
         as CNV, 
          CASE WHEN EXISTS (
            select cpg_name
            from genomic_sample_candidate_rel
            left join genomic_cpg using (sample_label)
            where candid = candidate.candid
          ) THEN \'Y\' ELSE \'N\' END
         as CPG FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID=candidate.CandID)
            LEFT JOIN psc ON (psc.CenterID= candidate.RegistrationCenterID)
            WHERE
            candidate.Entity_type = \'Human\' AND candidate.Active = \'Y\'
            ',
            array(),
            '\LORIS\data_team_helper\Models\BehaviouralDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return IncompleteProvisioner
     */
    public function forUser(\User $user): IncompleteProvisioner
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
