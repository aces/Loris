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
 * A MethylationDTO represents an Methylation in the genomic browser module.
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
class MethylationDTO implements \LORIS\Data\DataInstance
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
             'PSC'              => $this->PSC,
             'DCCID'            => $this->DCCID,
             'PSCID'            => $this->PSCID,
             'Sex'              => $this->Sex,
             'Subproject'       => $this->Subproject,
             'DoB'              => $this->DoB,
             'Sample'           => $this->Sample,
             'cpg_name'         => $this->cpg_name,
             'Beta_value'       => $this->Beta_value,
             'Chromosome'       => $this->Chromosome,
             'Strand'           => $this->Strand,
             'StartLoc'         => $this->StartLoc,
             'Probe_Loc_A'      => $this->Probe_Loc_A,
             'Probe_Seq_A'      => $this->Probe_Seq_A,
             'Probe_Loc_B'      => $this->Probe_Loc_B,
             'Probe_Seq_B'      => $this->Probe_Seq_B,
             'Design'           => $this->Design,
             'Color'            => $this->Color,
             'Assembly'         => $this->Assembly,
             'SNP_10'           => $this->SNP_10,
             'Gene'             => $this->Gene,
             'Accession_number' => $this->Accession_number,
             'Gene_Grp'         => $this->Gene_Grp,
             'Island_Loc'       => $this->Island_Loc,
             'Context'          => $this->Context,
             'Fantom_Prom'      => $this->Fantom_Prom,
             'DMR'              => $this->DMR,
             'Enhancer'         => $this->Enhancer,
             'HMM_Island'       => $this->HMM_Island,
             'Reg_Feature_Loc'  => $this->Reg_Feature_Loc,
             'Reg_Feature_Grp'  => $this->Reg_Feature_Grp,
             'DHS'              => $this->DHS,
             'Platform'         => $this->Platform,
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
