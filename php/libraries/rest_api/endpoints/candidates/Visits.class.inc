<?php
namespace LORIS\RestAPI\Candidates;

use \LORIS\Core\LORIS_DAO_Factory;
use \LORIS\RestAPI\Endpoint;
use \LORIS\RestAPI\RestApiException;
use \LORIS\RestAPI\RestApiException405;
use \LORIS\RestAPI\RestApiExceptionAllow;

class Visits extends Endpoint
{
    private $_candid;
    private $_visit;
    private $_allowedMethods = array('GET','POST', 'PUT', 'DELETE');

    public function __construct(string $visit_label = null, $candid)
    {
        $login = \SinglePointLogin::getInstance();
        if (!$login->authenticate()) {
            throw new RestApiException('Not logged in', 401);
        }

        $this->_candid = $candid;

        if (!empty($visit_label)) {
            $visit_dao = LORIS_DAO_Factory::getVisitDAO();
            try {
                $this->_visit = $visit_dao->getObject($candid, $visit_label);
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
     * @return none
     */
    public function handleGET()
    {
        $format_visit = function ($visit) {
            return array(
                'visit_label' => $visit->getVisit_label(),
                'visit_number' => $visit->getVisitNo(),
                'center_id'   => $visit->getCenterID()
            );
        };
        $data = null;

        if (!empty($this->_visit)) {
            $data = $format_visit($this->_visit);
        } else {
            $visit_dao    = LORIS_DAO_Factory::getVisitDAO();
            $data = array_map($format_visit, $visit_dao->getAll($this->_candid));
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

            $class_name = '\LORIS\RestAPI\Candidates\Visits\\' . $endpoint_name;
            if (!class_exists($class_name)) {
                throw new RestApiException("No Endpoint: $endpoint_name", 404);
            }

            $endpoint = new $class_name($endpoint_id);
            $final_enpoint = $endpoint->getEndpointInstance($request);
        }

        return $final_endpoint;
    }

}
