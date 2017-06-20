<?php
namespace LORIS\RestAPI;

use \LORIS\Core\LORIS_DAO_Factory;

class Candidates implements Endpoint
{
    private $_user;

    public function __construct()
    {
        $login = new \SinglePointLogin();
        if (!$login->authenticate()) {
            throw new RestApiException('Not logged in', 401);
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
    public function handleGET(array &$req, array &$input, \stdClass &$ctx = null)
    {
        $candid = array_shift($req);

        if (!$this->_isValidCandid($candid)) {
            throw new RestApiException('Missing or invalid candid', 400);
        }

        $candidate_dao = LORIS_DAO_Factory::getCandidateDAO();
        $candidate = $candidate_dao->getObject($candid);

        if (empty($req)) {
            $data = array(
                'candidate_id' => $candidate->getCandID(), 
                'DoB'          => $candidate->getDoB()
            );
            $response = array($data, 200);

        } else {
            $next_endpoint = array_shift($req);
            $endpoint_name = "LORIS\RestAPI\Candidates\\" . $next_endpoint;
            $endpoint = new $endpoint_name();
            $response = $endpoint->handleGET($req,$input,$candidate);
        }

        return $response;
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
throw new RestApiException('YO', 402);
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
       $this->_methodNotAllowed(); 
    }

    /**
     * Validate that the received input contains the required fields
     *
     * @param $input array The key-value inputs
     *
     * @return bool If all the fields are keys of the input
     */
    private function _isValidCandid($candid): bool {
        return is_numeric($candid);
    }

    /**
     * Handle the case when a method is disabled from this endpoint
     *
     * @throws RestApiException405
     * @return node
     */
    private function _methodNotAllowed()
    {
        $previous = new RestApiExceptionAllow("GET,POST,PUT");
        throw new RestApiException405('Method disabled', 405, $previous);
    }
}
