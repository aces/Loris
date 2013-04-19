<?php
/**
 * Background data loader.  Receives commands from the query GUI and
 * constructs javascript arrays to send data back.  API is simply
 * URL?mode=categories or URL?mode=fields&cat_id=XXX (where XXX is the
 * ParameterTypeCategoryID)
 *
 * It responds by calling a function such as loadFieldsByRemote(...)
 * in the parent window, usually sending back a large javascript
 * array.
 * @package main
 * @subpackage query_gui
 */
ob_start('ob_gzhandler');


// load the client
require_once 'NDB_Client.class.inc';
$client = new NDB_Client;

// TEMPORARY: disabling authentication simply to make testing easier
// and faster...  should be reenabled later for prod use (to protect
// data)
//$client->makeCommandLine();

$client->initialize();

// make local instances of objects
$config =& NDB_Config::singleton();

$currentUser =& User::singleton($_SESSION['State']->getUsername());

// enable caching?  (currently only applies to field list loading)
$caching_enabled = 'true';

// Features to add:
//// query saving
//// query loading

switch($_REQUEST['mode']) {
 case 'categories':
     // category list loading
     $remoteLoaderFunction = 'loadCategoriesByRemote';
     $remoteLoaderArgs = 'remoteFieldData';
     $query = "SELECT DISTINCT parameter_type_category.ParameterTypeCategoryID, Name FROM parameter_type_category, parameter_type_category_rel WHERE parameter_type_category.ParameterTypeCategoryID=parameter_type_category_rel.ParameterTypeCategoryID ORDER BY Type, Name";
     $DB->select($query, $results);

     foreach($results AS $row) {
         if ((!is_null($row['Name']))&&(!preg_match('/Array/',$row['Name']))) {
            $script .= "remoteFieldData.push({id:".$row['ParameterTypeCategoryID'].",name:\"".$row['Name']."\"});\n";
        }
     }
     break;

 case 'fields':
     // field list loading
     $remoteLoaderFunction = 'loadFieldsByRemote';
     $remoteLoaderArgs = "\"$_GET[type]\", \"$_GET[cat_id]\", remoteFieldData, $caching_enabled, false, fieldOrderList";
     $query = "SELECT parameter_type.ParameterTypeID, Name, Description, parameter_type.Type, ParameterTypeCategoryID FROM parameter_type, parameter_type_category_rel WHERE parameter_type.ParameterTypeID=parameter_type_category_rel.ParameterTypeID AND parameter_type.Queryable=1 AND parameter_type_category_rel.ParameterTypeCategoryID='$_GET[cat_id]'";
     $DB->select($query, $results);
     
     // apply natural order sorting to field list
     $sortable = $rawdata = array();
     foreach($results AS $row) {
         $rawdata[$row['ParameterTypeID']] = $row;
         $sortable[$row['ParameterTypeID']] = $row['Name'];
     }
     natsort($sortable);
     foreach($sortable AS $id => $name) {
         if(empty($rawdata[$id]['Description'])) $rawdata[$id]['Description'] = $rawdata[$id]['Name'];
         switch(substr($rawdata[$id]['Type'],0,3)){
         case "int":
         case "flo":
         case "dou":
         case "dec":
             $rawdata[$id]['Type']="number";
             break;
             
         case "enu":
             $rawdata[$id]['Values']=trim(substr($rawdata[$id]['Type'],4),"()");
             if(stristr($rawdata[$id]['Values'], "NULL")){
                 $rawdata[$id]['Values']=str_replace("NULL","'NULL'",$rawdata[$id]['Values']);
             }
             $rawdata[$id]['Type']="enum";
             break;
             
         default:
             $rawdata[$id]['Type']="string";
         }
         $data[] = $rawdata[$id];
     }
     foreach($data AS $result){
         $script.= "remoteFieldData[".$result['ParameterTypeID']."]=[".$result['ParameterTypeID'].", \"".$result['Name']."\", \"".htmlentities($result['Description'], ENT_COMPAT | ENT_HTML401, 'UTF-8')."\", ".$result['ParameterTypeCategoryID'].", \"".$result['Type']."\"";
         if(!empty($result['Values'])){
             $script.= ", [".$result['Values']."]";
         }
         $script.= "];\n";
     }
     foreach($sortable as $id => $name) {
         $script .= "fieldOrderList.push($id);\n";
     }
     break;
     
 case "saveQuery":
     $querySegments=explode("{-@-}",$_POST[queryData]);
     $DB->delete("query_gui_stored_queries", array("name"=>$querySegments[0], "userID"=>$currentUser->getData("ID")));
     $DB->insert("query_gui_stored_queries",array("name"=>$querySegments[0], "selected_fields"=>$querySegments[1], "conditionals"=>$querySegments[2], "conditionals_groups"=>$querySegments[3], "userID"=>$currentUser->getData("ID")));
     $remoteLoaderFunction="querySaved";
     break;
     
 case "deleteQuery":
    if(!is_numeric($_GET[qid])){
         return false;
     }
     $DB->delete("query_gui_stored_queries", array("qid"=>$_GET[qid]));
     $remoteLoaderFunction="queryDeleted";
 break;
     
 case "loadQuery":
     if(!is_numeric($_GET[qid])){
         return false;
     }
     $query="select name, selected_fields, conditionals, conditionals_groups FROM query_gui_stored_queries WHERE qid='$_GET[qid]'";
     $DB->select($query,$results);
     $results=$results[0];
     //load query name
     $queryName=$results['name'];
        
     //Load selected fields
     if(!empty($results['selected_fields'])){
         $lines=explode("\n",trim($results['selected_fields']));
         foreach ($lines AS $line){
             $line=trim($line);
             $fields.="qrSelectedFields['$line']='true';\n";
             $parameterIds[$line]=$line;
         }
     }
        
     //Load selected conditionals
     if(!empty($results['conditionals'])){
         $cid=0;
         $lines=explode("\n",trim($results['conditionals']));
         foreach ($lines AS $line){
             $bits=explode("{@}",trim($line));
             if(!empty($bits[0])) {
                 $conditionals.="qrConditionals[$cid]=[$bits[0],'$bits[1]','$bits[2]',$bits[3]];\n";
                 $parameterIds[$bits[0]]=$bits[0];
                 $cid++;
             }
         }
         //Load groups info
         $lines=explode("\n",trim($results['conditionals_groups']));
         foreach ($lines AS $line){
             $bits=explode("{@}",trim($line));
             if(!empty($bits[0])) {
                 $conditionalsGroups.="qrConditionalsGroups[$bits[0]]='$bits[1]';\n";
                 $groupsNesting.="qrGroupsNesting[$bits[0]]=$bits[2];\n";
             }
         }
     }
        
     foreach($parameterIds AS $pid){
         if(!empty($qpid)){$comma=",";}
         $qpid.=$comma.$pid;
     }
     $query="SELECT distinct ParameterTypeCategoryID from parameter_type_category_rel WHERE ParameterTypeID IN ($qpid)";
     $DB->select($query, $results);
     foreach($results AS $result){
         $usedCategories.="qrUsedCategories[".$result['ParameterTypeCategoryID']."]=true;\n";   
     }
        
     $remoteLoaderFunction="loadQuery";
     $remoteLoaderArgs="\"$_GET[action]\", $_GET[qid], \"$queryName\", qrUsedCategories, qrSelectedFields, qrConditionals, qrConditionalsGroups, qrGroupsNesting";
             
     $script=$fields.$conditionals.$conditionalsGroups.$groupsNesting.$usedCategories;
     break;
     
 case "listQueries":
     $userID=$currentUser->getData('ID');
     $query="select qid, name, selected_fields, conditionals, access FROM query_gui_stored_queries WHERE userID='$userID' OR access='public' ORDER by access DESC, name ASC";
     $DB->select($query,$results);
     foreach($results AS $result){
         $fields=!empty($result['selected_fields']) ? "true" : "false";
         $conditionals=!empty($result['conditionals']) ? "true" : "false";
         $private=$result['access'] == 'private' ? "true" : "false";
         $script.="queryList[$result[qid]]=[$result[qid], \"$result[name]\", $fields, $conditionals, $private];\n";
     }
     $remoteLoaderFunction="listQueries";
     $remoteLoaderArgs="queryList";
     break;

 case "executeQuery":
     $querySegments=explode("{-@-}",$_POST[queryData]);

     $querySegments=array("name"=>$querySegments[0],
                          "selected_fields"=>$querySegments[1],
                          "conditionals"=>$querySegments[2],
                          "conditionals_groups"=>$querySegments[3]);
                          
     // define parameter type id of selected fields
     $selectedFields = array();
     $selectedTables = array();
     $lines=explode("\n",trim($querySegments['selected_fields']));
     foreach ($lines AS $parameterTypeID){
         $parameterTypeID=trim($parameterTypeID);
	 
         $field = parameterTypeIDToFieldName($parameterTypeID);
         if(!empty($field)) {

             // add the table to the list of selected tables (if it's
             // not already there)
             $bits = explode('.', $field);
             $selectedFields[] = "`".$bits[0]."`.`".$bits[1]."`";
             if(!in_array("`".$bits[0]."`", $selectedTables))
                 $selectedTables[] = "`".$bits[0]."`";
         } else {
             echo "ERROR!  You selected a nonexistant field!\n<br>";
         }
     }

     // construct WHERE from selected conditionals
     if(!empty($querySegments['conditionals'])){
         // conditional expressions
         $cid=0;
         $lines=explode("\n",trim($querySegments['conditionals']));
         foreach ($lines AS $line){
             $bits=explode("{@}",trim($line));
             $conditionals[$bits[3]]['expressions'][$cid]=array('ParameterTypeID'=>$bits[0],
                                                                'operator'=>$bits[1],
                                                                'value'=>$bits[2],
                                                                'groupID'=>$bits[3]);
             $conditionals[$bits[3]]['expressions'][$cid]['expression'] = buildExpression($conditionals[$bits[3]]['expressions'][$cid]);

				 // add table to selectedTables if necessary
				 $field = trim(parameterTypeIDToFieldName($bits[0]));
				 if(!empty($field)) {
					 // add the table to the list of selected tables (if it's
					 // not already there)
					 $fbits = explode('.', $field);
					 if(!in_array("`".$fbits[0]."`", $selectedTables))
						 $selectedTables[] = "`".$fbits[0]."`";
				 }

             $cid++;
         }
         // expression grouping and join operator (AND/OR)
         $groupingTree = array(0=>array());
         $lines=explode("\n",trim($querySegments['conditionals_groups']));
         foreach ($lines AS $line){
             $bits=explode("{@}",trim($line));
             $conditionals[$bits[0]]['properties'] = array('joinOp'=>$bits[1],
                                                           'parent'=>$bits[2]);
	   
             addChildToTree($groupingTree, $bits[2], $bits[0]);
         }
         treeToExpression($where, $groupingTree, $conditionals);
     }
       
     // start constructing the query itself
     // add the selected fields
     $query = "SELECT ".join(', ', $selectedFields)." FROM ";

     // add the selected tables
     $query .= join(', ', $selectedTables);
     //$query .= " WHERE ";
     $query .= " WHERE COALESCE(" . join(', ', $selectedFields) . ") IS NOT NULL AND ";
       
     // if there are more than one table involved, join them
     if(count($selectedTables) > 1) {
         $lastTable = null;
         $join = '';
         foreach($selectedTables AS $table) {
             if(is_null($lastTable)) {
                 $lastTable = $table;
                 continue;
             }
               
             $join .= empty($join) ? '' : ' AND ';
             $join .= "$lastTable.SessionID = $table.SessionID";
         }
           
         $query .= $join . " AND ";
     }
       
     // add the where
     $query .= empty($where) ? 1 : $where;
       
     // finally!  a completed query!  now we just save it, get its
     // reference id, and send that to a popup
     $DB->insert("query_gui_downloadable_queries", array('query'=>$query));
     $queryID = $DB->lastInsertID;
     $download = $_POST['download'];
     if($download === 'execute') {
         SendFilesToPackage($querySegments['selected_fields'], $query);
     }

     $toCBrain = $_POST['cbrain'];
     if($toCBrain === 'execute') {
        SendFilesToCBrain($querySegments['selected_fields'], $query); //$selectedTables, empty($where) ? 1 : $where);
     }
     $script .= "window.open('query_gui_data_download.php?queryID=$queryID&format=$_REQUEST[outputFormat]', 'query_download_window');";

     $remoteLoaderFunction="doNothing";
     break;
       
}

function getFiles($cols, $query, $timestamp, $prefix="cbrain") {
    $DB = Database::singleton();
    $fileCols= array();
    $lines=explode("\n",trim($cols));
    foreach($lines as $field) {
        $fileCol = $DB->pselectRow("SELECT IsFile, Name FROM parameter_type WHERE ParameterTypeID=:ptid", array("ptid" => $field));
        if($fileCol['IsFile'] == true) {
            $fileCols[] = ParameterTypeIDToFieldName($field);
        }
    }

    // Strip off everything before from from the query that was generated above, then just re-add the file fields
    // as determined above
    $new_query = "SELECT " . join(',', $fileCols) . " " . substr($query, strpos($query, "FROM"));
    $DB->select($new_query, $results);
    $input = "";
    $fp = fopen("/tmp/$prefix.$timestamp.txt", 'w');
    foreach ($results as $row) {
        foreach ($row as $key => $val) {
            if(!empty($val)) {
                fwrite($fp, $val . "\n");
                $input .= $val . "\n";
            }
       }
    }
    fclose($fp);
    return "/tmp/$prefix.$timestamp.txt";
}

function SendFilesToPackage($cols, $query) {
    $DB = Database::singleton();
    $user = User::singleton();
    $timestamp = time();
    $filelist = getFiles($cols,$query,$timestamp, "download");
    $user = User::singleton();
    chdir("../tools");
    $cmd = sprintf("cat $filelist | ./%s %s.$timestamp > %s 2>&1 & echo $! >> %s", "package_files.sh", $user->getUsername(), "../logs/download.$timestamp", $filelist);
    exec($cmd);
    $cmd = "rm -f $filelist";
    exec($cmd);
    $DB->insert("query_gui_user_files", array("UserID" => $user->getData("ID"),
        "filename" => $user->getUsername() . ".$timestamp.tar.gz"
    ));
}

function SendFilesToCBrain($cols, $query) {
    $DB = Database::singleton();
    $user = User::singleton();
    $timestamp = time();
    $filelist = getFiles($cols,$query,$timestamp, "cbrain");
    $cmd = sprintf("cat /tmp/cbrain.$timestamp.txt | %s -lorisuser %s -profile prod > %s 2>&1 & echo $! >> %s\n", "perl -I../tools ../tools/copy_to_cbrain.pl", $user->getUsername(), "../logs/cbrain." . $timestamp, "/tmp/cbrain." . $timestamp);
print $cmd;
    exec($cmd);
    $cmd = "rm /tmp/cbrain.$timestamp.txt";
    exec($cmd);
}

function printArray($array, $indent=""){
    while(list($key,$val)=each($array)){
        if(is_array($val)){
            $output.=printArray($val, $indent."    ");
        } else {
            $output.=$indent."$key = $val \n";
        }
    }
    return $output;
}

function parameterTypeIDToFieldName($parameterTypeID) {
    $db =& Database::singleton();
    $query = 'SELECT CONCAT(CurrentGUITable, ".", Name) AS Name FROM parameter_type WHERE ParameterTypeID="'.$parameterTypeID.'" AND CurrentGUITable IS NOT NULL';
    $field = $db->selectOne($query);
    if($db->isError($field)) {
        print "Error looking up field name: ".$field->getMessage()."\n";
        die(1);
    }
    return $field;
}

function buildExpression($conditional) {
    $expression = '';

    // add field name
    $field = parameterTypeIDToFieldName($conditional['ParameterTypeID']);
    $field_bits = explode('.', $field);
    $expression .= '`'.$field_bits[0].'`.`'.$field_bits[1].'` ';

    // add operator
    $value = "'V'";
    switch($conditional['operator']) {
    case '=':
        $operator = '=';
        break;

    case 'value*':
        $operator = 'LIKE';
        $value = "'V%'";
        break;

    case '*value*':
        $operator = 'LIKE';
        $value = "'%V%'";
        break;

    case '!=':
    case '>=':
    case '<=':
    case '>':
    case '<':
        $operator = $conditional['operator'];
        break;
    }
  
    $expression .= $operator;
  
    // add value
    $expression .= ' '.str_replace('V', str_replace("'", "\'", $conditional['value']), $value);

    return $expression;
}

function conditionalToExpression(&$conditional) {
    $expression = '';
    if(empty($conditional['properties']['joinOp'])) $conditional['properties']['joinOp'] = 'AND';

    if(is_array($conditional['expressions'])) {
        foreach($conditional['expressions'] AS $cur_expression) {
            $expression .= empty($expression) ? '' : ' '.$conditional['properties']['joinOp'].' ';
            $expression .= $cur_expression['expression'];
        }
    }

    if(!empty($expression)) $expression = '(' . $expression . ')';
    return $expression;
}


// the fractal tree is structured simply with groupIDs as keys and
// arrays as values.  the value array will be empty if there are no
// children.
function addChildToTree(&$tree, $parent, $child) {
    foreach($tree AS $key=>$value) {
        if($key == $parent) {
            $tree[$key][$child] = array();
            return true;
        }

        if(is_array($value)) {
            addChildToTree($tree[$key], $parent, $child);
        }
    }

    return false;
}

function treeToExpression(&$expression, &$tree, &$conditionals, $parentID=null) {
    foreach($tree AS $groupID=>$value) {
        if(is_array($value) && isset($groupID)) {
            treeToExpression($expression, $tree[$groupID], $conditionals, $groupID);

            $cur_expression = conditionalToExpression($conditionals[$groupID]);
            if(!empty($cur_expression)) {
                if(!is_null($parentID)) $conditionals[$parentID]['expressions'][] = array('expression' => $cur_expression);
                else $expression = $cur_expression;
            }
        }
    }
}


?>
<html>
<head>
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">
<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
<script>
remoteFieldData = new Array;
queryList = new Array;
qrConditionals = new Array;
qrConditionalsGroups = new Array;
qrGroupsNesting = new Array;
qrSelectedFields = new Array;
qrUsedCategories = new Array;
fieldOrderList = []; // new Array;
<?=$script?>
</script>

</head>
<body onload='window.parent.<?=$remoteLoaderFunction?>( <?=$remoteLoaderArgs?>);window.parent.loadComplete();'>
<form id='saveQueryForm' method='POST' action='query_gui_data_loader.php'>
<textarea id='queryData' name='queryData'><?=$_POST['queryData']?></textarea>
<input type='text' id='mode' name='mode'>
<input type='text' id='download' name='download' />
<input type='text' id='outputFormat' name='outputFormat'>
<input type='text' id='cbrain' name='cbrain' />
<input type='submit'>
</form>
</body>
</html>
