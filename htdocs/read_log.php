<?php

set_time_limit(0);

$data_source_file = getLogName();

while (true) {
    $last_ajax_call = isset($_GTE['timestamp']) ? (int)$_GET['timestamp'] : null;

    clearstatcache();
   
    $last_change_in_data_file = filemtime($data_source_file);

    if ($last_ajax_call == null || $last_change_in_data_file > $last_ajax_call) {
        if (filesize($data_source_file) == 0) {
            sleep(2);
            continue;
        }
        $data = file_get_contents($data_source_file);
        file_put_contents($data_source_file, "");

        //$last_change_in_data_file = filemtime($data_source_file);
 
        $result = array(
            'data_from_file' => $data,
            'timestamp' => $last_change_in_data_file
        );
        
        $json = json_encode($result);
        echo $json;
       // ob_flush();
       // flush();
        break; 

    } else {
        sleep(5);
        continue;
    }
}

function getLogName() {
    $today= getdate();
    $date = sprintf(
        "%04d-%02d-%02d", $today['year'],
        $today['mon'], $today['mday']
    ); 
    $log = "/data/sandbox/data/logs/Log" . "." . $date . ".log";
    return $log;
}


/*
function sendMessage($message)
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
    $log = "/data/sandbox/data/logs/Log" . "." . $date . ".log";
    return $log;
}

if (! file_exists($logfile)) {
    $newfile = true;
  //  sendMessage("File does not exist");
}
else {
    $newfile = false;
   // sendMessage("File exists");
}
while (! file_exists($logfile))
    sleep(1);

$logfile = getLogName();

$file = fopen($logfile,"r");
$read = fread($file, filesize($logfile));
fclose($file); 

// the file has just been created, no need to check the time
if ($newfile) {
    parse($read);
}
else {
    $new_portion = getUpdates($read);
    // wait while new updates are available
    while ($new_portion == '') {
        sleep(1);
        $new_portion = getUpdates($read);
   //     sendMessage("New: " . $new_portion);
    }
    parse($new_portion);
}

function parse($text)
{
    $message = "";
    $lines = explode("\n", $text);
    $nbLines = count($lines);
    for ($i = 0; $i < $nbLines; $i++) {
        if ($lines[$i] != '') {
            // need only text, without time
            $first = strpos($lines[$i], ']' + 2);
            $message .= substr($lines[$i], $first) . "\n";
         
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
//    sendMessage($message); 
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
}*/
?>