<?php
#!/data/web/neurodb/software/bin/php
/**
 * @version $Id: derive_timepoint_flags.php,v 3.17 2006/06/20 15:12:29 dario Exp $
 * derives exclusion flags and stores them into parameter_exclusion_session table
 * @package timepoint_flag
 */

// define a config file to use
$configFile = "../project/config.xml";

set_include_path(get_include_path().":../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);
require_once "TimePoint_Flag.class.inc";

/**
 * HELP SCREEN
 * display and stop processing if action=help
 */
if (empty($argv[1]) || $argv[1] == 'help' || !in_array($argv[1],array('one','all')) || ($argv[1]=='one' && (empty($argv[2])))) {
    fwrite(STDERR, "Usage: \n\n");
    fwrite(STDERR, "generate_timepoint_flags.php help - displays this msg\n");
    fwrite(STDERR, "generate_timepoint_flags.php all [<subprojectID>] | one <sessionID>\n");
    return;
}

/**
* get cmd-line arguments
*/
// get $action argument
$action = strtolower($argv[1]);
if ($action=='one') {
     $sessionID = trim($argv[2]);
} else {
    if (!empty($argv[2])) $subProjectID = trim($argv[2]);
}

// DB Object
$db =& Database::singleton();
if(PEAR::isError($db)) {
    fwrite(STDERR, "Could not connect to database: ".$DB->getMessage()."\n");
    return false;
}

// get the list of timepoints - submitted to DCC, Pass or In Progress
$query = "SELECT * FROM session as s WHERE s.Active = 'Y' AND s.Submitted = 'Y' AND s.Current_stage='Approval' AND s.Approval IN('In progress', 'Pass')";
// subproject
if (!empty($subProjectID)) $query .= " AND s.SubprojectID = '$subProjectID'";
// sessionid
if ($action=='one' && !empty($sessionID)) $query .= " AND s.ID = '$sessionID'";	

$query .= " ORDER BY s.ID";

$result = array();
$db->select($query, $result);
if (PEAR::isError($result)) {
    fwrite(STDERR, "DBError, failed to get the list of timepoints: \n $query \n".$result->getMessage());
    return false;
}

// return a msg
if (count($result)==0) {
    fwrite(STDERR, "No timepoints returned! \n");
    return false;
}

fwrite(STDERR, "Start \n");


// name of the excel file to export data to
$filename = "timepoint_flags";
if (!empty($subProjectID)) $filename .= "_obj$subProjectID";
if (!empty($sessionID)) $filename .= "_candidate_".$result[0]['CandID']."_visit_".$result[0]['Visit_label'];
$today=date("YMd");
$filename .= "_$today";
fwrite(STDERR, $filename."\n");

$i=0;
foreach ($result as $currentTimepoint) {

    $sessionID = $currentTimepoint['ID'];

    // create Flag object
    if (isset($timepointFlagObject)) unset($timepointFlagObject);
    $timepointFlagObject = new TimePoint_Flag();
    if (PEAR::isError($timepointFlagObject)) {
        fwrite(STDERR, "Error, failed to create Flag object for sessionID ($sessionID):\n".$timepointFlagObject->getMessage());
        return false;
    }
    $success = $timepointFlagObject->select($sessionID);
    if (PEAR::isError($success)) {
        fwrite(STDERR, "Error, failed to create Flag object for sessionID ($sessionID) - SELECT failed:\n".$timepointFlagObject->getMessage());
        return false;
    }

    $constantsArray = array($timepointFlagObject->showConstant('TIMEPOINT_FLAG_MISSING_DATA'),$timepointFlagObject->showConstant('TIMEPOINT_FLAG_NA_INSTRUMENT'));
    
    // get flag types to assign the proper status to the session/flag records
    if (empty($flagTypeIDs)) { 
        $flagTypeIDs = $timepointFlagObject->getFlagTypeIDs();
        if (PEAR::isError($flagTypeIDs)) {
            fwrite(STDERR, "Error, failed to get the list of typeIDs:\n".$flagTypeIDs->getMessage());
            return false;
        }
    }
    
    // evaluate the flags for the timepoint and get the list of triggered flags and their statuses
    // flag statuses are captured as constants TIMEPOINT_FLAG_TRIGGER, TIMEPOINT_FLAG_NA_INSTRUMENT, TIMEPOINT_FLAG_NULL
    $flagList = array();
    $flagList = $timepointFlagObject->evaluateTimepointFlags();
    if (PEAR::isError($flagList)) {
        fwrite(STDERR, "Error, failed to evaluate flags for timepoint ($sessionID):\n". $flagList->getMessage());
        return false;
    }

    // if there are no flags skip to next timepoint
    if (count($flagList)==0) continue;
    
    foreach ($flagList as $flagName=>$flagStatus) {
        
        // check if the flag exists, i.e. previously triggered
        $flagExists = $timepointFlagObject->timepointFlagExists($sessionID, $flagName);
        if (PEAR::isError($flagExists)) {
            fwrite(STDERR, "Error:\n".$flagExists->getMessage());
            return false;
        }

        // skip to next flag if it's already in the table
        if ($flagExists) {
           continue;
        }

        // if the flag DNE in the flag/session table insert a new record
        // and reset the exclusion status to In Progress (where applicable)
        // and add to data array

        // get the flag's defined/default type
        $flagType = $timepointFlagObject->getFlagType($flagName);
        if (PEAR::isError($flagType)) {
            fwrite(STDERR, "Error, failed to get the flag's type ($flagName):\n".$flagType->getMessage());
            return false;
        }

        // define the flag's new type
        if (in_array($flagStatus, $constantsArray)) {
            // if the returned status is one of the above, 'overwrite' the flags default type
            $newFlagTypeID = $flagTypeIDs[$flagStatus];
        } else {
            // otherwise trigger the flag w/ its default type
            $newFlagTypeID = $flagTypeIDs[$flagType];
        }

        // if the returned flag is MISSING DATA, do not insert flag record
        // it'll appear in the excel file b/c data entry needs to be completed...
        // THIS IS ONLY DONE when the flags are mass-derived
        if ($flagStatus != $timepointFlagObject->showConstant('TIMEPOINT_FLAG_MISSING_DATA')) {

            // insert the new flag record into the flag/session table
//            $success = $timepointFlagObject->insertFlag($flagName, $newFlagTypeID);
            if (PEAR::isError($success)) {
                fwrite(STDERR, "DB Error:\n".$success->getMessage());
                return false;
            }

            // if there are new flags to add, the evarall status of the timepoint's excl evaluation needs to be reset
            // if the overal excusion flag is NOT NULL,
            // reset to NULL to force the review of the new flag
            if (!empty($currentTimepoint['BVLQCExclusion'])) {
                 // reset the status to NULL
//                $success = $timepointFlagObject->setBVLQCExclusion(null);
                if (PEAR::isError($success)) {
                    fwrite(STDERR, "DB Error:\n".$success->getMessage());
                    $prevFlagName2 = 1;
                }
            }

            // ALSO RESET THE APPROVAL FROM PASS to IN PROGRESS!!!
            // reset approval to In Progress
            if ($timepointFlagObject->getApprovalStatus()=='Pass') {
//                $success = $timepointFlagObject->setData("Approval", "In Progress");
                $prevFlagName = 1;
            }
        } // end if

        // create $data array for the excel file
        // print the list of positive triggers and their statuses
        $flagPositiveTriggers = $timepointFlagObject->evaluateFlagTriggers($flagName);
        if (is_array($flagPositiveTriggers)) {
            foreach ($flagPositiveTriggers as $triggerName=>$triggerStatus) {
                $i+=1;
                $data[$i]['Cand'] = $currentTimepoint['CandID'];
                $data[$i]['PSCID'] = $currentTimepoint['PSCID'];
                $data[$i]['Visit_label'] = $currentTimepoint['Visit_label'];
                $data[$i]['Objective'] = $currentTimepoint['SubprojectID'];

                // add flag info to data array
                $data[$i]["Flag"] = $flagName;
                $data[$i]["FlagStatus"] = $flagStatus;
                $data[$i]["FlagType"] = $newFlagTypeID;

                $data[$i]["Trigger"] = $triggerName;
                $data[$i]["Trigger_value"] =  $timepointFlagObject->getTriggerValue($flagName, $triggerName);
                $data[$i]["Trigger_status"] = $triggerStatus;
                if ($prevFlagName) {
                    $data[$i]["Distinct"] = "1";
                } else {
                    $data[$i]["Distinct"] = null;
                } 
                if ($prevFlagName2) {
                    $data[$i]["Distinct2"] = "1";
                } else {
                    $data[$i]["Distinct2"] = null;
                }
            }
        }
        unset($flagPositiveTriggers);
        unset($prevFlagName);
        unset($prevFlagName2);
    } // end foreach flag

    unset($timepointFlagObject);
    fwrite(STDERR, " - $i .");
} // end foreach record/timepoint
        

if (is_array($data) && ($data)>0) {

    fwrite(STDERR, "Start Excel \n");

    /**
    * Intitialize excel objects and open the files
    */
    require_once("Spreadsheet/Excel/Writer.php");
    // path to nihpd dir where db reports are stored
    $pathToDir = "/data/web/prod/htdocs/nihpd/Database/Reports_Services/Reports/";
    // new worksheet
    $workbookSummary = new Spreadsheet_Excel_Writer($pathToDir.$filename.".xls");
    // Create the worksheet
    $worksheetSummary =& $workbookSummary->addWorksheet('Summary');

    // create format objects for the workbook
    $formatTitle =& $workbookSummary->addFormat(array('font' => 'arial', 'size' =>10));
    $formatSummary =& $workbookSummary->addFormat(array('font' => 'arial', 'size' =>10));
    $formatSummaryBold =& $workbookSummary->addFormat(array('font' => 'arial', 'size' =>10));
    // title
    $formatTitle->setBold();
    $formatTitle->setAlign('left');
    // bold fields
    $formatSummaryBold->setBold();
    $formatSummaryBold->setAlign('center');
    // data fields
    $formatSummary->setRight(0.75);

    /*
    * build excel file
    */
    // set the title and date
    // setting them last so that spreadsheet would select
    $worksheetSummary->write(0, 0, "$title [".date("F j, Y")."]", $formatTitle);

    // start data rows at row 2
    $recordNo=2;
    foreach ($data as $currentRecord) {
        // headers, print them out if different from the prev row
        $keys = array_keys($currentRecord);
        if ($keys!=$prevKeys) {
            $prevKeys = $keys;
            for ($i=0; $i<count($keys); $i++) {
                $worksheetSummary->write($recordNo, $i, $keys[$i], $formatSummaryBold);
            }
            $recordNo++;
        }

        // data cols
        $i=0;
        foreach ($currentRecord as $val) {
            $worksheetSummary->write($recordNo, $i, isnull($val,""), $formatSummary);
            $i++;
        }
        $recordNo++;
    } // end foreach

    // close the excel file
    $workbookSummary->close();
} // end if

fwrite(STDERR, "End \n");

function isnull($value, $default) 
{
    if(is_null($value)) return $default;
    return $value;
}
?>