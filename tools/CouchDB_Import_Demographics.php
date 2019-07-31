<?php
require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
class CouchDBDemographicsImporter
{
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    // this is just in an instance variable to make
    // the code a little more readable.
    var $Dictionary = array(
                       'DoB'              => array(
                                              'Description' => 'Date of Birth',
                                              'Type'        => 'varchar(255)',
                                             ),
                       'CandID'           => array(
                                              'Description' => 'DCC Candidate Identifier',
                                              'Type'        => 'varchar(255)',
                                             ),
                       'PSCID'            => array(
                                              'Description' => 'Project Candidate Identifier',
                                              'Type'        => 'varchar(255)',
                                             ),
                       'Visit_label'      => array(
                                              'Description' => 'Visit of Candidate',
                                              'Type'        => 'varchar(255)',
                                             ),
                       'Cohort'           => array(
                                              'Description' => 'Cohort of this session',
                                              'Type'        => 'varchar(255)',
                                             ),
                       'Sex'              => array(
                                              'Description' => 'Candidate\'s biological sex',
                                              'Type'        => "enum('Male', 'Female')",
                                             ),
                       'Site'             => array(
                                              'Description' => 'Site that this visit took place at',
                                              'Type'        => "varchar(3)",
                                             ),
                       'Current_stage'    => array(
                                              'Description' => 'Current stage of visit',
                                              'Type'        => "enum('Not Started','Screening','Visit','Approval','Subject','Recycling Bin')",
                                             ),
                       'Failure'          => array(
                                              'Description' => 'Whether Recycling Bin Candidate was failure or withdrawal',
                                              'Type'        => "enum('Failure','Withdrawal','Neither')",
                                             ),
                       'CEF'              => array(
                                              'Description' => 'Caveat Emptor flag',
                                              'Type'        => "enum('true','false')",
                                             ),
                       'CEF_reason'       => array(
                                              'Description' => 'Reason for Caveat Emptor flag',
                                              'Type'        => "varchar(255)",
                                             ),
                       'CEF_comment'      => array(
                                              'Description' => 'Comment on Caveat Emptor flag',
                                              'Type'        => "varchar(255)",
                                             ),
                       'Comment'          => array(
                                              'Description' => 'Candidate comment',
                                              'Type'        => "varchar(255)",
                                             ),
                       'Status'           => array(
                                              'Description' => 'Participant status',
                                              'Type'        => "varchar(255)",
                                             ),
                       'Status_reason'    => array(
                                              'Description' => 'Reason for status - only filled out if status is inactive or incomplete',
                                              'Type'        => "int(10)",
                                             ),
                       'Status_comments'  => array(
                                              'Description' => 'Participant status comments',
                                              'Type'        => "text",
                                             ),
                       'session_feedback' => array(
                                              'Description' => 'Behavioural feedback at the session level',
                                              'Type'        => "varchar(255)",
                                             ),
                      );

    var $Config = array(
                   'Meta'   => array('DocType' => 'ServerConfig'),
                   'Config' => array(
                                'GroupString'  => 'How to arrange data: ',
                                'GroupOptions' => array(
                                                   'Cross-sectional',
                                                   'Longitudinal',
                                                  ),
                               ),
                  );

    function __construct()
    {
        $factory       = \NDB_Factory::singleton();
        $config        = \NDB_Config::singleton();
        $couchConfig   = $config->getSetting('CouchDB');
        $this->SQLDB   = $factory->Database();
        $this->CouchDB = $factory->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
    }

    function _getSubproject($id)
    {
        $config   = \NDB_Config::singleton();
        $subprojs = $config->getSubprojectSettings($id);
        if($subprojs['id'] == $id) {
            return $subprojs['title'];
        }
    }

    function _getProject($id)
    {
        $config = \NDB_Config::singleton();
        $projs  = $config->getProjectSettings($id);
        if($projs['id'] == $id) {
            return $projs['Name'];
        }
    }

    function _generateQuery()
    {
        $config = \NDB_Config::singleton();

        $fieldsInQuery = "SELECT c.DoB,
                                c.CandID, 
                                c.PSCID, 
                                s.Visit_label, 
                                s.SubprojectID, 
                                p.Alias as Site, 
                                c.Sex,
                                s.Current_stage, 
                                CASE WHEN s.Visit='Failure' THEN 'Failure' WHEN s.Screening='Failure' THEN 'Failure' WHEN s.Visit='Withdrawal' THEN 'Withdrawal' WHEN s.Screening='Withdrawal' THEN 'Withdrawal' ELSE 'Neither' END as Failure, 
                                c.ProjectID, 
                                c.flagged_caveatemptor as CEF, 
                                c_o.Description as CEF_reason, 
                                c.flagged_other as CEF_comment, 
                                pc_comment.Value as Comment, 
                                COALESCE(pso.Description,'Active') as Status, 
                                ps.participant_suboptions as Status_reason, 
                                ps.reason_specify as Status_comments, 
                                GROUP_CONCAT(fbe.Comment) as session_feedback";
        $tablesToJoin  = " FROM session s 
                                JOIN candidate c USING (CandID) 
                                LEFT JOIN psc p ON (p.CenterID=s.CenterID) 
                                LEFT JOIN caveat_options c_o ON (c_o.ID=c.flagged_reason) 
                                LEFT JOIN parameter_candidate AS pc_comment ON (pc_comment.CandID=c.CandID) AND pc_comment.ParameterTypeID=(SELECT ParameterTypeID FROM parameter_type WHERE Name='candidate_comment') 
                                LEFT JOIN participant_status ps ON (ps.CandID=c.CandID) 
                                LEFT JOIN participant_status_options pso ON (pso.ID=ps.participant_status)
                                LEFT JOIN feedback_bvl_thread fbt ON (fbt.CandID=c.CandID) 
                                LEFT JOIN feedback_bvl_entry fbe ON (fbe.FeedbackID=fbt.FeedbackID)";
        $groupBy       =" GROUP BY s.ID, 
                            c.DoB,
                            c.CandID,
                            c.PSCID, 
                            s.Visit_label, 
                            s.SubprojectID, 
                            Site, 
                            c.Sex,
                            s.Current_stage,
                            Failure,
                            c.ProjectID, 
                            CEF, 
                            CEF_reason, 
                            CEF_comment, 
                            pc_comment.Value, 
                            pso.Description, 
                            ps.participant_suboptions, 
                            ps.reason_specify";

        // If proband fields are being used, add proband information into the query
        if ($config->getSetting("useProband") === "true") {
            $probandFields  = ", c.ProbandSex as Sex_proband, ROUND(DATEDIFF(c.DoB, c.ProbandDoB) / (365/12)) AS Age_difference";
            $fieldsInQuery .= $probandFields;
            $groupBy       .= ", c.ProbandSex, Age_difference";
        }
        // If expected date of confinement is being used, add EDC information into the query
        if ($config->getSetting("useEDC") === "true") {
            $EDCFields      = ", c.EDC as EDC";
            $fieldsInQuery .= $EDCFields;
            $groupBy       .= ", c.EDC";
        }
        // If consent is being used, add consent information into query
        if ($config->getSetting("useConsent") === "true") {
            $consents = \Utility::getConsentList();
            foreach($consents as $consentID=>$consent) {
                $consentName    = $consent['Name'];
                $cField         = $this->SQLDB->escape("cc$consentID");
                $consentFields  = ",
                $cField.Status AS " . $consentName . ",
                $cField.DateGiven AS " . $consentName . "_date,
                $cField.DateWithdrawn AS " . $consentName . "_withdrawal";
                $fieldsInQuery .= $consentFields;
                $tablesToJoin  .= "
                                LEFT JOIN candidate_consent_rel $cField ON ($cField.CandidateID=c.CandID) 
                                AND $cField.ConsentID=(SELECT ConsentID FROM consent WHERE Name='" . $consentName . "') ";
                $groupBy       .= ",
                            $cField.Status,
                            $cField.DateGiven,
                            $cField.DateWithdrawn";
            }
        }
        $whereClause =" WHERE s.Active='Y' AND c.Active='Y' AND c.Entity_type != 'Scanner'";

        $concatQuery = $fieldsInQuery . $tablesToJoin . $whereClause . $groupBy;
        return $concatQuery;
    }

    function _updateDataDict()
    {
        $config = \NDB_Config::singleton();
        // If proband fields are being used, update the data dictionary
        if ($config->getSetting("useProband") === "true") {
            $this->Dictionary["Sex_proband"]    = array(
                                                   'Description' => 'Proband\'s biological sex',
                                                   'Type'        => "enum('Male','Female')",
                                                  );
            $this->Dictionary["Age_difference"] = array(
                                                   'Description' => 'Age difference between the candidate and the proband',
                                                   'Type'        => "int",
                                                  );
        }
        // If expected date of confinement is being used, update the data dictionary
        if ($config->getSetting("useEDC") === "true") {
            $this->Dictionary["EDC"] = array(
                                        'Description' => 'Expected Date of Confinement (Due Date)',
                                        'Type'        => "varchar(255)",
                                       );
        }
        $projects      = \Utility::getProjectList();
        $projectsEnum  = "enum('";
        $projectsEnum .= implode("', '", $projects);
        $projectsEnum .= "')";
        $this->Dictionary["Project"] = array(
                                        'Description' => 'Project for which the candidate belongs',
                                        'Type'        => $projectsEnum,
                                       );
        // If consent is being used, update the data dictionary
        if ($config->getSetting("useConsent") === "true") {
            $consents = \Utility::getConsentList();
            foreach($consents as $consent) {
                $consentName  = $consent['Name'];
                $consentLabel = $consent['Label'];
                $this->Dictionary[$consentName]           = array(
                                                             'Description' => $consentLabel,
                                                             'Type'        => "enum('yes','no')",
                                                            );
                $this->Dictionary[$consentName . "_date"] = array(
                                                             'Description' => $consentLabel . ' Date',
                                                             'Type'        => "date",
                                                            );
                $this->Dictionary[$consentName . "_withdrawal"] = array(
                                                                   'Description' => $consentLabel . ' Withdrawal Date',
                                                                   'Type'        => "date",
                                                                  );
            }
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

    function run()
    {
        $config = $this->CouchDB->replaceDoc('Config:BaseConfig', $this->Config);
        print "Updating Config:BaseConfig: $config";

        // Run query
        $max_len      = $this->SQLDB->run("SET SESSION group_concat_max_len = 100000;", array());
        $demographics = $this->SQLDB->pselect($this->_generateQuery(), array());

        $this->CouchDB->beginBulkTransaction();
        $config_setting = \NDB_Config::singleton();
        foreach($demographics as $demographics) {
            $id = 'Demographics_Session_' . $demographics['PSCID'] . '_' . $demographics['Visit_label'];
            $demographics['Cohort'] = $this->_getSubproject($demographics['SubprojectID']);
            unset($demographics['SubprojectID']);
            if(isset($demographics['ProjectID'])) {
                $demographics['Project'] = $this->_getProject($demographics['ProjectID']);
                unset($demographics['ProjectID']);
            }
            if ($config_setting->getSetting("useFamilyID") === "true") {
                $familyID = $this->SQLDB->pselectOne(
                    "SELECT FamilyID FROM family
                                                          WHERE CandID=:cid",
                    array('cid' => $demographics['CandID'])
                );
                if (!empty($familyID)) {
                    $this->Dictionary["FamilyID"] = array(
                                                     'Description' => 'FamilyID of Candidate',
                                                     'Type'        => "int(6)",
                                                    );
                    $demographics['FamilyID']     = $familyID;
                    $familyFields = $this->SQLDB->pselect(
                        "SELECT candID as Family_ID,
                                    Relationship_type as Relationship_to_candidate
                                    FROM family
                                    WHERE FamilyID=:fid AND CandID<>:cid",
                        array(
                         'fid' => $familyID,
                         'cid' => $demographics['CandID'],
                        )
                    );
                    $num_family   = 1;
                    if (!empty($familyFields)) {
                        foreach($familyFields as $row) {
                            //adding each sibling id and relationship to the file
                            $this->Dictionary["Family_CandID".$num_family]            = array(
                                                                                         'Description' => 'CandID of Family Member '.$num_family,
                                                                                         'Type'        => "varchar(255)",
                                                                                        );
                            $this->Dictionary["Relationship_type_Family".$num_family] = array(
                                                                                         'Description' => 'Relationship of candidate to Family Member '.$num_family,
                                                                                         'Type'        => "enum('half_sibling','full_sibling','1st_cousin')",
                                                                                        );
                            $demographics['Family_CandID'.$num_family]            = $row['Family_ID'];
                            $demographics['Relationship_type_Family'.$num_family] = $row['Relationship_to_candidate'];
                            $num_family += 1;
                        }
                    }
                }
            }

            $success = $this->CouchDB->replaceDoc(
                $id,
                array(
                 'Meta' => array(
                            'DocType'    => 'demographics',
                            'identifier' => array(
                                             $demographics['PSCID'],
                                             $demographics['Visit_label'],
                                            ),
                           ),
                 'data' => $demographics,
                )
            );
            print "$id: $success\n";
        }
        $this->_updateDataDict();
        $this->CouchDB->replaceDoc(
            'DataDictionary:Demographics',
            array(
             'Meta'           => array('DataDict' => true),
             'DataDictionary' => array('demographics' => $this->Dictionary),
            )
        );

        print $this->CouchDB->commitBulkTransaction();

    }
}

// Don't run if we're doing the unit tests; the unit test will call run.
if(!class_exists('UnitTestCase')) {
    $Runner = new CouchDBDemographicsImporter();
    $Runner->run();
}

