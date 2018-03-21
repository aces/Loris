<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the Config table.
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Client.class.inc';
require_once "Utility.class.inc";

$user =& User::singleton();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();
// this qurey could delete duplicate ConfigID-value pairs 
$DB =& Database::singleton();
foreach ($_POST as $key => $value) {
    if (is_numeric($key)) { //update
        if ($value == "") {
            $DB->delete('Config', array('ID' => $key));
        } else {
error_log(print_r("============",true));
error_log(print_r(checkDuplicateUpdateDropdown($key,$value),true));
error_log(print_r("============",true));
            $DB->update(
                'Config',
                array('Value' => $value),
                array('ID' => $key)
            );
             //  else {
             //           header("HTTP/1.1 303 Duplicate value for update");
             //           exit();          
             //   }
            //delete duplicate ConfigID-value pairs 
        }
    } else { //add new or remove
        $keySplit   = explode("-", $key);
        $valueSplit = explode("-", $value);
        if ($keySplit[0] == 'add') {
            if ($value !== "") {
                if (checkDuplicate($keySplit[1],$value) == '0'){
                $DB->insert(
                    'Config',
                    array(
                     'ConfigID' => $keySplit[1],
                     'Value'    => $value,
                    )
                );
                } else {
                        header("HTTP/1.1 303 Duplicate value");
                        exit();   
                }
            }
        } elseif ($valueSplit[0] == 'remove') {
            $DB->delete('Config', array('ID' => $valueSplit[1]));
        }
    }
}
//check 
function checkDuplicate($key,$value){
       $DB =& Database::singleton();
       $result = $DB->pselectOne(
           "Select count(*) from Config where ConfigID =:ConfigID and Value =:Value",
            array(':ConfigID' => $key,':Value'=>$value)
       );
       return $result;
}

function checkDuplicateUpdateDropdown($id,$value){
       $DB =& Database::singleton();
       $ConfigID = $DB->pselectOne(
           "Select ConfigID from Config where ID =:ID and Value =:Value",
            array(':ID' => $id,':Value'=>$value)
       );

       $result = $DB->pselectOne(
           "Select count(*) from Config where ConfigID =:ConfigID and Value =:Value",
            array(':ConfigID' => $ConfigID,':Value'=>$value)
       );
       
       return $result;
}
exit();

?>
