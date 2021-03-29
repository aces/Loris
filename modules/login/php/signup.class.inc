<?php declare(strict_types=1);

namespace LORIS\login;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * POST request for authentication.
 *
 * Used to request account.
 *
 * @category Loris
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Signup extends \NDB_Page implements ETagCalculator
{
    /**
     * This function will return a json object for login module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure POST request.
        switch ($request->getMethod()) {
        case 'POST':
            return $this->_handlePOST($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
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

        if (isset($values['command'])
            && $values['command'] === 'request'
        ) {
            // account request by user.
            return $this->requestAccount($request);
        }
        return new \LORIS\Http\Response\JSON\BadRequest(
            'Error'
        );
    }

    /**
     * Process request account form.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    function requestAccount(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true) ?? [];

        $config           = \NDB_Factory::singleton()->config();
        $reCAPTCHAPrivate = $config->getSetting('reCAPTCHAPrivate');

        // Verify reCAPTCHA
        if (isset($values['g-recaptcha-response']) && isset($reCAPTCHAPrivate)) {
            $recaptcha = new \ReCaptcha\ReCaptcha($reCAPTCHAPrivate);
            $resp      = $recaptcha->verify(
                $values['g-recaptcha-response'],
                $_SERVER['REMOTE_ADDR']
            );
            if (!$resp->isSuccess()) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    'Please complete the reCaptcha!'
                );
            }
        }

        $factory  = \NDB_Factory::singleton();
        $DB       = \NDB_Factory::singleton()->database();
        $name     = htmlspecialchars($values['firstname'], ENT_QUOTES);
        $lastname = htmlspecialchars($values['lastname'], ENT_QUOTES);
        $from     = htmlspecialchars($values['email'], ENT_QUOTES);
        $site     = $values['site'];
        $project  = $values['project'];
        $fullname = $name . ' ' . $lastname;

        $vals = [
            'UserID'               => $from,
            'Real_name'            => $fullname,
            'First_name'           => $name,
            'Last_name'            => $lastname,
            'Pending_approval'     => 'Y',
            'Email'                => $from,
            'account_request_date' => date('Y-m-d'),
        ];

        // Check email address' uniqueness
        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM users WHERE Email=:VEmail OR UserID=:VEmail",
            ['VEmail' => $from]
        );

        if ($result == 0) {
            // insert into DB only if email address doesn't exist
            $DB->insert('users', $vals);
            // Get the ID of the new user and insert into user_psc_rel
            $user_id = $DB->getLastInsertId();

            // verify site exists
            $siteList = \Utility::getSiteList();
            if (!is_null($site) && array_key_exists($site, $siteList)) {
                $DB->insert(
                    'user_psc_rel',
                    [
                        'UserID'   => $user_id,
                        'CenterID' => $site,
                    ]
                );
            }

            // verify project exists
            $projectList = \Utility::getProjectList();
            if (!is_null($project) && array_key_exists($project, $projectList)) {
                $DB->insert(
                    'user_project_rel',
                    [
                        'UserID'    => $user_id,
                        'ProjectID' => $project,
                    ]
                );
            }

            if ($values['examiner'] == 'true') {
                $rad = 0;
                if ($values['radiologist'] == 'true') {
                    $rad = 1;
                }
                //insert in DB as inactive until account approved
                $examinerID = $DB->pselect(
                    "SELECT e.examinerID
                     FROM examiners e
                     WHERE e.full_name=:fn",
                    ["fn" => $fullname]
                );

                // Add new account to the examiner tables
                if (empty($examinerID)) {
                    $DB->insert(
                        'examiners',
                        [
                            'full_name'   => $fullname,
                            'radiologist' => $rad,
                            'userID'      => $user_id,
                        ]
                    );
                    $examinerID = $DB->getLastInsertID();
                    $DB->insert(
                        'examiners_psc_rel',
                        [
                            'examinerID'       => $examinerID,
                            'centerID'         => $site,
                            'active'           => 'Y',
                            'pending_approval' => 'Y',
                        ]
                    );
                }
            }
        }

        // Don't send out emails if this is a sandbox VM.
        if (!$factory->config()->settingEnabled('sandbox')) {
            // Send an email to all users meeting the following criteria:
            //     - Associated with the Site
            //     - Associated with the Project
            //     - Have the User Management permission
            $query  = "
                SELECT DISTINCT
                    u.Email,
                    u.userID
                FROM
                    users u
                    JOIN user_psc_rel upr ON u.ID = upr.UserID
                    JOIN user_project_rel uprojr ON u.ID = uprojr.UserID
                WHERE
                    upr.CenterID = :center
                    AND uprojr.ProjectID = :project";
            $result = $DB->pselect(
                $query,
                ['center' => $site, 'project' => $project]
            );
            foreach ($result as $row) {
                $hasPermission = \User::factory($row['userID'])
                    ->hasAnyPermission(
                        ['user_accounts', 'user_accounts_multisite']
                    );
                if ($hasPermission === false) {
                    continue;
                }

                // Send email to users with User Management permissions.
                $config    = \NDB_Factory::singleton()->config();
                $studyName = $config->getSetting('title');

                \Email::send(
                    $row['Email'],
                    'request_account.tpl',
                    [
                        'Study'     => $studyName,
                        'UserID'    => $from,
                        'Real_name' => $fullname,
                        'Email'     => $from,
                    ]
                );
            }
        }

        return new \LORIS\Http\Response\JsonResponse(
            $values
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
            return '';
        }
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'POST',
        ];
    }

    /**
     * Returns true if the user has permission to access
     * the Login module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

}
