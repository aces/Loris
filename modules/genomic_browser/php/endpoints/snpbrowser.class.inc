<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Genomic_Browser.
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

use LORIS\genomic_browser\Provisioners\SnpProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_GenomicBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows snpbrowser to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SnpBrowser extends Endpoint implements ETagCalculator
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
                    'Failed to retrieve data for SNP.'
                );
            case 'Forbidden':
                return new \LORIS\Http\Response\Forbidden();
            default:
                break;
            }
        }
        $user        = $request->getAttribute('user');
        $provisioner = (new SnpProvisioner())->forUser($user);
        // $provisioner = (new ProfileProvisioner())->filter();
        $data = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body = array(
                 'data'         => $data,
                 'fieldOptions' => $this->_getFieldOptions($request),
                 'subprojects'  => \Utility::getSubprojectList(),
                );
        return new \LORIS\Http\Response\JsonResponse($body);
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
            $list_of_sites = array('' => 'Any') + $list_of_sites;
        } else {
            // allow only to view own site data
            $list_of_sites = $user->getStudySites();
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        // SubprojectID
        $list_of_subprojects = \Utility::getSubprojectList();

        $DB = \Database::singleton();
        $platform_results
            = $DB->pselect(
                "SELECT distinct Name FROM genotyping_platform ",
                array()
            );

        $platform_options = array('' => 'Any');
        foreach ($platform_results as $row => $result ) {
            $name = $result['Name'];
            $platform_options[$name] = $name;
        }

        return array(
                'centerID'            => parent::_formElementObjectCreator(
                    'centerID',
                    'select',
                    'Site',
                    $list_of_sites
                ),
                'DCCID'               => parent::_formElementObjectCreator(
                    'DCCID',
                    'text',
                    'DCCID',
                    null
                ),
                'PSCID'               => parent::_formElementObjectCreator(
                    'PSCID',
                    'text',
                    'PSCID',
                    null
                ),
                'Sex'                 => parent::_formElementObjectCreator(
                    'sex',
                    'select',
                    'Sex',
                    array(
                     ''       => 'All',
                     'Male'   => 'Male',
                     'Female' => 'Female',
                    )
                ),
                'SubprojectID'        => parent::_formElementObjectCreator(
                    'SubprojectID',
                    'select',
                    'Subproject',
                    array('' => 'Any') + \Utility::getSubprojectList()
                ),
                'DoB'                 => parent::_formElementObjectCreator(
                    'dob',
                    'select',
                    'Date of Birth',
                    array('maxlength' => 10)
                ),
                'External_ID'         => parent::_formElementObjectCreator(
                    'External_ID',
                    'text',
                    'External ID',
                    null
                ),
                'Assembly'            => parent::_formElementObjectCreator(
                    'Assembly',
                    'select',
                    'Build',
                    array(
                     null => 'Any',
                     '37' => 'GRCh37',
                    )
                ),
                'Strand'              => parent::_formElementObjectCreator(
                    'Strand',
                    'select',
                    'Strand',
                    array(
                     null => 'Any',
                     'F'  => 'Forward',
                     'R'  => 'Reverse',
                    )
                ),
                'Start_Loc'           => parent::_formElementObjectCreator(
                    'Start_Loc',
                    'text',
                    'Start Loc',
                    null
                ),
                'End_Loc'             => parent::_formElementObjectCreator(
                    'End_Loc',
                    'text',
                    'End Loc',
                    null
                ),
                'Gene_Symbol'         => parent::_formElementObjectCreator(
                    'Gene_Symbol',
                    'text',
                    'Gene',
                    null
                ),
                'Gene_Name'           => parent::_formElementObjectCreator(
                    'Gene_Name',
                    'text',
                    'Name',
                    null
                ),
                'Platform'            => parent::_formElementObjectCreator(
                    'Platform',
                    'select',
                    'Platform',
                    $platform_options
                ),
                'rsID'                => parent::_formElementObjectCreator(
                    'rsID',
                    'text',
                    'rsID',
                    null
                ),
                'SNP_Name'            => parent::_formElementObjectCreator(
                    'SNP_Name',
                    'text',
                    'Name',
                    null
                ),
                'SNP_Description'     => parent::_formElementObjectCreator(
                    'SNP_Description',
                    'text',
                    'Description',
                    null
                ),
                'SNP_External_Source' => parent::_formElementObjectCreator(
                    'SNP_External_Source',
                    'text',
                    'External Source',
                    null
                ),
                'Allele_A'            => parent::_formElementObjectCreator(
                    'Allele_A',
                    'select',
                    'Allele A',
                    array(
                     null => 'Any',
                     'A'  => 'A',
                     'C'  => 'C',
                     'T'  => 'T',
                     'G'  => 'G',
                    )
                ),
                'Allele_B'            => parent::_formElementObjectCreator(
                    'Allele_B',
                    'select',
                    'Allele B',
                    array(
                     null => 'Any',
                     'A'  => 'A',
                     'C'  => 'C',
                     'T'  => 'T',
                     'G'  => 'G',
                    )
                ),
                'Reference_Base'      => parent::_formElementObjectCreator(
                    'Reference_Base',
                    'select',
                    'Reference Base',
                    array(
                     null => 'Any',
                     'A'  => 'A',
                     'C'  => 'C',
                     'T'  => 'T',
                     'G'  => 'G',
                    )
                ),
                'Minor_Allele'        => parent::_formElementObjectCreator(
                    'Minor_Allele',
                    'select',
                    'Minor Allele',
                    array(
                     null => 'Any',
                     'A'  => 'A',
                     'C'  => 'C',
                     'T'  => 'T',
                     'G'  => 'G',
                    )
                ),
                'Array_Report'        => parent::_formElementObjectCreator(
                    'Array_Report',
                    'select',
                    'Array Report',
                    array(
                     null        => 'Any',
                     'Abnormal'  => 'Abnormal',
                     'Normal'    => 'Normal',
                     'Pending'   => 'Pending',
                     'Uncertain' => 'Uncertain',
                    )
                ),
                'Markers'             => parent::_formElementObjectCreator(
                    'Markers',
                    'text',
                    'Markers',
                    null
                ),
                'Validation_Method'   => parent::_formElementObjectCreator(
                    'Validation_Method',
                    'text',
                    'Validation Method',
                    null
                ),
                'Validated'           => parent::_formElementObjectCreator(
                    'Validated',
                    'select',
                    'Validated',
                    array(
                     null => 'Any',
                     '0'  => '0',
                     '1'  => '1',
                    )
                ),
                'Function_Prediction' => parent::_formElementObjectCreator(
                    'Function_Prediction',
                    'select',
                    'Function Prediction',
                    array(
                     null          => 'Any',
                     'exonic'      => 'exonic',
                     'ncRNAexonic' => 'ncRNAexonic',
                     'splicing'    => 'splicing',
                     'UTR3'        => 'UTR3',
                     'UTR5'        => 'UTR5',
                    )
                ),
                'Damaging'            => parent::_formElementObjectCreator(
                    'Damaging',
                    'select',
                    'Damaging',
                    array(
                     null => 'Any',
                     'D'  => 'D',
                     'NA' => 'NA',
                    )
                ),
                'Genotype_Quality'    => parent::_formElementObjectCreator(
                    'Genotype_Quality',
                    'text',
                    'Genotype Quality',
                    null
                ),
                'Exonic_Function'     => parent::_formElementObjectCreator(
                    'Exonic_Function',
                    'text',
                    'Exonic Function',
                    null
                ),
                'genomic_range'       => parent::_formElementObjectCreator(
                    'genomic_range',
                    'text',
                    'Genomic Range',
                    null
                ),
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
