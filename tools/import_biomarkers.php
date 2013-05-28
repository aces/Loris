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


$commentID = "";
$candID = "";
$PSCID = "";
$sessionID = "";


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
                echo "ID: " . $thisField[$key];
                $PSCID = $thisField[$key];
            }

            if ($key == 'Visit')
            {
                echo "Visit: " . $thisField[$key];
                if ($thisField[$key] == 'F0')
                    $visit = 'NAPLP00';
                elseif($thisField[$key] == 'F3')
                    $visit = 'NAPLP03';
            }

            if ($key == 'Tau') {
                echo "Tau: " . $thisField[$key];
                $tau = $thisField[$key];
            }

            if ($key == 'b-amyloid') {
                echo "b-amyloid: " . $thisField[$key];
                $b_amyloid = $thisField[$key];
            }

            if ($key == 'pTau') {
                echo "pTau " . $thisField[$key];
                $ptau = $thisField[$key];
            }

            $config =& NDB_Config::singleton();
            $db =& Database::singleton();
            if(Utility::isErrorX($db)) {
                fwrite(STDERR, "Could not connect to database: ".$db->getMessage());
                return false;
            }

            print "1\n";
            $candID = $db->pselectOne("SELECT CandID from candidate where PSCID =:pid", array("pid"=>$PSCID)); 
            print "2\n";
            $sessionID = $db->pselectOne("SELECT ID from session where CandID =:cid and Visit_label =:visit", array('cid'=>$candID, 'visit'=>$visit));
            print "3\n";
            $commentID = $db->pselectOne("SELECT CommentID from flag where sessionID=:sid and test_name = 'LP'", array('sid'=>$sessionID));
            print "4\n";
            print "CommentID: " . $commentID;

            $insertData = array('tau'=>$tau, 'b_amyloid'=>$b_amyloid, 'ptau'=>$ptau);
            $where = array('CommentID'=>$commentID);

            if (!empty($sessionID) && !empty($commentID)) {
                echo "Visit exists!";
                /*                $success = $DB->update($table, $insertData, $where);
                                  if (Utility::isErrorX($success)) {
                                  fwrite(STDERR, "Failed to update aosi table, DB Error: " . $success->getMessage()."\n");
                                  return false;
                                  }*/
            }

        }


    }
}

?>

