<?php
/* This is used by the stats page to get the list of scorable columns for an
* instrument via AJAX. It's used so that ScatterPlot-SVG.php can be run for
* any scorable in an instrument, dynamically */
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

require_once "Utility.class.inc";

print "helllo";
//gets the given visit_label and returns the instrument

/**
 * 1) Get the input...
 *  - if all...then run the entire pipeline...
 *  - if all...then run the entire pipeline...
 * 2) 
 */




/////////////////////////////////////////////////////////////
/////////initialization///////////////////////////////////////
/////////////////////////////////////////////////////////////

$db=& Database::singleton();
$config =& NDB_Config::singleton();


$paths = $config->getSetting('paths');
$mri_code_path = $paths['MRICodePath'];
$mri_incoming_path = $paths['IncomingPath'];
$mri_header_executer = $mri_code_path . "customize_headers.pl";
$environment_script = $mri_code_path . "environment";
$mri_log_file = $paths['data'] . "logs/tarchive_files.txt";
$bach_upload_script  = $mri_code_path . "batch_uploads_tarchive";

$action = $_REQUEST['action'];
$id = $_REQUEST['id'];

list($upload_id, $candid) =
    split("_", $id);



/////////////////////////////////////////////////////////////
////////set the environment variables////////////////////
/////////////////////////////////////////////////////////////

$path = $mri_code_path. ":". getenv('PATH');
putenv("PATH=$path");
print "path is $path";
$path = $mri_code_path. "uploadNeuroDB:". getenv('PERL5LIB');
putenv("PERL5LIB=$path");
putenv("TMPDIR=/tmp");
putenv("HOME=/home/zia");
putenv("USER=ZIA");


$command = "cd $mri_code_path; /usr/bin/perl $bach_upload_script < $mri_log_file";

print "I am here";
if ($action=='all'){
   
    $count = $db->pselectOne("SELECT COUNT(f.FileID) FROM mri_upload mu
                              JOIN files f ON (f.sessionID = mu.SessionID)
                              JOIN session s ON (s.ID = f.sessionID)
                               WHERE mu.UploadID =  :uid", array('UploadID'=>$upload_id));
    
    ////if the minc is not inserted into the files table///
    ////Run the minc-insertion pipeline
    if ($count==0){
        print "command is $command";
        $output = shell_exec($command);
        $db->update('mri_upload',array('MincInserted'=>1),array('UploadID'=>$upload_id));
    }
    else{
        print "It's already inserted";
    }
    print $output;
    
    ////////////////////////////////////////////////////////////////
    ///check to make sure if the minc is inserted ////////////////////
    ////and if so then set the MincInserted to True//////////////
    /////////////////////////////////////////////////////////
    /**
     * **1) get the content of the mri_log_file/////
     * 2) And for each of the file-name , make sure to see if it's in the files-table
     * 3) if yes,set the minc-inserted to true...
     */
    
    
    ///once completed set the mincinserted to true
    
    
    
    
}

?>
