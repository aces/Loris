<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Genomic Browser.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser\endpoints;

use LORIS\genomic_browser\Provisioners\MethylationProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_GenomicBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows methylation to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Methylation extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }
    /**
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();
        // User permission verification.
        $values = $this->_verifyPermissions($request, $values);
        if (isset($values['error'])) {
            switch ($values['error']) {
            case 'BadRequest':
                return new \LORIS\Http\Response\BadRequest(
                    'Failed to retrieve data for Methylation.'
                );
            case 'Forbidden':
                return new \LORIS\Http\Response\Forbidden();
            default:
                break;
            }
        }
        $user        = $request->getAttribute('user');
        $provisioner = (new MethylationProvisioner())->forUser($user);
        // $provisioner = (new MethylationProvisioner())->filter();
        $data         = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body         = array(
                         'data'         => $data,
                         'fieldOptions' => $this->_getFieldOptions($request),
                         'subprojects'  => \Utility::getSubprojectList(),
                        );
        $this->_cache = new \LORIS\Http\Response\JsonResponse($body);
        return $this->_cache;
    }

    /**
     * Provide the select inputs options
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions(
        ServerRequestInterface $request
    ) : array {

        $user = $request->getAttribute('user');

        // PSC
        if ($user->hasPermission('genomic_browser_view_allsites')) {
            // has access to all sites genomic data
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList();
            if (is_array($list_of_sites)) {
                $list_of_sites = array('' => 'Any') + $list_of_sites;
            }
        } else {
            // allow only to view own site data
            $list_of_sites = $user->getStudySites();
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        // Platform
        $DB = \Database::singleton();
        $platform_results = $DB->pselect(
            "SELECT distinct Name FROM genotyping_platform",
            array()
        );
        $platform_options = array('' => 'Any');
        foreach ($platform_results as $row => $result) {
            $name = $result['Name'];
            $platform_options[$name] = $name;
        }

        return array(
                'centerID'         => parent::_formElementObjectCreator(
                    'centerID',
                    'select',
                    'Site',
                    $list_of_sites
                ),
                'DCCID'            => parent::_formElementObjectCreator(
                    'DCCID',
                    'text',
                    'DCCID',
                    null
                ),
                'PSCID'            => parent::_formElementObjectCreator(
                    'PSCID',
                    'text',
                    'PSCID',
                    null
                ),
                'Sex'              => parent::_formElementObjectCreator(
                    'sex',
                    'select',
                    'Sex',
                    array(
                     ''       => 'All',
                     'Male'   => 'Male',
                     'Female' => 'Female',
                    )
                ),
                'SubprojectID'     => parent::_formElementObjectCreator(
                    'SubprojectID',
                    'select',
                    'Subproject',
                    array('' => 'Any') + \Utility::getSubprojectList()
                ),
                'DoB'              => parent::_formElementObjectCreator(
                    'dob',
                    'select',
                    'Date of Birth',
                    array('maxlength' => 10)
                ),
                'Sample'           => parent::_formElementObjectCreator(
                    'Sample',
                    'text',
                    'Sample',
                    null
                ),
                'cpg_name'         => parent::_formElementObjectCreator(
                    'cpg_name',
                    'text',
                    'CPG Name',
                    null
                ),
                'Beta_value'       => parent::_formElementObjectCreator(
                    'Beta_value',
                    'text',
                    'Beta value',
                    null
                ),
                'Chromosome'       => parent::_formElementObjectCreator(
                    'Chromosome',
                    'text',
                    'Chromosome',
                    null
                ),
                'Strand'           => parent::_formElementObjectCreator(
                    'Strand',
                    'select',
                    'Strand',
                    array(
                     null => 'Any',
                     'F'  => 'Forward',
                     'R'  => 'Reverse',
                    )
                ),
                'Start_Loc'        => parent::_formElementObjectCreator(
                    'Start_Loc',
                    'text',
                    'Start Loc',
                    null
                ),
                'Probe_Loc_A'      => parent::_formElementObjectCreator(
                    'Probe_Loc_A',
                    'text',
                    'Probe Loc A',
                    null
                ),
                'Probe_Seq_A'      => parent::_formElementObjectCreator(
                    'Probe_Seq_A',
                    'text',
                    'Probe Seq A',
                    null
                ),
                'Probe_Loc_B'      => parent::_formElementObjectCreator(
                    'Probe_Loc_B',
                    'text',
                    'Probe Loc B',
                    null
                ),
                'Probe_Seq_B'      => parent::_formElementObjectCreator(
                    'Probe_Seq_B',
                    'text',
                    'Probe Seq B',
                    null
                ),
                'Design'           => parent::_formElementObjectCreator(
                    'Design',
                    'select',
                    'Infinium design',
                    array(
                     null => 'Any',
                     'I'  => 'I',
                     'II' => 'II',
                    )
                ),
                'Color'            => parent::_formElementObjectCreator(
                    'Strand',
                    'select',
                    'Color',
                    array(
                     null  => 'Any',
                     'Grn' => 'Green',
                     'Red' => 'Red',
                    )
                ),
                'Assembly'         => parent::_formElementObjectCreator(
                    'Assembly',
                    'select',
                    'Build',
                    array(
                     null => 'Any',
                     '37' => 'GRCh37',
                    )
                ),
                'SNP_10'           => parent::_formElementObjectCreator(
                    'SNP_10',
                    'select',
                    'SNP',
                    array(
                     null   => 'Any',
                     'NULL' => 'No',
                     '_'    => 'Yes',
                    )
                ),
                'Gene_Symbol'      => parent::_formElementObjectCreator(
                    'Gene_Symbol',
                    'text',
                    'Gene',
                    null
                ),
                'Accession_number' => parent::_formElementObjectCreator(
                    'Accession_number',
                    'text',
                    'Accession number',
                    null
                ),
                'Gene_Grp'         => parent::_formElementObjectCreator(
                    'Gene_Grp',
                    'select',
                    'Position',
                    array(
                     null      => 'Any',
                     '1stExon' => '1st Exon',
                     '3`UTR'   => '3`UTR',
                     '5`UTR'   => '5`UTR',
                     'Body'    => 'Body',
                     'TSS1500' => 'TSS1500',
                     'TSS200'  => 'TSS200',
                    )
                ),
                'Island_Loc'       => parent::_formElementObjectCreator(
                    'Island_Loc',
                    'text',
                    'Island Loc',
                    null
                ),
                'Context'          => parent::_formElementObjectCreator(
                    'Context',
                    'select',
                    'Context',
                    $this->getDistinctValues(
                        'genomic_cpg_annotation',
                        'island_relation'
                    )
                ),
                'Fantom_Prom'      => parent::_formElementObjectCreator(
                    'Fantom_Prom',
                    'select',
                    'Promoter',
                    array(
                     null       => 'Any',
                     'NULL'     => 'No',
                     'NOT_NULL' => 'Yes',
                    )
                ),
                'DMR'              => parent::_formElementObjectCreator(
                    'DMR',
                    'select',
                    'DMR',
                    $this->getDistinctValues(
                        'genomic_cpg_annotation',
                        'dmr'
                    )
                ),
                'Enhancer'         => parent::_formElementObjectCreator(
                    'Enhancer',
                    'select',
                    'Enhancer',
                    array(
                     null => 'Any',
                     '1'  => 'Yes',
                    )
                ),
                'HMM_Island'       => parent::_formElementObjectCreator(
                    'HMM_Island',
                    'select',
                    'HMM Island',
                    array(
                     null       => 'Any',
                     'NULL'     => 'No',
                     'NOT_NULL' => 'Yes',
                    )
                ),
                'Reg_Feature_Loc'  => parent::_formElementObjectCreator(
                    'Reg_Feature_Loc',
                    'text',
                    'Reg Feature Loc',
                    null
                ),
                'Reg_Feature_Grp'  => parent::_formElementObjectCreator(
                    'Reg_Feature_Grp',
                    'select',
                    'Regulatory feat.:',
                    $this->getDistinctValues(
                        'genomic_cpg_annotation',
                        'reg_feature_group'
                    )
                ),
                'DHS'              => parent::_formElementObjectCreator(
                    'DHS',
                    'select',
                    'DHS',
                    array(
                     null   => 'Any',
                     '1'    => 'Yes',
                     'NULL' => 'No',
                    )
                ),
                'Platform'         => parent::_formElementObjectCreator(
                    'Platform',
                    'select',
                    'Platform',
                    $this->getDistinctValues(
                        'genotyping_platform',
                        'Name'
                    )
                ),
               );
    }

    /**
     * Provide an array of distinct value from a column in
     * the specified table. The first element has a null key and
     * its value is 'Any'.
     *
     * @param string $table  The tables name
     * @param string $column The column name
     *
     * @return array An array where value are keys as well as values
     */
    function getDistinctValues( $table, $column)
    {
        $DB      = \Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            array()
        );
        return array_reduce(
            $results,
            function ($carry, $item) {
                $value = array_values($item)[0];
                if (!empty($value)) {
                    $carry[$value] = $value;
                }
                return $carry;
            },
            array(null => 'Any')
        );

    }

    /**
     * Permission verification.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     * @param array                  $values  The form values.
     *
     * @return array
     */
    private function _verifyPermissions(
        ServerRequestInterface $request,
        array $values
    ) : array {
        $user = $request->getAttribute('user');
        if (!$user->hasPermission('genomic_browser_view_site')
            || !$user->hasPermission('genomic_browser_view_allsites')
        ) {
            $values['error'] = 'Forbidden';
            return $values;
        }
        return $values;
    }

    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Returns true if the user has permission to access
     * the Genomic Browser module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('genomic_browser_view_allsites')
            || $user->hasPermission('genomic_browser_view_site'));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return array('GET');
    }

    /**
     * Return a list of LORIS API versions which this endpoint
     * supports.
     *
     * @return string[] LORIS API Versions
     */
    protected function supportedVersions(): array
    {
        return array('unknown');
    }
}
