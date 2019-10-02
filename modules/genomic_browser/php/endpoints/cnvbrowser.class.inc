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

use LORIS\genomic_browser\Provisioners\CnvProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_GenomicBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows cnvbrowser to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CnvBrowser extends Endpoint implements ETagCalculator
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
                    'Failed to retrieve data for CNV.'
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
        $provisioner = (new CnvProvisioner())->forUser($user);
        // $provisioner = (new CnvProvisioner())->filter();
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
                'centerID'          => $this->_formElementObjectCreator(
                    'centerID',
                    'select',
                    'Site',
                    $list_of_sites
                ),
                'DCCID'             => $this->_formElementObjectCreator(
                    'DCCID',
                    'text',
                    'DCCID',
                    null
                ),
                'PSCID'             => $this->_formElementObjectCreator(
                    'PSCID',
                    'text',
                    'PSCID',
                    null
                ),
                'Sex'               => $this->_formElementObjectCreator(
                    'sex',
                    'select',
                    'Sex',
                    array(
                     ''       => 'All',
                     'Male'   => 'Male',
                     'Female' => 'Female',
                    )
                ),
                'SubprojectID'      => $this->_formElementObjectCreator(
                    'SubprojectID',
                    'select',
                    'Subproject',
                    array('' => 'Any') + \Utility::getSubprojectList()
                ),
                'DoB'               => $this->_formElementObjectCreator(
                    'dob',
                    'select',
                    'Date of Birth',
                    array('maxlength' => 10)
                ),
                'External_ID'       => $this->_formElementObjectCreator(
                    'External_ID',
                    'text',
                    'External ID',
                    null
                ),
                'Assembly'          => $this->_formElementObjectCreator(
                    'Assembly',
                    'select',
                    'Build',
                    array(
                     null => 'Any',
                     '37' => 'GRCh37',
                    )
                ),
                'Strand'            => $this->_formElementObjectCreator(
                    'Strand',
                    'select',
                    'Strand',
                    array(
                     null => 'Any',
                     'F'  => 'Forward',
                     'R'  => 'Reverse',
                    )
                ),
                'Start_Loc'         => $this->_formElementObjectCreator(
                    'Start_Loc',
                    'text',
                    'Start Loc',
                    null
                ),
                'End_Loc'           => $this->_formElementObjectCreator(
                    'End_Loc',
                    'text',
                    'End Loc',
                    null
                ),
                'Location'          => $this->_formElementObjectCreator(
                    'Location',
                    'text',
                    'Location',
                    null
                ),
                'Gene_Symbol'       => $this->_formElementObjectCreator(
                    'Gene_Symbol',
                    'text',
                    'Gene',
                    null
                ),
                'Gene_Name'         => $this->_formElementObjectCreator(
                    'Gene_Name',
                    'text',
                    'Gene Name',
                    null
                ),
                'CNV_Description'   => $this->_formElementObjectCreator(
                    'CNV_Description',
                    'text',
                    'Description',
                    null
                ),
                'CNV_Type'          => $this->_formElementObjectCreator(
                    'CNV_Type',
                    'select',
                    'Type',
                    array(
                     null      => 'All',
                     'gain'    => 'gain',
                     'loss'    => 'loss',
                     'unknown' => 'Unknown',
                    )
                ),
                'Copy_Num_Change'   => $this->_formElementObjectCreator(
                    'Copy_Num_Change',
                    'text',
                    'Copy Number Change',
                    null
                ),
                'Event_Name'        => $this->_formElementObjectCreator(
                    'Event_Name',
                    'text',
                    'Event Name',
                    null
                ),
                'Common_CNV'        => $this->_formElementObjectCreator(
                    'Common_CNV',
                    'select',
                    'Common',
                    array(
                     null => 'Any',
                     'Y'  => 'Yes',
                     'N'  => 'No',
                    )
                ),
                'Characteristics'   => $this->_formElementObjectCreator(
                    'Characteristics',
                    'select',
                    'Characteristics',
                    array(
                     null         => 'Any',
                     'Benign'     => 'Benign',
                     'Pathogenic' => 'Pathogenic',
                     'Unknown'    => 'Unknown',
                    )
                ),
                'Inheritance'       => $this->_formElementObjectCreator(
                    'Inheritance',
                    'select',
                    'Inheritance',
                    array(
                     null           => 'Any',
                     'de novo'      => 'de novo',
                     'maternal'     => 'maternal',
                     'paternal'     => 'paternal',
                     'unclassified' => 'unclassified',
                     'unknown'      => 'unknown',
                     'NA'           => 'NA',
                    )
                ),
                'Array_Report'      => $this->_formElementObjectCreator(
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
                'Markers'           => $this->_formElementObjectCreator(
                    'Markers',
                    'text',
                    'Markers',
                    array(
                     null => 'Any',
                     'F'  => 'Forward',
                     'R'  => 'Reverse',
                    )
                ),
                'Validation_Method' => $this->_formElementObjectCreator(
                    'Validation_Method',
                    'text',
                    'Validation Method',
                    null
                ),
                'Platform'          => $this->_formElementObjectCreator(
                    'Platform',
                    'select',
                    'Platform',
                    $platform_options
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
