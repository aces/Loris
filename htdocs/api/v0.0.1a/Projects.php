<?php
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';


class Projects extends APIBase {
    public function __construct($method) {
        parent::__construct($method);
    }

    public function handleGET() {
        $config = $this->Factory->config();

        $useProjects = $config->getSetting("useProjects");

        if($useProjects && $useProjects !== "false" && $useProjects !== "0") {
            $projects = \Utility::getProjectList();
            $this->JSON = [
                "Projects" =>  array_values($projects)
            ];
        } else {
            $this->JSON = [
                "Projects" =>  ["loris"]
            ];
        }
    }
}

if(isset($_REQUEST['PrintProjects'])) {
    $obj = new Projects($_SERVER['REQUEST_METHOD']);
    print $obj->toJSONString();
}
?>
