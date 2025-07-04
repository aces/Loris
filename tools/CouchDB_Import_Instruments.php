#!/usr/bin/env php
<?php declare(strict_types=1);

require_once 'generic_includes.php';

/**
 * Imports instruments to CouchDB.
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
class CouchDBInstrumentImporter
{
    var $SQLDB; // reference to the database handler
    var $CouchDB; // reference to the CouchDB database handler
    var $loris; // reference to the LorisInstance object

    /**
     * Create new instance.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance that data is being
     *                                    imported from.
     */
    function __construct(\LORIS\LorisInstance $loris)
    {
        $this->loris = $loris;
        $config      = $this->loris->getConfiguration();
        $couchConfig = $config->getSetting('CouchDB');
        $this->SQLDB = $this->loris->getDatabaseConnection();

        $factory       = \NDB_Factory::singleton();
        $this->CouchDB = $factory->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
    }

    /**
     * Update data dictionaries
     *
     * @param array $Instruments the instruments
     *
     * @return void
     */
    function updateDataDicts($Instruments)
    {
        foreach ($Instruments as $instrument => $name) {
            $Dict   = [
                'Administration'  => [
                    'Type'        => "enum('None'," .
                    " 'Partial', 'All')",
                    'Description' => "Administration " .
                    "for $name",
                ],
                'Data_entry'      => [
                    'Type'        => "enum('In Progress'," .
                    " 'Complete')",
                    'Description' => "Data entry status " .
                    "for $name",
                ],
                'Validity'        => [
                    'Type'        => "enum('Questionable'" .
                            ", 'Invalid', 'Valid')",
                    'Description' => "Validity of data " .
                            "for $name",
                ],
                'Conflicts_Exist' => [
                    'Type'        => "enum('Yes', 'No')",
                    'Description' => 'Conflicts exist for' .
                ' instrument data entry',
                ],
                'DDE_Complete'    => [
                    'Type'        => "enum('Yes', 'No')",
                    'Description' => 'Double Data Entry ' .
                'was completed for instrument',
                ],
            ];
            $Fields = $this->SQLDB->pselect(
                "SELECT * from parameter_type WHERE SourceFrom=:inst " .
                "AND Queryable=1",
                ['inst' => $instrument]
            );
            foreach ($Fields as $field) {
                if (isset($field['SourceField'])) {
                    $fname        = $field['SourceField'];
                    $Dict[$fname] = [];
                    $Dict[$fname]['Type']        = $field['Type'];
                    $Dict[$fname]['Description'] = $field['Description'];
                }
            }

            unset($Dict['city_of_birth']);
            unset($Dict['city_of_birth_status']);

            $this->CouchDB->replaceDoc(
                "DataDictionary:$instrument",
                [
                    'Meta'           => ['DataDict' => true],
                    'DataDictionary' => [$instrument => $Dict],
                ]
            );
        }
    }

    /**
     * Generates SQL statement
     *
     * @param string $tablename Name of the database table
     *
     * @return string
     */
    function generateDocumentSQL(string $tablename) : string
    {
        $select = "SELECT
            c.PSCID,
            s.Visit_label,
            f.Administration,
            f.Data_entry,
            f.Validity,
            f.CommentID,
            CASE
                WHEN EXISTS(
                    SELECT 'x'
                    FROM conflicts_unresolved cu
                    WHERE f.CommentID=cu.CommentId1 OR f.CommentID=cu.CommentId2
                )
            THEN 'Y'
            ELSE 'N'
            END AS Conflicts_Exist,
            CASE ddef.Data_entry='Complete'
            WHEN 1 THEN 'Y'
            WHEN null THEN 'Y'
            ELSE 'N'
            END AS DDE_Complete";

        $from = "FROM flag f
            JOIN session s ON(s.ID=f.SessionID)
            JOIN candidate c ON(c.ID=s.CandidateID)
            LEFT JOIN flag ddef ON(ddef.CommentID=CONCAT('DDE_', f.CommentID))
            LEFT JOIN test_names tn ON(f.TestID = tn.ID)
            LEFT JOIN instrument_data d ON (d.ID = f.DataID) ";

        $where = "WHERE f.CommentID NOT LIKE 'DDE%'
            AND tn.Test_name=:inst AND s.Active='Y' AND c.Active='Y'";

        if ($tablename === "") {
            // the data is in the flag table, add the data column to the query
            // and do not join the table.
            $extraSelect = ", d.Data ";

            return $select . $extraSelect . $from . $where;
        }

        // add the SQL table to the query
        $extraSelect = ", i.* ";
        $extraJoin   = "JOIN " . $this->SQLDB->escape($tablename)
                       . " i ON(i.CommentID=f.CommentID) ";
        return $select . $extraSelect . $from . $extraJoin . $where;
    }

    /**
     * Update candidate documents
     *
     * @param array $Instruments the instruments
     *
     * @return void
     */
    function updateCandidateDocs($Instruments)
    {
        $results       = [
            'new'       => 0,
            'modified'  => 0,
            'unchanged' => 0,
        ];
        $lorisinstance = new \LORIS\LorisInstance(
            \NDB_Factory::singleton()->database(),
            \NDB_Factory::singleton()->config(),
            [
                __DIR__ . "/../project/modules",
                __DIR__ . "/../modules/",
            ]
        );
        foreach ($Instruments as $instrument => $name) {
            // Since the testname does not always match the table name in the
            // the database, we need to instantiate the object to get the
            // table name.
            // We need to check if it is a JSONData instrument or SQL data
            $instrumentObj = \NDB_BVL_Instrument::factory(
                $lorisinstance,
                $instrument,
                '',
                ''
            );
            $JSONData      = $instrumentObj->usesJSONData();
            $tableName     = "";
            if ($JSONData === false) {
                $tableName = $instrumentObj->table ?? "";
            }

            $this->CouchDB->beginBulkTransaction();
            $preparedStatement = $this->SQLDB->prepare(
                $this->generateDocumentSQL($tableName)
            );
            $preparedStatement->execute(['inst' => $instrument]);
            while ($row = $preparedStatement->fetch(PDO::FETCH_ASSOC)) {
                $CommentID = $row['CommentID'];

                if ($JSONData) {
                    //Transform JSON object into an array and add treat it the
                    //same as SQL
                    $instrumentData = json_decode($row['Data'] ?? '', true) ?? [];
                    unset($row['Data']);
                    $docdata = $row + $instrumentData;
                } else {
                    $docdata = $row;
                }

                unset($docdata['CommentID']);
                unset($docdata['PSCID']);
                unset($docdata['Visit_label']);
                unset($docdata['Testdate']);
                unset($docdata['city_of_birth']);
                unset($docdata['city_of_birth_status']);

                if (isset($docdata['Examiner'])
                    && is_numeric($docdata['Examiner'])
                ) {
                    $docdata['Examiner'] = $this->SQLDB->pselectOne(
                        "SELECT full_name FROM examiners
            WHERE examinerID =:eid",
                        ["eid" => $docdata['Examiner']]
                    );
                }
                $doc     = [
                    'Meta' => [
                        'DocType'    => $instrument,
                        'identifier' => [
                            $row['PSCID'],
                            $row['Visit_label'],
                        ],
                    ],
                    'data' => $docdata,
                ];
                $success = $this->CouchDB->replaceDoc($CommentID, $doc);
                print "$row[PSCID] $row[Visit_label] $instrument: $success\n";

                if (!isset($results[$success])) {
                    $results[$success] = 0;
                }

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

    /**
     * Gets the instruments
     *
     * @return array
     */
    function getInstruments()
    {
        return \NDB_BVL_Instrument::getInstrumentNamesList($this->loris);
    }

    /**
     * Creates run log
     *
     * @param array $results The results of running the query
     *
     * @return void
     */
    function createRunLog($results)
    {
        $now = date("c");
        $id  = $this->CouchDB->createDoc(
            [
                'Meta'    => ['DocType' => 'RunLog'],
                'RunInfo' => [
                    'Script'        => 'Instrument Importer',
                    'Time'          => "$now",
                    'DocsCreated'   => $results['new'],
                    'DocsModified'  => $results['modified'],
                    'DocsUnchanged' => $results['unchanged'],
                ],
            ]
        );
        print "Created run log with id $id\n";
    }
    /**
     * Runs the importer
     *
     * @return void
     */
    function run()
    {
        $tests = $this->getInstruments();
        $this->updateDataDicts($tests);
        $results = $this->updateCandidateDocs($tests);
        $this->CreateRunLog($results);
    }
}
    // Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new CouchDBInstrumentImporter($lorisInstance);
    $Runner->run();
}
?>
