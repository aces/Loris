<?php
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';

class ProjectsJSON extends APIBase {
    public function __construct() {
        parent::__construct();

        $projects = Utility::getProjectList();
        $this->JSON = [
            "Projects" =>  array_values($projects)
        ];
    }
}

$obj = new ProjectsJSON();
print $obj->toJSONString();
?>
