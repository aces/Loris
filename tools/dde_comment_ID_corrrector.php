<?php

require_once "generic_includes.php";
require_once "Utility.class.inc";

// check that the $test_name is a valid instrument
$instruments = Utility::getAllInstruments();
$result = array();

foreach ($instruments as $instrument) {

	$query = "SELECT f.CommentID FROM flag f JOIN $instrument t on (t.CommentID = f.CommentID) WHERE f.commentid not like '%DDE%'";
	$result = $DB->pselect($query, array());

	if(PEAR::isError($result)) {
		print "Cannot pull instrument table data ".$result->getMessage()."<br>\n";
		die();
	}
	//for each row of the given table , concat DDE to the comment id
	foreach ($result as $record) {
		// Concat DDE to the comment_d
		$comment_id = $record['CommentID'];
		$pattern = '/^DDE_/';
		$dde_commentid = "DDE_" . $comment_id;

		//Doesn't exist
		if (($DB->pselectOne("SELECT COUNT(*) from flag where CommentID =:cf",array('cf'=>$dde_commentid)))==0){
			print "hello";
			$success=$DB->insert('flag',array("CommentID" => $dde_commentid)); //create the dde for instrument
			if (PEAR::isError($success)) {
				print "DB Error: ".$success->getMessage();
			}
		}

		if (($DB->pselectOne("SELECT COUNT(*) from $instrument where CommentID =:ci",array('ci'=>$dde_commentid)))==0){
			$success=$DB->insert($instrument,array("CommentID" => $dde_commentid)); //create the dde for instrument
			if (PEAR::isError($success)) {
				print "DB Error: ".$success->getMessage();
			}
		}

	}
}
?>
