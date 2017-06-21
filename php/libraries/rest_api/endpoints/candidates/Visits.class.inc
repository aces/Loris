<?php
namespace LORIS\RestAPI\Candidates;

use \LORIS\Core\LORIS_DAO_Factory;
use \LORIS\RestAPI\Endpoint;
use \LORIS\RestAPI\RestApiException;
use \LORIS\RestAPI\RestApiException405;
use \LORIS\RestAPI\RestApiExceptionAllow;

class Visits implements \LORIS\RestAPI\Endpoint
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
     * @param $context a Value Object to use as context. A Candidate_VO in this case
     *
     * @return none
     */
    public function handleGET(array &$req, array &$input, &$ctx = null)
    {
        $visit_label = array_shift($req);

        if (!$this->_isValidVisitLabel($visit_label)) {
            throw new RestApiException('Missing visit label', 400);
        }

        $visit_dao = LORIS_DAO_Factory::getVisitDAO();
        $visit = $visit_dao->getObject($ctx->getCandID(), $visit_label);
$candidate = \Candidate::singleton($ctx->getCandID());
var_dump($candidate->getListOfTimePoints());
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
     * @param $context a Value Object to use as context. A Candidate_VO in this case
     *
     * @return none
     */
    public function handlePOST(array &$req, array &$input, &$ctx = null)
    {
        // TODO
    }

    /**
     * Handle a PUT request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Value Object to use as context. A Candidate_VO in this case
     *
     * @return none
     */
    public function handlePUT(array &$req, array &$input, &$ctx = null)
    {
        // TODO
    }

    /**
     * Handle a DELETE request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Value Object to use as context. A Candidate_VO in this case
     *
     * @return none
     */
    public function handleDELETE(array &$req, array &$input, &$ctx = null)
    {
       $this->_methodNotAllowed(); 
    }

    /**
     * Validate that the received input contains the required fields
     *
     * @param $input string The visit label
     *
     * @return bool If not empty
     */
    private function _isValidVisitLabel($visit_label): bool {
        return !empty($visit_label);
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
