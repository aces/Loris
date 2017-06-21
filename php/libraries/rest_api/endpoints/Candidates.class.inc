<?php
namespace LORIS\RestAPI;

use \LORIS\Core\LORIS_DAO_Factory;

class Candidates extends Endpoint
{
    private $_candidate;
    private $_allowedMethods = array('GET','POST', 'PUT', 'DELETE');

    public function __construct(string $candid = null)
    {
        $login = \SinglePointLogin::getInstance();
        if (!$login->authenticate()) {
            throw new RestApiException('Not logged in', 401);
        }

        if (!empty($candid)) {
            $candidate_dao    = LORIS_DAO_Factory::getCandidateDAO();
            try {
                $this->_candidate = $candidate_dao->getObject($candid);
            } catch (\LorisException $e) {
                throw new RestApiException($e->getMessage(), 404);
            }
        }
    }

    /**
     * Accessor for this endpoint's allowed HTTP methods
     * 
     * @return string A comma separated list of allowed methods
     */
    public function getAllowedMethods()
    {
        return join(',',$this->_allowedMethods);
    }

    /**
     * Handle a GET request
     *
     * @param $context a Object Value to use as context
     *
     * @return none
     */
    public function handleGET(&$ctx = null)
    {
        $format_candidate = function ($candidate) {
            return array(
                'candidate_id' => $candidate->getCandID(), 
                'DoB'          => $candidate->getDoB()
            );
        };
        $data = null;

        if (!empty($this->_candidate)) {
            $data = $format_candidate($this->_candidate);
        } else {
            $candidate_dao    = LORIS_DAO_Factory::getCandidateDAO();
            $data = array_map($format_candidate, $candidate_dao->getAll());
        }
        return array($data, 200);
    }

    public function getEndpointInstance(array $request = null)
    {
        $final_endpoint = null;

        if (empty($request)) {
            $final_endpoint = $this;

        } else {
            $endpoint_name = array_shift($request);
            $endpoint_id   = array_shift($request);

            $class_name = '\LORIS\RestAPI\Candidates\\' . $endpoint_name;
            if (!class_exists($class_name)) {
                throw new RestApiException("No Endpoint: $endpoint_name", 404);
            }

            $endpoint = new $class_name($endpoint_id);
            $final_enpoint = $endpoint->getEndpointInstance($request);
        }
 
        return $final_endpoint;
    }
}
