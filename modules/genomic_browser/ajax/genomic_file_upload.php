<?php
/**
 * This allows uploading of files for the genomic module.
 *
 * NOTE : This require a genomic_uploader directory under the
 * GenomicDataPath directory specified in the cconfigSettings.
 * This directory needs to be accessible w/r to the apache user.
 *
 * PHP Version 5
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
reportProgress(1, 'Validating...');

$fileToUpload
    = (object) array(
                'file_type'         => $_FILES["fileData"]["type"],
                'file_name'         => $_FILES["fileData"]["name"],
                'tmp_name'          => $_FILES["fileData"]["tmp_name"],
                'size'              => $_FILES["fileData"]['size'],
                'inserted_by'       => $userSingleton->getData('UserID'),
                'genomic_file_type' => empty($_POST['fileType']) ?
                    null : str_replace('_', ' ', $_POST['fileType']),
                'description'       => $_POST['description'],
               );

switch ($fileToUpload->genomic_file_type) {
case 'Methylation beta-values':
    validateRequest();
    moveFileToFS($fileToUpload);
    registerFile($fileToUpload);
    insertMethylationData($fileToUpload);
    break;
case 'Other':
    moveFileToFS($fileToUpload);
    registerFile($fileToUpload);
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
    reportProgress(4, "Validation completed");
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
    $DB =& Database::singleton();
    reportProgress(5, "Copying file to $genomic_data_dir ");
    if (move_uploaded_file(
        $fileToUpload->tmp_name,
        $genomic_data_dir . 'genomic_uploader/'
        . $fileToUpload->file_name
    )) {
        reportProgress(5, "File copied to $genomic_data_dir ");
    } else {
        die(
            json_encode(
                array(
                 'message'  => 'File copy failed',
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
               'FileName'         => $genomic_data_dir
                   . 'genomic_uploader/' . $fileToUpload->file_name,
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
    reportProgress(15, "File copied");

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

    reportProgress(20, "Creating sample-candidate relations");

    $config           = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');
    $DB =& Database::singleton();

    $stmt = 'INSERT IGNORE INTO genomic_sample_candidate_rel (sample_label, CandID)
             VALUES ';
    $rows = array();

    $f = fopen(
        $genomic_data_dir . 'genomic_uploader/'
            . $fileToUpload->file_name,
        'r'
    );

    $line = fgets($f);
    fclose($f);

    $headers = explode(',', $line);
    array_shift($headers);

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

    $rows = array_map(
        function ($pscid) {
            return "( '$pscid', 
           (SELECT CandID FROM candidate WHERE PSCID = '"
            . explode('_', $pscid)[1]
            . "'))";
        },
        $headers
    );

    $stmt .= join(',', $rows);
    try {
        $prep   = $DB->prepare($stmt);
        $result = $DB->execute($prep, array(), array('nofetch' => true));
        // Report number on relation created (candidate founded)
        reportProgress(24, "Relation created");

    } catch (Exception $e) {
        die(
            json_encode(
                array(
                 'message'  => 'Can`t insert into the database.',
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

    reportProgress(25, "Inserting beta-values");
    // Assuming genomic_cpg_annotation have ialready been created.
    // see: /module/genomic_browser/tool/human...

    $config           = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');
    $DB =& Database::singleton();

    $f = fopen(
        $genomic_data_dir . 'genomic_uploader/'
            . $fileToUpload->file_name,
        "r"
    );

    if ($f) {

        $stmt_prefix = 'INSERT IGNORE INTO genomic_cpg 
           (sample_label, cpg_name, beta_value) VALUES ';

        $line    = fgets($f);
        $headers = explode(',', $line);
        array_shift($headers);

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

        while (($line = fgets($f)) !== false) {
            $stmt = '';

            $values   = explode(',', $line);
            $values   = array_map('trim', $values);
            $probe_id = $values[0];
            // TODO validate probe value

            array_shift($values);
            $rows = array();
            foreach ($values as $key => $value) {
                $row = "('$headers[$key]', '$probe_id', $value)";
                array_push($rows, $row);
            }

            $stmt .= join(',', $rows);

            try {
                $prep   = $DB->prepare($stmt_prefix . $stmt);
                $result = $DB->execute($prep, array(), array('nofetch' => true));
            } catch (Exception $e) {
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
    $config           = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');
    $DB =& Database::singleton();

    $f = fopen(
        $genomic_data_dir . 'genomic_uploader/'
            . $fileToUpload->file_name,
        "r"
    );

    if ($f) {

        $stmt_prefix = 'INSERT IGNORE INTO genomic_candidate_files_rel
            (CandID, GenomicFileID) VALUES ';
        $stmt        = '';

        $line = fgets($f);
        fclose($f);

        $headers = explode(',', $line);
        array_shift($headers);

        $rows = array();
        foreach ($headers as $pscid) {
            $pscid = trim($pscid);
            $row   = "(
               (select CandID from candidate where PSCID = '$pscid'),
               $fileToUpload->GenomicFileID
            )";
            array_push($rows, $row);
        }
        $stmt .= join(',', $rows);

        try {

            $prep   = $DB->prepare($stmt_prefix . $stmt);
            $result = $DB->execute($prep, array(), array('nofetch' => true));

        } catch (DatabaseException $e) {
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
    reportProgress(50, "Creating file-candidate relations");

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
 * see XMLHttpRequest.onreadystatechange = 3 (progress)
 *
 * @param integer $progress The progress percentage to report
 * @param string  $message  The message to send
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

    $DB    =& Database::singleton();
    $pscid = $DB->quote(trim($pscid));

    $CandID = $DB->pselectOne(
        "SELECT CandID from candidate WHERE PSCID = $pscid",
        array()
    );

    return !empty($CandID);
}
?>
