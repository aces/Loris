<?php
namespace LORIS\RestAPI;

use \LORIS\Core\LORIS_DAO_Factory;

class Candidates extends Endpoint
{
    private $_candidate;
    private $_allowedMethods = array(
                                'GET',
                                'HEAD',
                                'POST',
                                'PUT',
                                'PATCH',
                               );

    public function __construct(string $candid = null)
    {
        $login = \SinglePointLogin::getInstance();
        if (!$login->authenticate()) {
            throw new RestApiException('Not logged in', 401);
        }

        if (!empty($candid)) {
            $candidate_dao = LORIS_DAO_Factory::getCandidateDAO();

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
        return join(',', $this->_allowedMethods);
    }

    public function getEndpointInstance(array $request = null)
    {
        $final_endpoint = null;

        if (empty($request)) {
            $final_endpoint = $this;

        } else {
            $endpoint_name = array_shift($request);
            $endpoint_id   = array_shift($request);

            // TODO :: This can be generalized and put in the abstract class
            $class_name = '\LORIS\RestAPI\Candidates\\' . $endpoint_name;
            if (!class_exists($class_name)) {
                throw new RestApiException("No Endpoint: $endpoint_name", 404);
            }

            $endpoint       = new $class_name($endpoint_id, $this->_candidate->getCandID());
            $final_endpoint = $endpoint->getEndpointInstance($request);
        }

        return $final_endpoint;
    }

    /**
     * Handle a GET request
     *
     * @param $context a Object Value to use as context
     *
     * @throws RestApiException
     * @return array The response body and a status code.
     */
    public function handleGET(&$ctx = null)
    {
        $format_candidate = function ($candidate) {
            return array(
                    'candidate_id' => $candidate->getCandID(),
                    'DoB'          => $candidate->getDoB(),
                   );
        };
        $data = null;

        if (!empty($this->_candidate)) {
            $data = $format_candidate($this->_candidate);
        } else {
            $candidate_dao = LORIS_DAO_Factory::getCandidateDAO();
            $data          = array_map($format_candidate, $candidate_dao->getAll());
        }
        return array(
                $data,
                200,
               );
    }

    /**
     * Handle a HEAD request
     *
     * @param $context a Object Value to use as context
     *
     * @throws RestApiException
     * @return array The response body and a status code.
     */
    public function handleHEAD(&$ctx = null)
    {
        $format_candidate = function ($candidate) {
            return array(
                    'candidate_id' => $candidate->getCandID(),
                    'DoB'          => $candidate->getDoB(),
                   );
        };
        $data = null;

        if (!empty($this->_candidate)) {
            $data = $format_candidate($this->_candidate);
        } else {
            $candidate_dao = LORIS_DAO_Factory::getCandidateDAO();
            $data          = array_map($format_candidate, $candidate_dao->getAll());
        }
        return array(
                array(),
                200,
               );
    }

    /**
     * Handle a PUT request
     *
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @throws RestApiException
     * @return array The response body and a status code.
     */
    public function handlePUT(array &$input, &$ctx = null)
    {
        var_dump($this->_candidate);
    }

    /**
     * Handle a PATCH request
     *
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @throws RestApiException
     * @return array The response body and a status code.
     */
    public function handlePATCH(array &$input, &$ctx = null)
    {
        if (empty($input['Candidate'])) {
            throw new RestApiException("Missing Candidate data", 400);
        };

         $new_values = $input['Candidate'];

        if (empty($new_values['CandID'])) {
            throw new RestApiException("Missing CandID", 400);
        }

        if ($new_values['CandID'] != $this->_candidate->getCandID()) {
            throw new RestApiException("Candidate do not match", 400);
        }

        array_walk(
            $new_values,
            function ($value, $key) {
                $setter_name = 'set'.$key;
                if (!method_exists($this->_candidate, $setter_name)) {
                    throw new RestApiException("Invalid attribute", 400);
                }
                $this->_candidate->{'set'.$key}($value);
            },
            $this->_candidate
        );

         $candidate_dao = LORIS_DAO_Factory::getCandidateDAO();
         $candidate_dao->update($this->_candidate);

         return array(
                 array(),
                 204,
                );
    }
}
