<?php
/**
 * @package main
 * @subpackage unused
 */

require_once "../php/libraries/NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();


// // overwrite DB connection
//require_once "../php/libraries/NDB_Config.class.inc";
//require_once "../php/libraries/Database.class.inc";
//$config =& NDB_Config::singleton();
//$dbConfig = $config->getSetting('database');
//$DB =& Database::singleton('NIH_PD', $dbConfig['username'], $dbConfig['password'], $dbConfig['host']);
//if(PEAR::isError($DB)) {
//    fwrite(STDERR, "Could not connect to database: ".$DB->getMessage());
//    return false;
//}
//$GLOBALS['DB'] =& $DB;

$DB =& Database::singleton();
if(PEAR::isError($DB)) {
    fwrite(STDERR, "Could not connect to database: ".$DB->getMessage());
    return false;
}
$db =& $DB;

// start the graph
$graph = "digraph helpGraph {\n";

// graph the top level nodes (recursively)
$db->select("SELECT HelpID FROM help WHERE ParentID<1", $topLevel);
foreach($topLevel AS $topNode) {
    graphNode($graph, $topNode['HelpID']);
}

// graph the relationships
$db->select("SELECT HelpID, RelatedID FROM help_related_links", $links);
$graph .= "edge [style=dashed,color=red,dir=both];\n";
foreach($links AS $link) {
    $graph .= "node$link[HelpID] -> node$link[RelatedID];\n";
}

// end the graph
$graph .= "}\n";


// print out the graph
print $graph;

function graphNode(&$graph, $helpID, $parentID=0) {
    global $db;
    $db->select("SELECT HelpID FROM help WHERE ParentID=$helpID", $children);
    
    if($parentID==0) {
        $graph .= "subgraph tree$helpID {\n";
    } else {
        $graph .= "node$parentID -> node$helpID;\n";
    }
    
    $topic = $db->selectOne("SELECT Topic FROM help WHERE HelpID=$helpID");
    $graph .= "node$helpID [label=\"$topic\"];\n";
    
    if(is_array($children) && count($children) > 0) {
        foreach($children AS $node) {
            graphNode($graph, $node['HelpID'], $helpID);
        }
    }
    
    if($parentID==0) {
        $graph .= "}\n";
    }
}

?>