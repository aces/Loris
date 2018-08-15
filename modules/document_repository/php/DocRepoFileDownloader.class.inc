<?php

require_once '../tools/generic_includes.php';
require_once '../php/libraries/GenericDownloader.class.inc';

class DocRepoFileDownloader extends GenericDownloader {

    public function getFilenameFromDatabase(int $id) {

        // Ensure file exists in the document_repository table before serving
        $db     =& Database::singleton();
        $record = $db->pselectOne(
            "SELECT record_id FROM document_repository WHERE "
            . "Data_dir=:dd",
            array('dd' => $id)
        );
        error_log("Record is $record");
        return $record;
    }

}
