<?php
namespace LORIS\RestAPI;

class Login extends Endpoint
{
    public function __construct() 
    {
        $login = new \SinglePointLogin();
        if ($login->authenticate()) {
            throw new RestApiException("You are already logged in", 202);
        }
    }

    /**
     * Accessor for this endpoint's allowed HTTP methods
     * 
     * @return string A comma separated list of allowed methods
     */
    public function getAllowedMethods()
    {
        return 'POST';
    }

    /**
     * Handle a POST request
     *
     * @param $input array The content of php://input
     * @param $context a Object Value to use as context
     *
     * @return 
     */
    public function handlePOST(array &$input, &$ctx = NULL)
    {
        $response = array('token' => null);

        if (!$this->_isValidPostData($input))  {
            throw new RestApiException('Missing username or password', 400);
        } 
        $username = $input['username'];
        $password = $input['password'];

        $login = new \SinglePointLogin();

        if (!$login->passwordAuthenticate($username, $password ,false)) {
            throw new RestApiException($login->_lastError, 401);
        }
        $body = array('token' => $login->getEncodedToken($username));
        $status = 200;
        return array($body ,$status);
    }

    /**
     * Validate that the received input contains the required fields
     *
     * @param $input array The key-value inputs
     *
     * @return bool If all the fields are keys of the input
     */
    private function _isValidPostData($input): bool
    {
        $required_fields = array(
            'username',
            'password'
        );
        return array_reduce($required_fields,function($carry, $item) use ($input) {
            return $carry && array_key_exists($item, $input);
        },true);
    }
}
