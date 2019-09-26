<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\genomic_browser\Provisioners;

/**
 * Genomic Browser module
 *
 * PHP version 7
 *
 * @category Datadict
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
            '
            SELECT GWAS.rsID AS SNP_ID, 
                   SNP.Chromosome AS Chromosome, 
                   SNP.StartLoc AS Position_BP, 
                   GWAS.MajorAllele AS Major_Allele, 
                   GWAS.MinorAllele AS Minor_Allele, 
                   GWAS.MAF AS MAF, 
                   GWAS.Estimate AS Estimate, 
                   GWAS.StdErr AS StdErr, 
                   GWAS.Pvalue AS Pvalue FROM GWAS
            JOIN SNP ON (GWAS.SNPID = SNP.SNPID)
            ',
            array(),
            '\LORIS\genomic_browser\Models\GwasDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return GwasProvisioner
     */
    public function forUser(\User $user): GwasProvisioner
    {
        $new = clone($this);
        if (!$user->hasPermission('access_all_profiles')) {
            $new = $new->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        return $new;
    }
}
