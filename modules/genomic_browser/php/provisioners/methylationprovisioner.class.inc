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

namespace LORIS\genomic_browser\provisioners;

/**
 * The MethylationProvisioner class.
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
            $site_arr   = implode(",", $user->getCenterIDs());
            $this->_and = " AND candidate.RegistrationCenterID IN ($site_arr)";
        }
        parent::__construct(
            "
           SELECT
                psc.Name AS _PSC,
                LPAD(candidate.CandID, 6, '0') AS _DCCID,
                candidate.PSCID AS _PSCID,
                candidate.Sex AS _Sex,
                cohort.SubprojectID AS _Subproject,
                DATE_FORMAT(candidate.DoB, '%Y-%m-%d') AS _DoB,
                gscr.sample_label AS _Sample,
                cpg.cpg_name AS _cpg_name,
                cpg.beta_value AS _Beta_value,
                gca.Chromosome AS _Chromosome,
                gca.Strand AS _Strand,
                gca.StartLoc AS _StartLoc,
                gca.address_id_a AS _Probe_Loc_A,
                gca.probe_seq_a AS _Probe_Seq_A,
                gca.address_id_b AS _Probe_Loc_B,
                gca.probe_seq_b AS _Probe_Seq_B,
                gca.design_type AS _Design,
                gca.color_channel AS _Color,
                gca.genome_build AS _Assembly,
                gca.probe_snp_10 AS _SNP_10,
                gca.gene_name AS _Gene,
                gca.gene_acc_num AS _Accession_number,
                gca.gene_group AS _Gene_Grp,
                gca.island_loc AS _Island_Loc,
                gca.island_relation AS _Context,
                gca.fantom_promoter_loc AS _Fantom_Prom,
                gca.dmr AS _DMR,
                gca.enhancer AS _Enhancer,
                gca.hmm_island_loc AS _HMM_Island,
                gca.reg_feature_loc AS _Reg_Feature_Loc,
                gca.reg_feature_group AS _Reg_Feature_Grp,
                gca.dhs AS _DHS,
                platform.Name AS _Platform
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
                LEFT JOIN genomic_sample_candidate_rel gscr
                    ON (gscr.CandID = candidate.CandID)
                LEFT JOIN genomic_cpg cpg ON (gscr.sample_label = cpg.sample_label)
                LEFT JOIN genomic_cpg_annotation gca USING (cpg_name)
                LEFT JOIN genotyping_platform platform
                    ON (gca.platform_id = platform.PlatformID)
            WHERE
                cpg.beta_value IS NOT NULL
                AND candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
                $this->_and
            ",
            [],
            '\LORIS\genomic_browser\Models\MethylationDTO'
        );
    }
}
