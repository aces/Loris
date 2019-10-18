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
class SnpProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
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
                SNP.Chromosome AS Chromosome,
                SNP.Strand AS Strand,
                SNP.StartLoc AS StartLoc,
                SNP.EndLoc AS EndLoc,
                SNP.OfficialSymbol AS Gene_Symbol,
                SNP.OfficialName AS Gene_Name,
                genotyping_platform.Name AS Platform,
                SNP.rsID AS rsID,
                SNP.SNPExternalName AS SNP_Name,
                SNP.Description AS SNP_Description,
                SNP.SNPExternalSource AS External_Source,
                SNP_candidate_rel.AlleleA AS Allele_A,
                SNP_candidate_rel.AlleleB AS Allele_B,
                SNP.ReferenceBase AS Reference_Base,
                SNP.MinorAllele AS Minor_Allele,
                SNP_candidate_rel.ArrayReport AS Array_Report,
                SNP.Markers AS Markers,
                SNP_candidate_rel.ValidationMethod AS Validation_Method,
                SNP_candidate_rel.Validated AS Validated,
                SNP.FunctionPrediction AS Function_Prediction,
                SNP.Damaging AS Damaging,
                SNP_candidate_rel.GenotypeQuality AS Genotype_Quality,
                SNP.ExonicFunction AS Exonic_Function
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
                JOIN SNP_candidate_rel ON (candidate.CandID = SNP_candidate_rel.CandID)
                LEFT JOIN SNP ON (SNP.SNPID = SNP_candidate_rel.SNPID)
                LEFT JOIN genotyping_platform ON (SNP_candidate_rel.PlatformID = genotyping_platform.PlatformID)
            WHERE
                candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
            ",
            array(),
            '\LORIS\genomic_browser\Models\SnpDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return SnpProvisioner
     */
    public function forUser(\User $user): SnpProvisioner
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
