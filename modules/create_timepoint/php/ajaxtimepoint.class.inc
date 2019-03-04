<?php
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

namespace LORIS\create_timepoint;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The NDB_Page for the POST requests.
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AjaxTimepoint extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * This function will return a json file with DCCID and PSCID
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     * @throws \DatabaseException
     * @throws \DeprecatedException
     * @throws \LorisException
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        /**
         * Ensure it's a POST request.
         */
        if ($request->getMethod() != 'POST') {
            return (new \LORIS\Http\Response())
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(405)
                ->withHeader('Allow', 'POST')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        'Only POST requests are allowed'
                    )
                );
        }

        /**
         * Parse POST request body.
         */
        $requestBody = $request->getParsedBody();

        /**
         * User permission verification.
         */
        $user       = $request->getAttribute('user');
        $identifier = $requestBody['identifier'] ?? '';
        $candidate  =& \Candidate::singleton($identifier);

        if (!$user->hasPermission('data_entry')
            && !(in_array(
                $candidate->getData('RegistrationCenterID'),
                $user->getData('CenterIDs')
            ))
        ) {
            return (new \Loris\Http\Response())
                ->withStatus(403, 'Forbidden')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array('error' => 'Forbidden')
                        )
                    )
                );
        }

        /**
         * Sanitize $postResponse data.
         */
        $requestBody = $this->sanitizer($requestBody);

        /**
         * Response to reply.
         */
        $response = $this->processRequest($requestBody);

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200)
            ->withHeader('Allow', 'POST')
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode($response)
                )
            );
    }

    /**
     * Sanitize the $postResponse data.
     *
     * @param array $values that have been sanitized.
     *
     * @return array
     */
    function sanitizer(array $values) : array
    {
        // Verify cand ID.
        $values['identifier'] = isset($values['identifier']) ?
            htmlentities(
                $values['identifier'],
                ENT_QUOTES,
                'UTF-8'
            ) : '';
        return $values;
    }

    /**
     * Processes the values and saves to database
     *
     * @param array $values the user data received.
     *
     * @return array
     * @throws \DatabaseException
     * @throws \DeprecatedException
     * @throws \LorisException
     */
    function processRequest(array $values) : array
    {
        if (isset($values['command']) && $values['command'] == 'initialize') {
            $response = $this->initializeSetup($values);
        } else if (isset($values['command']) && $values['command'] == 'create') {
            $errors = $this->validate($values);
            if (!$errors) {
                try {
                    \TimePoint::createNew(
                        $values['identifier'],
                        $values['subproject'],
                        $values['visit'],
                        isset($values['psc']) ?? null
                    );
                } catch (\Exception $exception) {
                    $exception = '';
                }
                $response['status'] = 'success';
            } else {
                $response['status'] = 'error';
                $response['errors'] = $errors;
            }
        } else {
            $response['status'] = 'error';
        }
        return $response;
    }

    /**
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param array $values the user data received.
     *
     * @return array
     * @throws \DatabaseException
     * @throws \DeprecatedException
     * @throws \LorisException
     */
    function initializeSetup(array $values) : array
    {
        // Setup variables
        $errors         = array(); // form errors.
        $config         =& \NDB_Config::singleton();
        $candidate      =& \Candidate::singleton($values['identifier']);
        $allSubprojects = \Utility::getSubprojectList();

        // Frontend needs for select element.
        $values['subproject'] = $allSubprojects;

        // All subprojects from config file (error).
        if (empty($allSubprojects)) {
            $errors['subprojectID'] = 'No subprojects have been defined 
            for this study. If you are an administrator, please use the 
            Configuration module to add new subprojects.';
        }
        // List of valid subprojects for a given project
        if ($config->getSetting('useProjects') === 'true') {
            // If projects enabled, loop through and add valid subprojects only
            $subprojList = '';
            try {
                $subprojList = $candidate->getValidSubprojects();
            } catch (\DatabaseException $e) {
            }
            if (empty($subprojList)) {
                $errors['subprojectID'] = 'No subprojects have been 
                defined for the project this candidate is affiliated with. 
                If you are an administrator, please use the Configuration module to 
                add new subprojects and associate them with projects.';
            }
        }

        // Retrieve visit labels.
        $visit_options      = array();
        $visitLabelSettings = $config->getSetting('visitLabel');
        foreach (
            \Utility::toArray($visitLabelSettings) as $visitLabel
        ) {
            if (!empty($values['subproject'])) {
                if (isset($visitLabel['generation'])
                    && $visitLabel['generation'] !== 'sequence'
                ) {
                    throw new \DeprecatedException(
                        'User generated Visit Labels are no '.
                        'longer supported in Loris.'
                    );
                }
                $visitLabel = \Utility::toArray($visitLabel)[0];
                $labelOptions[''] = null;
                $items            = \Utility::toArray(
                    $visitLabel['labelSet']['item']
                );
                foreach ($items as $item) {
                    $item = \Utility::toArray($item)[0];
                    $labelOptions[$item['@']['value']] = $item['#'];
                }
                $visit_options[$visitLabel['@']['subprojectID']]
                    = array_filter($labelOptions);
            }
        }
        $values['visit'] = $visit_options;
        if (!empty($visit_options)) {
            // List of sites for the user.
            $user = \User::singleton();
            $DB   = \Database::singleton();
            $user_list_of_sites = $user->getData('CenterIDs');
            $num_sites          = count($user->getData('CenterIDs'));
            $psc_labelOptions   = array();
            if ($num_sites > 1) {
                $psc_labelOptions = array(null => '');
                foreach ($user_list_of_sites as $key => $siteID) {
                    $center = $DB->pselectRow(
                        "SELECT CenterID as ID, Name FROM psc 
                        WHERE CenterID =:cid",
                        array('cid' => $siteID)
                    );
                    $psc_labelOptions[$siteID] = $center['Name'];
                }
            }
            $values['psc'] = array_filter($psc_labelOptions);
        }
        if (!empty($errors)) {
            $values['errors'] = $errors;
        }
        if (empty($values['psc'])) {
            unset($values['psc']);
        }

        return $values;
    }

    /**
     * Validate the post data,
     * from user user form selection.
     *
     * @param array $values the form values.
     *
     * @return array
     * @throws \LorisException
     */
    function validate(array $values) : array
    {
        $user = \User::singleton();

        $errors = array();

        // validate site entered
        $site = $values['psc'] ?? '';
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        if ($num_sites > 1 && (empty($site) || !$user->hasCenter($site))) {
            $errors['psc'] = 'Site must be selected from the available dropdown.';
        }

        $candid       = intval($values['identifier']);
        $subprojectID = intval($values['subproject']);
        $visitLabel   = $values['visit'] ?? '';

        try {
            \TimePoint::isValidVisitLabel($candid, $subprojectID, $visitLabel);
        } catch ( \LorisException $e) {
            $errors['visitLabel'] = $e->getMessage();
        }

        return $errors;
    }

}
