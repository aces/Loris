<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Genomic Browser.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Genomic Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser\endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_GenomicBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows profiles to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Genomic Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Profiles extends Endpoint implements ETagCalculator
{
    public $skipTemplate = true;

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);
            case 'POST':
                return $this->_handlePOST($request);
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

        $values = $this->_setupVariables($request, $values);



        // User permission verification.
        $values = $this->_verifyPermissions($request, $values);
        if (isset($values['error'])) {
            switch ($values['error']) {
                case 'BadRequest':
                    return new \LORIS\Http\Response\BadRequest(
                        'Failed to retrieve data for create timepoint.'
                    );
                case 'Forbidden':
                    return new \LORIS\Http\Response\Forbidden(
                        'Forbidden'
                    );
                default:
                    break;
            }
        }


        return new \LORIS\Http\Response\JsonResponse(
            $values
        );
    }
    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = $request->getParsedBody();
        
        // User permission verification.
        $values = $this->_verifyPermissions($request, $values);
        if (isset($values['error'])) {
            switch ($values['error']) {
                case 'BadRequest':
                    return new \LORIS\Http\Response\BadRequest(
                        'Failed to retrieve data for create timepoint.'
                    );
                case 'Forbidden':
                    return new \LORIS\Http\Response\Forbidden(
                        'Forbidden'
                    );
                default:
                    break;
            }
        }

        return new \LORIS\Http\Response\JsonResponse(
            $values
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
     * Setup variables for form.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     * @param array                  $values  The form values.
     *
     * @return array
     */
    private function _setupVariables(
        ServerRequestInterface $request,
        array $values
    ) : array {
        // set the class variables
        $file_subquery = "
          CASE WHEN EXISTS (
            select genomicfileid
            from genomic_candidate_files_rel
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $snp_subquery  = "
          CASE WHEN EXISTS (
            select snpid
            from SNP_candidate_rel
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $cnv_subquery  = "
          CASE WHEN EXISTS (
            select cnvid
            from CNV
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $cpg_subquery  = "
          CASE WHEN EXISTS (
            select cpg_name
            from genomic_sample_candidate_rel
            left join genomic_cpg using (sample_label)
            where candid = candidate.candid
          ) THEN 'Y' ELSE 'N' END
        ";
        $columns = array(
            'psc.Name AS PSC',
            'LPAD(candidate.CandID, 6, "0") AS DCCID',
            'candidate.PSCID',
            'candidate.Sex',
            'cohort.SubprojectID as Subproject',
            'DATE_FORMAT(candidate.DoB,\'%Y-%m-%d\') AS DoB',
            'candidate.ExternalID as externalID',
            "$file_subquery as File",
            "$snp_subquery as SNP",
            "$cnv_subquery as CNV",
            "$cpg_subquery as CPG",
        );

        // This variable will be used by the columnFormatter javascript
        // to set the default hidden columns in the data table.
        $values['hiddenHeaders'] = json_encode(
            array_map(
                function ($header) {
                    return ucwords(str_replace('_', ' ', $header));
                },
                array(
                    'PSC',
                    'DCCID',
                    'externalID',
                    'DoB',
                )
            )
        );

        $query = " FROM candidate
            LEFT JOIN (select s.CandID, min(s.subprojectID) as SubprojectID
                from session s GROUP BY s.CandID) AS cohort
                ON (cohort.CandID=candidate.CandID)
            LEFT JOIN psc ON (psc.CenterID= candidate.RegistrationCenterID)
            WHERE
            candidate.Entity_type = 'Human' AND candidate.Active = 'Y' ";

        $user = \User::singleton();
        if (!$user->hasPermission('genomic_browser_view_allsites')) {
            // allow only to view own site data
            $site_arr     = implode(",", $user->getCenterIDs());
            $query .= " AND candidate.RegistrationCenterID IN ($site_arr)";
        }

        $group_by = '';

        $order_by = 'psc.Name, candidate.CandID DESC';

        $validFilters = array(
            'candidate.RegistrationCenterID',
            'candidate.CandID',
            'candidate.PSCID',
            'candidate.Sex',
            'cohort.SubprojectID',
            'candidate.DoB',
            'candidate.ExternalID',
            'show_brief_results',
            'File',
            'CNV',
            'SNP',
            'CPG',
        );

        $validHavingFilters = array(
            'File',
            'CNV',
            'SNP',
            'CPG',
        );

        $ftf = array(
            'centerID'           => 'candidate.RegistrationCenterID',
            'DCCID'              => 'candidate.CandID',
            'PSCID'              => 'candidate.PSCID',
            'sex'                => 'candidate.Sex',
            'SubprojectID'       => 'cohort.SubprojectID',
            'External_ID'        => 'candidate.ExternalID',
            'Show_Brief_Results' => 'show_brief_results',
            'File'               => 'File',
            'SNP'                => 'SNP',
            'CNV'                => 'CNV',
            'CPG'                => 'CPG',
        );

        // $this->formToFilter = $ftf;

        // PSC
        if ($user->hasPermission('genomic_browser_view_allsites')) {
            // has access to all sites genomic data
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList();
            if (is_array($list_of_sites)) {
                $list_of_sites = array('' => 'Any') + $list_of_sites;
            }
        } else {
            $list_of_sites = $user->getStudySites();
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        // SubprojectID
        $list_of_subprojects = \Utility::getSubprojectList();

        // selectElements, textElements for filter
        $selectElements = array();
        $textElements   = array();

        // add form elements
        array_push($selectElements,
            $this->_formElementObjectCreator(
            'centerID',
            'select',
            'Site',
            $list_of_sites
            ));
        array_push($textElements,
            $this->_formElementObjectCreator(
                'DCCID',
                'text',
                'DCCID',
                null
            ));
        array_push($textElements,
            $this->_formElementObjectCreator(
                'PSCID',
                'text',
                'PSCID',
                null
            ));
        array_push($textElements,
            $this->_formElementObjectCreator(
                'External_ID',
                'text',
                'External ID',
                null
            ));
        array_push($selectElements,
            $this->_formElementObjectCreator(
                'sex',
                'select',
                'Sex',
                array(
                    ''       => 'All',
                    'Male'   => 'Male',
                    'Female' => 'Female',
                )
            ));
        array_push($selectElements,
            $this->_formElementObjectCreator(
                'SubprojectID',
                'select',
                'Subproject',
                array('' => 'Any') + $list_of_subprojects
            ));
        array_push($textElements,
            $this->_formElementObjectCreator(
                'dob',
                'text',
                'Date of Birth',
                array('maxlength' => 10)
            ));

        $any_options = array(
            ''  => null,
            'Y' => 'Yes',
            'N' => 'No',
        );
        array_push($selectElements,
            $this->_formElementObjectCreator(
                'File',
                'select',
                'Files',
                $any_options
            ));
        array_push($selectElements,
            $this->_formElementObjectCreator(
                'SNP',
                'select',
                'SNPs found',
                $any_options
            ));
        array_push($selectElements,
            $this->_formElementObjectCreator(
                'CNV',
                'select',
                'CNVs found',
                $any_options
            ));
        array_push($selectElements,
            $this->_formElementObjectCreator(
                'CPG',
                'select',
                'CPGs found',
                $any_options
            ));
        $show_results_options = array(
            'brief' => 'Summary fields',
            'full'  => 'All fields',
        );
        array_push($selectElements,
            $this->_formElementObjectCreator(
                'Show_Brief_Results',
                'select',
                'Display',
                $show_results_options
            ));

    }


    /**
     * Used to create (select, text, ...) element for form filter.
     *
     * @param string name for element
     * @param string type for element
     * @param string label for element
     * @param array  values for element
     *
     * @return object
     */
    private function _formElementObjectCreator(
        string $name,
        string $type,
        string $label,
        array $values
    ) : object {
        $element = new \stdClass();
        $element->name = $name;
        $element->type = $type;
        $element->label = $label;
        if (isset($values)) {
            $element->values = $values;
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
        return array(
            'GET',
            'POST',
        );
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
