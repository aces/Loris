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
     * The Subproject
     *
     * @var string
     */
    private $_Subproject = "";

    /**
     * The DoB
     *
     * @var string
     */
    private $_DoB = "";

    /**
     * The ExternalID
     *
     * @var string
     */
    private $_ExternalID = "";

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
     * The Location
     *
     * @var string
     */
    private $_Location = "";

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
     * The CNV_Description
     *
     * @var string
     */
    private $_CNV_Description = "";

    /**
     * The CNV_Type
     *
     * @var string
     */
    private $_CNV_Type = "";

    /**
     * The Copy_Num_Change
     *
     * @var string
     */
    private $_Copy_Num_Change = "";

    /**
     * The Event_Name
     *
     * @var string
     */
    private $_Event_Name = "";

    /**
     * The Common_CNV
     *
     * @var string
     */
    private $_Common_CNV = "";

    /**
     * The Characteristics
     *
     * @var string
     */
    private $_Characteristics = "";

    /**
     * The Inheritance
     *
     * @var string
     */
    private $_Inheritance = "";

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
     * The Platform
     *
     * @var string
     */
    private $_Platform = "";

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return [
            'PSC'               => $this->_PSC,
            'DCCID'             => $this->_DCCID,
            'PSCID'             => $this->_PSCID,
            'Sex'               => $this->_Sex,
            'Subproject'        => $this->_Subproject,
            'DoB'               => $this->_DoB,
            'ExternalID'        => $this->_ExternalID,
            'Chromosome'        => $this->_Chromosome,
            'Strand'            => $this->_Strand,
            'StartLoc'          => $this->_StartLoc,
            'EndLoc'            => $this->_EndLoc,
            'Location'          => $this->_Location,
            'Gene_Symbol'       => $this->_Gene_Symbol,
            'Gene_Name'         => $this->_Gene_Name,
            'CNV_Description'   => $this->_CNV_Description,
            'CNV_Type'          => $this->_CNV_Type,
            'Copy_Num_Change'   => $this->_Copy_Num_Change,
            'Event_Name'        => $this->_Event_Name,
            'Common_CNV'        => $this->_Common_CNV,
            'Characteristics'   => $this->_Characteristics,
            'Inheritance'       => $this->_Inheritance,
            'Array_Report'      => $this->_Array_Report,
            'Markers'           => $this->_Markers,
            'Validation_Method' => $this->_Validation_Method,
            'Platform'          => $this->_Platform,
        ];
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
