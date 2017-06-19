<?php
namespace LORIS\RestAPI;

interface Endpoint
{
    /**
     * Handle a GET request
     *
     * @param $request array Pass by reference array of the request params
     * @param $context a Object Value to use as context
     *
     * @return none, but print result as side-effect
     */
    public function handleGET(array &$req, \stdClass &$ctx = NULL);

    /**
     * Handle a POST request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none, but print result and process as side-effect
     */
    public function handlePOST(array &$req, array &$input, \stdClass &$ctx = NULL);

    /**
     * Handle a PUT request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none, but print result and update as side-effect
     */
    public function handlePUT(array &$req, array &$input, \stdClass &$ctx = NULL);

    /**
     * Handle a DELETE request
     *
     * @param $request array Pass by reference array of the request params
     * @param $input array json_decode of the content of php://input
     * @param $context a Object Value to use as context
     *
     * @return none, but print result and delete  as side-effect 
     */
    public function handleDELETE(array &$req, array &$input, \stdClass &$ctx = NULL);

}
