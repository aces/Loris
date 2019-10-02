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
                return new \LORIS\Http\Response\Forbidden(
                    'Forbidden'
                );
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
                'centerID'            => $this->_formElementObjectCreator(
                    'centerID',
                    'select',
                    'Site',
                    $list_of_sites
                ),
                'DCCID'               => $this->_formElementObjectCreator(
                    'DCCID',
                    'text',
                    'DCCID',
                    null
                ),
                'PSCID'               => $this->_formElementObjectCreator(
                    'PSCID',
                    'text',
                    'PSCID',
                    null
                ),
                'Sex'                 => $this->_formElementObjectCreator(
                    'sex',
                    'select',
                    'Sex',
                    array(
                     ''       => 'All',
                     'Male'   => 'Male',
                     'Female' => 'Female',
                    )
                ),
                'SubprojectID'        => $this->_formElementObjectCreator(
                    'SubprojectID',
                    'select',
                    'Subproject',
                    array('' => 'Any') + \Utility::getSubprojectList()
                ),
                'DoB'                 => $this->_formElementObjectCreator(
                    'dob',
                    'select',
                    'Date of Birth',
                    array('maxlength' => 10)
                ),
                'External_ID'         => $this->_formElementObjectCreator(
                    'External_ID',
                    'text',
                    'External ID',
                    null
                ),
                'Assembly'            => $this->_formElementObjectCreator(
                    'Assembly',
                    'select',
                    'Build',
                    array(
                     null => 'Any',
                     '37' => 'GRCh37',
                    )
                ),
                'Strand'              => $this->_formElementObjectCreator(
                    'Strand',
                    'select',
                    'Strand',
                    array(
                     null => 'Any',
                     'F'  => 'Forward',
                     'R'  => 'Reverse',
                    )
                ),
                'Start_Loc'           => $this->_formElementObjectCreator(
                    'Start_Loc',
                    'text',
                    'Start Loc',
                    null
                ),
                'End_Loc'             => $this->_formElementObjectCreator(
                    'End_Loc',
                    'text',
                    'End Loc',
                    null
                ),
                'Gene_Symbol'         => $this->_formElementObjectCreator(
                    'Gene_Symbol',
                    'text',
                    'Gene',
                    null
                ),
                'Gene_Name'           => $this->_formElementObjectCreator(
                    'Gene_Name',
                    'text',
                    'Name',
                    null
                ),
                'Platform'            => $this->_formElementObjectCreator(
                    'Platform',
                    'select',
                    'Platform',
                    $platform_options
                ),
                'rsID'                => $this->_formElementObjectCreator(
                    'rsID',
                    'text',
                    'rsID',
                    null
                ),
                'SNP_Name'            => $this->_formElementObjectCreator(
                    'SNP_Name',
                    'text',
                    'Name',
                    null
                ),
                'SNP_Description'     => $this->_formElementObjectCreator(
                    'SNP_Description',
                    'text',
                    'Description',
                    null
                ),
                'SNP_External_Source' => $this->_formElementObjectCreator(
                    'SNP_External_Source',
                    'text',
                    'External Source',
                    null
                ),
                'Allele_A'            => $this->_formElementObjectCreator(
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
                'Allele_B'            => $this->_formElementObjectCreator(
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
                'Reference_Base'      => $this->_formElementObjectCreator(
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
                'Minor_Allele'        => $this->_formElementObjectCreator(
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
                'Array_Report'        => $this->_formElementObjectCreator(
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
                'Markers'             => $this->_formElementObjectCreator(
                    'Markers',
                    'text',
                    'Markers',
                    null
                ),
                'Validation_Method'   => $this->_formElementObjectCreator(
                    'Validation_Method',
                    'text',
                    'Validation Method',
                    null
                ),
                'Validated'           => $this->_formElementObjectCreator(
                    'Validated',
                    'select',
                    'Validated',
                    array(
                     null => 'Any',
                     '0'  => '0',
                     '1'  => '1',
                    )
                ),
                'Function_Prediction' => $this->_formElementObjectCreator(
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
                'Damaging'            => $this->_formElementObjectCreator(
                    'Damaging',
                    'select',
                    'Damaging',
                    array(
                     null => 'Any',
                     'D'  => 'D',
                     'NA' => 'NA',
                    )
                ),
                'Genotype_Quality'    => $this->_formElementObjectCreator(
                    'Genotype_Quality',
                    'text',
                    'Genotype Quality',
                    null
                ),
                'Exonic_Function'     => $this->_formElementObjectCreator(
                    'Exonic_Function',
                    'text',
                    'Exonic Function',
                    null
                ),
                'genomic_range'       => $this->_formElementObjectCreator(
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
     * Used to create (select, text, ...) element for form filter.
     *
     * @param string     $name   for element
     * @param string     $type   for element
     * @param string     $label  for element
     * @param array|null $values for element
     *
     * @return object
     */
    private function _formElementObjectCreator(
        string $name,
        string $type,
        string $label,
        ?array $values
    ) : object {
        $element        = new \stdClass();
        $element->name  = $name;
        $element->type  = $type;
        $element->label = $label;
        if (isset($values)) {
            $element->options = $values;
        }
        return $element;
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
