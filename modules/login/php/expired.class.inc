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
class Expired extends \NDB_Page implements ETagCalculator
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
            && $values['command'] === 'expired'
        ) {
            // login - expired password update
            return $this->expiredPassword($request);
        }

        return new \LORIS\Http\Response\JSON\BadRequest(
            'Error'
        );
    }

    /**
     * Expired password update.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    function expiredPassword(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true);

        // Check if password is not empty.
        if (empty($values['password']) || empty($values['confirm'])) {
            return new \LORIS\Http\Response\JSON\Conflict(
                'Can not use an empty password.'
            );
        }
        // Update the user password.
        if (isset($_SESSION['PasswordExpiredForUser'])) {
            $user      = \User::factory($_SESSION['PasswordExpiredForUser']);
            $plaintext = htmlspecialchars_decode($values['password']);
            // Check if new password is same as old password.
            if (!$user->isPasswordDifferent($plaintext)) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    'You cannot keep the same password.'
                );
            }
            // Update password
            try {
                $user->updatePassword(
                    new \Password(
                        $plaintext
                    )
                );
                unset($_SESSION['PasswordExpiredForUser']);
            } catch (\InvalidArgumentException $e) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    $e->getMessage()
                );
            }
        } else {
            return new \LORIS\Http\Response\JSON\Conflict(
                'Server encountered an error.'
            );
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
