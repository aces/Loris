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

    function _generateQuery() {
        $config = NDB_Config::singleton();
        $fieldsInQuery = "SELECT c.CandID, c.PSCID, s.Visit_label, s.SubprojectID, p.Alias as Site, c.Gender, s.Current_stage, CASE WHEN s.Visit='Failure' THEN 'Failure' WHEN s.Screening='Failure' THEN 'Failure' WHEN s.Visit='Withdrawal' THEN 'Withdrawal' WHEN s.Screening='Withdrawal' THEN 'Withdrawal' ELSE 'Neither' END as Failure, c.ProjectID, c.flagged_caveatemptor as CEF, c.flagged_caveatemptor as CEF, c_o.Description as CEF_reason, c.flagged_other as CEF_comment, pc_comment.Value as Comment, pso.Description as Status, ps.participant_suboptions as Status_reason, ps.reason_specify as Status_comments";
        $tablesToJoin = " FROM session s JOIN candidate c USING (CandID) LEFT JOIN psc p ON (p.CenterID=s.CenterID) LEFT JOIN caveat_options c_o ON (c_o.ID=c.flagged_reason) LEFT JOIN parameter_candidate AS pc_comment ON (pc_comment.CandID=c.CandID) AND pc_comment.ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='candidate_comment') LEFT JOIN participant_status ps ON (ps.CandID=c.CandID) LEFT JOIN participant_status_options pso ON (pso.ID=ps.participant_status)";
        // If proband fields are being used, add proband information into the query
        if ($config->getSetting("useProband") === "true") {
            $probandFields = ", c.ProbandGender as Gender_proband, ROUND(DATEDIFF(c.DoB, c.ProbandDoB) / (365/12)) AS Age_difference";
            $fieldsInQuery .= $probandFields;
        }
        // If expected date of confinement is being used, add EDC information into the query
        if ($config->getSetting("useEDC") === "true") {
            $EDCFields = ", c.EDC as EDC";
            $fieldsInQuery .= $EDCFields;
        }
        $concatQuery = $fieldsInQuery . $tablesToJoin . " WHERE s.Active='Y' AND c.Active='Y' AND ps.study_consent='yes' AND ps.study_consent_withdrawal IS NULL AND c.PSCID <> 'scanner'";
        return $concatQuery;
    }

    function _updateDataDict() {
        $config = NDB_Config::singleton();
        // If proband fields are being used, update the data dictionary
        if ($config->getSetting("useProband") === "true") {
            $this->Dictionary["Gender_proband"] = array(
                'Description' => 'Proband\'s gender',
                'Type' => "enum('Male','Female')"
            );
            $this->Dictionary["Age_difference"] = array(
                'Description' => 'Age difference between the candidate and the proband',
                'Type' => "int"
            );
        }
        // If expected date of confinement is being used, update the data dictionary
        if ($config->getSetting("useEDC") === "true") {
            $this->Dictionary["EDC"] = array(
                'Description' => 'Expected Date of Confinement (Due Date)',
                'Type' => "varchar(255)"
            );
        }
        /*
        // Add any candidate parameter fields to the data dictionary
        $parameterCandidateFields = $this->SQLDB->pselect("SELECT * from parameter_type WHERE SourceFrom='parameter_candidate' AND Queryable=1",
            array());
        foreach($parameterCandidateFields as $field) {
            if(isset($field['Name'])) {
                $fname = $field['Name'];
                $Dict[$fname] = array();
                $Dict[$fname]['Description'] = $field['Description'];
                $Dict[$fname]['Type'] = $field['Type'];
            }
        }
        */
    }

    function run() {
        $config = $this->CouchDB->replaceDoc('Config:BaseConfig', $this->Config);
        print "Updating Config:BaseConfig: $config";

        $this->CouchDB->replaceDoc('DataDictionary:Demographics',
            array('Meta' => array('DataDict' => true),
                  'DataDictionary' => array('demographics' => $this->Dictionary) 
            )
        );

        // Run query
        $demographics = $this->SQLDB->pselect($this->_generateQuery(), array());

        $this->CouchDB->beginBulkTransaction();

        foreach($demographics as $demographics) {
            $id = 'Demographics_Session_' . $demographics['PSCID'] . '_' . $demographics['Visit_label'];
            $demographics['Cohort'] = $this->_getSubproject($demographics['SubprojectID']);
            unset($demographics['SubprojectID']);
            if(isset($demographics['ProjectID'])) {
                $demographics['Project'] = $this->_getProject($demographics['ProjectID']);
                unset($demographics['ProjectID']);
            }
            if ($config->getSetting("useFamilyID") === "true") {
                $familyID     = $this->SQLDB->pselectOne("SELECT FamilyID FROM family
                                                          WHERE CandID=:cid",
                                                          array('cid'=>$demographics['CandID']));
                if (!empty($familyID)) {
                   $this->Dictionary["FamilyID"] = array(
                                    'Description' => 'FamilyID of Candidate',
                                    'Type'        => "int(6)",
                                    );
                    $demographics['FamilyID'] = $familyID;
                    $familyFields = $this->SQLDB->pselect("SELECT candID as Family_ID,
                                    Relationship_type as Relationship_to_candidate
                                    FROM family
                                    WHERE FamilyID=:fid AND CandID<>:cid",
                                    array('fid'=>$familyID, 'cid'=>$demographics['CandID']));
                    $num_family = 1;
                    if (!empty($familyFields)) {
                        foreach($familyFields as $row) {
                            //adding each sibling id and relationship to the file
                            $this->Dictionary["Family_CandID".$num_family] = array(
                                    'Description' => 'CandID of Family Member '.$num_family,
                                    'Type'        => "varchar(255)",
                                    );
                            $this->Dictionary["Relationship_type_Family".$num_family] = array(
                                    'Description' => 'Relationship of candidate to Family Member '.$num_family,
                                    'Type'        => "enum('half_sibling','full_sibling','1st_cousin')",
                                    );
                            $demographics['Family_CandID'.$num_family]                      = $row['Family_ID'];
                            $demographics['Relationship_type_Family'.$num_family] = $row['Relationship_to_candidate'];
                            $num_family                                                += 1;
                        }
                    }
                }
            }

            $success = $this->CouchDB->replaceDoc($id, array('Meta' => array(
                'DocType' => 'demographics',
                'identifier' => array($demographics['PSCID'], $demographics['Visit_label'])
            ),
                'data' => $demographics
            ));
            print "$id: $success\n";
        }
        $this->_updateDataDict();

        print $this->CouchDB->commitBulkTransaction();

    }
}

// Don't run if we're doing the unit tests; the unit test will call run.
if(!class_exists('UnitTestCase')) {
    $Runner = new CouchDBDemographicsImporter();
    $Runner->run();
}
?>
