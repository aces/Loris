<?php
#!/data/web/neurodb/software/bin/php
/**
 * this script creates an excel file based on the input, which can be a query or a php file returning an array
 * requirements: 
 * - a >>CORRECT<< SQL file with a SELECT at the beginning of the line, located in the 'lists' dir
 * - a php file that contains a function main() which returns an array[int <row>][string <col>][<field value>], located in the 'custom' dir
 * @version $Id: report2excel.php,v 1.2 2006/04/07 12:58:41 jharlap Exp $
 * @package main
 */
set_include_path(get_include_path().":../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../project/config.xml");

/**
* DB Connection
*/
$DB =& Database::singleton();
if(PEAR::isError($DB)) {
    fwrite(STDERR, "Could not connect to database: ".$DB->getMessage());
    return false;
}
$db =& $DB;

/**
* arguments
*/
if (empty($argv[1]) || $argv[1]=='help' || !in_array($argv[1], array('query','php')) || !is_file($argv[2]) || !is_dir($argv[3])) {
    fwrite(STDERR, "Usage: \n\n");
    fwrite(STDERR, "report2excel.php help - displays this msg\n");
    fwrite(STDERR, "report2excel.php <query/php> <input file> <path to output dir>\n");
    fwrite(STDERR, "input file - relative path to file w/ SQL or an array\n");
    return false;
}

if (!is_file($argv[2])) {
    fwrite (STDERR, "Error, invalid file");
	return false;
}

// get arguments
$action=$argv[1];
$filename = $argv[2];
$pathToDir = $argv[3];


if ($action=='query') {
    
    // parse the file
    $query = importFile($filename);
    if (PEAR::isError($query)) {
    	fwrite(STDERR, "Error:\n".$query->getMessage()."\n");
        return false;
    }
    
    // get records from the database
    $result=array();
    $db->select($query, $result);
    if (PEAR::isError($result)) {
        fwrite(STDERR, "DB Error:\n$query\n".$result->getMessage()."\n");
        return false;
    }
    
} else {
    
    include_once($filename);
    // check if the function main exists
    if (!function_exists("main")) {
    	fwrite(STDERR,"Error, included file [$filename] does not have the function named main()\n");
    	return false;
    }
    // get the array from the included file
    $result = main();
    if (PEAR::isError($result)) {
        fwrite(STDERR, "Error:\n".$result->getMessage()."\n");
        return false;
    }
    // if the main function of the included does not return an array
    if (!is_array($result)) {
    	print ("Error, the included file [$filename] main() does not return an array\n");
        return false;
    }
}

if (count($result)==0) {
    fwrite(STDERR, "Error, no records returned!\n");
    return false;
}

// extract the file name from the relative path
$filename = substr($filename,strrpos($filename,'/')+1);
$filename = substr($filename,0,strpos($filename,'.'));
// create a title
$title = str_replace('_',' ',$filename);

/**
* Intitialize excel objects and open the files
*/
require_once("Spreadsheet/Excel/Writer.php");
// new worksheet
$workbookSummary = new Spreadsheet_Excel_Writer($pathToDir."/".$filename.".xls");
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
foreach ($result as $currentRecord) {
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
}

// close the excel file
$workbookSummary->close();

function isnull($value, $default) 
{
    if(is_null($value)) return $default;
    return $value;
}


/**
* import SQL statement from an external file
* @param string name of the file, path relative to this file
* @return string SQL statement w/ \n line breaks to match the files lines
* @throws PEAR::Error
*/
function importFile($filename) 
{
    $fp=fopen($filename, "r");
    if (!$fp) {
        return PEAR::raiseError("Error, failed to open the file [$filename]");
    }

    // import the file contents
    $startimport=0;
    while(!feof($fp)) {
        
        $tempstring = fgets($fp);
        
        if (strpos(strtoupper($tempstring),"SELECT")!==false && strpos($tempstring,"SELECT")==0) {
            $startimport=1;
        }

        if ($startimport==1) {
            $string .= $tempstring."\n";
        }
    }

    fclose($fp);
    
    if (empty($string)) {
    	return PEAR::raiseError("Error, improperly formatted SQL, SELECT has to be at the beginning of a line!\nOnly SELECT statements can be run with Database::select().\n");
    }
    
    // strip any special characters & remove ';'
    $string = str_replace(";","",$string);

    return $string; 
}
?>