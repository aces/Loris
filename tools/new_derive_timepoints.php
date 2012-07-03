<?
// Derive timepoint variables inserts all the MRI-y related things into the
// parameter* tables, so that the quat script can take them and insert them
// into the quat tables. This version is loosely based on derive_timepoint_variables
// from nihpd.
//
// At the moment, this version of it just inserts the selected version
// of the T1/T2 files into different fields in the parameter_session table.
// This ensures that only 1 file per session is inserted into each column in
// the quat script (since the primary key is the SessionID), and the quat script 
// can run happily ever after.
//
// Generally, to get the DQG up and running you need to run:
// 1. data dictionary builder
// 2. derive timepoint
// 3. quat
// in that order.
//
// - Dave MacFarlane

require_once('generic_includes.php');
$db =& Database::singleton();
function MRI_Find_And_Insert_Selected() {
    global $db;
    // The key is the string in the Filename to identify it as that type,
    // the value is the ParameterType name to use to store the selected
    // These should already be created in the parameter type table
    // INSERT INTO parameter_type (Name, Type, SourceFrom, Queryable) VALUES ('MRI_Native_T1_File', 'varchar(255)', 'parameter_session', 1);
    $FileTypes = array('t1w' => 'MRI_Native_T1_File',
                       't2w' => 'MRI_Native_T2_File',
    );
    $ParameterTypeIDs = array();
    $CommentTypeID = $db->pselectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name=:parametertype", array('parametertype' => 'MRI_QC_Comment'));
    if(empty($CommentTypeID)) {
        print "Error: missing parameterTypeID for MRI_QC_Comment\n";
        exit(-1);
    }

    // Delete old values, and populate array of ParameterTypeIDs 
    foreach($FileTypes as $type => $parameter_type) {
        $ParameterTypeIDs[$type] = $db->pselectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name=:parametertype", array('parametertype' => $parameter_type));
        if(empty($ParameterTypeIDs[$type])) {
            print "Error: missing parameterTypeID for $parameter_type\n";
            exit(-1);
        }
        $ParameterTypeIDs[$type . '_QC'] = $db->pselectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name=:parametertype", array('parametertype' => $parameter_type . '_QC'));
        if(empty($ParameterTypeIDs[$type . '_QC'])) {
            print "Error: missing parameterTypeID for $parameter_type" . "_QC\n";
            exit(-1);
        }
        $db->delete('parameter_session', array('ParameterTypeID'=>$ParameterTypeIDs[$type]));
        $db->delete('parameter_session', array('ParameterTypeID'=>$ParameterTypeIDs[$type . '_QC']));

        $sessions = $db->pselect("SELECT f.SessionID, f.File, fqc.QCStatus, fmc.Comment FROM files f
            LEFT JOIN files_qcstatus fqc USINg(FileID)
            JOIN parameter_file pf USING(FileID)
            JOIN parameter_type pt USING(ParameterTypeID)
            LEFT JOIN feedback_mri_comments fmc ON (fmc.SessionID=f.SessionID AND fmc.CommentTypeID=7)
                    WHERE File like '%$type%'
                        AND pt.Name='Selected' AND COALESCE(pf.Value, '') <> '' AND File NOT LIKE '%phantom%'", array());

        $prepCount = $db->prepare("SELECT count(*) as NumComments FROM parameter_session WHERE ParameterTypeID=:CommentID AND SessionID=:SID");
        foreach($sessions as $row) {
            $val = array();
            print "Inserting $row[SessionID]\n";
            $val['SessionID']=$row['SessionID'];
            $val['Value'] = $row['File'];
            $val['ParameterTypeID'] = $ParameterTypeIDs[$type];
            $val['InsertTime'] = time();
            $db->insert("parameter_session", $val);

            print "Inserting $row[SessionID] QC Status\n";
            $val['Value'] = $row['QCStatus'];
            $val['ParameterTypeID'] = $ParameterTypeIDs[$type . '_QC'];
            $db->insert("parameter_session", $val);
            $NumComments = $prepCount->execute(array('CommentID' => $CommentTypeID, 'SID' => $row['SessionID']));
            print "NumComments: $NumComments[NumComments]\n";
            if($NumComments['NumComments'] == 0 && !empty($row['Comment'])) {
                $val['ParameterTypeID'] = $CommentTypeID;
                $val['Value'] = $row['Comment'];
                $db->insert("parameter_session", $val);
            }
        }

        // TEMPORARY: DELETE files with multiples selected, so quat
        // doesn't die. These files should be fixed.

        $duplisessions = $db->pselect("select SessionID, Value, count(*) from parameter_session WHERE ParameterTypeID=" . $ParameterTypeIDs[$type] . " GROUP BY SessionID, ParameterTypeID HAVING COUNT(*) > 1", array());
        foreach ($duplisessions as $row) {
            print "Deleting $row[SessionID]\n";
            $db->delete('parameter_session', array('SessionID' => $row['SessionID']));
        }

    }
    // add scanner id
    // Delete old values
    $scanner_ptid = $db->pselectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name=:parametertype", array('parametertype' => 'study:serial_no'));
    if(empty($scanner_ptid)) {
        print "Error: missing parameterTypeID for study:serial_no\n";
        exit(-1);
    }
    $db->delete('parameter_session', array('ParameterTypeID'=>$scanner_ptid));
    $scanners = $db->pselect("select SessionID, Value from parameter_file join files USING(FileID) WHERE ParameterTypeID=:scanner group by SessionID", array('scanner' => $scanner_ptid));
    foreach($scanners as $row) {
        switch($row['Value']) {
            case '35008': $scanner = 'PHI'; break;
            case '35182': $scanner = 'SEA'; break;
            case '35045': $scanner = 'STL HOS'; break;
            case '35177': $scanner = 'STL RES'; break;
            case '35140': $scanner = 'UNC HOS'; break;
            case '35412': $scanner = 'UNC RES'; break;
            default: $scanner = 'Unknown'; break;
        }
        $val['SessionID']=$row['SessionID'];
        $val['Value'] = $scanner;
        $val['ParameterTypeID'] = $scanner_ptid;
        $val['InsertTime'] = time();
        $db->insert("parameter_session", $val);
    }

}

function DeriveRadiologicalReviewStatus() {
    global $db;
    $PTIDs = array(
        'Final_Examiner_Name', 'Final_Examiner_Name2', 
        'Final_Review_Results', 'Final_Exclusionary', 'Final_Incidental_Findings', 
        'Review_Done2', 
        'Final_Review_Results2', 'Final_Exclusionary2', 'Final_Incidental_Findings2',
        'Finalized',
        'Review_Done', 
        'SAS', 'SAS2', 'PVS', 'PVS2',
    );
    $sessions = $db->pselect("SELECT * FROM session join flag on (session.ID=flag.SessionID) JOIN final_radiological_review USING(CommentID) WHERE Active='Y' and Cancelled='N'", array());
    foreach ($PTIDs as $type) {
        $PTID = $db->pselectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name=:parametertype", array('parametertype' => 'Final_Radiological_Review_' . $type));
        if(!is_numeric($PTID)) {
            print "Error finding ParameterTypeID for $PTID ($type)\n";
            return -1;
        }
        $db->delete('parameter_session', array('ParameterTypeID'=>$PTID));
        foreach($sessions as $row) {
            $val['SessionID'] = $row['SessionID'];
            if($type == 'SAS' || $type == 'SAS2' || $type == 'PVS' || $type == 'PVS2') {
                switch($row[$type]) {
                    case '0':
                        $val['Value'] = 'None';
                        break;
                    case '1':
                        $val['Value'] = 'Minimal';
                        break;
                    case '2':
                        $val['Value'] = 'Mild';
                        break;
                    case '3':
                        $val['Value'] = 'Moderate';
                        break;
                    case '4':
                        $val['Value'] = 'Marked';
                        break;
                    default:
                        $val['Value'] = 'Not Answered';
                        break;
                }
            } elseif ($type == 'Final_Examiner_Name' || $type == 'Final_Examiner_Name2') {
                $examinerid = '';
                if($type == "Final_Examiner_Name") {
                    $examinerid  = $row['Final_Examiner'];
                } else if ($type == "Final_Examiner_Name2") {
                    $examinerid = $row['Final_Examiner2'];
                }
                $ExaminerName = $db->pselectOne("SELECT full_name FROM examiners WHERE examinerID=:EXID", array("EXID" => $examinerid));
                $val['Value'] = $ExaminerName;
            } else {
                $val['Value'] = $row[$type];
            }
            $val['ParameterTypeID'] = $PTID;
            $val['InsertTime'] = time();
            print "Inserting $val[SessionID], $val[Value]\n";
            $db->insert("parameter_session", $val);
        }
        $duplisessions = $db->pselect("select SessionID, Value, count(*) from parameter_session WHERE ParameterTypeID=" . $PTID . " GROUP BY SessionID, ParameterTypeID HAVING COUNT(*) > 1", array());
        print "Deleting duplicate $PTID\n";
        print_r($duplisessions);
        foreach ($duplisessions as $row) {
            print "Deleting $row[SessionID]\n";
            $db->delete('parameter_session', array('SessionID' => $row['SessionID']));
        }
    }
}
function DeriveCohort() {
    global $db;
    $sessions = $db->pselect("SELECT ID, SubprojectID FROM session WHERE Active='Y' and Cancelled='N'", array());
    $PTID = $db->pselectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name=:parametertype", 
            array('parametertype' => 'Cohort'));
    if(!is_numeric($PTID)) {
        print "Error finding ParameterTypeID for cohort\n";
        return -1;
    }
    $db->delete('parameter_session', array('ParameterTypeID'=>$PTID));
    foreach($sessions as $row) {
        $val['SessionID'] = $row['ID'];
        switch($row['SubprojectID']) {
            case 1:
                $val['Value'] = '6 month recruit';
                break;
            case 2:
                $val['Value'] = '12 month recruit';
                break;
            case 3:
                $val['Value'] = 'Control';
                break;
            case 4:
                $val['Value'] = 'Fragile X 6 month recruit';
                break;
            case 5:
                $val['Value'] = 'Fragile X 12 month recruit';
                break;
            case 6:
                $val['Value'] = 'EARLI Sib';
                break;
            case 7:
                $val['Value'] = 'Relative';
                break;
            default:
                $val['Value'] = 'Unknown';
                break;
        }
        $val['ParameterTypeID'] = $PTID;
        $val['InsertTime'] = time();
        print "Inserting $val[SessionID], $val[Value]\n";
        $db->insert("parameter_session", $val);
    }
    $duplisessions = $db->pselect("select SessionID, Value, count(*) from parameter_session WHERE ParameterTypeID=" . $PTID . " GROUP BY SessionID, ParameterTypeID HAVING COUNT(*) > 1", array());
    foreach ($duplisessions as $row) {
        print "Deleting $row[SessionID]\n";
        $db->delete('parameter_session', array('SessionID' => $row['SessionID']));
    }
}

MRI_Find_And_Insert_Selected();
DeriveRadiologicalReviewStatus();
DeriveCohort();
?>
