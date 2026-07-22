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
    private const TOKEN_EXPIRATION_MINUTES = 20;

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
        case 'GET':
            return $this->_handleGET($request);
        case 'POST':
            return $this->_handlePOST($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Processes GET requests for password reset links.
     *
     * Validates the password reset token in the query string
     * before displaying the password reset form.
     *
     * @param ServerRequestInterface $request The incoming PSR-7 request.
     *
     * @return ResponseInterface The outgoing PSR-7 response.
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET request parameters.
        $params = $request->getQueryParams();

        if (isset($params['token'])) {
            return $this->_validateResetToken($request);
        }

        return new \LORIS\Http\Response\JSON\BadRequest(
            'Error'
        );
    }

    /**
     * Validates the password reset token.
     *
     * @param ServerRequestInterface $request PSR-7 request.
     *
     * @return ResponseInterface The outgoing PSR-7 response.
     */
    private function _validateResetToken(ServerRequestInterface $request)
    : ResponseInterface
    {
        if ($request->getMethod() === 'POST') {
            $token = $_SESSION['PasswordResetToken'] ?? null;
        }
        if ($request->getMethod() === 'GET') {
            $queryParams = $request->getQueryParams();
            $token       = $queryParams['token'] ?? null;
        }

        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();

        if (!is_string($token) || trim($token) === '') {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Missing password reset token.'
            );
        }

        // Check if the token is valid and not expired.
        $row = $db->pSelectRow(
            "SELECT r.UserID AS UserID, r.CreationDate, u.UserID AS Username
             FROM user_password_reset r
             INNER JOIN users u
             ON r.UserID = u.ID
             WHERE r.ResetToken = :token
                AND r.Status IS NULL
                AND r.CreationDate >= NOW() - INTERVAL "
                . self::TOKEN_EXPIRATION_MINUTES
                . " MINUTE",
            ['token' => $token]
        );

        if (empty($row)) {
            return new \LORIS\Http\Response\JSON\Conflict(
                'Invalid or expired reset password link.'
            );
        }

        // Set the session variable to indicate that the user can reset their
        // password.
        $_SESSION['PasswordExpiredForUser'] = $row['Username'];
        $_SESSION['PasswordResetToken']     = $token;
        $_SESSION['PasswordResetUserID']    = $row['UserID'];

        return new \LORIS\Http\Response\JsonResponse(
            ['valid' => true]
        );
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request)
    : ResponseInterface
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
            dgettext('login', 'Error')
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
        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true);

        // Check if password is not empty.
        if (empty($values['password']) || empty($values['confirm'])) {
            return new \LORIS\Http\Response\JSON\Conflict(
                dgettext('login', 'Can not use an empty password.')
            );
        }
        // Update the user password.
        if (isset($_SESSION['PasswordExpiredForUser'])) {
            $user      = \User::factory($_SESSION['PasswordExpiredForUser']);
            $plaintext = htmlspecialchars_decode($values['password']);
            // Check if new password is same as old password.
            if (!$user->isPasswordDifferent($plaintext)) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    dgettext('login', 'You cannot keep the same password.')
                );
            }
            // Update password
            try {
                $response = $this->_validateResetToken($request);
                if ($response->getStatusCode() !== 200) {
                    return $response;
                }
                $user->updatePassword(
                    new \Password(
                        $plaintext
                    )
                );
                // Mark the token that successfully reset the password as 'Used'
                $db->update(
                    'user_password_reset',
                    ['Status' => 'Used'],
                    [
                        'ResetToken' => $_SESSION['PasswordResetToken'],
                    ]
                );
                // Invalidate all other active tokens for this user by marking them
                // as 'Superseded'
                $stmt = $db->prepare(
                    "UPDATE user_password_reset
                        SET Status = 'Superseded'
                    WHERE UserID = :userID
                        AND ResetToken <> :token
                        AND Status IS NULL
                        AND CreationDate >= NOW() - INTERVAL "
                        . self::TOKEN_EXPIRATION_MINUTES
                        . " MINUTE"
                );
                $stmt->execute(
                    [
                        ':userID' => $_SESSION['PasswordResetUserID'],
                        ':token'  => $_SESSION['PasswordResetToken']
                    ]
                );
                unset($_SESSION['PasswordExpiredForUser']);
                unset($_SESSION['PasswordResetToken']);
                unset($_SESSION['PasswordResetUserID']);
            } catch (\InvalidArgumentException $e) {
                return new \LORIS\Http\Response\JSON\Conflict(
                    $e->getMessage()
                );
            }
        } else {
            return new \LORIS\Http\Response\JSON\Conflict(
                dgettext('login', 'Server encountered an error.')
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
            'GET',
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
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return true;
    }
}
