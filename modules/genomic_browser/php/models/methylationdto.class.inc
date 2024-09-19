<?php
declare(strict_types=1);

namespace LORIS\genomic_browser\Models;

use \LORIS\Data\DataInstance;
use \LORIS\StudyEntities\SiteHaver;

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
 * @link     https://github.com/aces/Loris
 */
class MethylationDTO implements DataInstance, SiteHaver
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
     * The Sample
     *
     * @var string
     */
    private $_Sample = "";

    /**
     * The cpg_name
     *
     * @var string
     */
    private $_cpg_name = "";

    /**
     * The Beta_value
     *
     * @var string
     */
    private $_Beta_value = "";

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
     * The Probe_Loc_A
     *
     * @var string
     */
    private $_Probe_Loc_A = "";

    /**
     * The Probe_Seq_A
     *
     * @var string
     */
    private $_Probe_Seq_A = "";

    /**
     * The Probe_Loc_B
     *
     * @var string
     */
    private $_Probe_Loc_B = "";

    /**
     * The Probe_Seq_B
     *
     * @var string
     */
    private $_Probe_Seq_B = "";

    /**
     * The Design
     *
     * @var string
     */
    private $_Design = "";

    /**
     * The Color
     *
     * @var string
     */
    private $_Color = "";

    /**
     * The Assembly
     *
     * @var string
     */
    private $_Assembly = "";

    /**
     * The SNP_10
     *
     * @var string
     */
    private $_SNP_10 = "";

    /**
     * The Gene
     *
     * @var string
     */
    private $_Gene = "";

    /**
     * The Accession_number
     *
     * @var string
     */
    private $_Accession_number = "";

    /**
     * The Gene_Grp
     *
     * @var string
     */
    private $_Gene_Grp = "";

    /**
     * The Island_Loc
     *
     * @var string
     */
    private $_Island_Loc = "";

    /**
     * The Context
     *
     * @var string
     */
    private $_Context = "";

    /**
     * The Fantom_Prom
     *
     * @var string
     */
    private $_Fantom_Prom = "";

    /**
     * The DMR
     *
     * @var string
     */
    private $_DMR = "";

    /**
     * The Enhancer
     *
     * @var string
     */
    private $_Enhancer = "";

    /**
     * The HMM_Island
     *
     * @var string
     */
    private $_HMM_Island = "";

    /**
     * The Reg_Feature_Loc
     *
     * @var string
     */
    private $_Reg_Feature_Loc = "";

    /**
     * The Reg_Feature_Grp
     *
     * @var string
     */
    private $_Reg_Feature_Grp = "";

    /**
     * The DHS
     *
     * @var string
     */
    private $_DHS = "";

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
            'PSC'              => $this->_PSC,
            'DCCID'            => $this->_DCCID,
            'PSCID'            => $this->_PSCID,
            'Sex'              => $this->_Sex,
            'Cohort'           => $this->_Cohort,
            'DoB'              => $this->_DoB,
            'Sample'           => $this->_Sample,
            'cpg_name'         => $this->_cpg_name,
            'Beta_value'       => $this->_Beta_value,
            'Chromosome'       => $this->_Chromosome,
            'Strand'           => $this->_Strand,
            'StartLoc'         => $this->_StartLoc,
            'Probe_Loc_A'      => $this->_Probe_Loc_A,
            'Probe_Seq_A'      => $this->_Probe_Seq_A,
            'Probe_Loc_B'      => $this->_Probe_Loc_B,
            'Probe_Seq_B'      => $this->_Probe_Seq_B,
            'Design'           => $this->_Design,
            'Color'            => $this->_Color,
            'Assembly'         => $this->_Assembly,
            'SNP_10'           => $this->_SNP_10,
            'Gene'             => $this->_Gene,
            'Accession_number' => $this->_Accession_number,
            'Gene_Grp'         => $this->_Gene_Grp,
            'Island_Loc'       => $this->_Island_Loc,
            'Context'          => $this->_Context,
            'Fantom_Prom'      => $this->_Fantom_Prom,
            'DMR'              => $this->_DMR,
            'Enhancer'         => $this->_Enhancer,
            'HMM_Island'       => $this->_HMM_Island,
            'Reg_Feature_Loc'  => $this->_Reg_Feature_Loc,
            'Reg_Feature_Grp'  => $this->_Reg_Feature_Grp,
            'DHS'              => $this->_DHS,
            'Platform'         => $this->_Platform,
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
