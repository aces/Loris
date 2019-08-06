<?php

// Dumps the database instruments and some accompanying information into Excel formatted files.
// For some large tables, this script requires *a lot* of memory.  Modify the `cli` php.ini for > 256M

// Operation:
// Passes the results from one or more SQL queries to the writeExcel function.

// Future improvements:
// The SQL to pull the instrument data rely on some nasty text matching (ie. where c.PSCID not like '1%').  Ideally, this junk could be purged directly from the DB, and the SQL made more plain.

require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once "Archive/Tar.php";
require_once "CouchDB_MRI_Importer.php";

//Configuration variables for this script, possibly installation dependent.
//$dataDir = "dataDump" . date("dMy");
$dumpName       = "dataDump" . date("dMy"); // label for dump
$config         = NDB_Config::singleton();
$paths          = $config->getSetting('paths');
$dataDir        = $paths['base'] . "tools/$dumpName/"; //temporary working directory
$destinationDir = $paths['base'] . "htdocs/dataDumps"; //temporary working directory

/**
 * Caching to discISAM 1.0
*/
//$cacheMethod = PHPExcel_CachedObjectStorageFactory:: cache_to_discISAM;
//$cacheSettings = array( 'dir'  => '/tmp' // If you have a large file you can cache it optional
//                      );
//PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);

$cacheMethod = PHPExcel_CachedObjectStorageFactory::cache_to_sqlite3;
if (PHPExcel_Settings::setCacheStorageMethod($cacheMethod)) {
    echo date('H:i:s') , " Enable Cell Caching using " , $cacheMethod , " method" , EOL;
} else {
    echo date('H:i:s') , " Unable to set Cell Caching using " , $cacheMethod , " method, reverting to memory" , EOL;
}

/*
* Prepare output/tmp directories, if needed.
*/
//Create
if (!file_exists($dataDir)) {
    mkdir($dataDir);
}
//Create
if (!file_exists($destinationDir)) {
        mkdir($destinationDir);
}

//Delete all previous files.
$d = dir($dataDir);
while($entry = $d->read()) {
    if ($entry!= "." && $entry!= "..") {
        unlink($dataDir . "/" . $entry);
    }
}
$d->close();

//Substitute words for numbers in Subproject data field
function MapSubprojectID(&$results)
{
    $projectID        = null;
    $subprojectLookup = Utility::getSubprojectList($projectID);

    for ($i = 0; $i < count($results); $i++) {
        $results[$i]["SubprojectID"] =
                $subprojectLookup[$results[$i]["SubprojectID"]];
    }
    return $results;
}
/*
* Start with all the instrument tables
*/
//Get the names of all instrument tables
$query = "select * from test_names order by Test_name";
//$query = "select * from test_names where Test_name like 'a%' order by Test_name";  //for rapid testing
$instruments = $DB->pselect($query, array());

foreach ($instruments as $instrument) {
    //Query to pull the data from the DB
    $Test_name = $instrument['Test_name'];
    if ($Test_name == 'prefrontal_task') {
        $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, 'See validity_of_data field' as Validity, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.Entity_type != 'Scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
    } else if ($Test_name == 'radiology_review') {
        $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, f.Validity, 'Site review:', i.*, 'Final Review:', COALESCE(fr.Review_Done, 0) as Review_Done, fr.Final_Review_Results, fr.Final_Exclusionary, fr.Final_Incidental_Findings, fre.full_name as Final_Examiner_Name, fr.Final_Review_Results2, fre2.full_name as Final_Examiner2_Name, fr.Final_Exclusionary2, COALESCE(fr.Review_Done2, 0) as Review_Done2, fr.Final_Incidental_Findings2, fr.Finalized from candidate c, session s, flag f, $Test_name i left join final_radiological_review fr ON (fr.CommentID=i.CommentID) left outer join examiners e on (i.Examiner = e.examinerID) left join examiners fre ON (fr.Final_Examiner=fre.examinerID) left join examiners fre2 ON (fre2.examinerID=fr.Final_Examiner2) where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.Entity_type != 'Scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
    } else {
        if (is_file("../project/instruments/NDB_BVL_Instrument_$Test_name.class.inc")) {
            $instrument =& NDB_BVL_Instrument::factory($Test_name, '', false);
            if ($instrument->ValidityEnabled == true) {
                $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, f.Validity, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.Entity_type != 'Scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
            } else {
                $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.Entity_type != 'Scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
            }
        } else {
            $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, f.Validity, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.Entity_type != 'Scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
        }
    }
    $instrument_table = $DB->pselect($query, array());
    MapSubprojectID($instrument_table);
    writeExcel($Test_name, $instrument_table, $dataDir);

} //end foreach instrument

/*
* Candidate Information query
*/
$Test_name = "candidate_info";
//this query is a but clunky, but it gets rid of all the crap that would otherwise appear.
$query   = "select distinct c.PSCID, c.CandID, c.Sex, c.DoB, s.SubprojectID from candidate c, session s where c.CandID = s.CandID and c.Active='Y' and s.CenterID <> 1 and s.CenterID in (select CenterID from psc where Study_site='Y') order by c.PSCID";
$results = $DB->pselect($query, array());

MapSubprojectID($results);
writeExcel($Test_name, $results, $dataDir);

/*
* Data Dictionary construction
* This relies on the quickform_parser and data_dictionary_builder having being recently run
*/
$Test_name  = "DataDictionary";
$query      = "select Name, Type, Description, SourceField, SourceFrom from parameter_type where SourceField is not null order by SourceFrom";
$dictionary = $DB->pselect($query, array());
writeExcel($Test_name, $dictionary, $dataDir);

//MRI data construction
//Using CouchDBMRIImporter since same data is imported to DQT.
$Test_name         = "MRI_Data";
$mriData           = new CouchDBMRIImporter();
$scanTypes         = $mriData->getScanTypes();
$candidateData     = $mriData->getCandidateData($scanTypes);
$mriDataDictionary = $mriData->getDataDictionary($scanTypes);

//add all dictionary names as excel column headings
foreach($mriDataDictionary as $dicKey=>$dicVal)
{
    //if column not already present
    if (!array_key_exists($dicKey, $candidateData[0])) {
        $candidateData[0][$dicKey] = null;
    }
}

writeExcel($Test_name, $candidateData, $dataDir);

// Clean up
// tar and gzip the product
$tarFile = $dumpName . ".tgz"; // produced dump file name and extension
$tar     = new Archive_Tar($tarFile, "gz");
$tar->add("./$dumpName/")
or die("Could not add files!");

// mv (or as php calls it, 'rename') to a web-accessible pickup directory
rename("./$tarFile", "$destinationDir/$tarFile"); //change, if not a subdirectory

// rm left-over junk, from all that excel file generation.
delTree($dataDir);

// Announce completion
echo "$tarFile ready in $destinationDir\n";


/**
 * Converts the column number into the excel column name in letters
 *
 * @param int $num The column number
 *
 * @return string $letter The excel column name in letters
 **/
function getNameFromNumber($num)
{
    $numeric = $num % 26;
    $letter  = chr(65 + $numeric);
    $num2    = intval($num / 26);
    if ($num2 > 0) {
        return getNameFromNumber($num2 - 1) . $letter;
    } else {
        return $letter;
    }
}


/**
 * Takes a 2D array and saves it as a nicely formatted Excel spreadsheet.
 * Metadata columns are preserved, multiple worksheets are used, when appropriate and headers are maintained.
 *
 * @param string       $Test_name        File name to be used.
 * @param unknown_type $instrument_table A 2D array of the data to be presented in Excel format
 * @param unknown_type $dataDir          The  output directory.
 */
function writeExcel($Test_name, $instrument_table, $dataDir)
{
    //    $metaCols = array("PSCID", "CandID", "Visit_label", "Examiner_name", "Data_entry_completion_status", "Date_taken"); //metadata columns
    $junkCols = array(
        "CommentID",
        "UserID",
        "Examiner",
        "Testdate",
        "Data_entry_completion_status",
    ); //columns to be removed

    // create empty Excel file to fill up
    // Create a new PHPExcel Object
    $ExcelApplication = new PHPExcel();
    $ExcelWorkSheet   = $ExcelApplication->getSheet(0);

    //ensure non-empty result set
    if (count($instrument_table) ==0) { //empty result set
        echo "Empty: $Test_name  [Contains no data]\n";
        return; // move on to the next instrument //nothing to save
    }

    //remove any undesired columns that came in from the DB query.
    for ($i = 0; $i < count($instrument_table); $i++) {
        $instrument_table[$i] = array_diff_key($instrument_table[$i], array_flip($junkCols));
    }

    // add all header rows
    $headers = array_keys($instrument_table[0]);
    $ExcelWorkSheet->fromArray($headers, ' ', 'A1');

    // Bold Cyan Column headers
    $numCol = count($instrument_table[0]) - 1;
    $header = 'a1:' . getNameFromNumber($numCol) . '1';
    $ExcelWorkSheet->getStyle($header)->getFill()->setFillType(
        \PHPExcel_Style_Fill::FILL_SOLID
    )->getStartColor()->setARGB('00e0ffff');

    $hor_cen = \PHPExcel_Style_Alignment::HORIZONTAL_CENTER;
    $style   = array(
        'font'      => array('bold' => true),
        'alignment' => array('horizontal' => $hor_cen),
    );
    $ExcelWorkSheet->getStyle($header)->applyFromArray($style);

    // add data to worksheet
    $ExcelWorkSheet->fromArray($instrument_table, ' ', 'A2');

    // Redimension columns to max size of data
    for ($col = 0; $col <= $numCol; $col++) {
        $ExcelWorkSheet->getColumnDimension(
            getNameFromNumber($col)
        )->setAutoSize(true);
    }

    // save file to disk
    print "Creating " . $Test_name . ".xls\n";
    $writer = PHPExcel_IOFactory::createWriter($ExcelApplication, 'Excel2007');
    $writer->save("$dataDir/$Test_name.xls");

    unset($ExcelApplication);
} //end function writeExcel

/**
 * PHP equivalent of `rm -rf`
 * This function stolen from PHP manual
 *
 * @param string dir Directory to be recursively deleted, ending with a slash
 */
function delTree($dir)
{
    $files = glob($dir . '*', GLOB_MARK);
    foreach ( $files as $file ){
        if (substr($file, -1) == '/' ) {
            delTree($file);
        } else {
            unlink($file);
        }
    }
    if (is_dir($dir)) { rmdir($dir);
    }
}


