<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Genomics
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\genomic_browser\provisioners;

/**
 * The GwasProvisioner class.
 *
 * PHP version 7
 *
 * @category Genomics
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class GwasProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            "
            SELECT
                GWAS.rsID AS _SNP_ID,
                SNP.Chromosome AS _Chromosome,
                SNP.StartLoc AS _Position_BP,
                GWAS.MajorAllele AS _Major_Allele,
                GWAS.MinorAllele AS _Minor_Allele,
                GWAS.MAF AS _MAF,
                GWAS.Estimate AS _Estimate,
                GWAS.StdErr AS _StdErr,
                GWAS.Pvalue AS _Pvalue
            FROM
                GWAS
                JOIN SNP ON (GWAS.SNPID = SNP.SNPID)
            ",
            [],
            '\LORIS\genomic_browser\Models\GwasDTO'
        );
    }
}
