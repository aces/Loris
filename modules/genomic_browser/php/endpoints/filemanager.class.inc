<?php declare(strict_types=1);
/**
 * POST request methods.
 *
 * Used for populating the Genomic Browser.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\genomic_browser\endpoints;

use LORIS\genomic_browser\Provisioners\FilesProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
use \LORIS\Middleware\ETagCalculator;

/**
 * The NDB_Filter_Form_GenomicBrowser Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows filemanager to be processed as part of the genomic browser.
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class FileManager extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    private $_values;

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        case 'POST':
            return $this->_handlePOST($request);
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }
    /**
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();
        // User permission verification.
        $values = $this->_verifyPermissions($request, $values);
        if (isset($values['error'])) {
            switch ($values['error']) {
            case 'BadRequest':
                return new \LORIS\Http\Response\BadRequest(
                    'Failed to retrieve data for create timepoint.'
                );
            case 'Forbidden':
                return new \LORIS\Http\Response\Forbidden(
                    'Forbidden'
                );
            default:
                break;
            }
        }
        $user        = $request->getAttribute('user');
        $provisioner = (new FilesProvisioner())->forUser($user);
        // $provisioner = (new FilesProvisioner())->filter();
        $data         = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body         = array(
                         'data'         => $data,
                         'fieldOptions' => $this->_getFieldOptions(),
                         'subprojects'  => \Utility::getSubprojectList(),
                         'permissions'  => [
                                            'user'           => $user->getUsername(),
                                            'upload_allowed' => $user->hasPermission(
                                                'genomic_data_manager'
                                            ),
                                           ],
                        );
        $this->_cache = new \LORIS\Http\Response\JsonResponse($body);
        return $this->_cache;
    }

    /**
     * Provide the select inputs options
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions() : array
    {
        return array(
                'genomic_file_id' => $this->_formElementObjectCreator(
                    'genomic_file_id',
                    'text',
                    'Type',
                    null
                ),
                'file_name'         => $this->_formElementObjectCreator(
                    'file_name',
                    'text',
                    'Name',
                    null
                ),
                'description'       => $this->_formElementObjectCreator(
                    'description',
                    'text',
                    'Description',
                    null
                ),
                'genomic_file_type' => $this->_formElementObjectCreator(
                    'genomic_file_type',
                    'text',
                    'Type',
                    null
                ),
                'date_inserted'     => $this->_formElementObjectCreator(
                    'date_inserted',
                    'text',
                    'Date inserted',
                    null
                ),
                'inserted_by_user_id' => $this->_formElementObjectCreator(
                    'inserted_by_user_id',
                    'text',
                    'Inserted by User',
                    null
                ),
                'caveat'            => $this->_formElementObjectCreator(
                    'caveat',
                    'select',
                    'Caveat',
                    $this->getDistinctValues(
                        'genomic_files',
                        'Caveat'
                    )
                ),
                'notes'             => $this->_formElementObjectCreator(
                    'notes',
                    'text',
                    'Notes',
                    null
                ),
               );
    }

    /**
     * Provide an array of distinct value from a column in
     * the specified table. The first element has a null key and
     * its value is 'Any'.
     *
     * @param string $table  The tables name
     * @param string $column The column name
     *
     * @return array An array where value are keys as well as values
     */
    function getDistinctValues( $table, $column)
    {
        $DB      = \Database::singleton();
        $results = $DB->pselect(
            "SELECT DISTINCT $column FROM $table ",
            array()
        );
        return array_reduce(
            $results,
            function ($carry, $item) {
                $value = array_values($item)[0];
                if (!empty($value)) {
                    $carry[str_replace(' ', '_', $value)] = $value;
                }
                return $carry;
            },
            array(null => 'Any')
        );

    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $this->_values = $request->getParsedBody();

        // User permission verification.
        $this->_values = $this->_verifyPermissions($request, $this->_values);
        if (isset($this->_values['error'])) {
            switch ($this->_values['error']) {
            case 'BadRequest':
                return new \LORIS\Http\Response\BadRequest(
                    'Failed to retrieve data for create timepoint.'
                );
            case 'Forbidden':
                return new \LORIS\Http\Response\Forbidden(
                    'Forbidden'
                );
            default:
                break;
            }
        }

        $user  = $request->getAttribute('user');
        $bytes = $_FILES['file']['size'];

        $fileToUpload
            = (object) array(
            'file_type'         => $_FILES['file']['type'],
            'file_name'         => $_FILES['file']['name'],
            'tmp_name'          => $_FILES['file']['tmp_name'],
            'size'              => round($bytes / 1048576, 0),
            'inserted_by'       => $user->getData('UserID'),
            'genomic_file_type' => empty($this->_values['fileType']) ?
                null : str_replace('_', ' ', $this->_values['fileType']),
            'description'       => $this->_values['fileDescription'],
        );

        $this->setFullPath($fileToUpload);

        switch ($fileToUpload->genomic_file_type) {
            case 'Methylation beta-values':
                $this->validateRequest();
                $this->begin();
                $this->registerFile($fileToUpload);
                $this->insertMethylationData($fileToUpload);
                $this->moveFileToFS($fileToUpload);
                $this->endWithSuccess();
                break;
            case 'Other':
                $this->begin();
                $this->registerFile($fileToUpload);
                $this->moveFileToFS($fileToUpload);
                $this->endWithSuccess();
                break;
            default:
                die(
                json_encode(
                    array(
                        'message' => "Unsupported filetype: $fileToUpload->genomic_file_type",
                        'progress' => 100,
                        'error' => true,
                    )
                )
                );
        }

        $this->reportProgress(100, 'Complete');

        return new \LORIS\Http\Response\JsonResponse(
            $this->_values
        );
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
     * Begins the transaction for the file upload
     *
     * @return void
     */
    function begin()
    {
        $DB = \Database::singleton();
        $DB->beginTransaction();
    }

    /**
     * Ends the transaction for the file upload with failure
     *
     * @return void
     */
    function endWithFailure()
    {
        $DB = \Database::singleton();
        $DB->rollBack();
    }

    /**
     * Ends the transaction for the file upload with success
     *
     * @return void
     */
    function endWithSuccess()
    {
        $DB = \Database::singleton();
        $DB->commit();
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

        $config           = \NDB_Config::singleton();
        $genomic_data_dir = $config->getSetting('GenomicDataPath');

        $dest_dir = dirname($fileToUpload->full_path);
        // update ui to show we are trying to move the file
        reportProgress(98, "Copying file...");
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
                reportProgress(99, "File successfully copied!");
            }
        } catch (\Exception $ex){
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
     * This coordinate the Methylation beta-values insertions.
     *
     * @param object $fileToUpload The object containing the $_FILES
     *               and the $_POST values.
     *
     * @return void
     */
    function insertMethylationData(&$fileToUpload)
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
     *               and the $_POST values.
     *
     * @return void
     */
    function createCandidateFileRelations(&$fileToUpload)
    {
        $DB =& \Database::singleton();

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
                            'pscid'           => $pscid,
                            'genomic_file_id' => $fileToUpload->GenomicFileID,
                        )
                    );
                    if (!$success) {
                        throw new \DatabaseException('Failed to insert row');
                    }
                }
            } catch (\DatabaseException $e) {
                $this->endWithFailure();
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
            $this->endWithFailure();
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
        $this->reportProgress(95, "Creating file-candidate relations");
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
        $this->reportProgress(95, 'Inserting beta-values');
        // Assuming genomic_cpg_annotation have already been created.
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
                                'sample_label' => $headers[$key],
                                'cpg_name'     => $probe_id,
                                'beta_value'   => $value,
                            )
                        );
                        if (!$success) {
                            throw new \DatabaseException('Failed to insert row');
                        }
                    }
                } catch (\Exception $e) {
                    $this->endWithFailure();
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
            $this->endWithFailure();
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

        $this->reportProgress(85, 'Creating sample-candidate relations');

        $DB =& \Database::singleton();

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
            'candidateExist'
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
                        'sample_label' => $pscid,
                        'pscid'        => explode(
                            '_',
                            $pscid
                        )[1],
                    )
                );
            }
            // Report number on relation created (candidate founded)
            reportProgress(90, 'Relation created');
        } catch (\Exception $e) {
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
     * This function checks if a PSCID is associated with a candidate
     * in the database.
     *
     * @param string $pscid The PSCID to check
     *
     * @return boolean True if the candidate exists
     */
    function candidateExists($pscid)
    {
        $DB =& \Database::singleton();

        $CandID = $DB->pselectOne(
            "SELECT CandID from candidate WHERE PSCID = :pscid",
            array("pscid" => $pscid)
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
    function setFullPath(&$fileToUpload)
    {
        $config           = \NDB_Config::singleton();
        $genomic_data_dir = rtrim($config->getSetting('GenomicDataPath'), '/')
            . '/genomic_uploader/';

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
     * This verify if the required parameters have been provided.
     *
     * @return void
     */
    function validateRequest()
    {
        $this->reportProgress(10, 'Validating...');
        if (empty($this->_values['pscidColumn'])
            || empty($_FILES['file'])
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
        $this->reportProgress(25, 'Validation completed');
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
        $DB     =& \Database::singleton();
        $config = \NDB_Config::singleton();
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

        } catch (\DatabaseException $e) {
            $this->endWithFailure();
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
        $this->reportProgress(80, 'File registered');
    }

    /**
     * Permission verification.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     * @param array                  $values  The form values.
     *
     * @return array
     */
    private function _verifyPermissions(
        ServerRequestInterface $request,
        array $values
    ) : array {
        $user = $request->getAttribute('user');
        if (!$user->hasPermission('genomic_browser_view_site')
            || !$user->hasPermission('genomic_browser_view_allsites')
        ) {
            $values['error'] = 'Forbidden';
            return $values;
        }
        return $values;
    }

    /**
     * Used to create (select, text, ...) element for form filter.
     *
     * @param string     $name   for element
     * @param string     $type   for element
     * @param string     $label  for element
     * @param array|null $values for element
     *
     * @return object
     */
    private function _formElementObjectCreator(
        string $name,
        string $type,
        string $label,
        ?array $values
    ) : object {
        $element        = new \stdClass();
        $element->name  = $name;
        $element->type  = $type;
        $element->label = $label;
        if (isset($values)) {
            $element->options = $values;
        }
        return $element;
    }


    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Returns true if the user has permission to access
     * the Genomic Browser module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('genomic_browser_view_allsites')
            || $user->hasPermission('genomic_browser_view_site'));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return array(
                'GET',
                'POST',
               );
    }

    /**
     * Return a list of LORIS API versions which this endpoint
     * supports.
     *
     * @return string[] LORIS API Versions
     */
    protected function supportedVersions(): array
    {
        return array('unknown');
    }
}
