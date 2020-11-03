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
 * A GwasDTO represents an GWAS in the genomic browser module.
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
class GwasDTO implements \LORIS\Data\DataInstance
{
    /**
     * The SNP_ID
     *
     * @var string
     */
    private $_SNP_ID = "";

    /**
     * The Chromosome
     *
     * @var string
     */
    private $_Chromosome = "";

    /**
     * The Position_BP
     *
     * @var string
     */
    private $_Position_BP = "";

    /**
     * The Major_Allele
     *
     * @var string
     */
    private $_Major_Allele = "";

    /**
     * The Minor_Allele
     *
     * @var string
     */
    private $_Minor_Allele = "";

    /**
     * The MAF
     *
     * @var string
     */
    private $_MAF = "";

    /**
     * The Estimate
     *
     * @var string
     */
    private $_Estimate = "";

    /**
     * The StdErr
     *
     * @var string
     */
    private $_StdErr = "";

    /**
     * The Pvalue
     *
     * @var string
     */
    private $_Pvalue = "";

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize() : array
    {
        return [
            'SNP_ID'       => $this->_SNP_ID,
            'Chromosome'   => $this->_Chromosome,
            'Position_BP'  => $this->_Position_BP,
            'Major_Allele' => $this->_Major_Allele,
            'Minor_Allele' => $this->_Minor_Allele,
            'MAF'          => $this->_MAF,
            'Estimate'     => $this->_Estimate,
            'StdErr'       => $this->_StdErr,
            'Pvalue'       => $this->_Pvalue,
        ];
    }
}
