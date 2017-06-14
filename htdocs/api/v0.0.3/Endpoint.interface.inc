<?php

namespace LORIS\API;

interface EndPoint
{
    /**
     * Handle a POST request
     *
     * @return none
     */
    public function handlePOST(array &$params, \stdClass $inputs)

    /**
     * Handle a GET request
     *
     * @return none
     */
    public function handleGET(array &$params)

    /**
     * Handle a PUT request
     *
     * @return none
     */
    public function handlePUT()

    /**
     * Handle a DELETE request
     *
     * @return none
     */
    public function handleDELETE()

    /**
     * Handle a OPTIONS request
     *
     * @return none
     */
    public function handleOPTIONS()
}
