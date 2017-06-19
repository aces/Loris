<?php
namespace LORIS\RestAPI;

class Candidates implements Endpoint
{
    private $_user;

    public function __construct()
    {
        $login = new \SinglePointLogin();
        if (!$login->authenticate()) {
            throw new \AccessDeniedException('Not logged in');

            header("HTTP/1.1 401 Unauthorized");
            print json_encode(["error" => "You are not logged in"]);
            exit;
        }
        $this->_user = \User_DAO::fetch($login->_username);
    }

    /**
     * Handle a GET request
     *
     * @param $request array Pass by reference array of the request params
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handleGET(array &$request, \stdClass &$ctx = null)
    {
var_dump(__FUNCTION__);
var_dump(func_get_args());
    }

    /**
     * Handle a POST request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handlePOST(array &$req, array &$input, \stdClass &$ctx = null)
    {
var_dump(__FUNCTION__);
var_dump(func_get_args());
Entrypoint::error('YO', 402);
    }

    /**
     * Handle a PUT request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handlePUT(array &$req, array &$input, \stdClass &$ctx = null)
    {
var_dump(__FUNCTION__);
var_dump(func_get_args());
    }

    /**
     * Handle a DELETE request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handleDELETE(array &$req, array &$input, \stdClass &$ctx = null)
    {
var_dump(__FUNCTION__);
var_dump(func_get_args());
    }
}
