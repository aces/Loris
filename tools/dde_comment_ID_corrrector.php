<?php

require_once "generic_includes.php";
require_once "Utility.class.inc";

// check that the $test_name is a valid instrument
$instruments = Utility::getAllInstruments();
$result = array();

//make sure that the instrument is dde-enable (in the config.xml)
// Get the list of DDE instruments
$config =& NDB_Config::singleton();
$ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
foreach ($instruments as $instrument) {

    $query = "SELECT f.CommentID,s.UserID,s.ID FROM flag f
        JOIN $instrument t ON (t.CommentID = f.CommentID) 
        JOIN session s ON (s.ID = f.SessionID) 
        WHERE f.commentid NOT LIKE '%DDE%'";
    $result = $DB->pselect($query, array());

    if(PEAR::isError($result)) {
        print "Cannot pull instrument table data ".$result->getMessage()."<br>\n";
        die();
    }


    if(in_array($instrument, $ddeInstruments)) {
        //for each row of the given table , concat DDE to the comment id
        foreach ($result as $record) {
            // Concat DDE to the comment_d
            $comment_id = $record['CommentID'];
            $userid = $record['UserID'];
            $session_id = $record['ID'];
            $pattern = '/^DDE_/';
            $dde_commentid = "DDE_" . $comment_id;



            //if the comment-id doesn't exist in the flag table insert it
            if (($DB->pselectOne("SELECT COUNT(*) FROM flag WHERE CommentID =:cf",array('cf'=>$dde_commentid)))==0) {

                $success=$DB->insert('flag',array("CommentID" => $dde_commentid,
                            'Test_name'=>$instrument,
                            'UserID'=>$userid,
                            'SessionID'=>$session_id,
                            'Testdate'=>null));
                //create the dde for instrument
                if (PEAR::isError($success)) {
                    print "DB Error: ".$success->getMessage();
                }
            }

            //if the comment-id doesn't exist in the instrument table insert it
            if (($DB->pselectOne("SELECT COUNT(*) FROM $instrument WHERE CommentID =:ci",array('ci'=>$dde_commentid)))==0) {

                $success = $DB->insert($instrument, array('CommentID'=>$dde_commentid));
                if (PEAR::isError($success)) {
                    print "DB Error: ".$success->getMessage();
                }
            }
        }
    }
}
?>
