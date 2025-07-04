<?php declare(strict_types=1);

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
 * @link     https://github.com/aces/Loris
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
                psc.Name AS _PSC,
                LPAD(candidate.CandID, 10, '0') AS _DCCID,
                candidate.PSCID AS _PSCID,
                candidate.Sex AS _Sex,
                cohort.CohortID AS _Cohort,
                candidate.ExternalID AS _ExternalID,
                candidate.RegistrationCenterID as _centerID,
                candidate.RegistrationProjectID as _projectID,
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
                        c.CandID,
                        min(s.cohortID) AS CohortID
                    FROM session s
                    JOIN candidate c ON c.ID=s.CandidateID
                    GROUP BY
                        c.CandID) AS cohort ON (cohort.CandID = candidate.CandID)
                LEFT JOIN psc ON (psc.CenterID = candidate.RegistrationCenterID)
                JOIN CNV ON (candidate.ID = CNV.CandidateID)
                LEFT JOIN genotyping_platform
                    ON (CNV.PlatformID = genotyping_platform.PlatformID)
            WHERE
                candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
            ",
            [],
            '\LORIS\genomic_browser\Models\CnvDTO'
        );
    }
}
