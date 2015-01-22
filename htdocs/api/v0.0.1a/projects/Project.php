<?php
namespace Loris\API\Projects;

set_include_path(get_include_path() . ":" . __DIR__ . "/..");
require_once 'APIBase.php';

class Project extends \Loris\API\APIBase {
    var $ProjectID;
    var $ProjectName;
    var $ProjectInstruments;

    protected function getProjectID($ProjectName) {
        $config = $this->Factory->config();

        $Projects = $config->getSetting("Projects")["project"];
        foreach($Projects as $project) {
            if($project['title'] === $ProjectName) {
                return $project['id'];
            }
        }
    }

    public function __construct($method, $projectName, $bCandidates, $bInstruments, $bVisits) {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        $this->bCandidates = $bCandidates;
        $this->bInstruments = $bInstruments;
        $this->bVisits = $bVisits;

        $this->ProjectName = $projectName;
        require_once 'Utility.class.inc';

        $this->ProjectID = $this->getProjectID($projectName);

        if(!is_numeric($this->ProjectID)) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error(['error' => 'Invalid project']);
            $this->safeExit(0);
        }

        $this->handleRequest();

    }
    function handleGET() {
        $JSONArray = [
            "Meta" => [
                "Project" => $this->ProjectName
            ]
        ];

        if($this->bCandidates) {
            $rows = $this->DB->pselect("SELECT CandID FROM candidate WHERE ProjectID=:projID", array("projID" => $this->ProjectID));
            $CandIDs = [];

            foreach($rows as $row) {
                $CandIDs[] = $row['CandID'];
            }

            $JSONArray['Candidates'] = $CandIDs;
        }

        if($this->bInstruments) {
            $Instruments = \Utility::getAllInstruments();
            $JSONArray['Instruments'] = array_keys($Instruments);
        }

        if($this->bVisits) {
            $Visits = \Utility::getExistingVisitLabels($this->ProjectID);
            $VisitNames = array_keys($Visits);

            $JSONArray['Visits'] = $VisitNames;
        }

        $this->JSON = $JSONArray;
    }
}

if(isset($_REQUEST['PrintProjectJSON'])) {
    $Proj = new Project(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['Project'],
        isset($_REQUEST['Candidates'])  ? true : false,
        isset($_REQUEST['Instruments']) ? true : false,
        isset($_REQUEST['Visits'])      ? true : false
    );

    print $Proj->toJSONString();
}
?>
