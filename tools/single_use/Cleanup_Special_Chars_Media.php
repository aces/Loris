<?php
/**
 * This script is written to clean up the files with special characters from the
 * media data table as well as clean up the
 * quotes appearing as %22 in the file names in the file system
 *
 * To use the script: php Cleanup_Special_Chars_Media.php
 *
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Pierre PAC SOO <pierre.pacsoo@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__."/../generic_includes.php";
$config = NDB_Config::singleton();

$media_path = $config->getSetting('mediaPath');

$data = $DB->pselect(
    "SELECT id, file_name
        FROM media",
    []
);

foreach ($data as $key => $file) {

    // fileNameURLencoded is needed for the step line 48 as the file name got rid of
    // '"' and replaced it with %22 urldecode will get rid of %22 and replace it
    // correctly for it to be inserted into the table
    $fileNameURLencoded = htmlspecialchars_decode($file['file_name']);
    $fileName           = urldecode($fileNameURLencoded);

    // update only if file name has been updated
    if ($fileName !== $file['file_name']) {

        // change name in sql table media
        $DB->unsafeupdate(
            "media",
            [
                "file_name" => $fileName
            ],
            [
                "id" => $file['id']
            ]
        );

        // update name in file system
        rename($media_path.$fileNameURLencoded, $media_path.$fileName);
        print("Old file name: " . $file['file_name'] . ". New file name: " .
            $fileName . "\n\n");
    }
}
