<?php
require_once 'generic_includes.php';
require_once 'CouchDB.class.inc';
require_once 'Database.class.inc';
require_once "FeedbackMRI.class.inc";

class CouchDBMRIImporter {
    var $SQLDB; // reference to the database handler, store here instead
                // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    // this is just in an instance variable to make
    // the code a little more readable.
    var $Dictionary = array(
        'QCComment' => array(
            'Type' => 'varchar(255)',
            'Description' => 'QC Comment for Session'
        )
    );
    var $feedback_Comments; //reference to list of MRI feedback types;
    var $feedback_PreDefinedComments; //reference to list of MRI feedback types;
    function __construct() {
        $this->SQLDB = Database::singleton();
        $this->CouchDB = CouchDB::singleton();
    }

    function UpdateDataDict($types) {

        $mri_feedback = new FeedbackMRI(1, "");

        foreach($types as $type) {
            $ScanType = $type['ScanType'];
            $this->Dictionary["Selected_$ScanType"] = array(
                'Type' => 'varchar(255)',
                'Description' => "Selected $ScanType file for session",
                'IsFile' => true
            );
            $this->Dictionary[$ScanType . "_QCStatus"] = array(
                'Type' => "enum('Pass', 'Fail')",
                'Description' => "QC Status for $ScanType file"
            );
            $feedback_types = $mri_feedback->getAllCommentTypes();//print_r($feedback_types);
            foreach ($feedback_types as $CommentTypeID=>$comments) {
                if (!empty($comments['field'])) {
                    $fieldName = $comments['field'];
                    $type      = "enum ('" .implode("','", $comments['values']). "')";

                    $this->Dictionary["Comment_".$fieldName."_$ScanType"] = array(
                        'Type' => 'varchar(255)',
                        'Description' => "Overall Comment for $fieldName $ScanType"
                        );

                } else {
                    $fieldName = $comments['name'];
                    $type      = 'varchar(255)';
                }
                $this->feedback_Comments[$CommentTypeID] = $fieldName;//array($fieldName=>$comments['name']);
                $this->Dictionary[$fieldName."_$ScanType"] = array(
                        'Type' => $type,
                        'Description' => $comments['name']." $ScanType"
                        );
                $preDefinedComments = $mri_feedback->getAllPredefinedComments($CommentTypeID);
                $this->feedback_PreDefinedComments[$CommentTypeID] = array();
                $pre = array();
                foreach ($preDefinedComments as $preDefinedCommentTypeID=>$preDefinedComment) {
                    $this->Dictionary[$preDefinedComment['field']."_$ScanType"] = array(
                            'Type' => "enum('Yes', 'No')",
                            'Description' => $preDefinedComment['Comment']." $ScanType"
                            );
                     $pre[$preDefinedCommentTypeID] = $preDefinedComment['field'];
                }
                $this->feedback_PreDefinedComments[$CommentTypeID] = $pre;

            }
        } //print_r($this->Dictionary);
        $this->CouchDB->replaceDoc("DataDictionary:mri_data",
            array('Meta' => array( 'DataDict' => true),
                'DataDictionary' => array(
                    'mri_data' => $this->Dictionary
                )
            )
        );
    }

    function _generateCandidatesQuery($ScanTypes) {
        $Query = "SELECT c.PSCID, s.Visit_label, s.ID as SessionID, fmric.Comment as QCComment";
        foreach($ScanTypes as $Scan) {
            $Query .= ", (SELECT f.File FROM files f LEFT JOIN files_qcstatus fqc USING(FileID) LEFT JOIN parameter_file p ON (p.FileID=f.FileID AND p.ParameterTypeID=$Scan[ParameterTypeID]) WHERE f.SessionID=s.ID AND p.Value='$Scan[ScanType]' LIMIT 1) as `Selected_$Scan[ScanType]`, (SELECT fqc.QCStatus FROM files f LEFT JOIN files_qcstatus fqc USING(FileID) LEFT JOIN parameter_file p ON (p.FileID=f.FileID AND p.ParameterTypeID=$Scan[ParameterTypeID]) WHERE f.SessionID=s.ID AND p.Value='$Scan[ScanType]' LIMIT 1) as `$Scan[ScanType]_QCStatus`";
        }
        $Query .= " FROM session s JOIN candidate c USING (CandID) LEFT JOIN feedback_mri_comments fmric ON (fmric.CommentTypeID=7 AND fmric.SessionID=s.ID) WHERE c.PSCID <> 'scanner' AND c.PSCID NOT LIKE '%9999' AND c.Active='Y' AND s.Active='Y' AND c.CenterID <> 1 limit 10";
        return $Query;
    }
    function _addMRIFeedback($current_feedback, $scan_type, $mri_feedback) {
        $CandidateData = array();
        //setting default values for mri feedback
        foreach ($this->feedback_Comments as $CommentTypeID=>$field) {
            $CandidateData[$field."_".$scan_type] = $mri_feedback->getMRIValue($field);
            $CandidateData["Comment_".$field."_".$scan_type] = '';// overall comment field for each CommentTypeID

            // set deafault for all the predefined comments as well
            $predefn = $this->feedback_PreDefinedComments[$CommentTypeID];
            foreach ($predefn as $id=>$key) {
                $CandidateData[$key."_".$scan_type] = 'No'; //no is default
            }
        }
        foreach ($current_feedback as $CommentTypeID=>$comment) {
            if (array_key_exists("predefined", $comment)) {
                $predefined = $comment['predefined'];
                foreach ($predefined as $key=>$val) {
                   $field_set = $this->feedback_PreDefinedComments[$CommentTypeID][$key];
                   $CandidateData[$field_set."_".$scan_type] = 'Yes';
                }
            }
            if (array_key_exists("text", $comment)) {
                $field_set = "Comment_".$this->feedback_Comments[$CommentTypeID];"\n ---- ".$comment['text']."----\n";
                $CandidateData[$field_set."_".$scan_type] = $comment['text'];
            }
        }
        return $CandidateData;
    }
    function UpdateCandidateDocs($data) {
        foreach($data as $row) {
            $doc = $row;
            $identifier = array($row['PSCID'], $row['Visit_label']);
            $docid = 'MRI_Files:' . join($identifier, '_');
            unset($doc['PSCID']);
            unset($doc['Visit_label']);
            unset($doc['SessionID']);
            unset($doc['FileID']);
            $success = $this->CouchDB->replaceDoc($docid, 
                array('Meta' => array(
                    'DocType' => 'mri_data',
                    'identifier' => $identifier
                ),
                'data' => $doc
            ));
            print $docid . ": " . $success . "\n";

            $config = NDB_Config::singleton();
            $paths = $config->getSetting('paths');

            foreach($ScanTypes as $Scan) {
                // This isn't very efficient to get the document a second time, but we need
                // the rev for adding the attachments. This whole section should be
                // optimized/cleaned up. For now it's just a hack to get the data into
                // CouchDB, it isn't very clean.
                // This should all be done using a single multipart request eventually.
                $latestDoc = $this->CouchDB->getDoc($docid);

                $fileName = $doc['Selected_' . $Scan['ScanType']];
                $fullPath = $paths['mincPath'] . $fileName;
                if(file_exists($fullPath)) {
                    if(!empty($fileName)) {
                        $toUpload = null;
                        if(!empty($latestDoc['_attachments'])) {
                            
                            if(isset($latestDoc['_attachments'][$fileName])) {
                                $size = $latestDoc['_attachments'][$fileName]['length'];
                                if($size != filesize($fullPath)) {
                                    // File has been modified, upload it.
                                    $toUpload = $fileName;

                                }
                            } else {
                                // This attachment not been uploaded - ever
                                $toUpload = $fileName;
                            }

                        } else {
                            // No current attachments, so this file has not
                            // been uploaded
                            $toUpload = $fileName;
                        }

                        if(!empty($toUpload)) {
                            $data = file_get_contents($fullPath);
                            print "Adding $fileName to $docid\n";
                            $output = $this->CouchDB->_postRelativeURL($docid . '/' . $fileName . '?rev=' . $latestDoc['_rev'], $data, 'PUT', 'application/x-minc');
                        }
                       


                    }
                } else {
                        print "****COULD NOT FIND $fullPath TO ADD TO $docid***\n";
                }
            }
        }
        return;
    }

    function run() {
        $ScanTypes = $this->SQLDB->pselect("SELECT DISTINCT pf.ParameterTypeID,
                          pf.Value as ScanType
                     FROM parameter_type pt
                     JOIN parameter_file pf
                     USING (ParameterTypeID)
                     WHERE pt.Name='selected' AND COALESCE(pf.Value, '') <> ''", array());
        $this->UpdateDataDict($ScanTypes);
        $query = $this->_generateCandidatesQuery($ScanTypes);
        $CandidateData = $this->SQLDB->pselect($query, array());
        $this->UpdateCandidateDocs($CandidateData, $ScanTypes);
        $CandidateData = $this->SQLDB->pselect($query, array());//print_r($CandidateData);
        foreach ($CandidateData as &$row) {
            foreach ($ScanTypes as $scanType) {
                $scan_type = $scanType['ScanType'];
                if (!empty($row['Selected_'.$scan_type]) ) {
                    $fileID = $this->SQLDB->pselectOne("SELECT FileID FROM files WHERE File=:fname",
                              array('fname'=>$row['Selected_'.$scan_type]));print "FILE = $fileID";
                    // instantiate feedback mri object
                 $mri_feedback = new FeedbackMRI($fileID, $row['SessionID']);
                 $current_feedback = $mri_feedback->getComments();//print_r($current_feedback);
                 $mri_qc_results = $this->_addMRIFeedback($current_feedback, $scan_type, $mri_feedback);
            //     array_push($row, $mri_qc_results);
                 $row = array_merge($row, $mri_qc_results);
                }
            }
        } print_r($CandidateData);
        //$this->UpdateCandidateDocs($CandidateData);
    }
}
// Don't run if we're doing the unit tests, the unit test will call run..
if(!class_exists('UnitTestCase')) {
    $Runner = new CouchDBMRIImporter();
    $Runner->run();
}
?>
