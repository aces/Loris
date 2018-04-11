<?php
/**
 * This file contains the unit test for Visit_Type class.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */



//require_once __DIR__ .
//    "/../../test/integrationtests/LorisIntegrationTest.class.inc";
require_once __DIR__ . "/NDB_Factory.class.inc";
require_once __DIR__ . "/../../test/bootstrap.php";
require_once __DIR__ . "/Visit.class.inc";
require_once __DIR__ . "/Database.class.inc";
require_once __DIR__ . "/testConfig.inc";

// TODO
// - creer 4 visit_type et garder les IDs
// - récupérer un visit_type par son ID
// - ajouter des projects subproject (p, x), (x, sp), (p, sp)
// - récupérer la liste des visit type
// - récupérer la liste des visit type pour 1 project (p, x), (x, sp), (p,s sp)
// - modifier un visit type label (avec et sans legacy label)
// - supprimer les visit_type_project_subproject 1 par 1 et vérifier la liste 
//   entre chaque


class VisitTest 
{
    public $idList = array();
    protected $visit = array(array('VisitLabel' => 'Label1', 'VisitLegacyLabel' => 'LegacyLabel1'),
                             array('VisitLabel' => 'Label2', 'VisitLegacyLabel' => null),
                             array('VisitLabel' => 'Label3', 'VisitLegacyLabel' => 'LegacyLabel3'),
                             array('VisitLabel' => 'Label4', 'VisitLegacyLabel' => 'LegacyLabel4'));

    protected $visitProject = array(array(),
                                    array('projectID' => 1, 'subprojectID' => null),  // TODO find projectID
                                    array('projectID' => null, 'subprojectID' => 11),
                                    array('projectID' => 2, 'subprojectID' => 12),
                                    array('projectID' => 2, 'subprojectID' => null));

    public function testCreate()
    {
        for ($i = 0; $i < sizeof($this->visit); $i++){
            $this->idList[$i] = Visit::createVisit($this->visit[$i]['VisitLabel'],$this->visit[$i]['VisitLegacyLabel']);
        }
    }


    public function testGetLabel()
    {
        $error = false;
        for ($i = 0; $i < sizeof($this->visit); $i++){
            $result = Visit::getLabel($this->idList[$i]);
            if ($this->assertArray($result[0], $this->visit[$i]) !== true) {
                $error = true;
            }
        }
        return $error;
    }

    public function testAddToProjectSubproject()
    {
      Visit::addToProjectSubproject($this->idList[0], $this->visitProject[0]);
      Visit::addToProjectSubproject($this->idList[1], $this->visitProject[1]);
      Visit::addToProjectSubproject($this->idList[2], $this->visitProject[2]);
      Visit::addToProjectSubproject($this->idList[3], $this->visitProject[3]);
      Visit::addToProjectSubproject($this->idList[2], $this->visitProject[4]);
    }

    public function testGetList()
    {
        $error = false;
        $param = array('projectID' => 1);
        $result = Visit::getList($param);
        if ($this->assertArray($result[0], array_merge($this->visit[1], array('VisitID' => $this->idList[1]))) !== true) {
            $error = true;
       }

        $param = array('subprojectID' => 11);
        $result = Visit::getList($param);
        if ($this->assertArray($result[0], array_merge($this->visit[2], array('VisitID' => $this->idList[2]))) !== true) {
            $error = true;
        }

        $param = array('projectID' => 2, 'subprojectID' => 12);
        $result = Visit::getList($param);
        if ($this->assertArray($result[0], array_merge($this->visit[3], array('VisitID' => $this->idList[3]))) !== true) {
            $error = true;
        }

        $param = array('projectID' => 2);
        $result = Visit::getList($param);
        $expect = array_merge( $this->visit[2], array('VisitID' => $this->idList[2]));
        if ($this->assertArray($result[0], $expect) !== true) {
            $error = true;

        } 

        $param = array();
        $result = Visit::getList();
        $expect = array( array_merge( $this->visit[0], array('VisitID' => $this->idList[0])),
                         array_merge( $this->visit[1], array('VisitID' => $this->idList[1])),
                         array_merge( $this->visit[2], array('VisitID' => $this->idList[2])),
                         array_merge( $this->visit[3], array('VisitID' => $this->idList[3])));
        for ($i = 0; $i < 4; $i++) {
            if ($this->assertArray($result[$i], $expect[$i]) !== true) {
                $error = true;
            }
        } 

        return $error;
    }

    public function testSetLabel()
    {
        $error = false;

        Visit::setLabel($this->idList[0], 'NewLabel1');
        Visit::setLabel($this->idList[1], 'NewLabel2', 'NewLegacyLabel2');

        $label1 = Visit::getLabel($this->idList[0]);
        if ($label1[0]['VisitLabel'] !== "NewLabel1" ) {
            $error = true;
        }
        $label2 = Visit::getLabel($this->idList[1]);
        if ($label2[0]['VisitLegacyLabel'] !== "NewLegacyLabel2" ) {
            $error = true;
        }
        return $error;
    }

    public function testDeleteFromProject()
    {
        //TODO (2, null), (2,12), (null, 11), (null, null)
        $error = false;
        $param = array('projectID' => 2);
        Visit::deleteFromProject($this->idList[2], $param);
        $result1 = Visit::getList($param);
        $param = array('projectID' => 2, 'subprojectID' => 12);
        $result2 = Visit::getList($param);
        if ($this->assertArray($result1, array()) == false ||
            $this->assertArray($result2, array(array_merge( $this->visit[3], array('VisitID' => $this->idList[3])))) == false ) {
            $error = true;
        }

        $param = array('projectID' => 2, 'subprojectID' => 12);
        Visit::deleteFromProject($this->idList[3], $param);
        $result = Visit::getList($param);
        if  ($this->assertArray($result, array()) == false) {
            $error = true;
        }

        $param = array('subprojectID' => 11);
        Visit::deleteFromProject($this->idList[2], $param);
        $result = Visit::getList($param);
        if  ($this->assertArray($result, array()) == false) {
            $error = true;
        }

        $param = array();
        $result = Visit::deleteFromProject($this->idList[0], $param);
        if ($result != false) {
            $error = true;
        }

        return $error;  
    }

    private function assertArray($array1, $array2){
        // check for phpunit function call
        if (sizeof($array1) != sizeof($array2)){
            print("Array not the same size\n");
            return false;
        }
        
        foreach ($array1 as $key=>$value){
            if (isset($array2[$key]) && is_array($array2[$key])) {
                $result = $this->assertArray($value, $array2[$key]);
                if ($result == false){
                    return false;
                }
            }
            elseif ( !(isset($array2[$key]) && $value === $array2[$key] 
                     || is_null($value) && is_null($array2[$key]) )){
                print("Value are not the same\n");
                return false;
            }
        }
        return true;
    }
}

//prepare Database for test;
global $DB ;
$DB = new Database();
$DB = Database::singleton($database, $username, $password, $host);
$DB->run("DELETE FROM visit_project_subproject_rel");
$DB->run("DELETE FROM visit");

$test = new VisitTest();

// create the visits and retreive
$test->testCreate();
$error = $test->testGetLabel();
printf ("createVisit() and getLabel() %s\n", $error ? "fail" : "pass");

// create visit-project-subproject associations and retreive
$test->testAddToProjectSubproject();
$error = $test->testGetList();  
printf ("getList() %s\n", ($error ? "fail" : "pass"));

// modify visit label
$error = $test->testSetLabel();
printf("setLabel() %s\n", ($error ? "fail" : "pass"));


// remove visit-project-subproject associations
$error = $test->testDeleteFromProject();
printf("deleteFromProject() %s\n", ($error ? "fail" : "pass"));

?>
