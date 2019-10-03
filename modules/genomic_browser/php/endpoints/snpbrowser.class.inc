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
        } else {
            // allow only to view own site data
            $list_of_sites = $user->getStudySites();
        }

        // SubprojectID
        $list_of_subprojects = \Utility::getSubprojectList();

        $DB = \Database::singleton();
        $platform_results
            = $DB->pselect(
                "SELECT distinct Name FROM genotyping_platform ",
                array()
            );

        $platform_options = array();
        foreach ($platform_results as $row => $result ) {
            $name = $result['Name'];
            $platform_options[$name] = $name;
        }

        return array(
                'centerID'            => parent::formElementObjectCreator(
                    'centerID',
                    'select',
                    'Site',
                    true,
                    $list_of_sites
                ),
                'DCCID'               => parent::formElementObjectCreator(
                    'DCCID',
                    'text',
                    'DCCID',
                    true,
                    null
                ),
                'PSCID'               => parent::formElementObjectCreator(
                    'PSCID',
                    'text',
                    'PSCID',
                    false,
                    null
                ),
                'Sex'                 => parent::formElementObjectCreator(
                    'sex',
                    'select',
                    'Sex',
                    false,
                    array(
                     'Male'   => 'Male',
                     'Female' => 'Female',
                    )
                ),
                'SubprojectID'        => parent::formElementObjectCreator(
                    'SubprojectID',
                    'select',
                    'Subproject',
                    true,
                    \Utility::getSubprojectList()
                ),
                'DoB'                 => parent::formElementObjectCreator(
                    'dob',
                    'select',
                    'Date of Birth',
                    true,
                    array('maxlength' => 10)
                ),
                'External_ID'         => parent::formElementObjectCreator(
                    'External_ID',
                    'text',
                    'External ID',
                    true,
                    null
                ),
                'Assembly'            => parent::formElementObjectCreator(
                    'Assembly',
                    'select',
                    'Build',
                    false,
                    array('37' => 'GRCh37')
                ),
                'Strand'              => parent::formElementObjectCreator(
                    'Strand',
                    'select',
                    'Strand',
                    true,
                    array(
                     'F' => 'Forward',
                     'R' => 'Reverse',
                    )
                ),
                'Start_Loc'           => parent::formElementObjectCreator(
                    'Start_Loc',
                    'text',
                    'Start Loc',
                    true,
                    null
                ),
                'End_Loc'             => parent::formElementObjectCreator(
                    'End_Loc',
                    'text',
                    'End Loc',
                    true,
                    null
                ),
                'Gene_Symbol'         => parent::formElementObjectCreator(
                    'Gene_Symbol',
                    'text',
                    'Gene',
                    true,
                    null
                ),
                'Gene_Name'           => parent::formElementObjectCreator(
                    'Gene_Name',
                    'text',
                    'Name',
                    true,
                    null
                ),
                'Platform'            => parent::formElementObjectCreator(
                    'Platform',
                    'select',
                    'Platform',
                    true,
                    $platform_options
                ),
                'rsID'                => parent::formElementObjectCreator(
                    'rsID',
                    'text',
                    'rsID',
                    false,
                    null
                ),
                'SNP_Name'            => parent::formElementObjectCreator(
                    'SNP_Name',
                    'text',
                    'Name',
                    true,
                    null
                ),
                'SNP_Description'     => parent::formElementObjectCreator(
                    'SNP_Description',
                    'text',
                    'Description',
                    true,
                    null
                ),
                'SNP_External_Source' => parent::formElementObjectCreator(
                    'SNP_External_Source',
                    'text',
                    'External Source',
                    true,
                    null
                ),
                'Allele_A'            => parent::formElementObjectCreator(
                    'Allele_A',
                    'select',
                    'Allele A',
                    false,
                    array(
                     'A' => 'A',
                     'C' => 'C',
                     'T' => 'T',
                     'G' => 'G',
                    )
                ),
                'Allele_B'            => parent::formElementObjectCreator(
                    'Allele_B',
                    'select',
                    'Allele B',
                    false,
                    array(
                     'A' => 'A',
                     'C' => 'C',
                     'T' => 'T',
                     'G' => 'G',
                    )
                ),
                'Reference_Base'      => parent::formElementObjectCreator(
                    'Reference_Base',
                    'select',
                    'Reference Base',
                    true,
                    array(
                     'A' => 'A',
                     'C' => 'C',
                     'T' => 'T',
                     'G' => 'G',
                    )
                ),
                'Minor_Allele'        => parent::formElementObjectCreator(
                    'Minor_Allele',
                    'select',
                    'Minor Allele',
                    false,
                    array(
                     'A' => 'A',
                     'C' => 'C',
                     'T' => 'T',
                     'G' => 'G',
                    )
                ),
                'Array_Report'        => parent::formElementObjectCreator(
                    'Array_Report',
                    'select',
                    'Array Report',
                    true,
                    array(
                     'Abnormal'  => 'Abnormal',
                     'Normal'    => 'Normal',
                     'Pending'   => 'Pending',
                     'Uncertain' => 'Uncertain',
                    )
                ),
                'Markers'             => parent::formElementObjectCreator(
                    'Markers',
                    'text',
                    'Markers',
                    true,
                    null
                ),
                'Validation_Method'   => parent::formElementObjectCreator(
                    'Validation_Method',
                    'text',
                    'Validation Method',
                    true,
                    null
                ),
                'Validated'           => parent::formElementObjectCreator(
                    'Validated',
                    'select',
                    'Validated',
                    true,
                    array(
                     '0' => '0',
                     '1' => '1',
                    )
                ),
                'Function_Prediction' => parent::formElementObjectCreator(
                    'Function_Prediction',
                    'select',
                    'Function Prediction',
                    false,
                    array(
                     'exonic'      => 'exonic',
                     'ncRNAexonic' => 'ncRNAexonic',
                     'splicing'    => 'splicing',
                     'UTR3'        => 'UTR3',
                     'UTR5'        => 'UTR5',
                    )
                ),
                'Damaging'            => parent::formElementObjectCreator(
                    'Damaging',
                    'select',
                    'Damaging',
                    false,
                    array(
                     'D'  => 'D',
                     'NA' => 'NA',
                    )
                ),
                'Genotype_Quality'    => parent::formElementObjectCreator(
                    'Genotype_Quality',
                    'text',
                    'Genotype Quality',
                    true,
                    null
                ),
                'Exonic_Function'     => parent::formElementObjectCreator(
                    'Exonic_Function',
                    'text',
                    'Exonic Function',
                    false,
                    null
                ),
                'genomic_range'       => parent::formElementObjectCreator(
                    'genomic_range',
                    'text',
                    'Genomic Range',
                    true,
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
