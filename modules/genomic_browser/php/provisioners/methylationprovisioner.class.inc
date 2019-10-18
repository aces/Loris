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
class MethylationProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    private $_and = '';

    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        $user = \User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            $site_arr     = implode(",", $user->getCenterIDs());
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
                gscr.sample_label AS Sample,
                cpg.cpg_name AS cpg_name,
                cpg.beta_value AS Beta_value,
                gca.Chromosome AS Chromosome,
                gca.Strand AS Strand,
                gca.StartLoc AS StartLoc,
                gca.address_id_a AS Probe_Loc_A,
                gca.probe_seq_a AS Probe_Seq_A,
                gca.address_id_b AS Probe_Loc_B,
                gca.probe_seq_b AS Probe_Seq_B,
                gca.design_type AS Design,
                gca.color_channel AS Color,
                gca.genome_build AS Assembly,
                gca.probe_snp_10 AS SNP_10,
                gca.gene_name AS Gene,
                gca.gene_acc_num AS Accession_number,
                gca.gene_group AS Gene_Grp,
                gca.island_loc AS Island_Loc,
                gca.island_relation AS Context,
                gca.fantom_promoter_loc AS Fantom_Prom,
                gca.dmr AS DMR,
                gca.enhancer AS Enhancer,
                gca.hmm_island_loc AS HMM_Island,
                gca.reg_feature_loc AS Reg_Feature_Loc,
                gca.reg_feature_group AS Reg_Feature_Grp,
                gca.dhs AS DHS,
                platform.Name AS Platform
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
                LEFT JOIN genomic_sample_candidate_rel gscr ON (gscr.CandID = candidate.CandID)
                LEFT JOIN genomic_cpg cpg ON (gscr.sample_label = cpg.sample_label)
                LEFT JOIN genomic_cpg_annotation gca USING (cpg_name)
                LEFT JOIN genotyping_platform platform ON (gca.platform_id = platform.PlatformID)
            WHERE
                cpg.beta_value IS NOT NULL
                AND candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
                $this->_and
            ",
            array(),
            '\LORIS\genomic_browser\Models\MethylationDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return MethylationProvisioner
     */
    public function forUser(\User $user): MethylationProvisioner
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
