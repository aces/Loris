<?php
/*
 if (file_exists("/data/preventAD/data/assembly" . $_FILES["file"]["name"]))
      {
      echo $_FILES["file"]["name"] . " already exists. ";
      }
*/
/*
if ($handle = opendir($base_dir)) {
    echo "Directory handle: $handle\n";
    echo "Entries:\n";

    while (false !== ($entry = readdir($handle))) {
 	if ($entry != "." && $entry != "..") {
        	echo "$entry\n";
    	}
	if($subHandle = opendir($base_dir . '/' . $entry)) {
		echo "Dir handle: $subHandle\n";
		echo "Sub Entries:\n";
		while (false !==($subEntry = readdir($subHandle))) {
			echo "$subEntry\n";
	}
	closedir($subHandle);
	}
    }	
    closedir($handle);
}
*/

$dccid = $_POST['dccidP'];


//$dir = '/data/preventAD/data/assembly';
$dir = '../mri/thickness';
function ListFiles($dir) {
   if($dh = opendir($dir)) {

        $files = Array();
        $inner_files = Array();

        while($file = readdir($dh)) {
            if($file != "." && $file != ".." && $file[0] != '.') {
                if(is_dir($dir . "/" . $file)) {
//		    echo "----DIR:" . $dir . "\n";
//		    echo "++++FILE:" . $file . "\n";
                    $inner_files = ListFiles($dir . "/" . $file);
                    if(is_array($inner_files)) $files = array_merge($files, $inner_files); 
                } else {
		    if(preg_match("/.txt$/", $file))
                    array_push($files, $dir . "/" . $file);
                }
            }
        }

        closedir($dh);
        return $files;
    }
}


foreach (ListFiles($dir) as $key=>$file){
    echo $file ."\n";
}  

?>
