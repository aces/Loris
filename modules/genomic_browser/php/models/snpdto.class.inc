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

namespace LORIS\genomic_browser\Models;

/**
 * A SnpDTO represents an SNP in the genomic browser module.
 * It is doing the mapping between the profile table columns
 * and the JSON object properties returned to the frontend.
 *
 * Additionally, it implements the DataInstance interface so it can be used by
 * a Database Provisioner.
 *
 * @category Genomic_Browser
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class SnpDTO implements \LORIS\Data\DataInstance
{
    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string
     */
    public function toJSON(): string
    {
        return json_encode(
            array(
             'PSC'                 => $this->PSC,
             'DCCID'               => $this->DCCID,
             'PSCID'               => $this->PSCID,
             'Sex'                 => $this->Sex,
             'Subproject'          => $this->Subproject,
             'DoB'                 => $this->DoB,
             'externalID'          => $this->externalID,
             'Chromosome'          => $this->Chromosome,
             'Strand'              => $this->Strand,
             'StartLoc'            => $this->StartLoc,
             'EndLoc'              => $this->EndLoc,
             'Gene_Symbol'         => $this->Gene_Symbol,
             'Gene_Name'           => $this->Gene_Name,
             'Platform'            => $this->Platform,
             'rsID'                => $this->rsID,
             'SNP_Name'            => $this->SNP_Name,
             'SNP_Description'     => $this->SNP_Description,
             'External_Source'     => $this->External_Source,
             'Allele_A'            => $this->Allele_A,
             'Allele_B'            => $this->Allele_B,
             'Reference_Base'      => $this->Reference_Base,
             'Minor_Allele'        => $this->Minor_Allele,
             'Array_Report'        => $this->Array_Report,
             'Markers'             => $this->Markers,
             'Validation_Method'   => $this->Validation_Method,
             'Validated'           => $this->Validated,
             'Function_Prediction' => $this->Function_Prediction,
             'Damaging'            => $this->Damaging,
             'Genotype_Quality'    => $this->Genotype_Quality,
             'Exonic_Function'     => $this->Exonic_Function,
            )
        );
    }
    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return string
     */
    public function getPSC(): string
    {
        return (string) $this->psc;
    }
}
