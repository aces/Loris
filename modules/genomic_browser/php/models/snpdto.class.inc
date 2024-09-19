<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Genomic_Browser
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\genomic_browser\Models;

use \LORIS\Data\DataInstance;
use \LORIS\StudyEntities\SiteHaver;

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
class SnpDTO implements DataInstance, SiteHaver
{
    /**
     * The centerID
     *
     * @var int
     */
    private $_centerID;

    /**
     * The projectID
     *
     * @var int
     */
    private $_projectID;

    /**
     * The PSC
     *
     * @var string
     */
    private $_PSC = "";

    /**
     * The DCCID
     *
     * @var string
     */
    private $_DCCID = "";

    /**
     * The PSCID
     *
     * @var string
     */
    private $_PSCID = "";

    /**
     * The Sex
     *
     * @var string
     */
    private $_Sex = "";

    /**
     * The Cohort
     *
     * @var string
     */
    private $_Cohort = "";

    /**
     * The DoB
     *
     * @var string
     */
    private $_DoB = "";

    /**
     * The externalID
     *
     * @var string
     */
    private $_externalID = "";

    /**
     * The Chromosome
     *
     * @var string
     */
    private $_Chromosome = "";

    /**
     * The Strand
     *
     * @var string
     */
    private $_Strand = "";

    /**
     * The StartLoc
     *
     * @var string
     */
    private $_StartLoc = "";

    /**
     * The EndLoc
     *
     * @var string
     */
    private $_EndLoc = "";

    /**
     * The Gene_Symbol
     *
     * @var string
     */
    private $_Gene_Symbol = "";

    /**
     * The Gene_Name
     *
     * @var string
     */
    private $_Gene_Name = "";

    /**
     * The Platform
     *
     * @var string
     */
    private $_Platform = "";

    /**
     * The rsID
     *
     * @var string
     */
    private $_rsID = "";

    /**
     * The SNP_Name
     *
     * @var string
     */
    private $_SNP_Name = "";

    /**
     * The SNP_Description
     *
     * @var string
     */
    private $_SNP_Description = "";

    /**
     * The External_Source
     *
     * @var string
     */
    private $_External_Source = "";

    /**
     * The Allele_A
     *
     * @var string
     */
    private $_Allele_A = "";

    /**
     * The Allele_B
     *
     * @var string
     */
    private $_Allele_B = "";

    /**
     * The Reference_Base
     *
     * @var string
     */
    private $_Reference_Base = "";

    /**
     * The Minor_Allele
     *
     * @var string
     */
    private $_Minor_Allele = "";

    /**
     * The Array_Report
     *
     * @var string
     */
    private $_Array_Report = "";

    /**
     * The Markers
     *
     * @var string
     */
    private $_Markers = "";

    /**
     * The Validation_Method
     *
     * @var string
     */
    private $_Validation_Method = "";

    /**
     * The Validated
     *
     * @var string
     */
    private $_Validated = "";

    /**
     * The Function_Prediction
     *
     * @var string
     */
    private $_Function_Prediction = "";

    /**
     * The Damaging
     *
     * @var string
     */
    private $_Damaging = "";

    /**
     * The Genotype_Quality
     *
     * @var string
     */
    private $_Genotype_Quality = "";

    /**
     * The Exonic_Function
     *
     * @var string
     */
    private $_Exonic_Function = "";

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'PSC'                 => $this->_PSC,
            'DCCID'               => $this->_DCCID,
            'PSCID'               => $this->_PSCID,
            'Sex'                 => $this->_Sex,
            'Cohort'              => $this->_Cohort,
            'DoB'                 => $this->_DoB,
            'externalID'          => $this->_externalID,
            'Chromosome'          => $this->_Chromosome,
            'Strand'              => $this->_Strand,
            'StartLoc'            => $this->_StartLoc,
            'EndLoc'              => $this->_EndLoc,
            'Gene_Symbol'         => $this->_Gene_Symbol,
            'Gene_Name'           => $this->_Gene_Name,
            'Platform'            => $this->_Platform,
            'rsID'                => $this->_rsID,
            'SNP_Name'            => $this->_SNP_Name,
            'SNP_Description'     => $this->_SNP_Description,
            'External_Source'     => $this->_External_Source,
            'Allele_A'            => $this->_Allele_A,
            'Allele_B'            => $this->_Allele_B,
            'Reference_Base'      => $this->_Reference_Base,
            'Minor_Allele'        => $this->_Minor_Allele,
            'Array_Report'        => $this->_Array_Report,
            'Markers'             => $this->_Markers,
            'Validation_Method'   => $this->_Validation_Method,
            'Validated'           => $this->_Validated,
            'Function_Prediction' => $this->_Function_Prediction,
            'Damaging'            => $this->_Damaging,
            'Genotype_Quality'    => $this->_Genotype_Quality,
            'Exonic_Function'     => $this->_Exonic_Function,
        ];
    }

    /**
     * Returns the CenterID for this row
     *
     * @return \CenterID The CenterID
     */
    public function getCenterID(): \CenterID
    {
        return \CenterID::singleton($this->_centerID);
    }

    /**
     * Returns the ProjectID for this row
     *
     * @return \ProjectID The ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return \ProjectID::singleton($this->_projectID);
    }
}
