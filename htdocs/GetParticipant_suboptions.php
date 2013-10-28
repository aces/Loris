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

  $DB =& Database::singleton();
  if(isset($_REQUEST['p_status'])){
      
      print " \n";
      $results = $DB->pselect("SELECT Description FROM participant_status_options WHERE parentID=:pid",
                               array('pid'=> $_REQUEST['p_status']));
      foreach($results as $row){
          print $row['Description'] . "\n";
      }
  } else if(isset($_REQUEST['pscid']))  {
      print "yyyY";
       $results = $DB->pselect("SELECT participant_statusID, participant_subOptions from participant_status p JOIN 
                              candidate c on c.CandID = p.CandID WHERE c.PSCID='".$_REQUEST['pscid']."'");
                            //  array('pid'=>"'".$_REQUEST['pscid']."'"));    
       foreach($results as $row){
           $id = $row['participant_statusID'];
           $sub_id = $row['participant_subOptions'];

           $desc = $DB->pselectOne("SELECT Description FROM participant_status_options WHERE ID=:id",
                                     array('id'=> $id));
           $sub_desc = $DB->pselectOne("SELECT Description FROM participant_status_options WHERE ID=:sid",
                                     array('sid'=> $sub_id));

//           print $desc.";".$sub_desc;
            print $id;$sub_id;
           
       }
  }
?>
