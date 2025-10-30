<?php declare(strict_types=1);

namespace LORIS\login;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Perform multi-factor authentication for LORIS.
 *
 * This page is used by the MFA middleware to prompt for and
 * validate a 2 factor authentication code.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class MFA extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . '/login/js/mfaPrompt.js',
            ]
        );
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . '/login/css/login.css']
        );
    }

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
            return parent::handle($request);
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
        $requestdata = json_decode((string )$request->getBody(), true);
        $user        = $request->getAttribute("user");
        if (!isset($requestdata['code'])) {
            return new \LORIS\Http\Response\JSON\Unauthorized("Missing code");
        }

        $validator = $user->getTOTPValidator();
        $counter   = $validator->getTimeCounter();
        $wantCode  = $validator->getCode($counter, 6);
        if ($wantCode === $requestdata['code']) {
            $login = $_SESSION['State']->getProperty('login');
            $login->setPassedMFA();
            return new \LORIS\Http\Response\JSON\OK(["success" => "validated code"]);
        } else {
            return new \LORIS\Http\Response\JSON\Unauthorized("Invalid MFA code");
        }
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return ['GET', 'POST'];
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
