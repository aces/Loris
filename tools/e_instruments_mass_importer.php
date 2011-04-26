#!/data/web/neurodb/software/bin/php
<?php

/**
 * @package behavioural
 */

/*
take arguments:  instrument type, list of files
prepare list of files
foreach file
    set up fake instrument environment
    embed insturment object
    run import
    destroy instrument object
print log as csv?
*/

//Make sure the test name argument is present
if(count($argv)!=2){
    echo "Usage: e_instruments_mass_importer.php <name_of_instrument> <list_of_files>.\n\n";
    return false;
}

//Check the test name
$validTestNames=array("cantab","carey_electronic","cbcl","cvlt2","cvltc","das","disc","dps4","psi_electronic","wj3");
if(!in_array($argv[1],$validTestNames)){
    echo "\nInvalid Test name\n\n";
    return false;
}
$testName=$argv[1];
$instrumentClassName="NDB_BVL_Instrument_".$argv[1];

//Ensure php version compatability
//taken from php.net notes
if (version_compare(phpversion(),'4.3.0','<')) 
{
    define('STDIN',fopen("php://stdin","r"));
    register_shutdown_function( create_function( '' , 'fclose(STDIN);
    fclose(STDOUT); fclose(STDERR); return true;' ) );
}


// PEAR::Config
require_once "Config.php";

// define which configuration file we're using for this installation
$configFile = "../project/config.xml";

// load the configuration data into a global variable $config
$configObj = new Config;
$root =& $configObj->parseConfig($configFile, "XML");
if(PEAR::isError($root)) {
    die("Config error: ".$root->getMessage());
}
$configObj =& $root->searchPath(array('config'));
$config =& $configObj->toArray();
$config = $config['config'];
unset($configObj, $root);

// require all relevant OO class libraries
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";
require_once "../php/libraries/Candidate.class.inc";
require_once "../php/libraries/NDB_BVL_Instrument.class.inc";
require_once "../php/libraries/TimePoint.class.inc";
require_once "../php/libraries/Utility.class.inc";
require_once "../php/libraries/File_Upload.class.inc";

require_once "../project/instruments/".$instrumentClassName.".class.inc";

/*
 * new DB Object
 */
$DB =& Database::singleton($config['database']['database'], $config['database']['username'], $config['database']['password'], $config['database']['host']);
if(PEAR::isError($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
}


//Get the list of files from STDIN
while($file=fgets(STDIN)){
    $files[]=$file;
}

//Process the files
foreach($files AS $file){
    $file=trim($file);
    $filename=basename($file);

    preg_match("/([0-9]{6})([vViI][1-9])/", $filename, $matches);
    $candID=$matches[1];
    $visitLabel=$matches[2];


    //$candID=substr($filename,8,6);
    //$visitLabel=substr($filename,0,2);
    //Trim the filename for using in the screen outputed log
    $shortFilename=basename($file);

    if(!file_exists($file)) {
        $log.="$file: Does not exist\n";
        echo "$shortFilename:  Does not exist.\n";
        continue;
    }

    //Instantiate a new File Upload object
    $fileUpload=new File_Upload;
    $fileUpload->moveOrCopy="copy";
    $fileUpload->isCLImport=true;
    $fileUpload->setOverwriteMode("overwrite");
    
    //Instantiate test object
    $testObjectName="NDB_BVL_Instrument_".$testName;
    $testObject=new $testObjectName;
    
    
    
    //Get SessionID
    $GLOBALS['DB']->select("SELECT session.ID, candidate.PSCID FROM session LEFT JOIN candidate USING (CandID) WHERE candidate.CandID='$candID' AND session.Visit_label='$visitLabel'", $sresults);
    if(PEAR::isError($sresults)) {
        return "Could not access session table";
    }
    if(empty($sresults)){
        $log.="$file: Not a recognized ID pair\n";
        echo "$shortFilename:  Not a recognized ID pair, couldn't find a session with the ids CandID='$candID' AND Visit_label='$visitLabel'.\n";
        continue;
    }
    $sessionID=$sresults[0]['ID'];
    $PSCID=$sresults[0]['PSCID'];
    
    //If this is a carey pop the file open to see which carey it is.
    if($testName=="carey_electronic"){
        $fp=fopen($file, "r");
        $data=fread($fp,filesize($file));
        fclose($fp);
        $lines=explode("\n",$data);
        $dbTestName=$testObject->getCareyTestType($lines[0]);
    } else {
        //For PSI strip the _electronic part from the database query name
        $dbTestName=str_replace("_electronic","",$testName);  
    }
    //Get CommentID
    
    $GLOBALS['DB']->select("SELECT CommentID FROM flag WHERE SessionID='$sessionID' AND Test_name='$dbTestName'", $fresults);
    if(PEAR::isError($fresults)) {
        return "Could not access flag table";
    }
    
    if(empty($fresults)){
        $log.="$file: Couldn't retreive comment id.\n";
        echo "$shortFilename: Couldn't retreive comment id using SessionID='$sessionID' AND Test_name='$dbTestName'\n";
        continue;
    }
    $commentID=$fresults[0]['CommentID'];
    
    //Tell File_Upload what file handlers to use.
    $fileType=registerFile($fileUpload, $file, $testName, $testObject);
    if($fileType=="unknown"){
        $log.="$file:  Unknown file type\n";
        echo "$shortFilename:  Unknown file type\n";
        continue;
    }
    
    //Set the target directory that you want files moved into once they are validated and processed.
    $fileUpload->setBaseUploadDirectory("../htdocs/uploads");
    
    //Set the prefix to prepend to the filenames
    $fileUpload->setFilenamePrefix("");
    //$fileUpload->setFilenamePrefix($visitLabel."-".$testName."-");
    
    //set the the IDs to the handler functions.
    $timepoint =& TimePoint::singleton($sessionID);
    $fileUpload->setHandlerArgs(array("CommentID"=>$commentID,
                                "candID"=>$candID,
                                "PSCID"=>$PSCID,
                                "visitNo"=>$timepoint->getVisitNo(),
                                "Visit_label"=>$timepoint->getVisitLabel(),
                                "visitLabel"=>$timepoint->getVisitLabel(),
                                "username"=>"mass_importer")
                         );
    
    //call File_Upload::processFiles() which loops through the files and 
    //proccesses them (including verify, move, and import steps)
    $fileUpload->processFiles();
    
    //echo error messages from the import
    if(!empty($fileUpload->errorLog)){
        foreach($fileUpload->errorLog as $errorArray){
            foreach($errorArray AS $error){
                $log.="$file: $error\n";
                echo "$shortFilename: $error\n";
            }
        }
    } else {
        $log.="$file: Imported Succesfully\n";
        echo "$shortFilename: Imported Succesfully\n";
    }
    unset($fileUpload);
    unset($testObject);
}

//Write a log file
$time=time();
$logname="import-$testName-$time.log";
$fp=fopen($logname,"w");
fwrite($fp,$log);
fclose($fp);
chmod($logname,0666);

//Print the final summary to screeen.
$log=str_replace("/data/nihpd/nihpd1/uploads/behavioural/unison_root/data/","",$log);
echo "\n\nSUMMARY\n".$log."\n\n";


/**
* registerFile determines the file type and registers it with the test object
*
* @param     object  $fileUpload  A reference to the file upload object
* @param     string  $fileName    The name of the current file.
* @param     string  $testName    The name of the current test.
* @param     object  $testObject  A reference to the test object.
*
* @return    string    returns file type, or unkown if it can't match it.
*/
function registerFile(&$fileUpload, $fileName, $testName, &$testObject){
    switch($testName){
        case "cantab":
            if(substr(strtolower($fileName), -4)==".htm"){
                $fileUpload->setFileHandler("cantabFile", $testObject);
                $fileUpload->addCLFile($fileName,"cantabFile");
                return "cantabFile";
            } 
        break;
        
        case "carey_electronic":
            if(strtolower(substr($fileName, -4))==".txt"){
                $fileUpload->setFileHandler("careyRawTxtFile", $testObject);
                $fileUpload->addCLFile($fileName,"careyRawTxtFile");
                return 'careyRawTxtFile';
            }
        break;
                
        case "cbcl":
            if(strpos($fileName, "_profexport")!==FALSE){
                $fileUpload->setFileHandler("cbclProfTxtFile", $testObject, array("import"=>"importProfFile"));
                $fileUpload->addCLFile($fileName,"cbclProfTxtFile");
                return "cbclProfTxtFile";
            } else if (strpos($fileName, "_rawexport")!==FALSE) {
                $fileUpload->setFileHandler("cbclRawTxtFile", $testObject, array("import"=>"importRawFile"));
                $fileUpload->addCLFile($fileName,"cbclRawTxtFile");
                return "cbclRawTxtFile";
            }
        break;
        
        case "cvlt2":
            if(strtolower(substr($fileName, -4))==".txt"){
                $fileUpload->setFileHandler("cvlt2File", $testObject);
                $fileUpload->addCLFile($fileName,"cvlt2File");
                return "cvlt2File";
            }
        break;
        
        case "cvltc":
        if(strtolower(substr($fileName, -4))==".dat"){
                $fileUpload->setFileHandler("cvltcFile", $testObject);
                $fileUpload->addCLFile($fileName,"cvltcFile");
                return "cvltcFile";
            }
        break;
        
        case "das":
            if(strtolower(substr($fileName, -4))==".txt"){
                $fileUpload->setFileHandler("das_uploadFile", $testObject);
                $fileUpload->addCLFile($fileName,"das_uploadFile");
                return "das_uploadFile";
            }
        break;
        
        case "dps4":
         if(substr(strtolower($fileName), -5)=="y.chr"){
                $fileUpload->setFileHandler("dps4yFile", $testObject, array("import"=>"importYFile"));
                $fileUpload->addCLFile($fileName,"dps4yFile");
                return "dps4yFile";
            } else if (substr(strtolower($fileName), -6)=="im.chr"){
                $fileUpload->setFileHandler("dps4imFile", $testObject, array("import"=>"importIMFile"));
                $fileUpload->addCLFile($fileName,"dps4imFile");
                return "dps4imFile";
            }
        break;
    
        case "disc":
            if(strtolower(substr($fileName,-5))=="y.rtf"){
                $fileUpload->setFileHandler("discCliYFile",$testObject);
                $fileUpload->addCLFile($fileName,"discCliYFile");
                return 'discCliYFile';
            } else if(substr($fileName,-4)==".rtf"){
                $fileUpload->setFileHandler("discCliFile",$testObject);
                $fileUpload->addCLFile($fileName,"discCliFile");
                return 'discCliFile';
            } else if(!strstr($fileName,".")){
                $fp=fopen($fileName, "r");
                $file=fread($fp,filesize($fileName));
                fclose($fp);
                $lines=explode("\n",$file);
                if(stristr($lines[1],"C-DISC DIAGNOSTIC REPORT (PARENT)")){
                    $fileUpload->setFileHandler("discDiagFile",$testObject);
                    $fileUpload->addCLFile($fileName,"discDiagFile");
                    return 'discDiagFile';
                } else if (stristr($lines[1],"C-DISC DIAGNOSTIC REPORT (YOUTH)")){
                    $fileUpload->setFileHandler("discDiagYFile",$testObject);
                    $fileUpload->addCLFile($fileName,"discDiagYFile");
                    return 'discDiagYFile';
                }
            }
        break;
        
        case "psi_electronic":
            if(strtolower(substr($fileName, -4))==".dat"){
                $fileUpload->setFileHandler("psiDatFile", $testObject);
                $fileUpload->addCLFile($fileName,"psiDatFile");
                return "psiDatFile";
            } else if (strtolower(substr($fileName, -4))==".rpt"){
                $fileUpload->setFileHandler("psiRptFile", $testObject);
                $fileUpload->addCLFile($fileName,"psiRptFile");
                return "psiRptFile";
            }
        break;
        
        case "wj3":
            if(substr(strtolower($fileName), -4)==".txt"){
                $fileUpload->setFileHandler("wj3File", $testObject);
                $fileUpload->addCLFile($fileName,"wj3File");
                return "wj3File";
            }
        break;
    }
    return "unknown";
}

?>
