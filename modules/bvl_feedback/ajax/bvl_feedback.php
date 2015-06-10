<?php
/** This is used to fetch all the data necessary for the bvl_feedback sidebar.

 * @category Behavioural 
 * @author: Evan McIlroy <evanmcilroy@gmail.com>
 * @returns: JSON object.
 * Date: 15-06-09
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

ob_start('ob_gzhandler');
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

// create DB object
$DB =& Database::singleton();
if (Utility::isErrorX($DB)) {
    return PEAR::raiseError("Could not connect to database: ".
        $DB->getMessage());
}

if (!empty($_REQUEST['candID'])){
    $candidate =& Candidate::singleton($_REQUEST['candID']);
    if (PEAR::isError($candidate)){
        $tpl_data['candID'] = $candidate->getCandID();
        $tpl_data['PSCID'] = $candiate ->getPSCID();        
    }
}

$tpl_data['css'] = $config->getSetting('css');
$smarty = new Smarty_neurodb;

if (is_array($tpl_data)){
    $smarty->assign($tpl_data);
}

print json_encode($tpl_data);

$smarty->display('feedback_bvl_pop.tpl');

ob_end_flush();
?>