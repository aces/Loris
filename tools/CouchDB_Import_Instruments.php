<?php
require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
require_once 'Utility.class.inc';
class CouchDBInstrumentImporter
{
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

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

    function UpdateDataDicts($Instruments)
    {
        foreach ($Instruments as $instrument => $name) {
            $Dict   = array(
                       'Administration'  => array(
                                             'Type'        => "enum('None'," .
                                               " 'Partial', 'All')",
                                             'Description' => "Administration " .
                                               "for $name",
                                            ),
                       'Data_entry'      => array(
                                             'Type'        => "enum('In Progress'," .
                                               " 'Complete')",
                                             'Description' => "Data entry status " .
                                               "for $name",
                                            ),
                       'Validity'        => array(
                                             'Type'        => "enum('Questionable'" .
                                               ", 'Invalid', 'Valid')",
                                             'Description' => "Validity of data " .
                                               "for $name",
                                            ),
                       'Conflicts_Exist' => array(
                                             'Type'        => "enum('Yes', 'No')",
                                             'Description' => 'Conflicts exist for' .
                                               ' instrument data entry',
                                            ),
                       'DDE_Complete'    => array(
                                             'Type'        => "enum('Yes', 'No')",
                                             'Description' => 'Double Data Entry ' .
                                               'was completed for instrument',
                                            ),
                      );
            $Fields = $this->SQLDB->pselect(
                "SELECT * from parameter_type WHERE SourceFrom=:inst " .
                  "AND Queryable=1",
                array('inst' => $instrument)
            );
            foreach ($Fields as $field) {
                if (isset($field['SourceField'])) {
                    $fname        = $field['SourceField'];
                    $Dict[$fname] = array();
                    $Dict[$fname]['Type']        = $field['Type'];
                    $Dict[$fname]['Description'] = $field['Description'];
                }
            }

            unset($Dict['city_of_birth']);
            unset($Dict['city_of_birth_status']);

            $this->CouchDB->replaceDoc(
                "DataDictionary:$instrument",
                array(
                 'Meta'           => array('DataDict' => true),
                 'DataDictionary' => array($instrument => $Dict),
                )
            );
        }
    }

    function generateDocumentSQL(string $tablename) : string
    {
        $select = "SELECT 
                        c.PSCID, 
                        s.Visit_label, 
                        f.Administration, 
                        f.Data_entry, 
                        f.Validity,
                        f.CommentID, 
                        CASE WHEN EXISTS (SELECT 'x' FROM conflicts_unresolved cu WHERE f.CommentID=cu.CommentId1 OR f.CommentID=cu.CommentId2) THEN 'Y' ELSE 'N' END AS Conflicts_Exist, 
                        CASE ddef.Data_entry='Complete' WHEN 1 THEN 'Y' WHEN NULL THEN 'Y' ELSE 'N' END AS DDE_Complete ";
        $from = "FROM 
                        flag f 
                        JOIN session s ON (s.ID=f.SessionID) 
                        JOIN candidate c ON (c.CandID=s.CandID) 
                        LEFT JOIN flag ddef ON (ddef.CommentID=CONCAT('DDE_', f.CommentID)) ";
        $where = "WHERE 
                        f.CommentID NOT LIKE 'DDE%' 
                        AND f.Test_name=:inst
                        AND s.Active='Y' AND c.Active='Y'";

        if ($tablename === "") {
            // the data is in the flag table, add the data column to the query and
            // do not join the table.
            $extraSelect = ", f.Data ";

            return $select . $extraSelect . $from . $where;
        }

        // add the SQL table to the query
        $extraSelect = ", i.* ";
        $extraJoin = "JOIN " . $this->SQLDB->escape($tablename) . " i ON (i.CommentID=f.CommentID) ";
        return $select . $extraSelect . $from . $extraJoin . $where;
    }
    function UpdateCandidateDocs($Instruments)
    {
        $results = array(
                    'new'       => 0,
                    'modified'  => 0,
                    'unchanged' => 0,
                   );
        foreach ($Instruments as $instrument => $name) {
            // Since the testname does not always match the table name in the database
            // we need to instantiate the object to get the table name
            // we need to check if it is a JSONData instrument or SQL data
            $instrumentObj = \NDB_BVL_Instrument::factory(
                $instrument,
                '',
                ''
            );
            $JSONData = $instrumentObj->usesJSONData();
            $tableName = "";
            if ($JSONData === false) {
                $tableName = $instrumentObj->table;
            }

            $this->CouchDB->beginBulkTransaction();
            $preparedStatement = $this->SQLDB->prepare($this->generateDocumentSQL($tableName));
            $preparedStatement->execute(array('inst' => $instrument));
            while ($row = $preparedStatement->fetch(PDO::FETCH_ASSOC)) {
                $CommentID = $row['CommentID'];

                if ($JSONData) {
                    //Transform JSON object into an array and add treat it the same as SQL
                    $instrumentData = json_decode($row['Data'], true) ?? array();
                    unset($row['Data']);
                    $docdata = $row + $instrumentData;
                } else {
                    $docdata   = $row;
                }

                unset($docdata['CommentID']);
                unset($docdata['PSCID']);
                unset($docdata['Visit_label']);
                unset($docdata['Testdate']);
                unset($docdata['city_of_birth']);
                unset($docdata['city_of_birth_status']);

                if (isset($docdata['Examiner']) && is_numeric($docdata['Examiner'])) {
                    $docdata['Examiner'] = $this->SQLDB->pselectOne("SELECT full_name FROM examiners WHERE examinerID=:eid", array("eid" => $docdata['Examiner']));
                }
                $doc     = array(
                            'Meta' => array(
                                       'DocType'    => $instrument,
                                       'identifier' => array(
                                                        $row['PSCID'],
                                                        $row['Visit_label'],
                                                       ),
                                      ),
                            'data' => $docdata,
                           );
                $success = $this->CouchDB->replaceDoc($CommentID, $doc);
                print "$row[PSCID] $row[Visit_label] $instrument: $success\n";

                $results[$success] += 1;

                // Count every 200 //
                if (($results[$success] % 200) === 0) {
                    $this->CouchDB->commitBulkTransaction();
                    $this->CouchDB->beginBulkTransaction();
                }
            }

            $result = $this->CouchDB->commitBulkTransaction();
        }
        return $results;
    }

    function GetInstruments()
    {
        return \Utility::getAllInstruments();
    }

    function createRunLog($results)
    {
        $now = date("c");
        $id  = $this->CouchDB->createDoc(
            array(
             'Meta'    => array('DocType' => 'RunLog'),
             'RunInfo' => array(
                           'Script'        => 'Instrument Importer',
                           'Time'          => "$now",
                           'DocsCreated'   => $results['new'],
                           'DocsModified'  => $results['modified'],
                           'DocsUnchanged' => $results['unchanged'],
                          ),
            )
        );
        print "Created run log with id $id\n";
    }
    function run()
    {
        $tests = $this->GetInstruments();
        $this->UpdateDataDicts($tests);
        $results = $this->UpdateCandidateDocs($tests);
        $this->CreateRunLog($results);
    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new CouchDBInstrumentImporter();
    $Runner->run();
}
?>
