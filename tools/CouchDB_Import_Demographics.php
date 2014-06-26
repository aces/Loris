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
        'EDC' => array(
            'Description' => 'Expected Date of Confinement (Due Date)',
            'Type' => "varchar(255)",
        ),
        'CEF' => array(
            'Description' => 'Caveat Emptor flag',
            'Type' => "enum('true','false')",
        ),
        'CEF_reason' => array(
            'Description' => 'Reason for Caveat Emptor flag',
            'Type' => "varchar(255)",
        ),
        'CEF_comment' => array(
            'Description' => 'Comment on Caveat Emptor flag',
            'Type' => "varchar(255)",
        ),
        'Comment' => array(
            'Description' => 'Candidate comment',
            'Type' => "varchar(255)",
        ),
        'Status' => array(
            'Description' => 'Participant status',
            'Type' => "varchar(255)",
        ),
        'Status_reason' => array(
            'Description' => 'Reason for status - only filled out if status is inactive or incomplete',
            'Type' => "int(10)",
        ),
        'Status_comments' => array(
            'Description' => 'Participant status comments',
            'Type' => "text",
        )

    );
    function __construct() {
        $this->SQLDB = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
        $this->config = NDB_Config::singleton();
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

    function _generateQuery() {
        $config = NDB_Config::singleton();
        $fieldsInQuery = "SELECT c.CandID, c.PSCID, s.Visit_label, s.SubprojectID, p.Alias as Site, c.Gender, s.Current_stage, CASE WHEN s.Visit='Failure' THEN 'Failure' WHEN s.Screening='Failure' THEN 'Failure' WHEN s.Visit='Withdrawal' THEN 'Withdrawal' WHEN s.Screening='Withdrawal' THEN 'Withdrawal' ELSE 'Neither' END as Failure, c.ProjectID, c.EDC as EDC, c.flagged_caveatemptor as CEF, c.flagged_caveatemptor as CEF, c_o.Description as CEF_reason, c.flagged_other as CEF_comment, pc_comment.Value as Comment, pso.Description as Status, ps.participant_suboptions as Status_reason, ps.reason_specify as Status_comments";
        $tablesToJoin = " FROM session s JOIN candidate c USING (CandID) LEFT JOIN psc p ON (p.CenterID=s.CenterID) LEFT JOIN caveat_options c_o ON (c_o.ID=c.flagged_reason) LEFT JOIN parameter_candidate AS pc_comment ON (pc_comment.CandID=c.CandID) AND pc_comment.ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='candidate_comment') LEFT JOIN participant_status ps ON (ps.CandID=c.CandID) LEFT JOIN participant_status_options pso ON (pso.ID=ps.participant_status)";
        if ($config->getSetting("useProband") === "true") {
            $probandFields = ", c.ProbandGender as Gender_proband, ROUND(DATEDIFF(c.DoB, c.ProbandDoB) / (365/12)) AS Age_difference, c.Sibling1 as Sibling_ID, f.Relationship_type as Relationship_to_sibling";
            $fieldsInQuery .= $probandFields;
            $probandTables = " LEFT JOIN family f ON (f.CandID=c.CandID)";
            $tablesToJoin = $tablesToJoin . $probandTables;
        }
        $concatQuery = $fieldsInQuery . $tablesToJoin . " WHERE s.Active='Y' AND c.Active='Y' AND ps.study_consent='yes' AND ps.study_consent_withdrawal IS NULL AND c.PSCID <> 'scanner'";
        return $concatQuery;
    }

    function _updateDataDict() {
        $config = NDB_Config::singleton();
        $Proband = array(
            'Gender_proband' => array(
                'Description' => 'Proband\'s gender',
                'Type' => "",
            ),
            'Age_difference' => array(
                'Description' => 'Age difference between the candidate and the proband',
                'Type' => "",
            ),
            'Sibling_ID' => array(
                'Description' => 'ID of the candidate\'s sibling',
                'Type' => "int(6)",
            ),
            'Relationship_to_sibling' => array(
                'Description' => 'Candidate\'s relationship to their sibling',
                'Type' => "enum('half_sibling','full_sibling','1st_cousin')",
            )
        );
        if ($config->getSetting("useProband") === "true") {
            $this->Dictionary = array_merge($this->Dictionary, $Proband);
        }
    }

    function run() {

        $this->_updateDataDict();

        $this->CouchDB->replaceDoc('DataDictionary:Demographics',
            array('Meta' => array('DataDict' => true),
                  'DataDictionary' => array('demographics' => $this->Dictionary) 
            )
        );
        
        // Run query
        $demographics = $this->SQLDB->pselect($this->_generateQuery(), array());
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

// Don't run if we're doing the unit tests; the unit test will call run.
if(!class_exists('UnitTestCase')) {
    $Runner = new CouchDBDemographicsImporter();
    $Runner->run();
}
?>
