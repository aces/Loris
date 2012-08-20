<?
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
require_once 'Utility.class.inc';
class CouchDBInstrumentImporter {
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    function __construct() {
        $this->SQLDB = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
    }

    function UpdateDataDicts($Instruments) {
        foreach($Instruments as $instrument => $name) {
            $Dict = array(
                'Administration' => array(
                    'Type' => "enum('None', 'Partial', 'All')",
                    'Description' => "Administration for $name"
                ),
                'Data_entry' => array(
                    'Type' => "enum('In Progress', 'Complete')",
                    'Description' => "Data entry status for $name"
                ),
                'Validity' => array(
                    'Type' => "enum('Questionable', 'Invalid', 'Valid')",
                    'Description' => "Validity of data for $name"
                )
            );
            $Fields = $this->SQLDB->pselect("SELECT * from parameter_type WHERE SourceFrom=:inst AND Queryable=1",
                array('inst' => $name));
            foreach($Fields as $field) {
                $fname = $field['Name'];
                $Dict[$fname]['Type'] = $field['Type'];
                $Dict[$fname]['Description'] = $field['Description'];
            }
            $this->CouchDB->replaceDoc("DataDictionary:$name", array(
                'Meta' => array('DataDict' => true),
                'DataDictionary' => array($name => $Dict)
            ));
        }
    }

    function generateDocumentSQL($instrument) {
        return "SELECT c.PSCID, s.Visit_label, f.Administration, f.Data_entry, f.Validity, i.* FROM $instrument i join flag f USING (CommentID) join session s ON (s.ID=f.SessionID) join candidate c ON (c.CandID=s.CandID) WHERE CommentID NOT LIKE 'DDE%' AND s.Active='Y' AND c.Active='Y'";
    }
    function UpdateCandidateDocs($Instruments) {
        foreach($Instruments as $instrument => $name) {
            $data = $this->SQLDB->pselect($this->generateDocumentSQL($instrument), array('inst' => $name));
            foreach($data as $row) {
                $CommentID  = $row['CommentID'];
                $docdata = $row;
                unset($docdata['CommentID']);
                unset($docdata['PSCID']);
                unset($docdata['Visit_label']);

                if(is_numeric($docdata['Examiner'])) {
                    $docdata['Examiner'] = $this->SQLDB->pselectOne("SELECT full_name FROM examiners WHERE examinerID=:eid", array("eid" => $row['Examiner']));
                }
                $doc = array ('Meta' => 
                    array(
                        'DocType' => $name,
                        'identifier' => array($row['PSCID'], $row['Visit_label'])
                    ),
                    'data' => $docdata
                );
                $success = $this->CouchDB->replaceDoc($CommentID, $doc);
                print "$row[PSCID] $row[Visit_label] $name: $success\n";
            }

        }
    }

    function GetInstruments() {
        return Utility::getAllInstruments();
    }
    function run() {
        $tests = $this->GetInstruments();
        $this->UpdateDataDicts($tests);
        $this->UpdateCandidateDocs($tests);
    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if(!class_exists('UnitTestCase')) {
    $Runner = new CouchDBInstrumentImporter();
    $Runner->run();
}
?>
