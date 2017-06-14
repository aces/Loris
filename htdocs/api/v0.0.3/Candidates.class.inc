<?php
namespace LORIS\API;

class Candidates
{
    public function __construct()
    {
        $login = new \SinglePointLogin();
        if (!$login->authenticate()) {
            throw new \LORIS\Exceptions\AccessDeniedException('Not logged in');

            header("HTTP/1.1 401 Unauthorized");
            print json_encode(["error" => "You are not logged in"]);
            exit;
        }
    }

    public function handleGET(array $params)
    {
        var_dump($params);
    }

    public function handlePOST(array $params, \stdClass $inputs)
    {
        var_dump($params);
        var_dump($inputs);
    }
}
