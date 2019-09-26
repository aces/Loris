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
 * A CnvDTO represents an CNV in the genomic browser module.
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
class CnvDTO implements \LORIS\Data\DataInstance
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
             'PSC'               => $this->PSC,
             'DCCID'             => $this->DCCID,
             'PSCID'             => $this->PSCID,
             'Sex'               => $this->Sex,
             'Subproject'        => $this->Subproject,
             'DoB'               => $this->DoB,
             'ExternalID'        => $this->ExternalID,
             'Chromosome'        => $this->Chromosome,
             'Strand'            => $this->Strand,
             'StartLoc'          => $this->StartLoc,
             'EndLoc'            => $this->EndLoc,
             'Location'          => $this->Location,
             'Gene_Symbol'       => $this->Gene_Symbol,
             'Gene_Name'         => $this->Gene_Name,
             'CNV_Description'   => $this->CNV_Description,
             'CNV_Type'          => $this->CNV_Type,
             'Copy_Num_Change'   => $this->Copy_Num_Change,
             'Event_Name'        => $this->Event_Name,
             'Common_CNV'        => $this->Common_CNV,
             'Characteristics'   => $this->Characteristics,
             'Inheritance'       => $this->Inheritance,
             'Array_Report'      => $this->Array_Report,
             'Markers'           => $this->Markers,
             'Validation_Method' => $this->Validation_Method,
             'Platform'          => $this->Platform,
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
