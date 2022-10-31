<?php declare(strict_types=1);

namespace LORIS\login;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * POST request for authentication.
 *
 * Used to reset password.
 *
 * @category Loris
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Reset extends \NDB_Page implements ETagCalculator
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
            && $values['command'] === 'reset'
        ) {
            // password reset request by user.
            return $this->resetPassword($request);
        }

        return new \LORIS\Http\Response\JSON\BadRequest(
            'Error'
        );
    }

    /**
     * Reset password.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    function resetPassword(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true);

        // Always claim success to avoid providing user info to attackers.
        $values['success'] = 'Password reset. '
            . 'You should receive an email within a few minutes.';

        // Create the user object.
        $username = $values['username'];
        $user     = \User::factory($username);

        // Check if valid user.
        if ($user->userID) {
            $email = $user->getEmail();
            if (empty($email)) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    'Not a valid user'
                );
            }

            try {
                // Check if valid email.
                if ($user->isEmailValid()) {
                    $config = \NDB_Factory::singleton()->config();
                    // Generate a new password.
                    $password = \Utility::randomString();
                    // Reset the password in the database and
                    // expire password so user must change it upon login.
                    $user->updatePassword(
                        new \Password($password),
                        true
                    );

                    // send the user an email
                    $factory = \NDB_Factory::singleton();

                    $msg_data          = [];
                    $msg_data['study'] = $config->getSetting('title');
                    $msg_data['url']   = $factory->settings()->getBaseURL();
                    $msg_data['realname'] = $user->getFullname();
                    $msg_data['password'] = $password;
                    \Email::send($email, 'lost_password.tpl', $msg_data);
                } else {
                    error_log(
                        $_SERVER['REMOTE_ADDR']
                        . '(' . $_SERVER['HTTP_X_FORWARDED_FOR'] . ')'
                        . ' attempted to reset password for ' . $username
                    );
                    return new \LORIS\Http\Response\JSON\Conflict(
                        'Sending reset email failed.'
                    );
                }
            } catch (\LorisException $e) {
                error_log($e->getMessage());
                return new \LORIS\Http\Response\JSON\Conflict(
                    'Sending reset email failed.'
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
