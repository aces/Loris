<?php
require_once 'Database.class.inc';
require_once 'CouchDB.class.inc';
require_once '../tools/CouchDB_Import_MRI.php';

Mock::generate('Database');
Mock::generate('CouchDB');
Mock::generatePartial('CouchDBMRIImporter', 'CouchDBMRIImporterPartial', array('UpdateDataDict', 'UpdateCandidateDocs'));

class TestOfCouchDBImportDemographics extends UnitTestCase {
    function setUp() {
        $this->config = NDB_Config::singleton();
        $this->db = $this->config->getSetting('CouchDB');
        $subproj = $this->config->getSetting("subprojects");
        $this->subprojects = $subproj['subproject'];
    }

    function _getSubproject($id) {
        foreach($this->subprojects as $subproject) {
            if($subproject['id'] == $id) {
                return $subproject['title'];
            }
        }
        throw new Exception("Missing subprojectID");
    }

    function testImportDemographics() {
        require_once '../tools/CouchDB_Import_Demographics.php';
        $Import = new CouchDBDemographicsImporter();
        $Import->SQLDB = new MockDatabase();
        $Import->CouchDB = new MockCouchDB();
        $Import->CouchDB->returns('replaceDoc', 'new');
        $Import->SQLDB->expectOnce('pselect');
        $Candidates = array(
            0 => array(
                'CandID' => 101170,
                'PSCID' => 'PHI0043',
                'Visit_label' => 'V06',
                'SubprojectID' => 1,
                'Site' => 'PHI',
                'Gender' => 'Male',
                'Current_stage' => 'Recycling Bin',
                'Failure' => 'Failure'
            ),
            1 => array(
                'CandID' => 101246,
                'PSCID' => 'SEA3332',
                'Visit_label' => 'V16',
                'SubprojectID' => 2,
                'Site' => 'SEA',
                'Gender' => 'Female',
                'Current_stage' => 'Visit',
                'Failure' => 'Neither'
            )
        );
        $Import->SQLDB->returnsAt(0, 'pselect', $Candidates);
        $DataDict = array('Meta' => array('DataDict' => true),
            'DataDictionary' => array(
                'demographics' => $Import->Dictionary
            )
        );
        $this->assertTrue(is_array($Import->Dictionary),'Data Dictionary is not an array');
        $Import->CouchDB->expectAt(0, 'replaceDoc', array('DataDictionary:Demographics', $DataDict));
        $Candidates[0]['Cohort'] = $this->_getSubproject($Candidates[0]['SubprojectID']);
        $Candidates[1]['Cohort'] = $this->_getSubproject($Candidates[1]['SubprojectID']);
        unset($Candidates[0]['SubprojectID']);
        unset($Candidates[1]['SubprojectID']);
        $Import->CouchDB->expectAt(1, 'replaceDoc', array('Demographics_Session_PHI0043_V06', array( 'Meta' => array('DocType' => 'demographics', 'identifier' => array('PHI0043', 'V06')), 'data' => $Candidates[0] )));
        $Import->CouchDB->expectAt(2, 'replaceDoc', array('Demographics_Session_SEA3332_V16', array( 'Meta' => array('DocType' => 'demographics', 'identifier' => array('SEA3332', 'V16')), 'data' => $Candidates[1] )));
        $Import->CouchDB->expectCallCount('replaceDoc', 3);
        $Import->run();

    }

    function testImportMRI() {
        $FakeScanTypes = array(
            0 => array('ParameterTypeID' => 34, 'ScanType' => 'T1'),
            1 => array('ParameterTypeID' => 65, 'ScanType' => 'T2'),
        );
        // First test that the main logic of the function works
        $Import = new CouchDBMRIImporterPartial();
        $Import->SQLDB = new MockDatabase();
        $Import->CouchDB = new MockCouchDB();

        $Import->SQLDB->returnsAt(0, 'pselect', $FakeScanTypes);
        $Import->expectCallCount('UpdateDataDict', 1);
        $Import->expectCallCount('UpdateCandidateDocs', 1);
        // Should call pselect once for the scan types, and once for the candidate data
        $Import->SQLDB->expectCallCount('pselect', 2);

        $Import->run();

        // Now test that the individual components work..
        $Import = new CouchDBMRIImporter();
        $Import->SQLDB = new MockDatabase();
        $Import->CouchDB = new MockCouchDB();
        // first UpdateDataDict
        $Import->UpdateDataDict( $FakeScanTypes );
        $this->assertEqual($Import->Dictionary, array(
            'QCComment' => array(
                'Type' => 'varchar(255)',
                'Description' => 'QC Comment for Session'
            ),
            'Selected_T1' => array(
                'Type' => 'varchar(255)',
                'Description' => 'Selected T1 file for session'
            ),
            'T1_QCStatus' => array(
                'Type' => "enum('Pass', 'Fail')",
                'Description' => 'QC Status for T1 file'
            ),
            'Selected_T2' => array(
                'Type' => 'varchar(255)',
                'Description' => 'Selected T2 file for session'
            ),
            'T2_QCStatus' => array(
                'Type' => "enum('Pass', 'Fail')",
                'Description' => 'QC Status for T2 file'
            )
        ));
        // Make sure the right query is being returned for candidate data
        $SQL = $Import->_generateCandidatesQuery($FakeScanTypes);
        $this->assertEqual($SQL, "SELECT c.PSCID, s.Visit_label, fmric.Comment as QCComment, (SELECT f.File FROM files f LEFT JOIN files_qcstatus fqc USING(FileID) LEFT JOIN parameter_file p ON (p.FileID=f.FileID AND p.ParameterTypeID=34) WHERE f.SessionID=s.ID AND fqc.QCStatus='Pass' AND p.Value='T1' LIMIT 1) as `Selected_T1`, (SELECT fqc.QCStatus FROM files f LEFT JOIN files_qcstatus fqc USING(FileID) LEFT JOIN parameter_file p ON (p.FileID=f.FileID AND p.ParameterTypeID=34) WHERE f.SessionID=s.ID AND fqc.QCStatus='Pass' AND p.Value='T1' LIMIT 1) as `T1_QCStatus`, (SELECT f.File FROM files f LEFT JOIN files_qcstatus fqc USING(FileID) LEFT JOIN parameter_file p ON (p.FileID=f.FileID AND p.ParameterTypeID=65) WHERE f.SessionID=s.ID AND fqc.QCStatus='Pass' AND p.Value='T2' LIMIT 1) as `Selected_T2`, (SELECT fqc.QCStatus FROM files f LEFT JOIN files_qcstatus fqc USING(FileID) LEFT JOIN parameter_file p ON (p.FileID=f.FileID AND p.ParameterTypeID=65) WHERE f.SessionID=s.ID AND fqc.QCStatus='Pass' AND p.Value='T2' LIMIT 1) as `T2_QCStatus` FROM session s JOIN candidate c USING (CandID) LEFT JOIN feedback_mri_comments fmric ON (fmric.CommentTypeID=7 AND fmric.SessionID=s.ID) WHERE c.PSCID <> 'scanner' AND c.PSCID NOT LIKE '%9999' AND c.Active='Y' AND s.Active='Y' AND c.CenterID <> 1");
        $Import->CouchDB->expectOnce("replaceDoc");
        $Import = new CouchDBMRIImporter();
        $Import->SQLDB = new MockDatabase();
        $Import->CouchDB = new MockCouchDB();
        $Import->CouchDB->expectCallCount('replaceDoc', 2);
        $Import->CouchDB->expectAt(0, 'replaceDoc', array('MRI_Files:DCC3333_V1', 
            array(
                'Meta' => array(
                    'DocType' => 'mri_data',
                    'identifier' => array('DCC3333', 'V1')
                ),
                'data' => array(
                    'QCComment' => 'Hello',
                    'Selected_T1' => '/nota/file',
                    'T1_QCStatus' => 'Pass',
                    'Selected_T2' => '/another/file',
                    'T2_QCStatus' => 'Fail',
                )
            )
        ));
        //$Import->CouchDB->expectAt(1, 'replaceDoc', 'abc')
        $Import->UpdateCandidateDocs(array(
            0 => array(
                'PSCID' => 'DCC3333', 
                'Visit_label' => 'V1',
                'QCComment' => 'Hello',
                'Selected_T1' => '/nota/file',
                'T1_QCStatus' => 'Pass',
                'Selected_T2' => '/another/file',
                'T2_QCStatus' => 'Fail',
            ),
            1 => array(
                'PSCID' => 'DCC4333', 
                'Visit_label' => 'V600',
                'QCComment' => 'Hello again',
                'Selected_T1' => '/notanother/file',
                'T1_QCStatus' => 'Fail',
                'Selected_T2' => '/another/file',
                'T2_QCStatus' => 'Pass',
            ),
        ));

    }
}
?>
