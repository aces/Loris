<?php 
require_once "generic_includes.php";
require_once "PEAR.php";


//exec("perl cleanup.pl EARLI-DATA-AOSI-1328311043.csv >/tmp/cleanup_xyz");
$fixedLines = file("/tmp/PreventAD_CSF_05_13.csv");
$fields = array();
$thisField = array();
$table = 'LP'; //$argv[1];

$mappings = array(
		"Tau"=>"tau",
		"b-amyloid"=>"b_amyloid",
		"pTau"=>"ptau",
		);

$counter = 0;
$commentID = "";
$candID = "";
$PSCID = "";
$sessionID = "";
$visit = "";


for( $i = 0; $i < sizeof($fixedLines); $i++ )
{
	if ($i == 0)
	{
		$key = explode("\t", $fixedLines[$i]);

		for ($j = 0; $j < sizeof($key); $j++)
		{
			$field = $key[$j];
			$thisField[$field] = "";
		}
	}

	else
	{
		$fieldNum = 0;
		$data = explode("\t", $fixedLines[$i]);


		foreach ($thisField as $key=>$value)
		{
			if (preg_match("/^\"/", $data[$fieldNum]) && preg_match("/\"$/", $data[$fieldNum])) {
				$data[$fieldNum] = preg_replace("/\"/", "", $data[$fieldNum]);
			}

			if (preg_match("/'/", $data[$fieldNum])) {
				$data[$fieldNum] = preg_replace("/'/", "\'", $data[$fieldNum]);
			}

			$thisField[$key] = $data[$fieldNum];
			$fieldNum++;
		}

		foreach ($thisField as $key=>$value)
		{


			if ($key == 'SubjectID') {
				$counter ++;
				$PSCID = $thisField[$key];
				echo "-------count: " . $counter ."\n";
				echo "-------ID: " . $PSCID . "\n";
			}

			if ($key == 'Visit')
			{
				if ($thisField[$key] == 'F0')
					$visit = 'NAPLP00';
				elseif($thisField[$key] == 'F3')
					$visit = 'NAPLP03';

				echo "Visit: " . $visit . "\n";
			}

			if ($key == 'Tau') {
				$tau = $thisField[$key];
			}

			if ($key == 'b-amyloid') {
				$b_amyloid = $thisField[$key];
			}

			if ($key == 'pTau') {
				$ptau = $thisField[$key];
			}

			$config =& NDB_Config::singleton();
			$db =& Database::singleton();
			if(Utility::isErrorX($db)) {
				fwrite(STDERR, "Could not connect to database: ".$db->getMessage());
				return false;
			}

			$candID = $db->pselectOne("SELECT CandID from candidate where PSCID =:pid", array("pid"=>$PSCID)); 
			$sessionID = $db->pselectOne("SELECT ID from session where CandID =:cid and Visit_label =:visit", array('cid'=>$candID, 'visit'=>$visit));
			if (empty($sessionID) && $visit == 'NAPLP00')
				$sessionID = $db->pselectOne("SELECT ID from session where CandID =:cid and Visit_label =:visit", array('cid'=>$candID, 'visit'=>'NAPLP01'));
			$commentID = $db->pselectOne("SELECT CommentID from flag where sessionID=:sid and test_name = 'LP'", array('sid'=>$sessionID));
			print "CommentID: " . $commentID ."\n";

			$insertData = array('tau'=>$tau, 'b_amyloid'=>$b_amyloid, 'ptau'=>$ptau);
			$where = array('CommentID'=>$commentID);

			if (!empty($sessionID) && !empty($commentID)) {
				$success = $DB->update($table, $insertData, $where);
				if (Utility::isErrorX($success)) {
					fwrite(STDERR, "Failed to update aosi table, DB Error: " . $success->getMessage()."\n");
					return false;
				}
				echo "Updated!\n";
			}
			else {
				echo "Does not exist\n";

			}

		}


	}
}

?>

