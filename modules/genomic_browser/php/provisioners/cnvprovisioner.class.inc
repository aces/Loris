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

namespace LORIS\genomic_browser\provisioners;

/**
 * The CnvProvisioner class.
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
    private $_and = '';

    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        $user = \User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
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
                cohort.SubprojectID AS _Subproject,
                DATE_FORMAT(candidate.DoB, '%Y-%m-%d') AS _DoB,
                candidate.ExternalID AS _ExternalID,
                CNV.Chromosome AS _Chromosome,
                CNV.Strand AS _Strand,
                CNV.StartLoc AS _StartLoc,
                CNV.EndLoc AS _EndLoc,
                CONCAT(CNV.Chromosome, ':', CNV.StartLoc, '-', CNV.EndLoc)
                    AS LOCATION,
                CNV.OfficialSymbol AS _Gene_Symbol,
                CNV.OfficialName AS _Gene_Name,
                CNV.Description AS _CNV_Description,
                CNV.Type AS _CNV_Type,
                CNV.CopyNumChange AS _Copy_Num_Change,
                CNV.EventName AS _Event_Name,
                CNV.Common_CNV AS _Common_CNV,
                CNV.Characteristics AS C_haracteristics,
                CNV.Inheritance AS _Inheritance,
                CNV.ArrayReport AS _Array_Report,
                CNV.Markers AS _Markers,
                CNV.ValidationMethod AS _Validation_Method,
                genotyping_platform.Name AS _Platform
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
                LEFT JOIN genotyping_platform
                    ON (CNV.PlatformID = genotyping_platform.PlatformID)
            WHERE
                candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
                $this->_and
            ",
            [],
            '\LORIS\genomic_browser\Models\CnvDTO'
        );
    }
}
