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
 * The SnpProvisioner class.
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
    private $_and = '';

    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        $user = \User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            // restrict data to own site
            $site_arr   = implode(",", $user->getCenterIDs());
            $this->_and = " AND candidate.RegistrationCenterID IN ("
                . $site_arr . ")";
        }
        parent::__construct(
            "
            SELECT
                psc.Name AS _PSC,
                LPAD(candidate.CandID, 6, '0') AS _DCCID,
                candidate.PSCID AS _PSCID,
                candidate.Sex AS _Sex,
                subproj.title AS _Subproject,
                DATE_FORMAT(candidate.DoB, '%Y-%m-%d') AS _DoB,
                candidate.ExternalID AS _externalID,
                SNP.Chromosome AS _Chromosome,
                SNP.Strand AS _Strand,
                SNP.StartLoc AS _StartLoc,
                SNP.EndLoc AS _EndLoc,
                SNP.OfficialSymbol AS _Gene_Symbol,
                SNP.OfficialName AS _Gene_Name,
                genotyping_platform.Name AS _Platform,
                SNP.rsID AS _rsID,
                SNP.SNPExternalName AS _SNP_Name,
                SNP.Description AS _SNP_Description,
                SNP.SNPExternalSource AS _External_Source,
                SNP_candidate_rel.AlleleA AS _Allele_A,
                SNP_candidate_rel.AlleleB AS _Allele_B,
                SNP.ReferenceBase AS _Reference_Base,
                SNP.MinorAllele AS _Minor_Allele,
                SNP_candidate_rel.ArrayReport AS _Array_Report,
                SNP.Markers AS _Markers,
                SNP_candidate_rel.ValidationMethod AS _Validation_Method,
                SNP_candidate_rel.Validated AS _Validated,
                SNP.FunctionPrediction AS _Function_Prediction,
                SNP.Damaging AS _Damaging,
                SNP_candidate_rel.GenotypeQuality AS _Genotype_Quality,
                SNP.ExonicFunction AS _Exonic_Function
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
                LEFT JOIN subproject AS subproj
                    ON (cohort.SubprojectID = subproj.SubprojectID)
                LEFT JOIN psc ON (psc.CenterID = candidate.RegistrationCenterID)
                JOIN SNP_candidate_rel
                    ON (candidate.CandID = SNP_candidate_rel.CandID)
                LEFT JOIN SNP ON (SNP.SNPID = SNP_candidate_rel.SNPID)
                LEFT JOIN genotyping_platform
                    ON (SNP_candidate_rel.PlatformID =
                        genotyping_platform.PlatformID)
            WHERE
                candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
                $this->_and
            LIMIT 10000
            ",
            [],
            '\LORIS\genomic_browser\Models\SnpDTO'
        );
    }
}
