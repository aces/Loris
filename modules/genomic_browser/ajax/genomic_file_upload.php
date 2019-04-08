<?php
/**
 * This allows uploading of files for the genomic module.
 *
 * NOTE : This require a genomic_uploader directory under the
 * GenomicDataPath directory specified in the cconfigSettings.
 * This directory needs to be accessible w/r to the apache user.
 *
 * PHP Version 7
 *
 *  @category   Loris
 *  @package    Genomic_Module
 *  @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 *  @contriutor Xavier Lecours boucher <xavier.lecoursboucher@mcgill.ca>
 *  @license    Loris license
 *  @link       https://github.com/aces/Loris-Trunk
 */
$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('genomic_browser_view_site')
    && !$userSingleton->hasPermission('genomic_browser_view_allsites')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Set output mode to allow XHR request progress

$config   = NDB_Config::singleton();
$base_dir = $config->getSetting('base');
if (empty($base_dir)) {
    error_log('Security problem : base ConfigSettings not set or empty.');
    header("HTTP/1.1 412 Precondition Failed");
    exit;
}

set_time_limit(0);
ob_implicit_flush(true);
ob_end_flush();
header('Content-Type: application/json; charset=UTF-8');
$bytes = $_FILES["fileData"]['size'];

$fileToUpload
    = (object) array(
                'file_type'         => $_FILES["fileData"]["type"],
                'file_name'         => $_FILES["fileData"]["name"],
                'tmp_name'          => $_FILES["fileData"]["tmp_name"],
                'size'              => round($bytes / 1048576, 0),
                'inserted_by'       => $userSingleton->getData('UserID'),
                'genomic_file_type' => empty($_POST['fileType']) ?
                    null : str_replace('_', ' ', $_POST['fileType']),
                'description'       => $_POST['description'],
               );

setFullPath($fileToUpload);

switch ($fileToUpload->genomic_file_type) {
case 'Methylation beta-values':
    validateRequest();
    begin();
    registerFile($fileToUpload);
    insertMethylationData($fileToUpload);
    moveFileToFS($fileToUpload);
    endWithSuccess();
    break;
case 'Other':
    begin();
    registerFile($fileToUpload);
    moveFileToFS($fileToUpload);
    endWithSuccess();
    break;
default:
    die(
        json_encode(
            array(
             'message'  => "Unsupported filetype: $fileToUpload->genomic_file_type",
             'progress' => 100,
             'error'    => true,
            )
        )
    );
}

//TODO :: Creating file-candidate relations
reportProgress(100, "Complete");
exit;

/**
 * This verify if the required parameters have been provided.
 *
 * @return void
 */
function validateRequest()
{
    reportProgress(10, 'Validating...');
    if (( empty($_POST['pscidColumn'])
        && empty($_POST['fileMapping']) )
        || empty($_FILES['fileData'])
    ) {
        die(
            json_encode(
                array(
                 'message'  => 'Validation failed : Missing inputs',
                 'progress' => 100,
                 'error'    => true,
                )
            )
        );
        // This require some more work
        // Should compare the header and existing data to inform
        // the user about predicted no-insertion.
    }
    reportProgress(25, "Validation completed");
}

/**
 * Sets $fileToUpload->full_path
 *
 * @param stdClass $fileToUpload The file to upload
 *
 * @return void
 */
function setFullPath(&$fileToUpload)
{
    $config           = NDB_Config::singleton();
    $genomic_data_dir = rtrim($config->getSetting('GenomicDataPath'), '/')
        . "/genomic_uploader/";

    $fileToUpload->full_path = $genomic_data_dir
            . $fileToUpload->file_name;

    $collision_count = 0;
    $collision_max   = 100;

    while (file_exists($fileToUpload->full_path)) {
        ++$collision_count;
        if ($collision_count > $collision_max) {
            die(
                json_encode(
                    array(
                     'message'  => 'That file already exists, '
                        . 'could not generate a non-colliding name',
                     'progress' => 100,
                     'error'    => true,
                    )
                )
            );
        }
        $ext = pathinfo($fileToUpload->file_name, PATHINFO_EXTENSION);
        $nme = pathinfo($fileToUpload->file_name, PATHINFO_FILENAME);
        $fileToUpload->full_path = $genomic_data_dir
            . $nme . "-" . $collision_count . '.' .$ext;
    }
}

/**
 * This moves the file from php tmp dir to the genomic data
 * directory specified in the configSettings.
 *
 * @param object $fileToUpload The object containing the $_FILES
 *               and the $_POST values.
 *
 * @return void
 */
function moveFileToFS(&$fileToUpload)
{

    $config           = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');

    $dest_dir = dirname($fileToUpload->full_path);
    // update ui to show we are trying to move the file
    reportProgress(98, "Copying file...");
    // file system validation
    try {
        if (!file_exists($fileToUpload->tmp_name)) {
            throw new Exception(
                "Some parts of path $fileToUpload->tmp_name does not exist."
            );
        } else if (!is_dir($dest_dir)) {
            throw new Exception(
                "$dest_dir exists but is not a directory."
            );
        } else if (!is_writable($dest_dir)) {
            throw new Exception(
                "$dest_dir is not writable by web user."
            );
        }
        if (move_uploaded_file(
            $fileToUpload->tmp_name,
            $fileToUpload->full_path
        )
        ) {
            reportProgress(99, "File successfully copied!");
        }
    } catch (Exception $ex){
        error_log("Cannot move file: $ex");
        endWithFailure();
        // TODO: The below does not get printed to the frontend.
        //       Further debugging needed
        die(
            json_encode(
                array(
                 'message'  => "File copy failed",
                 'progress' => 100,
                 'error'    => true,
                )
            )
        );
    }
}

/**
 * This insert a record in the genomic_files table
 *
 * @param object $fileToUpload The object containing the $_FILES
 *               and the $_POST values.
 *
 * @return void
 */
function registerFile(&$fileToUpload)
{
    $DB     =& Database::singleton();
    $config = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');

    $values = array(
               'FileName'         => $fileToUpload->full_path,
               'Description'      => $fileToUpload->description,
               'FileType'         => $fileToUpload->file_type,
               'AnalysisModality' => $fileToUpload->genomic_file_type,
               'FileSize'         => $fileToUpload->size,
               'Date_inserted'    => date("Y-m-d h:i:s", time()),
               'InsertedByUserID' => $fileToUpload->inserted_by,
              );
    try {
        $DB->replace('genomic_files', $values);
        //TODO :: This should select using date_insert and
        //        validate if a record is found.
        $last_id = $DB->pselectOne(
            'SELECT MAX(GenomicFileID) AS last_id
           FROM genomic_files',
            array()
        );
        $fileToUpload->GenomicFileID = $last_id;

        $fileToUpload->date_inserted = $values['Date_inserted'];

    } catch (DatabaseException $e) {
        endWithFailure();
        //TODO: The below validation should be done before running the query.
        //      Currently, it generates unnecessary PHP warnings
        die(
            json_encode(
                array(
                 'message'  => 'File registration failed. Is the description empty?',
                 'progress' => 100,
                 'error'    => true,
                )
            )
        );
    }
    reportProgress(80, "File registered");
}

/**
 * This insert sample-candidate mapping to allow more that one
 * sets of beta-values per candidate.
 * NOTE : sample_label are prefixed by the insertion date to avoid
 *        duplication (data loss).
 *
 * @param object $fileToUpload The object containing the $_FILES
 *               and the $_POST values.
 *
 * @return void
 */
function createSampleCandidateRelations(&$fileToUpload)
{

    reportProgress(85, "Creating sample-candidate relations");

    $DB =& Database::singleton();

    $f = fopen(
        $fileToUpload->tmp_name,
        'r'
    );

    $line = fgets($f);
    fclose($f);

    $headers = explode(',', $line);
    array_shift($headers);

    $headers = array_map('trim', $headers);

    $headers = array_filter(
        $headers,
        'candidateExists'
    );

    $sample_label_prefix = date('U', strtotime($fileToUpload->date_inserted));
    array_walk(
        $headers,
        function (&$item, $key, $prefix) {
            $item = $prefix . '_' . trim($item);
        },
        $sample_label_prefix
    );

    $stmt = $DB->prepare(
        "
        INSERT IGNORE INTO
            genomic_sample_candidate_rel (sample_label, CandID)
        VALUES (
            :sample_label,
            (SELECT CandID FROM candidate WHERE PSCID = :pscid)
        )
    "
    );

    try {
        foreach ($headers as $pscid) {
            $success = $stmt->execute(
                array(
                 "sample_label" => $pscid,
                 "pscid"        => explode(
                     '_',
                     $pscid
                 )[1],
                )
            );
        }
        // Report number on relation created (candidate founded)
        reportProgress(90, "Relation created");
    } catch (Exception $e) {
        endWithFailure();
        die(
            json_encode(
                array(
                 'message'  => "Can't insert into the database.",
                 'progress' => 100,
                 'error'    => true,
                )
            )
        );
    }
}

/**
 * This insert the Methylation beta-values using the preexisting i
 * sample-candidate mapping.
 * NOTE : sample_label are prefixed by the insertion date to avoid
 *        duplication (data loss).
 *
 * @param object $fileToUpload The object containing the $_FILES
 *               and the $_POST values.
 *
 * @return void
 */
function insertBetaValues(&$fileToUpload)
{

    reportProgress(95, "Inserting beta-values");
    // Assuming genomic_cpg_annotation have ialready been created.
    // see: /module/genomic_browser/tool/human...

    $DB =& Database::singleton();

    $f = fopen(
        $fileToUpload->tmp_name,
        "r"
    );

    if ($f) {
        $line    = fgets($f);
        $headers = explode(',', $line);
        array_shift($headers);

        $headers = array_map('trim', $headers);

        $headers = array_filter(
            $headers,
            'candidateExists'
        );

        $sample_label_prefix = date('U', strtotime($fileToUpload->date_inserted));
        array_walk(
            $headers,
            function (&$item, $key, $prefix) {
                $item = $prefix . '_' . trim($item);
            },
            $sample_label_prefix
        );

        $sample_count = count($headers);

        $stmt = $DB->prepare(
            "
            INSERT IGNORE INTO
                genomic_cpg (sample_label, cpg_name, beta_value)
            VALUES (
                :sample_label,
                :cpg_name,
                :beta_value
            )
        "
        );

        while (($line = fgets($f)) !== false) {
            try {
                $values   = explode(',', $line);
                $values   = array_map('trim', $values);
                $probe_id = $values[0];
                // TODO validate probe value

                array_shift($values);
                foreach ($values as $key => $value) {
                    $success = $stmt->execute(
                        array(
                         "sample_label" => $headers[$key],
                         "cpg_name"     => $probe_id,
                         "beta_value"   => $value,
                        )
                    );
                    if (!$success) {
                        throw new DatabaseException("Failed to insert row");
                    }
                }
            } catch (Exception $e) {
                endWithFailure();
                die(
                    json_encode(
                        array(
                         'message'  => 'Insertion failed',
                         'progress' => 100,
                         'error'    => true,
                        )
                    )
                );
            }
        }
        fclose($f);
    } else {
        endWithFailure();
        die(
            json_encode(
                array(
                 'message'  => 'Beta value file can`t be opened',
                 'progress' => 100,
                 'error'    => true,
                )
            )
        );
    }
}

/**
 * This create the relations between the file and the candidates
 * that have values inserted.
 *
 * @param object $fileToUpload The object containing the $_FILES
 *               and the $_POST values.
 *
 * @return void
 */
function createCandidateFileRelations(&$fileToUpload)
{
    $DB =& Database::singleton();

    $f = fopen(
        $fileToUpload->tmp_name,
        "r"
    );

    if ($f) {
        try {
            $line = fgets($f);
            fclose($f);

            $headers = explode(',', $line);
            array_shift($headers);

            $stmt = $DB->prepare(
                "
                INSERT IGNORE INTO
                    genomic_candidate_files_rel (CandID, GenomicFileID)
                VALUES (
                    (select CandID from candidate where PSCID = :pscid),
                    :genomic_file_id
                )
            "
            );

            foreach ($headers as $pscid) {
                $pscid   = trim($pscid);
                $success = $stmt->execute(
                    array(
                     "pscid"           => $pscid,
                     "genomic_file_id" => $fileToUpload->GenomicFileID,
                    )
                );
                if (!$success) {
                    throw new DatabaseException("Failed to insert row");
                }
            }
        } catch (DatabaseException $e) {
            endWithFailure();
            die(
                json_encode(
                    array(
                     'message'  => 'File registration failed',
                     'progress' => 100,
                     'error'    => true,
                    )
                )
            );
        }
    } else {
        endWithFailure();
        die(
            json_encode(
                array(
                 'message'  => 'Beta value file can`t be opened',
                 'progress' => 100,
                 'error'    => true,
                )
            )
        );
    }
    reportProgress(95, "Creating file-candidate relations");

}

/**
 * This coordinate the Methylation beta-values insertions.
 *
 * @param object $fileToUpload The object containing the $_FILES
 *               and the $_POST values.
 *
 * @return void
 */
function insertMethylationData(&$fileToUpload)
{
    createSampleCandidateRelations($fileToUpload);
    insertBetaValues($fileToUpload);
    createCandidateFileRelations($fileToUpload);
}

/**
 * This sends progress status to the client.
 *
 * @param integer $progress The progress percentage to report
 * @param string  $message  The message to send
 *
 * @see XMLHttpRequest.onreadystatechange = 3 (progress)
 *
 * @return void
 */
function reportProgress($progress, $message)
{
    $response = array(
                 'message'  => $message,
                 'progress' => $progress,
                );
    echo json_encode($response);
    sleep(1);
}

/**
 * This function checks if a PSCID is associated with a candidate
 * in the database.
 *
 * @param string $pscid The PSCID to check
 *
 * @return boolean True if the candidate exists
 */
function candidateExists($pscid)
{

    $DB =& Database::singleton();

    $CandID = $DB->pselectOne(
        "SELECT CandID from candidate WHERE PSCID = :pscid",
        array("pscid" => $pscid)
    );

    return !empty($CandID);
}

/**
 * Begins the transaction for the file upload
 *
 * @return void
 */
function begin()
{
    $DB = Database::singleton();
    $DB->beginTransaction();
}

/**
 * Ends the transaction for the file upload with failure
 *
 * @return void
 */
function endWithFailure()
{
    $DB = Database::singleton();
    $DB->rollBack();
}

/**
 * Ends the transaction for the file upload with success
 *
 * @return void
 */
function endWithSuccess()
{
    $DB = Database::singleton();
    $DB->commit();
}

