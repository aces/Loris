<?php
namespace LORIS\RestAPI;

class Login implements Endpoint
{
    public function __construct() 
    {
        $login = new \SinglePointLogin();
        if ($login->authenticate()) {
            // TODO :: To be documented
            Entrypoint::response(["message" =>"You are already logged in"], 202);
            Entrypoint::safeExit(0);
        }
    }

    /**
     * Handle a GET request
     *
     * @param $request array Pass by reference array of the request params
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handleGET(array &$request, \stdClass &$ctx = NULL)
    {
        Entrypoint::header('Allow: POST');
        Entrypoint::error('Method Not Allowed', 405);
    }

    /**
     * Handle a POST request
     *
     * @param $request array Pass by reference array of the request params
     * @param $file array The content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handlePOST(array &$req, array &$file, \stdClass &$ctx = NULL)
    {
        $required_fields = array(
            'username',
            'password'
        );
        if (!$this->_isValidPostData($file))  {
            Entrypoint::error('Invalid input', 400);
        } 
        $username = $file['username'];
        $password = $file['password'];

        $login = new \SinglePointLogin();
        if ($login->passwordAuthenticate($username, $password ,false)) {
            $response = array(
                'token' => $login->getEncodedToken($username)
            );
            Entrypoint::response($response,200);
        } else {
            Entrypoint::error($login->_lastError, 401);
        }
    }

    /**
     * Handle a PUT request
     *
     * @param $request array Pass by reference array of the request params
     * @param $file array The content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handlePUT(array &$req, array &$file, \stdClass &$ctx = NULL)
    {
        Entrypoint::header('Allow: POST');
        Entrypoint::error('Method Not Allowed', 405);
    }

    /**
     * Handle a DELETE request
     *
     * @param $request array Pass by reference array of the request params
     * @param $file array The content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handleDELETE(array &$req, array &$file, \stdClass &$ctx = NULL)
    {
        Entrypoint::header('Allow: POST');
        Entrypoint::error('Method Not Allowed', 405);
    }

    /**
     * Validate that the received input contains the required fields
     *
     * @param $input array The key-value inputs
     *
     * @return bool If all the fields are keys of the input
     */
    private function _isValidPostData($input): bool {
        $required_fields = array(
            'username',
            'password'
        );
        return array_reduce($required_fields,function($carry, $item) use ($input) {
            return $carry && array_key_exists($item, $input);
        },true);
    }
}
