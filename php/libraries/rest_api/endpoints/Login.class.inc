<?php
namespace LORIS\RestAPI;

class Login implements Endpoint
{
    public function __construct() 
    {
        $login = new \SinglePointLogin();
        if ($login->authenticate()) {
            throw new RestApiException("You are already logged in", 202);
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
    public function handleGET(array &$req, array &$input, \stdClass &$ctx = NULL)
    {
        $this->_methodNotAllowed();
    }

    /**
     * Handle a POST request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array The content of php://input
     * @param $context a Object Value to use as context
     *
     * @return 
     */
    public function handlePOST(array &$req, array &$input, \stdClass &$ctx = NULL)
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
     * Handle a PUT request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array The content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handlePUT(array &$req, array &$input, \stdClass &$ctx = NULL)
    {
        $this->_methodNotAllowed();
    }

    /**
     * Handle a DELETE request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array The content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handleDELETE(array &$req, array &$input, \stdClass &$ctx = NULL)
    {
        $this->_methodNotAllowed();
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

    /**
     * Handle the case when a method is disabled from this endpoint
     *
     * @throws RestApiException405
     * @return node
     */
    private _methodNotAllowed()
    {
        $previous = new RestApiExceptionAllow("POST");
        throw new RestApiException405('Method disabled', 405, $previous);
    }

}
