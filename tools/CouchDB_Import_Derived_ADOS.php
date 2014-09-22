<?php
/**
 * This script creates a "fake" (derived) ADOS instrument in the CouchDB
 * data querying tool. This derived instrument contains the scores and metadata
 * for the ADOS that was administered to the candidate, and only that ADOS.
 *
 * PHP Version 5
 *
 *  @category Loris
 *  @package  DQT
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 */
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
require_once 'Utility.class.inc';
require_once 'NDB_Factory.class.inc';
/**
 * Class which implements script to derived fake ADOS instrument and update
 * all CouchDB documents that are appropriate.
 *
 *  @category Loris
 *  @package  DQT
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 */
class CouchDBADOSImporter
{
    var $SQLDB; // reference to the database handler, store here instead
    // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    /**
     * Construct the object used for importing data. This initiates
     * a pointer to both the CouchDB and MySQL DB handler, which is
     * used instead of the ::singleton() methods so that the test
     * suite can mock them out for testing.
     * 
     * This is a constructor called automagically by PHP, it should not be called 
     * manually. 
     *
     * @return null
     */
    function __construct()
    {
        $factory = NDB_Factory::singleton();
        $this->SQLDB = $factory->Database();
        $this->CouchDB = $factory->CouchDB();
    }

    /**
     * Update (or create) the CouchDB document for the data dictionary for
     * this derived variable.
     *
     * @return null
     */
    function updateDataDict()
    {
        $this->CouchDB->replaceDoc(
            "DataDictionary:ADOS_Derived",
            array(
                'Meta' => array(
                    'DataDict' => true
                ),
                'DataDictionary' => array(
                    'ADOS_Derived' => array(
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
                            'Type'        => "enum('Yes', 'No')",
                            'Description' => 'Conflicts exist for instrument data entry'
                        ),
                        'DDE_Complete' => array(
                            'Type'        => "enum('Yes', 'No')",
                            'Description' => 
                            'Double Data Entry was completed for instrument'
                        ),
                        'Candidate_Age' => array(
                            'Type' => 'varchar(255)',
                            'Description' => 'Age of Candidate'),
                        'ADOS_Version' => array(
                            'Type' => 
                            "enum('ados1_module1','ados1_module2','ados1_module3'"
                            . ",'ados2_module1','ados2_module2','ados2_module3')",
                            'Description' => 'Version of ADOS Administered'
                        ),
                        'social_affect_total' => array(
                            'Type' => "varchar(255)",
                            'Description' => 'Social Affect Total score'
                        ),
                        'restricted_repetitive_behavior_total' => array(
                            'Type' => "varchar(255)",
                            'Description' => 
                            'Restricted Repetitive Behaviour Total score'
                        ),
                        'social_affect_restricted_repetitive_behavior_total' => array(
                            'Type' => "varchar(255)",
                            'Description' => 
                            'Social Affect Restricted Repetitive Behaviour'
                            . ' Total score'
                        ),
                        'ADOS_classification' => array(
                            'Type' => "varchar(255)",
                            'Description' => 'ADOS Diagnosis'
                        ),
                        'social_affect_gotham_weighted' => array(
                            'Type' => "varchar(255)",
                            'Description' => 'Weighted Social Affect score'
                        ),
                        'restricted_repetitive_gotham_weighted' => array(
                            'Type' => "varchar(255)",
                            'Description' => 'Weighted Restricted Repetitive score'
                        ),
                        'gotham_weighted_score' => array(
                            'Type' => "varchar(255)",
                            'Description' => 'Weighted ADOS Score'
                        ),
                        'severity_score_lookup' => array(
                            'Type' => "varchar(255)",
                            'Description' => 'ADOS severity lookup'
                        )

                    )
                )
            )
        );
    }

    /**
     * Gets the ADOS module that was Administered at a particular
     * SessionID
     *
     * @param int $SessionID The Session
     *
     * @return string Test_name of ADOS module. null if not found
     */
    function getADOSModule($SessionID)
    {
        $rows = $this->SQLDB->pselect(
            "SELECT Test_name, Administration FROM flag " .
            "WHERE SessionID=:SID AND Test_name LIKE 'ados%'" .
            " AND CommentID NOT LIKE 'DDE%'",
            array('SID' => $SessionID)
        ); 
        foreach ($rows as $row) {
            if ($row['Administration'] === 'All') {
                return $row['Test_name'];
            }
        }
        return null;
    }

    /**
     * Update an individual session's document. This will find the
     * appropriate ADOS module that was administered, and create the
     * document containing scores from that module.
     *
     * @param int $SessionID The session to be updated
     *
     * @return null
     */
    function updateCandidate($SessionID)
    {
        $ADOSModule = $this->getADOSModule($SessionID);

        $Fields = array(
            'f.CommentID',
            'c.PSCID',
            's.Visit_label',
            'f.Administration', 'f.Data_entry', 'f.Validity',
            /* Special cases, do them later */
            //'Conflicts_Exist', 'DDE_Complete', 
            'i.Candidate_Age',
            /* Not a field, just the value of getADOSModule,
             * but don't forget to add it in the replaceDoc
             */
            // 'ADOS Version',  
            'i.social_affect_total',
            'i.restricted_repetitive_behavior_total',
            'i.social_affect_restricted_repetitive_behavior_total',
            'i.ADOS_classification',
            'i.social_affect_gotham_weighted',
            'i.restricted_repetitive_gotham_weighted',
            'i.gotham_weighted_score',
            'i.severity_score_lookup'
        );
        $row = $this->SQLDB->pselectRow(
            "SELECT " . join(",", $Fields) .
            " FROM flag f LEFT JOIN $ADOSModule i USING (CommentID)" .
            " LEFT JOIN session s ON (s.ID=f.SessionID)" .
            " LEFT JOIN candidate c USING (CandID) " . 
            "WHERE f.Test_name=:AM AND f.SessionID=:SID AND s.Active='Y'" .
            " AND c.Active='Y' AND f.CommentID NOT LIKE 'DDE%'",
            array(
                "AM"  => $ADOSModule,
                'SID' => $SessionID
            )
        );
        if ($row === array()) {
            return;
        }
        $PSCID=$row['PSCID'];
        $Visit_label=$row['Visit_label'];

        print $this->CouchDB->replaceDoc(
            "ADOS_Derived:$PSCID" . "_" . $Visit_label,
            array(
                'Meta' => array(
                    'DocType'    => 'ADOS_Derived',
                    'identifier' => array(
                        $PSCID,$Visit_label
                    )
                ),
                'data' => array(
                    'Administration' => $row['Administration'],
                    'Data_entry'     => $row['Data_entry'],
                    'Validity'       => $row['Validity'],
                    'Candidate_Age'  => $row['Candidate_Age'],
                    'ADOS_Version'   => $ADOSModule,
                    'social_affect_total' 
                       => $row['social_affect_total'],
                    'restricted_repetitive_behavior_total'
                       => $row['restricted_repetitive_behavior_total'],
                    'social_affect_restricted_repetitive_behavior_total'
                       => $row['social_affect_restricted_repetitive_behavior_total'],
                    'ADOS_classification'
                       => $row['ADOS_classification'],
                    'social_affect_gotham_weighted' 
                       => $row['social_affect_gotham_weighted'],
                    'restricted_repetitive_gotham_weighted' 
                       => $row['restricted_repetitive_gotham_weighted'],
                    'gotham_weighted_score' 
                       => $row['gotham_weighted_score'],
                    'severity_score_lookup' 
                       => $row['severity_score_lookup']
                )
            )
        );
    }

    /**
     * Get a list of sessions which must be created/updated and then updates
     * each one.
     *
     * @return null
     */
    function updateCandidateDocs()
    {
        $sessions = $this->SQLDB->pselect(
            "SELECT s.ID FROM session s JOIN candidate c USING (CandID)" .
            " WHERE c.Active='Y' AND s.Active='Y' " .
            "AND s.Visit_label in ('V24', 'V36')",
            array()
        );
        foreach ($sessions as $row) {
            $this->updateCandidate($row['ID']);
        }
    }

    /**
     * Initiate the script, called automatically if not run by
     * UnitTesting suite.
     *
     * @return null
     */
    function run()
    {
        $this->updateDataDict();
        $this->updateCandidateDocs();
    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if (!class_exists('UnitTestCase')) {
    $Runner = new CouchDBADOSImporter();
    $Runner->run();
}
?>
