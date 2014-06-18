<?php
#!/data/web/neurodb/software/bin/php
/**

 * This reports generates a tab separated file, one row per subject, one column per exclusion criteria from the parameter_exclusion table.
 * temporary constraint is: Objective =1, VisitNo = 1
 * @version $Id: generate_exclusion_report.php,v 3.9 2006/04/07 12:58:41 jharlap Exp $
 * @package timepoint_flag
 */

/*
pseudoCode:
select the list of sessionIDs
get the ExclusionList (array Name=>Type)
print out column headers (demopgrahics fields)
foreach ExclusionList
print Name of the flag (as column label)
end foreach

foreach timepoint
create exclusion object
get the list of exclusions (array ExclusionData: Exclusion_name(Name)=>Flag_type(Type))
dumpLine w/ timepoint ExclusionData array
end foreach

function dumpLine:
create Timepoint object
get demographics info
calculate age
print Demographics info (w/ tabs)
foreach ExclusionData
print value of the ExclusionData['Name']
end foreach
*/

//Ensure php version compatability
//taken from php.net notes
if (version_compare(phpversion(),'4.3.0','<'))
{
    define('STDIN',fopen("php://stdin","r"));
    register_shutdown_function( create_function( '' , 'fclose(STDIN);
    fclose(STDOUT); fclose(STDERR); return true;' ) );
}

require_once "../php/libraries/NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

// overwrite DB connection
require_once "../php/libraries/NDB_Config.class.inc";
require_once "../php/libraries/Database.class.inc";
$config =& NDB_Config::singleton();
$dbConfig = $config->getSetting('database');
// DB Object
$DB =& Database::singleton('NIH_PD', $dbConfig['username'], $dbConfig['password'], $dbConfig['host']);
if(PEAR::isError($DB)) {
    fwrite(STDERR, "Could not connect to database: ".$DB->getMessage());
    return false;
}
$GLOBALS['DB'] =& $DB;
$db =& $DB;

require_once "../php/libraries/TimePoint_Flag.class.inc";
require_once "../php/libraries/NDB_BVL_Instrument.class.inc";

/**
* get list of sessionIDs
*/
$query = "Select Submitted, MRIQCStatus, MRIQCPending, Scan_done,  Approval, BVLQCStatus, BVLQCType, ID as SessionID FROM session WHERE Active = 'Y' AND Screening = 'Pass' AND VisitNo=1";
// temporary constraint
$query .= " AND Objective = 1";
// order by
$query .= " ORDER BY CenterID, Date_visit";

$db->select($query,$result);
if (PEAR::isError($db)) {
    fwrite(STDERR, "DBError, failed to get the list of sessionIDs: \n".$result->getMessage());
    return false;
}

// set array of instrument used for exclusion
$instrumentLabels = array("BTSI_Y1","FTSI_Y1","Neurological_exam","WASI","WJ-III","DAS","DISC","CBCL","FIGS_Y1");
$instrumentList = array("brief_interview","full_telephone_screening_interview_year1","neuro_obj1","wasi","wj3","das","disc","cbcl","figs_parent");

$TAB = "\t";
$NEWLINE = "\n";

/**
* start processing
*/
fwrite(STDERR, "Starting... \n");

// print the column headers
print "Site\tDCCID\tPSCID\tSessionID\tVisit\tObjective\tAge at Visit\tACCEPTED\tDate_of_visit\tIQTest_date\tDB_Window\tSent To DCC\tMR Scan Done\tQC Completed\tMRI QC\tMRI QC Pending\tBVL QC\tBVL QC Type\tCertification\tAdverse Findings\tFeedback";
foreach ($instrumentLabels as $instrument) {
    print "\t$instrument";
}

// for each time point get the list of flags' records
foreach ($result as $currentTimepoint) {
    
    // get the identification data
    // from the query above
    $sessionID = $currentTimepoint['SessionID'];
    $data['SessionID'] = $sessionID;
    $data['MRIQCStatus'] = $currentTimepoint['MRIQCStatus'];
    $data['MRIQCPending'] = $currentTimepoint['MRIQCPending'];
    $data['Scan_done'] = $currentTimepoint['Scan_done'];
    $data['BVLQCStatus'] = $currentTimepoint['BVLQCStatus'];
    $data['BVLQCType'] = $currentTimepoint['BVLQCType'];
    $data['Submitted'] = $currentTimepoint['Submitted'];
    $data['Approval'] = $currentTimepoint['Approval'];
    
    fwrite(STDERR, "Timepoint: $sessionID; ");
    
    // create TimePoint_exclusion object
    $timepointFlagObject =& TimePoint_Flag::singleton($sessionID);
    if (PEAR::isError($timepointFlagObject)) {
        // if error, stop processing
        fwrite(STDERR, "Timepoint_Flag Object Error: " . $timepointFlagObject->getMessage()."\n");
        return false;
    }
    
    // from the timepoint class
    $data['Site'] = $timepointFlagObject->getPSC();
    $data['DCCID'] = $timepointFlagObject->getCandID();
    $data['Visit'] = $timepointFlagObject->getVisitLabel();
    $data['Objective'] = $timepointFlagObject->getObjective();
    
    // NOT YET AVAILABLE
    $data['Certification'] = '';
    
    
    /**
    * PROFILE & timepoint info
    */
    $query = "SELECT c.DoB, c.EDC, c.PSCID, s.Date_visit, w.Date_taken as WASI_date, d.Date_taken as DAS_date FROM candidate as c LEFT JOIN session as s USING (CandID) LEFT JOIN flag as f ON (s.ID = f.SessionID) LEFT JOIN wasi as w ON (f.CommentID = w.CommentID) LEFT JOIN das as d ON (f.CommentID = d.CommentID) WHERE f.Test_name IN ('wasi', 'das') AND s.VisitNo=1 AND c.CandID=".$data['DCCID'];
    $db->selectRow($query, $candrow);
    if (PEAR::isError($candrow)) {
        fwrite(STDERR, $candrow->getMessage());
        return false;
    }
    
    $data['PSCID'] = $candrow['PSCID'];
    
    if($data['Objective'] == 2) {
        $dateBirth = $candrow['EDC'];
    } else {
        $dateBirth = $candrow['DoB'];
    }
    
    if (!empty($dateVisit) && !empty($dateBirth)) {
        $age = Utility::calculateAge($dateBirth, $dateVisit);
    }
    
    $data['Age_Visit'] = $age['year']*12 + $age['mon'];
    
    
    // set the DB window dates
    $data['Date_visit'] = $candrow['Date_visit'];
    if (!empty($candrow['WASI_date'])) {
        $data['Date_IQ_Test'] = $candrow['WASI_date'];
    } else {
        $data['Date_IQ_Test'] = $candrow['DAS_date'];
    }
    
    // test the DB date
    if (empty($data['Date_IQ_Test']) || empty($data['Date_visit'])) {
        // if any of the dates is empty
        $data['DB_Window'] = "MI";
    } else {
        // split the dates to test them
        $dateArray = explode('-', $data['Date_visit']);
        $dateOfVisit = array('Y'=>$dateArray[0], 'M'=>$dateArray[1], 'd'=>$dateArray[2]);
        $dateArray = explode('-', $data['Date_IQ_Test']);
        $dateOfIQTest = array('Y'=>$dateArray[0], 'M'=>$dateArray[1], 'd'=>$dateArray[2]);
        unset($dateArray);
        if (_checkDate($dateOfIQTest) == false || _checkDate($dateOfVisit) === false) {
            $data['DB_Window'] = "Date Error";
        } else {
            // test the DB window - not applicable for V1
            if (strtolower($data['Visit']) == 'v1') {
                $data['DB_Window'] = "";
            } else {
                // compute the dates in months
                $data['DB_Window'] = abs(($dateOfVisit['Y']*12 + $dateOfVisit['M']) - ($dateOfIQTest['Y']*12 + $dateOfIQTest['M']));
            }
        }
        unset($dateOfIQTest);
        unset($dateOfVisit);
    }
    
    
    /*
    ** FEEDBACK status info
    */
    $feedback =& NDB_BVL_Feedback::singleton($username, null, $sessionID);
    if (PEAR::isError($feedback)) {
        fwrite(STDERR, $feedback->getMessage()."\n");
        return false;
    }
    $feedback_status = $feedback->getMaxThreadStatus('Y');
    if (PEAR::isError($feedback_status)) {
        fwrite(STDERR, $feedback_status->getMessage()."\n");
        return false;
    }
    // prepare the $data element
    if (!is_array($feedback_status)) {
        $data['Feedback'] = $feedback_status;
    }
    // destroy vars
    unset($feedback);
    unset($feedback_status);
    
    // get list of NA instruments
    $NAinstruments = array();
    $NAinstruments = $timepointFlagObject->getListOfNonAdministeredInstruments();
    if (PEAR::isError($NAinstruments)) {
        fwrite(STDERR, "Error, Failed to get the list of NA instruments: \n".$NAinstruments->getMessage());
        return false;
    }
    // set the NA instrument data
    if (count($NAinstruments)>0) {
        foreach ($instrumentList as $instrument) {
            if (in_array($instrument, $NAinstruments)) {
                // set the value to MI, missing DATA
                $data[$instrument] = 'MI';
            }
        }
    }
    
    $dateVisit = $timepointFlagObject->getDateOfVisit();
    
    // get the full list of flags (once)
    if (!isset($listOfFlags)) {
        $listOfFlags = $timepointFlagObject->getListOfFlags();
        if (PEAR::isError($listOfFlags)) {
            fwrite(STDERR, "Error, failed to get the list of flags: \n".$listOfFlags->getMessage());
            return false;
        }
    }
    
    // loop the list of flags and assign it a flag type from the table
    $i = 1;
    foreach ($listOfFlags as $flagName) {
        
        // to slice the report in two pages (uncomment one of the lines)
        // loop the first 23, the 1st time
//            	if ($i > 23) break;
        // and the next 22 the 2nd time
        if ($i < 24) { $i++; continue; }
        
        //fwrite(STDERR, "Flag $i: $flagName\n");
        
        // get the flag type & status from DB
        $flagData = $timepointFlagObject->getFlag($sessionID, $flagName);
        
        if (PEAR::isError($flagData)) {
            fwrite(STDERR, "Error, failed to get the flag record ($flagName): \n".$flagData->getMessage());
            return false;
        }
        
        if (!isset($listOfTriggers[$flagName])) {
            $indexCount = 1;
        } else {
            $indexCount = 2;
        }
            
        if ($indexCount == 1) {
            // get list of triggers for the flag
            $listOfTriggers[$flagName] = $timepointFlagObject->getListOfTriggers($flagName);
            
            if (PEAR::isError($listOfTriggers[$flagName])) {
                fwrite(STDERR, $listOfTriggers[$flagName]->getMessage()."\n");
                return false;
            }
            
            if (is_array($listOfTriggers[$flagName])) {
                
                // print the flag and trigger labels (once) - for flags that have triggers
                print $TAB.$flagName.$TAB."Status".$TAB."Comment";
                                
                // print the trigger labels (once)
                foreach ($listOfTriggers[$flagName] as $triggerName) {
                    print $TAB.$triggerName;
                }
                
                // print review data lable
                $reviewLabel = "Review Data";
                
            }
        }
        
        if (is_array($listOfTriggers[$flagName])) {
            
            // get the list of triggers field values
            $listTriggerFieldValues = $timepointFlagObject->getTriggerFieldValues($flagName);
            if (PEAR::isError($listTriggerFieldValues)) {
                fwrite(STDERR, "Error, failed to get the trigger field values for flag ($flagName): \n".$listTriggerFieldValues->getMessage());
                return false;
            }
            
            // add to data array
            $data[$flagName] = $flagData;
            
            foreach ($listOfTriggers[$flagName] as $triggerName) {
                $data[$flagName][$triggerName] = $listTriggerFieldValues[$triggerName];
            }
            
            // get the array of review fields w/ field values
            $reviewfieldArray = $timepointFlagObject->getFlagReviewFieldsValues($flagName);
            
            if (PEAR::isError($reviewfieldArray)) {
                fwrite(STDERR, "Error: ".$reviewfieldArray->getMessage());
                return false;
            }
            
            if (is_array($reviewfieldArray) && count($reviewfieldArray) > 0) {
                foreach ($reviewfieldArray as $reviewFieldLabel=>$reviewFieldValue) {
                    if ($indexCount == 1) {
                        if (!empty($reviewLabel)) {
                            print $TAB.$reviewLabel;
                            unset($reviewLabel);
                        }
                        // add the review qst label to the colun heading
                        print " ($reviewFieldLabel);";
                    }
                    if (!empty($reviewFieldValue)) {
                        $data[$flagName]['Review'] .= "($reviewFieldLabel): ". trim($reviewFieldValue) ."; ";
                    }
                }
            }
            unset($reviewfieldArray);
            unset($reviewFieldValue);
            unset($reviewFieldLabel);
        }
        
        $i++;
    } // end foreach list of flags
    
    // get the MRI adverse status
    if ($currentTimepoint['Scan_done'] == 'Y') {
        $adverseArray = array();
        $query = "SELECT Findings_confirmed FROM NIH_PD_DEV.mri_adverse WHERE SessionID = '$sessionID' AND Findings_confirmed IS NOT NULL GROUP BY SessionID";
        $db->selectRow($query, $adverseArray);
        if (PEAR::isError($adverseArray)) {
            fwrite(STDERR, $adverseArray->getMessage());
            return false;
        }
        // if the ID was returned then there was a findings
        if (count($adverseArray) == 0 || empty($adverseArray['Findings_confirmed'])) {
            // adverse finding DNE
            $data['Adverse_findings'] = "";
        } else {
            $data['Adverse_findings'] = $adverseArray['Findings_confirmed'];
        }
        unset($adverseArray);
        unset($query);
        
    } else {
        // if the scan was not done, adverse finding are N/A
        $data['Adverse_findings'] = "";
    }
    
    /*
    ** Overall QC completion status
    */
    if (
    // if data is submitted to DCC
    $data['Submitted'] == 'Y'
    // if no feedback is outstanding and BVLQC is marked as complete
    && !in_array($data['Feedback'], array('opened', 'answered')) && $data['BVLQCStatus'] == 'Complete'
    // scna no done OR scan done, MRI QC completed and not pending
    &&  ($data['Scan_done'] == 'N' || $data['Scan_done'] == 'Y' && !empty($data['MRIQCStatus']) && $data['MRIQCPending'] == 'N')
    ) {
        $data['QCCompleted'] = 'Y';
    } else {
        $data['QCCompleted'] = 'N';
    }
    
    // dump the line with exclusion fields
    dumpLine($instrumentList, $listOfFlags, $listOfTriggers, $sessionID, $data);
    
    unset($timepointFlagObject);
    unset($sessionID);
    unset($currentTimepoint);
    unset($data);
    unset($triggerName);
    unset($flagData);
    unset($flagName);
}

fwrite(STDERR, "\n end");

function dumpLine($instrumentList, $listOfFlags, $listOfTriggers, $sessionID, $data) {
    
    $TAB = "\t";
    $NEWLINE = "\n";
    
    print $NEWLINE;
    
    // dump the line
    print $data['Site'].$TAB.$data['DCCID'].$TAB.$data['PSCID'].$TAB.$data['SessionID'].$TAB.$data['Visit'].$TAB.$data['Objective'].$TAB.$data['Age_Visit'].$TAB.$data['Approval'].$TAB.$data['Date_visit'].$TAB.$data['Date_IQ_Test'].$TAB.$data['DB_Window'].$TAB.$data['Submitted'].$TAB.$data['Scan_done'].$TAB.$data['QCCompleted'].$TAB.$data['MRIQCStatus'].$TAB.$data['MRIQCPending'].$TAB.$data['BVLQCStatus'].$TAB.$data['BVLQCType'].$TAB.$data['Certification'].$TAB.$data['Adverse_findings'].$TAB.$data['Feedback'];
    
    // print the NA instrument status
    foreach ($instrumentList as $instrument) {
        print $TAB.$data[$instrument];
    }
    
    // print flag/trigger data
    $i = 1;
    foreach($listOfFlags AS $flagName) {
        
        // to slice the report in two pages (uncomment one of the lines)
        // loop the first 23, the 1st time
//            	if ($i > 23) break;
        // and the next 22 the 2nd time
        if ($i < 24) { $i++; continue; }
        
        
        if (is_array($listOfTriggers[$flagName])) {
            
            print $TAB.$data[$flagName]['Type_name'];
            print $TAB.$data[$flagName]['Flag_status'];
            print $TAB.$data[$flagName]['Comment'];
            
            // print trigger values
            foreach ($listOfTriggers[$flagName] as $triggerName) {
                print $TAB.$data[$flagName][$triggerName];
            }
            // print the review fields data
            if (!empty($data[$flagName]['Review'])) {
                $TAB.$data[$flagName]['Review'];
            }
        }
        
        $i++;
    }
    
    fwrite(STDERR, ". \n");
}
?>