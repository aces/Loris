<?php
/** This is used by the candidate parameters to get the 
 * list of participant_suboptions via AJAX
 */
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

  require_once "Database.class.inc";
  require_once 'NDB_Config.class.inc';
  require_once 'NDB_Client.class.inc';
  $config =& NDB_Config::singleton();
  $client = new NDB_Client();
  $client->initialize();

  require_once "Utility.class.inc";

  $DB =& Database::singleton();
if (isset($_REQUEST['p_status'])) {
      print " \n";
      $results = $DB->pselect("SELECT Description FROM participant_status_options 
                      WHERE parentID=:pid", array('pid'=> $_REQUEST['p_status']));
    foreach ($results as $row) {
          print $row['Description'] . "\n";
    }
} else if (isset($_REQUEST['pscid'])) {
       $results = $DB->pselect("SELECT participant_status, participant_suboptions 
              FROM participant_status p JOIN candidate c ON (c.CandID = p.CandID)
              WHERE c.PSCID=:pid", array('pid'=>"'".$_REQUEST['pscid']."'"));    
    foreach ($results as $row) {
        $id = $row['participant_status'];

        $desc = $DB->pselectOne("SELECT Description FROM participant_status_options 
                                 WHERE ID=:id", array('id'=> $id));
        $sub_desc = $DB->pselectOne("SELECT Description FROM participant_status_options 
                         WHERE ID=:sid", array('sid'=> $row['participant_suboptions']));

           print $id.";".$sub_desc;
           
    }
}
?>
