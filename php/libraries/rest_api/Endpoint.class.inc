<?php
namespace LORIS\RestAPI;

abstract class Endpoint
{
    /**
     * Accessor for this endpoint's allowed HTTP methods
     * 
     * @return string A comma separated list of allowed methods
     */
    public function getAllowedMethods()
    {
        return '';
    }

    /**
     * Handle a OPTIONS request
     *
     * @return array The response body and a status code.
     */
    public function handleOPTIONS()
    {
        return array (
            'body' => '',
            'status' => 200
        );
    }

    /**
     * Handle a GET request
     *
     * @param $context a Object Value to use as context
     *
     * @throws RestApiException
     * @return array The response body and a status code.
     */
    public function handleGET(&$ctx = NULL)
    {
        $this->_methodNotAllowed();
    }

    /**
     * Handle a POST request
     *
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @throws RestApiException
     * @return array The response body and a status code.
     */
    public function handlePOST(array &$input, &$ctx = NULL)
    {
        $this->_methodNotAllowed();
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
    public function handlePUT(array &$input, &$ctx = NULL)
    {
        $this->_methodNotAllowed();
    }

    /**
     * Handle a DELETE request
     *
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @throws RestApiException
     * @return array The response body and a status code.
     */
    public function handleDELETE(array &$input, &$ctx = NULL)
    {
        $this->_methodNotAllowed();
    }

    /**
     * Handle the case when a method is disabled from this endpoint
     *
     * @throws RestApiException405
     * @return node
     */
    private function _methodNotAllowed()
    {
        $previous = new \Exception($this->getAllowedMethods());
        throw new RestApiException405('Method disabled', 405, $previous);
    }

    /** 
     * Instanciate endpoints to get to theend of the request arguments.
     *
     * @throws RestApiException
     * @return Endpoint
     */
    public function getEndpointInstance(array $request = null)
    {
        return $this;
    } 
}
