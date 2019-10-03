<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used to retrieve info & create timepoint by the create_timepoint form.
 * Ensures the user can create timepoint before processing
 * the POST body (array) data.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\create_timepoint\endpoints;
use LORIS\StudyEntities\Candidate\CandID;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;
/**
 * The NDB_Filter_Form_Create_Timepoint for the POST requests.
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Timepoint extends Endpoint implements ETagCalculator
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
        // Verify identifier from Post.
        $values['identifier'] = isset($values['identifier']) ?
            intval($values['identifier']) : null;
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
        // Setup variables
        $errors         = array(); // form errors.
        $config         = \NDB_Config::singleton();
        $candidate      = \Candidate::singleton(new CandID($values['candID']));
        $allSubprojects = \Utility::getSubprojectList();
        // All subprojects from config file (error).
        if (empty($allSubprojects)) {
            $errors['subprojectID'] = 'No subprojects have been defined 
            for this study. If you are an administrator, please use the 
            Configuration module to add new subprojects.';
        }
        // List of valid subprojects for a given project
        $subprojList = $candidate->getValidSubprojects();
        if (empty($subprojList)) {
            $this->form->errors['subprojectID'] = 'No subprojects have been 
            defined for the project this candidate is affiliated with. 
            If you are an administrator, please use the Configuration module to 
            add new subprojects and associate them with projects.';
        }
        $values['subproject'] = array_intersect_key(
            \Utility::getSubprojectList(),
            $candidate->getValidSubprojects()
        );
        // Retrieve visit labels.
        $visit_options      = array();
        $visitLabelSettings = $config->getSetting('visitLabel');
        foreach (
            \Utility::associativeToNumericArray($visitLabelSettings) as $visitLabel
        ) {
            if (!empty($values['subproject'])) {
                $visitLabel   = \Utility::associativeToNumericArray($visitLabel)[0];
                $labelOptions = array();
                $items        = \Utility::associativeToNumericArray(
                    $visitLabel['labelSet']['item']
                );
                foreach ($items as $item) {
                    $item = \Utility::associativeToNumericArray($item)[0];
                    $labelOptions[$item['@']['value']] = $item['#'];
                }
                $visit_options[$visitLabel['@']['subprojectID']]
                    = array_filter($labelOptions);
            }
        }
        $values['visit'] = $visit_options;
        $values['psc']   = array_intersect(
            \Utility::getSiteList(),
            \User::singleton()->getSiteNames()
        );
        if (!empty($errors)) {
            $values['errors'] = $errors;
        }
        if (empty($values['psc'])) {
            unset($values['psc']);
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
        $values = json_decode((string) $request->getBody(), true);
        // Validate POST data.
        $values = $this->_validate($values);
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
        // convert site entered to a \Site object
        $user = \User::singleton();
        $user_list_of_sites = $user->getCenterIDs();
        $num_sites          = count($user_list_of_sites);
        if ($num_sites == 1) {
            $site = \Site::singleton($user_list_of_sites[0]);
        } else if ($num_sites > 1) {
            $site = \Site::singleton(intval($values['psc']));
        }
        // List projects
        $projects = \Utility::getProjectList();
        if (count($projects) == 1) {
            //if there is only one project, autoselect first project from array of 1
            //TODO: change this to array_key_first() when support is only PHP 7.3+
            $project = \Project::singleton(array_pop($projects));
        } else if (count($projects) > 1) {
            $project_id = intval($values['psc']);
            $project    = \Project::singleton($projects[$project_id]);
        }
        assert(isset($site) && $site !== null);
        $errors   = $values['errors'];
        $response = array();
        $project  = null;
        if (!$errors && $site) {
            \TimePoint::createNew(
                \Candidate::singleton(new CandID($values['candID'])),
                intval($values['subproject']),
                $values['visit'] ?? null,
                $site,
                $project
            );
            $response['status'] = 'success';
        } else {
            $response['status'] = 'error';
            $response['errors'] = $errors;
        }
        return new \LORIS\Http\Response\JsonResponse(
            $response
        );
    }
    /**
     * Validate the post data,
     * from the create timepoint form.
     *
     * @param array $values the form values.
     *
     * @return array
     */
    private function _validate(array $values) : array
    {
        $user   = \User::singleton();
        $errors = array();
        if (!isset($values['identifier'])) {
            $values['error'] = 'BadRequest';
            return $values;
        }
        $values['identifier'] = isset($values['identifier']) ?
            intval($values['identifier']) : null;
        $values['psc']        = empty($values['psc']) ?
            null : $values['psc'];
        // validate site entered
        $site = (int) $values['psc'];
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        if ($num_sites > 1 && (empty($site) || !$user->hasCenter($site))) {
            $errors['psc'] = 'Site must be selected from the available dropdown.';
        }
        $candid       = $values['candID'];
        $subprojectID = intval($values['subproject']);
        $visitLabel   = $values['visit'] ?? '';
        try {
            \TimePoint::isValidVisitLabel(
                new CandID($candid),
                $subprojectID,
                $visitLabel
            );
        } catch (\LorisException $exception) {
            $errors['visitLabel'] = $exception->getMessage();
        }
        $values['errors'] = $errors;
        return $values;
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
        $user      = $request->getAttribute('user');
        $candidate = \Candidate::singleton(
            new CandID($values['candID'])
        );
        if (!$user->hasPermission('data_entry')
            && !(in_array(
                intval($candidate->getData('RegistrationCenterID')),
                $user->getData('CenterIDs'),
                true
            ))
        ) {
            $values['error'] = 'Forbidden';
            return $values;
        }
        return $values;
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
        return (
            $user->hasPermission('data_entry')
        );
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
        if ($request->getMethod() === 'POST') {
            return 'Etag not calculated on POST request';
        }
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
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
