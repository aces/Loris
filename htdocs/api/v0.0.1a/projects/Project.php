<?php
set_include_path(get_include_path() . ":" . __DIR__ . "/..");
require_once 'APIBase.php';

error_log(get_include_path());
class ProjectJSON extends APIBase {
    var $ProjectID;
    var $ProjectInstruments;

    protected function getProjectID($ProjectName) {
        $config = NDB_Config::singleton();

        $Projects = $config->getSetting("Projects")["project"];
        foreach($Projects as $project) {
            if($project['title'] === $ProjectName) {
                return $project['id'];
            }
        }
    }

    public function __construct($projectName, $bCandidates, $bInstruments, $bVisits) {
        parent::__construct();
        require_once 'Utility.class.inc';

        $this->ProjectID = $this->getProjectID($projectName);

        if(!is_numeric($this->ProjectID)) {
            header("HTTP/1.1 404 Not Found");
            print json_encode(['error' => 'Invalid project']);
            exit(0);
        }

        $JSONArray = [
            "Meta" => [
                "Project" => $projectName
            ]
        ];

        if($bCandidates) {
            $rows = $this->DB->pselect("SELECT CandID FROM candidate WHERE ProjectID=:projID", array("projID" => $this->ProjectID));
            $CandIDs = [];

            foreach($rows as $row) {
                $CandIDs[] = $row['CandID'];
            }

            $JSONArray['Candidates'] = $CandIDs;
        }

        if($bInstruments) {
            $Instruments = Utility::getAllInstruments();
            $JSONArray['Instruments'] = array_keys($Instruments);
        }

        if($bVisits) {
            $Visits = Utility::getExistingVisitLabels($this->ProjectID);
            $VisitNames = array_keys($Visits);

            $JSONArray['Visits'] = $VisitNames;
        }

        $this->JSON = $JSONArray;
    }
}

$Proj = new ProjectJSON(
    $_REQUEST['Project'],
    isset($_REQUEST['Candidates'])  ? true : false,
    isset($_REQUEST['Instruments']) ? true : false,
    isset($_REQUEST['Visits'])      ? true : false
);

print $Proj->toJSONString();
?>
