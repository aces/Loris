<?php
require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
class CouchDBRadiologicalReviewImporter {
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    var $Dictionary = array(
        'FinalReview_Radiologist' => array(
            'Description' => 'Radiologist/Reviewer doing the final review',
            'Type' => 'varchar(255)'
        ),  
        'FinalReview_Done' => array(
            'Description' => 'Final review done',
            'Type' => "enum('No','Yes')"
        ),  
        'FinalReview_Results' => array(
            'Description' => 'Results of the final radiology review',
            'Type' => "enum('normal','abnormal','atypical','not_answered')"
        ),  
        'FinalReview_ExclusionaryStatus' => array(
            'Description' => 'Final review exclusionary status',
            'Type' => "enum('exclusionary','non_exclusionary','not_answered')"
        ),  
        'FinalReview_SAS' => array(
            'Description' => 'Final review subarachnoid space',
            'Type' => "enum('None', 'Minimal', 'Mild', 'Moderate', 'Marker')"
        ),  
        'FinalReview_PVS' => array(
            'Description' => 'Final review perivascular space',
            'Type' => "enum('None', 'Minimal', 'Mild', 'Moderate', 'Marker')",
        ),  
        'FinalReview_Comment' => array(
            'Description' => 'Current stage of visit',
            'Type' => 'text'
        ),  
        'FinalReview_Finalized' =>  array(
            'Description' => 'Final review finalized',
            'Type' => "enum('No','Yes')",
        ),
        'ExtraReview_Radiologist' => array(
            'Description' => 'Radiologist/Reviewer doing the extra review',
            'Type' => 'varchar(255)'
        ),  
        'ExtraReview_Done' => array(
            'Description' => 'Extra review done',
            'Type' => "enum('No','Yes')"
        ),  
        'ExtraReview_Results' => array(
            'Description' => 'Results of the extra radiology review',
            'Type' => "enum('normal','abnormal','atypical','not_answered')"
        ),  
        'ExtraReview_ExclusionaryStatus' => array(
            'Description' => 'Extra review exclusionary status',
            'Type' => "enum('exclusionary','non_exclusionary','not_answered')"
        ),  
        'ExtraReview_SAS' => array(
            'Description' => 'Extra review subarachnoid space',
            'Type' => "enum('None', 'Minimal', 'Mild', 'Moderate', 'Marker')"
        ),  
        'ExtraReview_PVS' => array(
            'Description' => 'Extra review perivascular space',
            'Type' => "enum('None', 'Minimal', 'Mild', 'Moderate', 'Marker')",
        ),  
        'ExtraReview_Comment' => array(
            'Description' => 'Current stage of visit',
            'Type' => "enum('Not Started','Screening','Visit','Approval','Subject','Recycling Bin')"
        ),
        'Conflict_Final_Extra' => array(
            'Description' => 'Conflict between final and extra reviews',
            'Type' => "enum('No','Yes')"
        ),
        'Conflict_Any' => array(
            'Description' => 'Conflict between any reviews',
            'Type' => "enum('No','Yes')"
        )
    );

    function __construct() {
        $this->SQLDB = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
    }

    function run() {

        // Update CouchDB data dictionary
        $this->CouchDB->replaceDoc('DataDictionary:FinalRadiologicalReview',
            array('Meta' => array('DataDict' => true),
                  'DataDictionary' => array('FinalRadiologicalReview' => $this->Dictionary) 
            )
        );

        // Query to retrieve radiological review data
        $finalradiologicalreview = $this->SQLDB->pselect("SELECT c.PSCID, s.Visit_label,
            eFinal.full_name AS FinalReview_Radiologist, 
            CASE WHEN frr.Review_Done=0 THEN 'No' 
            WHEN frr.Review_Done=1 THEN 'Yes' END as FinalReview_Done, 
            frr.Final_Review_Results AS FinalReview_Results, 
            frr.Final_Exclusionary AS FinalReview_ExclusionaryStatus, 
            CASE WHEN frr.SAS=0 THEN 'None' 
            WHEN frr.SAS=1 THEN 'Minimal' 
            WHEN frr.SAS=2 THEN 'Mild' 
            WHEN frr.SAS=3 THEN 'Moderate' 
            WHEN frr.SAS=4 THEN 'Marker' END as FinalReview_SAS, 
            CASE WHEN frr.PVS=0 THEN 'None' 
            WHEN frr.PVS=1 THEN 'Minimal' 
            WHEN frr.PVS=2 THEN 'Mild' 
            WHEN frr.PVS=3 THEN 'Moderate' 
            WHEN frr.PVS=4 THEN 'Marker' END as FinalReview_PVS, 
            frr.Final_Incidental_Findings AS FinalReview_Comment, 
            CASE WHEN frr.Finalized=0 THEN 'No' 
            WHEN frr.Finalized=1 THEN 'Yes' END as FinalReview_Finalized,
            eExtra.full_name AS ExtraReview_Radiologist, 
            CASE WHEN frr.Review_Done2=0 THEN 'No' 
            WHEN frr.Review_Done2=1 THEN 'Yes' END as ExtraReview_Done, 
            frr.Final_Review_Results2 AS ExtraReview_Results, 
            CASE WHEN frr.SAS2=0 THEN 'None' 
            WHEN frr.SAS2=1 THEN 'Minimal' 
            WHEN frr.SAS2=2 THEN 'Mild' 
            WHEN frr.SAS2=3 THEN 'Moderate' 
            WHEN frr.SAS2=4 THEN 'Marker' END as ExtraReview_SAS, 
            CASE WHEN frr.PVS2=0 THEN 'None' 
            WHEN frr.PVS2=1 THEN 'Minimal' 
            WHEN frr.PVS2=2 THEN 'Mild' 
            WHEN frr.PVS2=3 THEN 'Moderate' 
            WHEN frr.PVS2=4 THEN 'Marker' END as ExtraReview_PVS, 
            frr.Final_Exclusionary2 AS ExtraReview_ExclusionaryStatus,
            frr.Final_Incidental_Findings2 AS ExtraReview_Comment,
            CASE WHEN orig.review_results <> r.final_review_results THEN 'true'
            WHEN orig.abnormal_atypical_exclusionary <> r.final_exclusionary  THEN 'true'
            WHEN r.Final_Review_Results <> r.Final_Review_Results2 THEN 'true'
            WHEN r.Final_Exclusionary <> r.Final_Exclusionary2 THEN 'true'
            WHEN r.SAS <> r.SAS2 THEN 'true'
            WHEN r.PVS <> r.PVS2 THEN 'true'
            ELSE 'false' END as Conflict_Final_Extra,
            CASE WHEN r.Final_Review_Results <> r.Final_Review_Results2 THEN 'prim_second'
            WHEN r.Final_Exclusionary <> r.Final_Exclusionary2 THEN 'prim_second'
            WHEN r.SAS <> r.SAS2 THEN 'prim_second'
            WHEN r.PVS <> r.PVS2 THEN 'prim_second'
            ELSE 'false' END as Conflict_Any
            FROM final_radiological_review frr
            LEFT JOIN flag f ON (f.CommentID=frr.CommentID) 
            LEFT JOIN session s ON (s.ID=f.SessionID) 
            LEFT JOIN candidate c ON (c.CandID=s.CandID)
            LEFT JOIN examiners eFinal ON (eFinal.ExaminerID=frr.Final_Examiner)
            LEFT JOIN examiners eExtra ON (eExtra.ExaminerID=frr.Final_Examiner2)", array());
        
        // Adding the data to CouchDB documents
        foreach($finalradiologicalreview as $review) {
            $identifier = array($review['PSCID'], $review['Visit_label']);
            $id = 'Final_Radiological_Review_' . join($identifier, '_');
            unset($review['PSCID']);
            unset($review['Visit_label']);
            $success = $this->CouchDB->replaceDoc($id, array('Meta' => array(
                'DocType' => 'FinalRadiologicalReview',
                'identifier' => $identifier
            ),
                'data' => $review
            ));
            print "$id: $success\n";
        }
    }
}

// Don't run if we're doing the unit tests; the unit test will call run.
if(!class_exists('UnitTestCase')) {
    $Runner = new CouchDBRadiologicalReviewImporter();
    $Runner->run();
}
?>
