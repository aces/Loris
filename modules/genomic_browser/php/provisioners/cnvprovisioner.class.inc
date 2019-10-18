<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Genomic_Browser
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
 * @category Genomic_Browser
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class CnvProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
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
                candidate.ExternalID AS ExternalID,
                CNV.Chromosome AS Chromosome,
                CNV.Strand AS Strand,
                CNV.StartLoc AS StartLoc,
                CNV.EndLoc AS EndLoc,
                CONCAT(CNV.Chromosome, ':', CNV.StartLoc, '-', CNV.EndLoc) AS LOCATION,
                CNV.OfficialSymbol AS Gene_Symbol,
                CNV.OfficialName AS Gene_Name,
                CNV.Description AS CNV_Description,
                CNV.Type AS CNV_Type,
                CNV.CopyNumChange AS Copy_Num_Change,
                CNV.EventName AS Event_Name,
                CNV.Common_CNV AS Common_CNV,
                CNV.Characteristics AS Characteristics,
                CNV.Inheritance AS Inheritance,
                CNV.ArrayReport AS Array_Report,
                CNV.Markers AS Markers,
                CNV.ValidationMethod AS Validation_Method,
                genotyping_platform.Name AS Platform
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
                JOIN CNV ON (candidate.CandID = CNV.CandID)
                LEFT JOIN genotyping_platform ON (CNV.PlatformID = genotyping_platform.PlatformID)
            WHERE
                candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
            ",
            array(),
            '\LORIS\genomic_browser\Models\CnvDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return CnvProvisioner
     */
    public function forUser(\User $user): CnvProvisioner
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
