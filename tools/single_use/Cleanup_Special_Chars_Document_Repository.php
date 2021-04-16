<?php
/**
 * This script is written to clean up the files with special characters from the document repository data table as well as clean up the
 * quotes appearing as %22 in the file names in the file system
 *
 * To use the script: php Cleanup_Special_Chars_Document_Repository.php
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
$config = NDB_Config::singleton();

$document_repository_path = $config->getSetting('documentRepositoryPath');

$data = $DB->pselect(
    "SELECT record_id, File_name, uploaded_by
        FROM document_repository",
    []
);

foreach($data as $key => $file) {

    // fileNameURLencoded is needed for the step line 48 as the file name got rid of '"' and replaced it with %22
    // urldecode will get rid of %22 and replace it correctly for it to be inserted into the table
    $fileNameURLencoded = htmlspecialchars_decode($file['File_name']);
    $fileName = urldecode($fileNameURLencoded);

    // update only if file name has been updated
    if($fileName !== $file['File_name']) {

        // change name in sql table media
        $DB->unsafeupdate(
            "document_repository",
            [
                "file_name" => $fileName,
                "Data_dir"  => $fileName
            ],
            [
                "record_id" => $file['record_id']
            ]
        );

        // update name in file system
        rename($document_repository_path . $file['uploaded_by'] . "/" . $fileNameURLencoded, $document_repository_path.$file['uploaded_by']."/".$fileName);
        print("Old file name: " . $file['File_name'] . ". New file name: " . $fileName . "\n\n");
    }
}
