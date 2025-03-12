<?php declare(strict_types=1);

namespace LORIS\genomic_browser\provisioners;

/**
 * The ProfileProvisioner class.
 *
 * PHP version 7
 *
 * @category Genomics
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ProfileProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
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
                subproj.title AS _Cohort,
                DATE_FORMAT(candidate.DoB, '%Y-%m-%d') AS _DoB,
                candidate.ExternalID AS _externalID,
                candidate.RegistrationCenterID as _centerID,
                candidate.RegistrationProjectID as _projectID,
                CASE WHEN EXISTS (
                    SELECT
                        genomicfileid
                    FROM
                        genomic_candidate_files_rel gcfr
                    WHERE
                        candidate.ID = gcfr.CandidateID) THEN
                    'Y'
                ELSE
                    'N'
                END AS _File, CASE WHEN EXISTS (
                    SELECT
                        snpid
                    FROM
                        SNP_candidate_rel scr
                    WHERE
                        candidate.ID = scr.CandidateID) THEN
                    'Y'
                ELSE
                    'N'
                END AS _SNP, CASE WHEN EXISTS (
                    SELECT
                        cnvid
                    FROM
                        CNV cnv
                    WHERE
                        candidate.ID = cnv.CandidateID) THEN
                    'Y'
                ELSE
                    'N'
                END AS _CNV, CASE WHEN EXISTS (
                    SELECT
                        cpg_name
                    FROM
                        genomic_sample_candidate_rel gscr
                    LEFT JOIN genomic_cpg USING (sample_label)
                WHERE
                    candidate.ID = gscr.CandidateID) THEN
                    'Y'
                ELSE
                    'N'
                END AS _CPG
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
                LEFT JOIN cohort AS subproj
                    ON (cohort.CohortID = subproj.CohortID)
                LEFT JOIN psc ON (psc.CenterID = candidate.RegistrationCenterID)
            WHERE
                candidate.Entity_type = 'Human'
                AND candidate.Active = 'Y'
            ",
            [],
            '\LORIS\genomic_browser\Models\ProfileDTO'
        );
    }
}
