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

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

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
//        if ($request->getMethod() != 'POST') {
//            return (new \LORIS\Http\Response())
//                ->withHeader('Content-Type', 'application/json')
//                ->withStatus(405)
//                ->withHeader('Allow', 'POST')
//                ->withBody(
//                    new \LORIS\Http\StringStream(
//                        'Only POST requests are allowed'
//                    )
//                );
//        }
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
                new \LORIS\Http\StringStream(
                    json_encode($response)
                )
            );
    }

    /**
     * Processes the values and saves to database
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function processRequest(array $values) : array
    {
        if (isset($values['command']) && $values['command'] == 'initialize') {
            $response = $this->initializeSetup($values);
            $response['status'] = 'success';
        } else if (isset($values['command']) && $values['command'] == 'login') {
            $response['status'] = 'success';
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
     */
    function initializeSetup(array $values) : array
    {
//        $login = $_SESSION['State']->getProperty('login');
//        if (!empty($login->_lastError)) {
//            $this->tpl_data['error_message'] = $login->_lastError;
//        }
//        $config =& \NDB_Config::singleton();
//
//        $study_links = $config->getExternalLinks('Studylinks');
//        foreach ($study_links as $label => $url) {
//            $WindowName = md5($url);
//            $this->tpl_data['studylinks'][] = array(
//                'url'        => $url,
//                'label'      => $label,
//                'windowName' => $WindowName,
//            );
//        }
//        $this->tpl_data['study_description'] = html_entity_decode(
//            $config->getSetting('StudyDescription')
//        );
//
//        $this->tpl_data['study_title'] = $config->getSetting('title');
//
//        try {
//            $this->tpl_data['study_logo'] = $config->getSetting('studylogo');
//        } catch(\ConfigurationException $e) {
//            $this->tpl_data['study_logo'] = '';
//        }
        return $values;
    }
}
