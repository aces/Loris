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
//$dir = '/data/preventAD/data/assembly';

$dccid = $_POST['dccidP'];
//$dccid = '201198';
//echo "DCCID 1: " . $dccid . "\n";

$dir = '../mri/surfaces';
function ListFiles($dir, $dccid) {
   if($dh = opendir($dir)) {

        $files = Array();
        $inner_files = Array();
//	echo "DCCID 2: " . $dccid . "\n"; 

        while($file = readdir($dh)) {
            if($file != "." && $file != ".." && $file[0] != '.') {
                if(is_dir($dir . "/" . $file)) {
//		    echo "----DIR:" . $dir . "\n";
//		    echo "++++FILE:" . $file . "\n";
                    $inner_files = ListFiles($dir . "/" . $file, $dccid);
//			$files = ListFiles($dir . "/" . $file, $dccid);
                    if(is_array($inner_files) && $file == $dccid) /*array_push($files, $dir . "/" . $file); */ //$files = array_merge($files, $inner_files); 
			{
				for ($j=0; $j<count($inner_files); $j++)
					array_push($files, $inner_files[$j]);

			}
                } else {
		    if(preg_match("/.obj$/", $file))
//		}
                    array_push($files, $dir . "/" . $file);
                }
            }
        }
//	print_r($files);
        closedir($dh);
        return $files;
    }
}


foreach (ListFiles($dir, $dccid) as $key=>$file){
    echo $file ."\n";
}  

?>
