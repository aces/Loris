<?php declare(strict_types=1);

/**
 * Used for uploading file with Genomic Browser.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser\uploading;

/**
 * The Genomicfile Class.
 *
 * This class provides the php code to process uploading
 * a user file from the genomic browser.
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Genomicfile
{
    /**
     * The file uploaded from the user.
     */
    private $_fileToUpload;

    /**
     * The bytes of the file.
     */
    private $_bytes;

    /**
     * The user uploading the file.
     */
    private $_user;

    /**
     * The post message array content.
     */
    private $_values;

    /**
     * Setup uploading configurations.
     *
     * @param object $user   The user uploading.
     * @param array  $files  The $_FILES array content.
     * @param array  $values The post message array content.
     *
     * @return array
     */
    function setupUploading($user, $files, $values) : array
    {
        if (!isset($files['file'])
            || empty($files['file']->getStream()->getMetadata('uri'))
        ) {
            return [];
        }
        $this->_user   = $user;
        $this->_bytes  = $files['file']->getSize();
        $this->_values = $values;
        $uri           = $files['file']->getStream()->getMetadata('uri');
        $this->_fileToUpload
            = (object) [
                'file_type'         => $files['file']->getClientMediaType(),
                'file_name'         => $files['file']->getClientFilename(),
                'tmp_name'          => $uri,
                'size'              => round($this->_bytes / 1048576, 0),
                'inserted_by'       => $this->_user->getData('UserID'),
                'genomic_file_type' => empty($this->_values['fileType']) ?
                null : str_replace('_', ' ', $this->_values['fileType']),
                'description'       => $this->_values['fileDescription'] ?? '',
            ];

        $this->setFullPath($this->_fileToUpload);

        switch ($this->_fileToUpload->genomic_file_type) {
        case 'Methylation beta-values':
            $this->begin();
            $this->registerFile($this->_fileToUpload);
            $this->insertMethylationData($this->_fileToUpload);
            $this->moveFileToFS($this->_fileToUpload);
            $this->endWithSuccess();
            break;
        case 'Other':
            $this->begin();
            $this->registerFile($this->_fileToUpload);
            $this->moveFileToFS($this->_fileToUpload);
            $this->endWithSuccess();
            break;
        default:
            $unsupported = $this->_fileToUpload->genomic_file_type;
            return [
                'message'  => "Unsupported filetype: $unsupported",
                'progress' => 100,
                'error'    => true,
            ];
        }

        return $this->reportProgress(100, 'Complete');
    }

    /**
     * This sends progress status to the client.
     *
     * @param integer $progress The progress percentage to report
     * @param string  $message  The message to send
     *
     * @see XMLHttpRequest.onreadystatechange = 3 (progress)
     *
     * @return array
     */
    function reportProgress($progress, $message) : array
    {
        $response = [
            'message'  => $message,
            'progress' => $progress,
        ];
        return $response;
    }

    /**
     * Begins the transaction for the file upload
     *
     * @return void
     */
    function begin() : void
    {
        $DB = \NDB_Factory::singleton()->database();
        $DB->beginTransaction();
    }

    /**
     * Ends the transaction for the file upload with failure
     *
     * @return void
     */
    function endWithFailure() : void
    {
        $DB = \NDB_Factory::singleton()->database();
        $DB->rollBack();
    }

    /**
     * Ends the transaction for the file upload with success
     *
     * @return void
     */
    function endWithSuccess() : void
    {
        $DB = \NDB_Factory::singleton()->database();
        $DB->commit();
    }

    /**
     * This moves the file from php tmp dir to the genomic data
     * directory specified in the configSettings.
     *
     * @param object $fileToUpload The object containing the $_FILES
     *                             and the $_POST values.
     *
     * @return void
     */
    function moveFileToFS(&$fileToUpload) : void
    {
        $dest_dir = dirname($fileToUpload->full_path);
        // update ui to show we are trying to move the file
        $this->reportProgress(98, "Copying file...");
        // file system validation
        try {
            if (!file_exists($fileToUpload->tmp_name)) {
                throw new \Exception(
                    "Some parts of path $fileToUpload->tmp_name does not exist."
                );
            } else if (!is_dir($dest_dir)) {
                throw new \Exception(
                    "$dest_dir exists but is not a directory."
                );
            } else if (!is_writable($dest_dir)) {
                throw new \Exception(
                    "$dest_dir is not writable by web user."
                );
            }
            if (move_uploaded_file(
                $fileToUpload->tmp_name,
                $fileToUpload->full_path
            )
            ) {
                $this->reportProgress(99, 'File successfully copied!');
            }
        } catch (\Exception $ex) {
            error_log("Cannot move file: $ex");
            $this->endWithFailure();
        }
    }

    /**
     * This coordinate the Methylation beta-values insertions.
     *
     * @param object $fileToUpload The object containing the $_FILES
     *                             and the $_POST values.
     *
     * @return void
     */
    function insertMethylationData(&$fileToUpload) : void
    {
        $this->createSampleCandidateRelations($fileToUpload);
        $this->insertBetaValues($fileToUpload);
        $this->createCandidateFileRelations($fileToUpload);
    }

    /**
     * This create the relations between the file and the candidates
     * that have values inserted.
     *
     * @param object $fileToUpload The object containing the $_FILES
     *                             and the $_POST values.
     *
     * @return void
     */
    function createCandidateFileRelations(&$fileToUpload) : void
    {
        $DB = \NDB_Factory::singleton()->database();

        $f = fopen(
            $fileToUpload->tmp_name,
            'r'
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
                        genomic_candidate_files_rel (CandidateID, GenomicFileID)
                    VALUES (
                        (select ID from candidate where PSCID = :pscid),
                        :genomic_file_id
                    )
                    "
                );

                foreach ($headers as $pscid) {
                    $pscid   = trim($pscid);
                    $success = $stmt->execute(
                        [
                            'pscid'           => $pscid,
                            'genomic_file_id' => $fileToUpload->GenomicFileID,
                        ]
                    );
                    if (!$success) {
                        throw new \DatabaseException('Failed to insert row');
                    }
                }
            } catch (\DatabaseException $e) {
                $this->endWithFailure();
            }
        } else {
            $this->endWithFailure();
        }
        $this->reportProgress(95, 'Creating file-candidate relations');
    }

    /**
     * This insert the Methylation beta-values using the preexisting i
     * sample-candidate mapping.
     * NOTE : sample_label are prefixed by the insertion date to avoid
     *        duplication (data loss).
     *
     * @param object $fileToUpload The object containing the $_FILES
     *                             and the $_POST values.
     *
     * @return void
     */
    function insertBetaValues(&$fileToUpload) : void
    {
        $this->reportProgress(95, 'Inserting beta-values');
        // Assuming genomic_cpg_annotation have already been created.
        // see: /module/genomic_browser/tool/human...

        $DB = \NDB_Factory::singleton()->database();

        $f = fopen(
            $fileToUpload->tmp_name,
            'r'
        );

        if ($f) {
            $line    = fgets($f);
            $headers = explode(',', $line);
            array_shift($headers);

            $headers = array_map('trim', $headers);

            $headers = array_filter(
                $headers,
                [
                    $this,
                    'candidateExists',
                ]
            );

            $sample_label_prefix = date(
                'U',
                strtotime($fileToUpload->date_inserted)
            );
            array_walk(
                $headers,
                function (&$item, $prefix) {
                    $item = $prefix . '_' . trim($item);
                },
                $sample_label_prefix
            );

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
                            [
                                'sample_label' => $headers ? $headers[$key] : '',
                                'cpg_name'     => $probe_id,
                                'beta_value'   => $value,
                            ]
                        );
                        if (!$success) {
                            throw new \DatabaseException('Failed to insert row');
                        }
                    }
                } catch (\Exception $e) {
                    $this->endWithFailure();
                }
            }
            fclose($f);
        } else {
            $this->endWithFailure();
        }
    }

    /**
     * This insert sample-candidate mapping to allow more that one
     * sets of beta-values per candidate.
     * NOTE : sample_label are prefixed by the insertion date to avoid
     *        duplication (data loss).
     *
     * @param object $fileToUpload The object containing the $_FILES
     *                             and the $_POST values.
     *
     * @return void
     */
    function createSampleCandidateRelations(&$fileToUpload) : void
    {
        $this->reportProgress(85, 'Creating sample-candidate relations');

        $DB = \NDB_Factory::singleton()->database();

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
            [
                $this,
                'candidateExists',
            ]
        );

        $sample_label_prefix = date('U', strtotime($fileToUpload->date_inserted));
        array_walk(
            $headers,
            function (&$item, $prefix) {
                $item = $prefix . '_' . trim($item);
            },
            $sample_label_prefix
        );

        $stmt = $DB->prepare(
            "
            INSERT IGNORE INTO
                genomic_sample_candidate_rel (sample_label, CandidateID)
            VALUES (
                :sample_label,
                (SELECT ID FROM candidate WHERE PSCID = :pscid)
            )
            "
        );

        try {
            foreach ($headers as $pscid) {
                $stmt->execute(
                    [
                        'sample_label' => $pscid,
                        'pscid'        => explode(
                            '_',
                            $pscid
                        )[1],
                    ]
                );
            }
            // Report number on relation created (candidate founded)
            $this->reportProgress(90, 'Relation created');
        } catch (\Exception $e) {
            $this->endWithFailure();
        }
    }

    /**
     * This function checks if a PSCID is associated with a candidate
     * in the database.
     *
     * @param string $pscid The PSCID to check
     *
     * @return boolean True if the candidate exists
     */
    function candidateExists($pscid) : bool
    {
        $DB = \NDB_Factory::singleton()->database();

        $CandID = $DB->pselectOne(
            "SELECT CandID from candidate WHERE PSCID = :pscid",
            ['pscid' => $pscid]
        );

        return !empty($CandID);
    }

    /**
     * Sets $fileToUpload->full_path
     *
     * @param object $fileToUpload The file to upload
     *
     * @return void
     */
    function setFullPath(&$fileToUpload) : void
    {
        $config           = \NDB_Config::singleton();
        $genomic_data_dir = rtrim(
            $config->getSetting('GenomicDataPath'),
            '/'
        ) . '/';

        $fileToUpload->full_path = $genomic_data_dir
            . $fileToUpload->file_name;

        $collision_count = 0;

        while (file_exists($fileToUpload->full_path)) {
            ++$collision_count;
            $ext = pathinfo($fileToUpload->file_name, PATHINFO_EXTENSION);
            $nme = pathinfo($fileToUpload->file_name, PATHINFO_FILENAME);
            $fileToUpload->full_path = $genomic_data_dir
                . $nme . '-' . $collision_count . '.' .$ext;
        }
    }

    /**
     * This insert a record in the genomic_files table
     *
     * @param object $fileToUpload The object containing the $_FILES
     *                             and the $_POST values.
     *
     * @return void
     */
    function registerFile(&$fileToUpload) : void
    {
        $DB = \NDB_Factory::singleton()->database();

        $values = [
            'FileName'         => $fileToUpload->full_path,
            'Description'      => $fileToUpload->description,
            'FileType'         => $fileToUpload->file_type,
            'AnalysisModality' => $fileToUpload->genomic_file_type,
            'FileSize'         => $fileToUpload->size,
            'Date_inserted'    => date('Y-m-d h:i:s', time()),
            'InsertedByUserID' => $fileToUpload->inserted_by,
        ];
        try {
            $DB->replace('genomic_files', $values);
            // This should select using date_insert and
            //  validate if a record is found.
            $last_id = $DB->pselectOne(
                'SELECT MAX(GenomicFileID) AS last_id
           FROM genomic_files',
                []
            );
            $fileToUpload->GenomicFileID = $last_id;

            $fileToUpload->date_inserted = $values['Date_inserted'];

        } catch (\DatabaseException $e) {
            $this->endWithFailure();
        }
        $this->reportProgress(80, 'File registered');
    }

}
