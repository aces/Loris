<?php
/**
 * POST request methods.
 *
 * Used to retrieve info & login by the login form.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\login;

use LORIS\Http\StringStream;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use SinglePointLogin;

/**
 * The NDB_Page for the POST requests.
 *
 * @category Loris
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AjaxLogin extends \NDB_Page
{
    public $skipTemplate = true;
    public $AjaxModule   = true;
    /**
     * This function will return a json object for login.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
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
         * Response to reply.
         */
        $response = $this->processRequest($requestBody);

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200)
            ->withHeader('Allow', 'POST')
            ->withBody(
                new StringStream(json_encode($response))
            );
    }

    /**
     * Processes the request values.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function processRequest(array $values) : array
    {
        if (isset($values['command']) && $values['command'] == 'initialize') {
            $response           = $this->initializeSetup($values);
            $response['status'] = 'success';
        } else if (isset($values['command']) && $values['command'] == 'login') {
            $response           = $this->login($values);
        } else {
            $response['status'] = 'error';
        }
        return $response;
    }
    /**
     * Initialize setup.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function initializeSetup(array $values) : array
    {
        $login = $_SESSION['State']->getProperty('login');
        if (!empty($login->_lastError)) {
            $values['error'] = $login->_lastError;
        }
        $config =& \NDB_Config::singleton();

        $study_links = $config->getExternalLinks('Studylinks');
        foreach ($study_links as $label => $url) {
            $WindowName = md5($url);
            $values['studylinks'][] = array(
                                       'url'        => $url,
                                       'label'      => $label,
                                       'windowName' => $WindowName,
                                      );
        }
        $values['study_description'] = html_entity_decode(
            $config->getSetting('StudyDescription')
        );

        $values['study_title'] = $config->getSetting('title');
        $values['study_logo']  = $config->getSetting('studylogo');

        return $values;
    }
    /**
     * Execute login.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function login(array $values) : array
    {
        $login = new SinglePointLogin();
        $_POST['login'] = 'true';
        $_POST['username'] = $values['username'];
        $_POST['password'] = $values['password'];
        if (!$login->isLoggedIn()) {
            $auth = $login->authenticate();
            if ($auth === true) {
                if ($login->passwordExpired()) {
                    header("HTTP/1.1 302 Found");
                    header("Location: /login/password-expiry");

                }
                $login->setState();
            } elseif ($auth === false) {
                // only send a 403 error if they were attempting to log in,
                // otherwise the login page returns a 403 when first accessing
                // it.
                if (!empty($_REQUEST['login'])) {
                    header("HTTP/1.1 403 Forbidden");
                } else {
                    // authenticate set an "Incorrect username or password"
                    // error. We don't want it to be displayed on the login page
                    // if they didn't just try and log in, so as a hack clear
                    // it if $_REQUEST['login'] isn't set.
                    $login->_lastError = '';
                }
                $login->clearState();
            }
        }
        if (!$login->isLoggedIn()) {
            $values['error'] = 'failed to login';
        } else {
            $values['status'] = 'success';
        }
        return $values;
    }
}
