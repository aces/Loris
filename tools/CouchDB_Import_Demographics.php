<?php
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
class CouchDBDemographicsImporter {
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    // this is just in an instance variable to make
    // the code a little more readable.
    var $Dictionary = array(
        'CandID' => array(
            'Description' => 'DCC Candidate Identifier',
            'Type' => 'varchar(255)'
        ),  
        'PSCID' => array(
            'Description' => 'Project Candidate Identifier',
            'Type' => 'varchar(255)'
        ),  
        'Visit_label' => array(
            'Description' => 'Visit of Candidate',
            'Type' => 'varchar(255)'
        ),  
        'Cohort' => array(
            'Description' => 'Cohort of this session',
            'Type' => 'varchar(255)'
        ),  
        'Gender' => array(
            'Description' => 'Candidate\'s gender',
            'Type' => "enum('Male', 'Female')"
        ),  
        'Site' => array(
            'Description' => 'Site that this visit took place at',
            'Type' => "varchar(3)",
        ),  
        'Current_stage' => array(
            'Description' => 'Current stage of visit',
            'Type' => "enum('Not Started','Screening','Visit','Approval','Subject','Recycling Bin')"
        ),  
        'Failure' =>  array(
            'Description' => 'Whether Recycling Bin Candidate was failure or withdrawal',
            'Type' => "enum('Failure','Withdrawal','Neither')",
        ),
       'Project' => array(
            'Description' => 'Project for which the candidate belongs',
            'Type' => "enum('IBIS1','IBIS2','Fragile X', 'EARLI Collaboration')",
        ),
        'Plan' => array(
            'Description' => 'Plan for IBIS2 candidate',
            'Type' => "varchar(20)",
        ),
        'EDC' => array(
            'Description' => 'Expected Date of Confinement (Due Date)',
            'Type' => "varchar(255)",
        )

    );

    var $Config = array(
        'Meta' => array(
            'DocType' => 'ServerConfig'
        ),
        'Config' => array(
            'GroupString'  => 'How to arrange data: ',
            'GroupOptions' => 
                array('Cross-sectional', 'Longitudinal')
        )
    );

    function __construct() {
        $this->SQLDB = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
    }

    function _getSubproject($id) {
        $config = NDB_Config::singleton();
        $subprojsXML = $config->getSetting("subprojects");
        $subprojs = $subprojsXML['subproject'];
        foreach($subprojs as $subproj) {
            if($subproj['id'] == $id) {
                return $subproj['title'];
            }
        }
    }

    function _getProject($id) {
        $config = NDB_Config::singleton();
        $subprojsXML = $config->getSetting("Projects");
        $subprojs = $subprojsXML['project'];
        foreach($subprojs as $subproj) {
            if($subproj['id'] == $id) {
                return $subproj['title'];
            }
        }
    }

    function run() {
        $config = $this->CouchDB->replaceDoc('Config:BaseConfig', $this->Config);
        print "Updating Config:BaseConfig: $config";
        $this->CouchDB->replaceDoc('DataDictionary:Demographics',
            array('Meta' => array('DataDict' => true),
                  'DataDictionary' => array('demographics' => $this->Dictionary) 
            )
        );

        // Project, Plan, EDC
        $demographics = $this->SQLDB->pselect("SELECT c.CandID, c.PSCID, s.Visit_label, s.SubprojectID, p.Alias as Site, c.Gender, s.Current_stage, CASE WHEN s.Visit='Failure' THEN 'Failure' WHEN s.Screening='Failure' THEN 'Failure' WHEN s.Visit='Withdrawal' THEN 'Withdrawal' WHEN s.Screening='Withdrawal' THEN 'Withdrawal' ELSE 'Neither' END as Failure, c.ProjectID, pc_plan.Value as Plan, c.EDC as EDC FROM session s JOIN candidate c USING (CandID) LEFT JOIN psc p ON (p.CenterID=s.CenterID) LEFT JOIN parameter_type pt_plan ON (pt_plan.Name='candidate_plan') LEFT JOIN parameter_candidate AS pc_plan ON (pc_plan.CandID=c.CandID AND pt_plan.ParameterTypeID=pc_plan.ParameterTypeID) WHERE s.Active='Y' AND c.Active='Y' AND c.PSCID <> 'scanner'", array());
        foreach($demographics as $demographics) {
            $id = 'Demographics_Session_' . $demographics['PSCID'] . '_' . $demographics['Visit_label'];
            $demographics['Cohort'] = $this->_getSubproject($demographics['SubprojectID']);
            unset($demographics['SubprojectID']);
            if(isset($demographics['ProjectID'])) {
                $demographics['Project'] = $this->_getProject($demographics['ProjectID']);
                unset($demographics['ProjectID']);
            }
            $success = $this->CouchDB->replaceDoc($id, array('Meta' => array(
                'DocType' => 'demographics',
                'identifier' => array($demographics['PSCID'], $demographics['Visit_label'])
            ),
                'data' => $demographics
            ));
            print "$id: $success\n";
        }

    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if(!class_exists('UnitTestCase')) {
    $Runner = new CouchDBDemographicsImporter();
    $Runner->run();
}
?>
