<?php
/**
    Ajax Streaming 
*/

//('../php/libraries/NDB_Menu_Filter_mri_upload.class.inc');
//require_once ('../php/libraries/Log.class.inc'); 
header('Content-Type: text/octet-stream');
header('Cache-Control: no-cache');
/**
    
*/

function send_message($message)
{
//    $d = array('message' => $message);
  //  echo json_encode($d) . PHP_EOL;
      echo $message;
      ob_flush();
      flush();
}

// need a better way to get the file name,
// not to call this function every second.
// 
function getLogName() {
    $today= getdate();
    $date = sprintf(
        "%04d-%02d-%02d", $today['year'],
        $today['mon'], $today['mday']
    ); 
    $log = "/data/sandbox/data/logs/MRI_upload" . "." . $date . ".log";
    return $log;
}

$logfile = getLogName(); 

if (! file_exists($logfile))
    $newfile = true;

while (! file_exists($logfile))
    sleep(1);


$file = fopen($logfile,"r");
$read = fread($file, filesize($logfile));
fclose($file); 

// the file has just been created, no need to check the time
if ($newfile) {
    parse($read)
}
else {
    $new_portion = getUpdates($read);
    // wait while new updates are available
    while ($new_portion == '') {
        sleep(1);
        $new_portion = getUpdates($read);
    }
    parse($new_portion)
}

function parse($text)
{
    $lines = explode("\n", $text);
    $nbLines = count($lines);
    for ($i = 0; $i < $nbLines; $i++) {
        if ($lines[$i] != '') {
            // need only text, without time
            $first = strpos($lines[$i], ']' + 2)
            $message += substr($lines[$i], $first) + "\n";
         
            // get the last update time and save it
            if ($i = $nbLines - 1) { 
                $first = strpos($lines[$i], '[') + 1;
                $timeString = substr($lines[$i], $first, strpos($lines[$i], ']')-$first);
                $time = strtotime($timeString);
                // TODO: save time to the file
            }
        } else {
            continue;
        }
    }   
    send_message($message); 
}

function getUpdates($text)
{
    $now = time();  // should be not now, but time from the last update 
    $lines = explode("\n", $text);
    $nbLines = count($lines);
    for ($i = 0; $i < $nbLines; $i++) {
        if ($lines[$i] != '') {
            $first = strpos($lines[$i], '[') + 1;
            $timeString = substr($lines[$i], $first, strpos($lines[$i], ']')-$first);
            $time = strtotime($timeString);
            // no updates yet
            if ($now > $time) {
                // not the last line
                if ($i < $nbLines-1) {
                    unset($lines[$i]);
                    var_dump($lines);
                // the last line
                } else {
                    return '';
                }
            // found updates
            } else {
                // copy rest of the array to the new one
                $updates = implode("\n", $lines);
                return $updates;
            }
        // empty lines
        } else {
            continue;
        }
    }
}
?>