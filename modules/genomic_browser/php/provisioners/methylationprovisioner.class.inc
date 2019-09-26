<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Datadict
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
                   gscr.sample_label as Sample, 
                   cpg.cpg_name as cpg_name, 
                   cpg.beta_value as Beta_value, 
                   gca.Chromosome as Chromosome, 
                   gca.Strand as Strand, 
                   gca.StartLoc as StartLoc, 
                   gca.address_id_a as Probe_Loc_A, 
                   gca.probe_seq_a as Probe_Seq_A, 
                   gca.address_id_b as Probe_Loc_B, 
                   gca.probe_seq_b as Probe_Seq_B, 
                   gca.design_type as Design, 
                   gca.color_channel as Color, 
                   gca.genome_build as Assembly, 
                   gca.probe_snp_10 as SNP_10, 
                   gca.gene_name as Gene, 
                   gca.gene_acc_num as Accession_number, 
                   gca.gene_group as Gene_Grp, 
                   gca.island_loc as Island_Loc, 
                   gca.island_relation as Context, 
                   gca.fantom_promoter_loc as Fantom_Prom, 
                   gca.dmr as DMR, 
                   gca.enhancer as Enhancer, 
                   gca.hmm_island_loc as HMM_Island, 
                   gca.reg_feature_loc as Reg_Feature_Loc, 
                   gca.reg_feature_group as Reg_Feature_Grp, 
                   gca.dhs as DHS, 
                   platform.Name as Platform FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                    from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID = candidate.CandID)
            LEFT JOIN psc
                ON (psc.CenterID = candidate.RegistrationCenterID)
            LEFT JOIN genomic_sample_candidate_rel gscr
                ON (gscr.CandID = candidate.CandID)
            LEFT JOIN genomic_cpg cpg
                ON (gscr.sample_label = cpg.sample_label)
            LEFT JOIN genomic_cpg_annotation gca
                USING (cpg_name)
            LEFT JOIN genotyping_platform platform
                ON (gca.platform_id = platform.PlatformID)
            WHERE
            cpg.beta_value IS NOT NULL AND
            candidate.Entity_type = \'Human\' AND candidate.Active = \'Y\'
            ',
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
