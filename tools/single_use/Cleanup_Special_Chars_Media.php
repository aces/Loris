<?php
/**
 * This script is written to clean up the files with special characters from the media data table as well as clean up the
 * quotes appearing as %22 in the file names in the file system
 *
 * To use the script: php Cleanup_Special_Chars_Media.php
 *
 *
 * PHP Version 7
 *
 * @category Main
 * @package Loris
 * @author Pierre PAC SOO <pierre.pacsoo@mcin.ca>
 * @license Loris license
 * @link https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__."/../generic_includes.php";

$data = $DB->pselect(
    "SELECT id, file_name
        FROM media",
    []
);

foreach($data as $key => $file) {

    // decode special characters in the file name
    // print("File name is: " . $file['file_name'] . "\n");
    $fileNameURLencoded = htmlspecialchars_decode($file['file_name']);
    $fileName = urldecode($fileNameURLencoded);
    // print("Now file name is: " . $fileName . "\n");

    // update only if file name has been updated
    if($fileName !== $file['file_name']) {
        print($fileNameURLencoded . "\n");
//        $DB->unsafeupdate(
//            "media",
//            [
//                "file_name" => $fileName
//            ],
//            [
//                "id" => $file['id']
//            ]
//        );

        // update name in file system
        //shell_exec("mv /data/uploads/$fileNameURLencoded /data/uploads/" . addslashes($fileName));
//        print("File name was: " . $file['file_name'] . "\n");
//        print("Now file name is: " . $fileName . "\n");
    }
}
