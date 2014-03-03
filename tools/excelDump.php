<?php

// Dumps the database instruments and some accompanying information into Excel formatted files.
// For some large tables, this script requires *a lot* of memory.  Modify the `cli` php.ini for > 256M

// Operation:
// Passes the results from one or more SQL queries to the writeExcel function.

// Future improvements:
// The SQL to pull the instrument data rely on some nastry text matching (ie. where c.PSCID not like '1%').  Ideally, this junk could be purged directly from the DB, and the SQL made more plain.

require_once "generic_includes.php";
require_once 'Spreadsheet/Excel/Writer.php';
require_once "Archive/Tar.php";

//Configuration variables for this script, possibly installation dependent.
//$dataDir = "dataDump" . date("dMy");
$dumpName = "dataDump" . date("dMy"); // label for dump
$dataDir = $config['paths']['base'] . "tools/$dumpName/"; //temporary working directory
$destinationDir = $config['paths']['base'] . "htdocs/excel_dumps"; //temporary working directory

/*
* Prepare output directory, if needed.
*/
//Create
if(!file_exists($dataDir)) {
	mkdir($dataDir);
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
function MapSubprojectID(&$results) {
    global $config;
    $subprojectLookup = array();
    // Look it up from the config file, because it's not stored
    // in the database
    foreach($config["study"]["subprojects"]["subproject"] as $subproject) {
	    $subprojectLookup[$subproject["id"]] =  $subproject["title"];
    }

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
$DB->select($query, $instruments);
if (PEAR::isError($instruments)) {
	PEAR::raiseError("Couldn't get instruments. " . $instruments->getMessage());
}

foreach ($instruments as $instrument) {
	//Query to pull the data from the DB
	$Test_name = $instrument['Test_name'];
    if($Test_name == 'prefrontal_task') {
	    $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, 'See validity_of_data field' as Validity, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.PSCID != 'scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
    } else if ($Test_name == 'radiology_review') {
        $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, f.Validity, 'Site review:', i.*, 'Final Review:', COALESCE(fr.Review_Done, 0) as Review_Done, fr.Final_Review_Results, fr.Final_Exclusionary, fr.Final_Incidental_Findings, fre.full_name as Final_Examiner_Name, fr.Final_Review_Results2, fre2.full_name as Final_Examiner2_Name, fr.Final_Exclusionary2, COALESCE(fr.Review_Done2, 0) as Review_Done2, fr.Final_Incidental_Findings2, fr.Finalized from candidate c, session s, flag f, $Test_name i left join final_radiological_review fr ON (fr.CommentID=i.CommentID) left outer join examiners e on (i.Examiner = e.examinerID) left join examiners fre ON (fr.Final_Examiner=fre.examinerID) left join examiners fre2 ON (fre2.examinerID=fr.Final_Examiner2) where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.PSCID != 'scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
    } else {
        if (is_file("../project/instruments/NDB_BVL_Instrument_$Test_name.class.inc")) {
            $instrument =& NDB_BVL_Instrument::factory($Test_name, '', false);
            if($instrument->ValidityEnabled == true) {
	            $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, f.Validity, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.PSCID != 'scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
            } else {
	            $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.PSCID != 'scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
            }
        } else {
	    $query = "select c.PSCID, c.CandID, s.SubprojectID, s.Visit_label, s.Submitted, s.Current_stage, s.Screening, s.Visit, f.Administration, e.full_name as Examiner_name, f.Data_entry, f.Validity, i.* from candidate c, session s, flag f, $Test_name i left outer join examiners e on i.Examiner = e.examinerID where c.PSCID not like 'dcc%' and c.PSCID not like '0%' and c.PSCID not like '1%' and c.PSCID not like '2%' and c.PSCID != 'scanner' and i.CommentID not like 'DDE%' and c.CandID = s.CandID and s.ID = f.sessionID and f.CommentID = i.CommentID AND c.Active='Y' AND s.Active='Y' order by s.Visit_label, c.PSCID";
        }
    }
	$DB->select($query, $instrument_table);
	if(PEAR::isError($instrument_table)) {
		print "Cannot pull instrument table data ".$instrument_table->getMessage()."<br>\n";
		die();
	}
    MapSubprojectID($instrument_table);
	writeExcel($Test_name, $instrument_table, $dataDir);

} //end foreach instrument


/*
* Candidate Information query
*/
$Test_name = "candidate_info";
//this query is a but clunky, but it gets rid of all the crap that would otherwise appear.
$query = "select distinct c.PSCID, c.CandID, c.Gender, c.DoB, s.SubprojectID from candidate c, session s where c.CandID = s.CandID and substring(c.PSCID, 1, 3) in ('PHI', 'STL', 'SEA', 'UNC') and c.Active='Y' order by c.PSCID";
$DB->select($query, $results);
if (PEAR::isError($results)) {
	PEAR::raiseError("Couldn't get candidate info. " . $results->getMessage());
}


MapSubprojectID(&$results);
writeExcel($Test_name, $results, $dataDir);

/*
* Data Dictionary construction
* This relies on the quickform_parser and data_dictionary_builder having being recently run
*/
$Test_name = "DataDictionary";
$query = "select Name, Type, Description, SourceField, SourceFrom from parameter_type where SourceField is not null order by SourceFrom";
$DB->select($query, $dictionary);
if (PEAR::isError($dictionary)) {
	PEAR::raiseError("Could not generate data dictionary. " . $dictionary->getMessage());
}
writeExcel($Test_name, $dictionary, $dataDir);

// Clean up
// tar and gzip the product
$tarFile = $dumpName . ".tgz"; // produced dump file name and extension
$tar = new Archive_Tar($tarFile, "gz");
$tar->add("./$dumpName/")
or die ("Could not add files!");

// mv (or as php calls it, 'rename') to a web-accessible pickup directory
rename("./$tarFile", "$destinationDir/$tarFile"); //change, if not a subdirectory

// rm left-over junk, from all that excel file generation.
delTree($dataDir);

// Announce completion
echo "$tarFile ready in $destinationDir\n";




/**
 * Takes a 2D array and saves it as a nicely formatted Excel spreadsheet.
 * Metadata columns are preserved, multiple worksheets are used, when appropriate and headers are maintained.
 *
 * @param string	$Test_name	File name to be used.
 * @param unknown_type $instrument_table 	A 2D array of the data to be presented in Excel format
 * @param unknown_type $dataDir The  output directory.
 */
function writeExcel ($Test_name, $instrument_table, $dataDir) {
	//Modifiable parameters
	$maxColsPerWorksheet = 250;  //leave a little bit of extra room
	//    $metaCols = array("PSCID", "CandID", "Visit_label", "Examiner_name", "Data_entry_completion_status", "Date_taken"); //metadata columns
	$junkCols = array("CommentID", "UserID", "Examiner", "Testdate", "Data_entry_completion_status"); //columns to be removed

	// create empty Excel file to fill up
	$workbook = new Spreadsheet_Excel_Writer("$dataDir/$Test_name.xls");

	//Excel has a 256 column limit per worksheet.  If our instrument table/array is greater, split it into the needed number of worksheets
	for ($w = 1; $w <= ceil(count($instrument_table[0]) / $maxColsPerWorksheet); $w++) {
		$worksheets[] =& $workbook->addWorkSheet("Sheet{$w}");
	}

	//ensure non-empty result set
	if (count($instrument_table) ==0) { //empty result set
		echo "Empty: $Test_name  [Contains no data]\n";
		return; // move on to the next instrument //nothing to save
	}

	//remove any undesired columns that came in from the DB query.
	for ($i = 0; $i < count($instrument_table); $i++) {
		$instrument_table[$i] = array_diff_key($instrument_table[$i], array_flip($junkCols));
	}

	//Use Excel 97/2000 Binary File Format thereby allowing cells to contain more than 255 characters.
	$workbook->setVersion(8); // Use Excel97/2000 Format.

	// Formatting for the header row; bold and frozen
	$headerFormat =& $workbook->addFormat();
	$headerFormat->setBold();
	$headerFormat->setAlign('center');

	// Formatting:  Freeze only the first worksheet, at the metaCols and header intersection.
	//	$worksheet =& $worksheets[0];
	//	$worksheet->freezePanes(array(1, count($metaCols), 1, count($metaCols)));  //change after # of cols are decided.

	// add all header rows
	$headers = array_keys($instrument_table[0]);
	foreach($headers as $headerNum=>$header) {
		//figure out which sheet number the header belongs on
		$worksheetNum = intval($headerNum  / $maxColsPerWorksheet);
		$worksheet =& $worksheets[$worksheetNum];
		//figure out the column (only tricky if there is more than one worksheet.
		$col = $headerNum % $maxColsPerWorksheet;
		$worksheet->write(0, $col, $header, $headerFormat);
	}

	// add data to worksheet
	$rowCount=1;  //start right after the header
	foreach ($instrument_table as $row) {
		$dataRow = array_values($row);
		foreach($dataRow as $valueNum=>$value){
			//figure out which sheet number the header belongs on
			$worksheetNum = intval($valueNum  / $maxColsPerWorksheet);
			$worksheet =& $worksheets[$worksheetNum];
			//figure out the column (only tricky if there is more than one worksheet)
			$col = $valueNum % $maxColsPerWorksheet;
			//Replace NULLs with . (dots)
			if (is_null($value)) $value = ".";
			$worksheet->write($rowCount, $col, $value);
		}
		$rowCount++;
	}

	// save file to disk
	if ($workbook->close() === true) {
		unset($worksheets); // need to unset for the next instrument
		echo "Success: $Test_name\n";
	} else {
		echo"ERROR: Could not save $Test_name spreadsheet.\n";
	}
} //end function writeExcel

/**
 * PHP equivalent of `rm -rf`
 * This function stolen from PHP manual
 * @param string dir Directory to be recursively deleted, ending with a slash
 *
 */
function delTree($dir) {
	$files = glob( $dir . '*', GLOB_MARK );
	foreach( $files as $file ){
		if( substr( $file, -1 ) == '/' ) {
			delTree( $file );
		} else {
			unlink( $file );
		}
	}
	if (is_dir($dir)) rmdir( $dir );
}

?>
