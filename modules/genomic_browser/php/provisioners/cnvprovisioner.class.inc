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
            '
            SELECT psc.Name AS PSC, 
                   LPAD(candidate.CandID, 6, "0") AS DCCID, 
                   candidate.PSCID, candidate.Sex, 
                   cohort.SubprojectID as Subproject, 
                   DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB, 
                   candidate.ExternalID as ExternalID, 
                   CNV.Chromosome as Chromosome, 
                   CNV.Strand as Strand, 
                   CNV.StartLoc as StartLoc, 
                   CNV.EndLoc as EndLoc, 
                   CONCAT(
                              CNV.Chromosome,
                              ":",
                              CNV.StartLoc,
                              "-",
                              CNV.EndLoc
                           ) as Location, 
                   CNV.OfficialSymbol as Gene_Symbol, 
                   CNV.OfficialName as Gene_Name, 
                   CNV.Description as CNV_Description, 
                   CNV.Type as CNV_Type, 
                   CNV.CopyNumChange as Copy_Num_Change, 
                   CNV.EventName as Event_Name, 
                   CNV.Common_CNV as Common_CNV, 
                   CNV.Characteristics as Characteristics, 
                   CNV.Inheritance as Inheritance, 
                   CNV.ArrayReport as Array_Report, 
                   CNV.Markers as Markers, 
                   CNV.ValidationMethod as Validation_Method, 
                   genotyping_platform.Name as Platform FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID=candidate.CandID)
            LEFT JOIN psc ON (psc.CenterID=candidate.RegistrationCenterID)
            JOIN CNV ON (candidate.CandID = CNV.CandID)
            LEFT JOIN genotyping_platform ON
              (CNV.PlatformID = genotyping_platform.PlatformID)
            WHERE
            candidate.Entity_type = \'Human\' AND candidate.Active = \'Y\'
            ',
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
