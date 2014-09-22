<?php
require_once __DIR__ . '/../test_includes.php';
require_once 'NDB_Factory.class.inc';
require_once 'Database.class.inc';
require_once 'CouchDB.class.inc';
require_once __DIR__ . '/../../tools/CouchDB_Import_Demographics.php';
require_once __DIR__ . '/../../tools/CouchDB_Import_MRI.php';
require_once __DIR__ . '/../../tools/CouchDB_Import_Instruments.php';
//require_once __DIR__ . '/../../tools/CouchDB_Deport_Sites.php';

Mock::generate('Database');
Mock::generate('CouchDB');
Mock::generate('PDOStatement');
Mock::generatePartial('CouchDBMRIImporter', 'CouchDBMRIImporterPartial', array('UpdateDataDict', 'UpdateCandidateDocs'));
Mock::generatePartial('CouchDBInstrumentImporter', 'CouchDBInstrumentImporterPartial', array('UpdateDataDicts', 'UpdateCandidateDocs', 'CreateRunLog'));
Mock::generatePartial('CouchDBSiteDeporter', 'CouchDBSiteDeporterPartial', array('_isSitePurged'));


class TestOfCouchDBImportDemographics extends UnitTestCase {
    function setUp() {
        $this->config = NDB_Config::singleton();
        $this->db = $this->config->getSetting('CouchDB');
        $subproj = $this->config->getSetting("subprojects");
        $this->subprojects = $subproj['subproject'];
        $this->Factory = NDB_Factory::singleton();
        $this->Factory->setTesting(true);
    }
    function tearDown() {
        $this->Factory->reset();
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
        $Import = new CouchDBDemographicsImporter();
        $Import->SQLDB = $this->Factory->Database();
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

    function testImportInstruments() {
        $Import = new CouchDBInstrumentImporterPartial();
        $Import->SQLDB = $this->Factory->Database();
        $Import->CouchDB = new MockCouchDB();

        $Import->SQLDB->returns('pselect', array(
            0 => array('Test_name' => 'hello', 'Full_name' => 'hello full name'), 
            1 => array('Test_name' => 'hello2', 'Full_name' => 'hello2 full name')
        ));
        $tests = array('hello' => 'hello full name', 'hello2' => 'hello2 full name');
        $Import->expectOnce('UpdateDataDicts', array($tests));
        $Import->expectOnce('UpdateCandidateDocs', array($tests));
        $Import->expectOnce('CreateRunLog');

        $Import->run();
        
        // If we don't reset the factory, the "pselect" count is two, because of the above being the
        // same mock
        $this->Factory->reset();
        $Import = new CouchDBInstrumentImporterPartial();
        $Import->SQLDB = $this->Factory->Database(); // new MockDatabase();
        $Import->CouchDB = new MockCouchDB();
        $Import->SQLDB->returns('pselect', array(
            0 => array('Test_name' => 'hello', 'Full_name' => 'hello full name'), 
            1 => array('Test_name' => 'hello2', 'Full_name' => 'hello2 full name')
        ));
        $tests = $Import->GetInstruments();

        $Import->SQLDB->expectOnce("pselect", array("SELECT Test_name, Full_name FROM test_names", array()) );
        $this->assertEqual($tests, array('hello' => 'hello full name', 'hello2' => 'hello2 full name'));
    }

    function testImportInstrumentUpdateDict() {
        // The main run works, now test UpdateDataDict.. use the non-partial mock
        $Import = new CouchDBInstrumentImporter();
        $Import->SQLDB = $this->Factory->Database();
        $Import->CouchDB = new MockCouchDB();

        /*
        $Import->SQLDB->returnsAt(0, 'pselect',
            array('hello' => 'I am a test',
                  'hello2' => 'I am another test')
        );
         */
        $Import->SQLDB->returns('pselect', array(
            0 => array('ParameterTypeID' => 3,
                  'Name' => 'Hello',
                  'SourceField' => 'Hello',
                  'Type' => 'varchar(255)',
                  'Description' => 'I am a field!'),
            1 => array('ParameterTypeID' => 34,
                      'Name' => 'Another_field',
                      'SourceField' => 'Another_field',
                      'Type' => "enum('three', 'ten')",
                      'Description' => 'Another field!'
                  )
              )
          );
        // Each data dictionary should have been updated, for a total of 2 calls to replaceDoc..
        $Dictionary = array(
            'Administration' => array(
                'Type' => "enum('None', 'Partial', 'All')",
                'Description' => 'Administration for hello' 
            ),
            'Data_entry' => array(
                'Type' => "enum('In Progress', 'Complete')",
                'Description' => 'Data entry status for hello' 
            ),
            'Validity' => array(
                'Type' => "enum('Questionable', 'Invalid', 'Valid')",
                'Description' => 'Validity of data for hello' 
            ),
            'Conflicts_Exist' => array(
                'Type'   => "enum('Yes', 'No')",
                'Description' => 'Conflicts exist for instrument data entry'
            ),
            'DDE_Complete' => array(
                'Type'   => "enum('Yes', 'No')",
                'Description' => 'Double Data Entry was completed for instrument'
            ),
            'Hello' => array(
                'Type' => 'varchar(255)',
                'Description' => 'I am a field!'),
            'Another_field' => array(
                'Type' => "enum('three', 'ten')",
                'Description' => 'Another field!'
            )
        );
            
        $Import->CouchDB->expectAt(0, 'replaceDoc', array('DataDictionary:hello',
            array('Meta' => array('DataDict' => true),
                'DataDictionary' => array(
                    'hello' => $Dictionary
                )
            )
        ));
        $Import->CouchDB->expectAt(1, 'replaceDoc', array('DataDictionary:hello2',
            // Just make sure the first parameter is correct, since otherwise we need
            // to change all the Admin/Data_entry/Validity descriptions for this assertion
            '*' 
        ));
        $Import->CouchDB->expectCallCount('replaceDoc', 2);
        $Import->UpdateDataDicts(array('hello' => 'hello', 'hello2' => 'hello2'));
    }

    function testImportInstrumentUpdateCandidateDocs() {
        $Import = new CouchDBInstrumentImporter();
        $Import->SQLDB = $this->Factory->Database();
        $Import->CouchDB = new MockCouchDB();
        $PDOMock = new MockPDOStatement();

        $Instruments = array('hello' => 'hello', 'hello2' => 'hello2');
        //$Import->SQLDB->expectAt(0, 'pselect', array('*', array('inst' => 'hello')));
        //$Import->SQLDB->expectAt(1, 'pselect', array('*', array('inst' => 'hello2')));
        $PDOMock->returns('fetch', false);
        $PDOMock->returnsAt(
            0,
            'fetch',
            array('PSCID' => 'STL333',
                  'Visit_label' => 'V1',
                  'Administration' => 'All',
                  'Data_entry' => 'Complete',
                  'Validity' => 'Valid',
                  'Examiner' => 3,
                  'CommentID' => '324fff',
                  'Hello' => 'hi!',
                  'Another_field' => 'ffff'
            )
        );
        // Call 1 is false to end the first instrument
        $PDOMock->returnsAt(
            2,
            'fetch',
            array('PSCID' => 'STL333',
                  'Visit_label' => 'V1',
                  'Administration' => 'All',
                  'Data_entry' => 'Complete',
                  'Validity' => 'Valid',
                  'Examiner' => 3,
                  'CommentID' => '324fff',
                  'Hello' => 'hi!',
                  'Another_field' => 'ffff'
            )
        );
        $Import->SQLDB->returns("prepare", $PDOMock);
        $Import->SQLDB->returns('pselectOne', 'John Smith the Third'); //, array('SELECT Full_name FROM examiners'));
        //$Import->SQLDB->expectCallCount('pselect', 2);
        // Two instruments, one value for each one = 2 calls total
        $Import->CouchDB->expectCallCount('replaceDoc', 2);
        $Import->CouchDB->expectAt(0, 'replaceDoc', array('324fff', array(
            'Meta' => array(
                'DocType' => 'hello',
                'identifier' => array('STL333', 'V1')
            ),
            'data' => array(
                'Administration' => 'All',
                'Data_entry' => 'Complete',
                'Validity' => 'Valid',
                'Examiner' => 'John Smith the Third',
                'Hello' => 'hi!',
                'Another_field' => 'ffff'
            )
        )
        ));
        $Import->CouchDB->returnsAt(0, 'replaceDoc', 'new');
        $Import->CouchDB->returnsAt(1, 'replaceDoc', 'unchanged');
        $results = $Import->UpdateCandidateDocs($Instruments);

        $this->assertEqual(
            $results, 
            array('new' => 1, 'modified' => 0, 'unchanged' => 1),
            'Update candidate docs did not return results summary'
        );
        $SQL = $Import->generateDocumentSQL('instrumentname');
        $this->assertEqual($SQL, "SELECT c.PSCID, s.Visit_label, f.Administration, f.Data_entry, f.Validity, CASE WHEN EXISTS (SELECT 'x' FROM conflicts_unresolved cu WHERE i.CommentID=cu.CommentId1 OR i.CommentID=cu.CommentId2) THEN 'Y' ELSE 'N' END AS Conflicts_Exist, CASE ddef.Data_entry='Complete' WHEN 1 THEN 'Y' WHEN NULL THEN 'Y' ELSE 'N' END AS DDE_Complete, i.* FROM instrumentname i JOIN flag f USING (CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c ON (c.CandID=s.CandID) LEFT JOIN flag ddef ON (ddef.CommentID=CONCAT('DDE_', f.CommentID)) WHERE f.CommentID NOT LIKE 'DDE%' AND s.Active='Y' AND c.Active='Y'");
    }

    function testImportInstrumentCreateRunLog() {
        $Import = new CouchDBInstrumentImporter();
        $Import->SQLDB = $this->Factory->database();
        $Import->CouchDB = new MockCouchDB();

        $Import->CouchDB->returns("createDoc", "abc123");
        $now = date("c");

        $Import->CouchDB->expectOnce(
            "createDoc", array(array('Meta' => array(
                    'DocType' => 'RunLog'
                ),
                'RunInfo' => array(
                    'Script' => 'Instrument Importer',
                    'Time' => "$now",
                    'DocsCreated' => 12,
                    'DocsModified' => 33,
                    'DocsUnchanged' => 1
                )
            )
        )
        );

        $Import->createRunLog(
            array('new' => 12, 'modified' => 33, 'unchanged' => 1)
        );
    }

    /*
    function testDeportSites() {
        $Deport = new CouchDBSiteDeporterPartial();

        $Deport->SQLDB = $this->Factory->Database();
        $Deport->CouchDB = new MockCouchDB();

        //$Import->CouchDB->expectAt(0, 'replaceDoc', array('DataDictionary:Demographics', $DataDict));
        $Deport->CouchDB->expectAt(0, 'QueryView', array('DQG-2.0', 'search', 
            array('startkey' => array('demographics', 'Site'),
                  'endkey'   => array('demographics', 'Site', '香'),
                  'reduce'   => "false"
                 )
            )
        );

        $Deport->CouchDB->returns('QueryView', array(
                array("id" => "Demographics_Session_PHI0000_V06",
                      "key" => array("demographics","Site","PHI"),
                      "value" => array("PHI0000","V06")),
                array("id" => "Demographics_Session_DCC0000_V12",
                      "key" => array("demographics","Site","DCC"),
                      "value" => array("DCC0000","DCC"), 
                ),
                array("id" =>"Demographics_Session_PHI0000_V36",
                      "key" => array("demographics","Site","PHI"),
                      "value" => array("PHI0000","V36")
                )
            )
        );
        $Deport->returns('_isSitePurged', false);
        $Deport->returnsAt(1, '_isSitePurged', true);
        $Deport->expectCallCount("_isSitePurged", 3);
        $Deport->CouchDB->expectAt(1, 'QueryView', array(
            'DQG-2.0', 'sessions', array('startkey' => array('DCC0000', 'DCC'),
                        'endkey' => array('DCC0000', 'DCC'),
                        'reduce' => 'false'
                                     )
            )
        );

        $Deport->CouchDB->returnsAt(1, 'QueryView', array(
                array("id" => "Instrumento",
                      "key" => array("demographics","Site","DCC"),
                      "value" => array("DCC0000","DCC")),
                array("id" => "Demographics_Session_DCC0000_V12",
                      "key" => array("demographics","Site","DCC"),
                      "value" => array("DCC0000","DCC"), 
        )));
        $Deport->CouchDB->expectCallCount('QueryView', 2);
        // Only DCC should be deleted from the above list
        $Deport->CouchDB->expectAt(0, 'deleteDoc', array('Instrumento'));
        $Deport->CouchDB->expectCallCount("deleteDoc", 2);
        $Deport->run();

        // Now test the method that was stubbed out..
        $Deport = new CouchDBSiteDeporter();
        
        $Deport->Config = new MockNDB_Config();

        $Deport->Config->returns('getSetting', array('dcc', 'abc'));
        $this->assertTrue($Deport->_isSitePurged('DCC'));
        $this->assertTrue($Deport->_isSitePurged('dcc'));
        $this->assertFalse($Deport->_isSitePurged('PHI'));
        $this->assertTrue($Deport->_isSitePurged('abc'));

    }
     */
}
?>
