<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use SodiumException;
require_once "Archive/Tar.php";

/**
 * Contains the File_Reader class used for electrophysiological browser
 *
 * PHP Version 7
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Annotations extends \NDB_Page
{
    /**
     * Determine whether the user has permission to create and edit the derivatives
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user can create and edit the derivatives
     */
    function _hasAccess(\User $user): bool
    {
        return ($user->hasPermission('electrophysiology_browser_edit_annotations'));
    }

    /**
     * Handle how to operate all the files.
     * GET method gets a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $parameters = $request->getQueryParams();
        $user       = $request->getAttribute('user');
        
        if (!$this->_hasAccess($user)) {
            return (new \LORIS\Middleware\PageDecorationMiddleware($user))
                ->process(
                    $request,
                    new \LORIS\Http\StringStream("Permission denied")
                )->withStatus(403);
        }

        $config       = \NDB_Factory::singleton()->config();
        $downloadpath = \Utility::appendForwardSlash(
            $config->getSetting("dataDirBasepath")
        );
        
        switch ($request->getMethod()) {
        case 'GET':
            if (array_key_exists('physioFileID', $parameters)
                && array_key_exists('filePath', $parameters)
            ) {
                $physioFileID = intval($parameters['physioFileID']) ?? null;
                self::updateDerivativeFiles($physioFileID);

                $config       = \NDB_Factory::singleton()->config();
                $downloadpath = \Utility::appendForwardSlash(
                    $config->getSetting("dataDirBasepath")
                );

                $file     = $parameters['filePath'] ?? null;
                $filename = urldecode(basename($file));
                $path     = dirname($file);

                $downloader = new \LORIS\FilesDownloadHandler(
                    new \SPLFileInfo($downloadpath . $path)
                );
                return $downloader->handle(
                    $request->withAttribute('filename', $filename)
                );
            }

        case 'DELETE':
            $this->_deleteAnnotation($request);
            return (new \LORIS\Http\Response\JSON\OK());
        default:
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ["GET", "DELETE"]
            ));
        }
    }


    /**
     * Gets the annotation data for the given physiological file
     *
     * @param int $physioFileID Electrophysiological file ID
     *
     * @return array array with the data for each annotation for the file
     */
    function getAnnotations(int $physioFileID): array
    {
        $db = \NDB_Factory::singleton()->database();

        $result         = [];
        $params         = [];
        $params['PFID'] = $physioFileID;

        //Get the annotation file IDs
        $instanceFileID = $db->pselect(
            'SELECT AnnotationFileID
                FROM physiological_annotation_file
                WHERE PhysiologicalFileID=:PFID
                AND FileType="tsv"',
            $params
        );
        $metadataFileID = $db->pselect(
            'SELECT AnnotationFileID
                FROM physiological_annotation_file
                WHERE PhysiologicalFileID=:PFID
                AND FileType="json"',
            $params
        );

        $params['instance_FID'] = $instanceFileID;
        $params['metadata_FID'] = $metadataFileID;

        //Get the information for each annotation for the given file
        $annotationInstance  = $db->pselect(
            'SELECT * FROM physiological_annotation_instance
                WHERE AnnotationFileID=:instance_FID',
            $params
        );
        $result['instances'] = $annotationInstance;

        //Get the metadata for the annotations of the given file
        $annotationMetadata = $db->pselect(
            'SELECT * FROM physiological_annotation_parameter
                WHERE AnnotationFileID=:metadata_FID',
            $params
        );
        $result['metadata'] = $annotationMetadata;

        //Get all pre-existing label types
        $annotationLabels = $db->pselect(
            'SELECT * FROM physiological_annotation_label',
            $params
        );
        $result['labels'] = $annotationLabels;

        return $result;
    }

    /**
     * Updates annotation tables when there is a POST request.
     * Will add new derivative files if none exist for the given instance.
     * Will either add new annotations or update existing ones.
     *
     * @param ServerRequestInterface $request POST request from server
     *
     * @return void
     */
    function _updateAnnotation(ServerRequestInterface $request)
    {
        $values        = $request->getQueryParams();
        $physioFileID  = $values['physioFileID'];
        $params        = ['PFID' => $physioFileID];
        $instance_data = $values['instance'];
        $user          = \NDB_Factory::singleton()->user();
        $db            = \NDB_Factory::singleton()->database();

        if ($this->_hasAccess($user)) {

            $physioFilePath = $db->pselectone(
                'SELECT FilePath
                    FROM physiological_file
                    WHERE PhysiologicalFileID=:PFID',
                $params
            );

            //If the label is new, add to annotation label table
            //and get label ID
            $labelID = $db->pselectone(
                "SELECT AnnotationLabelID
                    FROM physiological_annotation_label
                    WHERE LabelName=:label",
                ['label' => $instance_data['label_name']]
            );
            if (empty($labelID)) {
                $data = [
                    'LabelName'        => $instance_data['label_name'],
                    'LabelDescription' => $instance_data['label_description']
                ];
                $db->insert("physiological_annotation_label", $data);
                $labelID = $db->pselectone(
                    "SELECT AnnotationLabelID
                        FROM physiological_annotation_label
                        WHERE LabelName=:label",
                    ['label' => $instance_data['label_name']]
                );
            }

            //If no derivative files exist, must create new files
            $annotationFID = $db->pselect(
                "SELECT AnnotationFileID
                    FROM physiological_annotation_file
                    WHERE PhysiologicalFileID=:PFID",
                $params
            );

            //Get data from POST request
            $metadata = [
                'Description' => $values['description'],
                'Sources'     => $values['sources'],
                'Author'      => $values['author']
            ];

            $instance = [
                'Onset'             => $instance_data['onset'],
                'Duration'          => $instance_data['duration'],
                'AnnotationLabelID' => $labelID,
                'Channels'          => $instance_data['channels'],
                'AbsoluteTime'      => $instance_data['abs_time'],
                'Description'       => $instance_data['description']
            ];

            //Insert new files and data into DB
            if (empty($annotationFID)) {

                //Create new filepaths
                //Get data directory base path from Config
                $dataDirID = $db->pselectone(
                    'SELECT ID
                        FROM ConfigSettings
                        WHERE Name=:name',
                    ['name' => 'dataDirBasepath']
                );
                $dataDir   = $db->pselectone(
                    'SELECT Value
                        FROM Config
                        WHERE ConfigID=:id',
                    ['id' => $dataDirID]
                );
                //Create path with correct structure
                $subPath       = strstr($physioFilePath, "sub");
                $pathWithDeriv = $dataDir
                    . "bids_imports/derivatives/loris_annotations/"
                    . $subPath;
                //Create directories if they don't exist
                $dirname = pathinfo($pathWithDeriv, PATHINFO_DIRNAME);
                if (!file_exists($dirname)) {
                    mkdir($dirname, 0777, true);
                    echo "Derivative folder created\n";
                }
                //Replace file type with "annotations"
                $pathWithoutEDF = substr(
                    $pathWithDeriv,
                    0,
                    strrpos($pathWithDeriv, "_")
                );

                $tsv_path  = $pathWithoutEDF . "_annotations.tsv";
                $json_path = $pathWithoutEDF . "_annotations.json";
                $tgz_path  = $pathWithoutEDF . "_annotations.tgz";
                //Create files
                $tsv_file  = fopen($tsv_path, 'a+');
                $json_file = fopen($json_path, 'a+');
                $tgz_file  = new \PharData($tgz_path);
                $tgz_file->addFile($tsv_path, basename($tsv_path));
                $tgz_file->addFile($json_path, basename($json_path));
                fclose($tsv_file);
                fclose($json_file);

                $f    = file_get_contents($tgz_path);
                $hash = sodium_crypto_generichash($f);

                $params_tsv     = [
                    'PhysiologicalFileID' => $physioFileID,
                    'FileType'            => 'tsv',
                    'FilePath'            => str_replace($dataDir, '', $tsv_path)
                ];
                $params_json    = [
                    'PhysiologicalFileID' => $physioFileID,
                    'FileType'            => 'json',
                    'FilePath'            => str_replace($dataDir, '', $json_path),
                ];
                $params_archive = [
                    'PhysiologicalFileID' => $physioFileID,
                    'FilePath'            => str_replace($dataDir, '', $tgz_path),
                    'Blake2bHash'         => bin2hex($hash)
                ];
                $db->insert("physiological_annotation_file", $params_tsv);
                $db->insert("physiological_annotation_file", $params_json);
                $db->insert("physiological_annotation_archive", $params_archive);

                //Get new annotation file ID
                $annotation_tsv_ID = $db->pselectone(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='tsv'",
                    $params
                );
                //Get new annotation file ID
                $annotation_json_ID = $db->pselectone(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='json'",
                    $params
                );
                echo $annotation_json_ID . "\n";
                $metadata['AnnotationFileID'] = $annotation_json_ID;
                $instance['AnnotationFileID'] = $annotation_tsv_ID;

                $db->insert("physiological_annotation_parameter", $metadata);

                //Get new metadata file ID
                $metadata_ID = $db->pselectone(
                    "SELECT AnnotationParameterID
                        FROM physiological_annotation_parameter
                        WHERE AnnotationFileID=:annotation_ID",
                    ['annotation_ID' => $annotation_json_ID]
                );

                $instance['AnnotationParameterID'] = $metadata_ID;

                $db->insert("physiological_annotation_instance", $instance);

            } else {
                //If the files are not new
                //Get annotation file ID for the tsv file
                $tsv_ID = $db->pselectone(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='tsv'",
                    $params
                );
                //Get annotation file ID for the json file
                $json_ID = $db->pselectone(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='json'",
                    $params
                );

                $instance['AnnotationFileID'] = $tsv_ID;
                $metadata['AnnotationFileID'] = $json_ID;

                /* If no instance ID is specified, insert new instance
                 * into instance table and get the parameter file ID
                 * from the parameter table
                 */
                if (empty($values['instance_id'])) {
                    $parameterID = $db->pselectone(
                        "SELECT AnnotationParameterID
                            FROM physiological_annotation_parameter
                            WHERE AnnotationFileID=:annotationFID",
                        ['annotationFID' => $json_ID]
                    );
                    $instance['AnnotationParameterID'] = $parameterID;

                    $db->insert('physiological_annotation_instance', $instance);
                } else {
                    $db->update(
                        'physiological_annotation_instance',
                        $instance,
                        ['AnnotationInstanceID' => $values['instance_id']]
                    );
                }
                //Update parameter table if parameter ID provided
                if (!empty($values['parameter_id'])) {
                    $db->update(
                        'physiological_annotation_parameter',
                        $metadata,
                        ['AnnotationParameterID' => $values['parameter_id']]
                    );
                }

                //In all cases where files are not new,
                //set LastUpdate time for all related files
                $db->update(
                    'physiological_annotation_file',
                    ['LastUpdate' => date("Y-m-d H:i:s")],
                    ['PhysiologicalFileID' => $physioFileID]
                );
            }
        }
    }

    /**
     * Deletes one annotation from a given physiological file
     *
     * @param ServerRequestInterface $request DELETE request from server
     *
     * @return void
     */
    function _deleteAnnotation(ServerRequestInterface $request)
    {
        $values = $request->getQueryParams();
        $user   = \NDB_Factory::singleton()->user();
        $db     = \NDB_Factory::singleton()->database();
        $params = [
            'AnnotationFileID'     => $values['annotationFileID'],
            'AnnotationInstanceID' => $values['instance_id']
        ];

        if ($this->_hasAccess($user)) {
            $db->delete("physiological_annotation_instance", $params);
        }
    }

    /**
     * Updates the derivative files associated with the given
     * physiological file ID
     *
     * @param int $physioFileID File ID for the annotations to updaete
     *
     * @return void
     * @throws SodiumException
     */
    static function updateDerivativeFiles(int $physioFileID): void
    {
        $db = \NDB_Factory::singleton()->database();

        //Get data directory base path from Config
        $dataDirID = $db->pselectone(
            'SELECT ID
            FROM ConfigSettings
            WHERE Name=:name',
            ['name' => 'dataDirBasepath']
        );
        $dataDir   = $db->pselectone(
            'SELECT Value
            FROM Config
            WHERE ConfigID=:id',
            ['id' => $dataDirID]
        );

        $tsv_entries = [
            'onset', 'duration', 'label', 'channels', 'aboslute_time', 'description'
        ];

        $params      = ['PFID' => $physioFileID];
        $tsv_id      = $db->pselectone(
            "SELECT AnnotationFileID
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='tsv'",
            $params
        );
        $tsv_path    = $db->pselectone(
            "SELECT FilePath
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='tsv'",
            $params
        );
        $tsv_update  = $db->pselectone(
            "SELECT LastUpdate
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='tsv'",
            $params
        );
        $json_id     = $db->pselectone(
            "SELECT AnnotationFileID
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='json'",
            $params
        );
        $json_path   = $db->pselectone(
            "SELECT FilePath
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='json'",
            $params
        );
        $json_update = $db->pselectone(
            "SELECT LastUpdate
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='json'",
            $params
        );
        $tgz_path    = $db->pselectone(
            "SELECT FilePath
            FROM physiological_annotation_archive
            WHERE PhysiologicalFileID=:PFID",
            $params
        );

        $tsv_path  = $dataDir.$tsv_path;
        $json_path = $dataDir.$json_path;
        $tgz_path  = $dataDir.$tgz_path;

        $tsv_timestamp  = filemtime($tsv_path);
        $json_timestamp = filemtime($json_path);

        //Update files if files updated before database updated
        if ($tsv_timestamp > $tsv_update
            || $json_timestamp > $json_update
        ) {
            //Update the three files with the given paths
            $labels   = []; // Label Name => Label Description
            $tsv_file = fopen($tsv_path, 'w'); //Will override all file content
            //Add columns
            $columns = implode("\t", $tsv_entries);
            fwrite($tsv_file, $columns."\n");
            //Get all annotation instances
            //Then go thru each and get the label name + description
            //add label name to file and also to an array for json file
            //change anything null to n/a
            $instances = $db->pselect(
                "SELECT
                Onset,
                Duration,
                AnnotationLabelID,
                Channels,
                AbsoluteTime,
                Description
                FROM physiological_annotation_instance
                WHERE AnnotationFileID=:AFID",
                ['AFID' => $tsv_id]
            );

            foreach ($instances as $instance) {

                //First, get label name/description
                $label_name = $db->pselectone(
                    "SELECT LabelName
                    FROM physiological_annotation_label
                    WHERE AnnotationLabelID=:labelID",
                    ['labelID' => $instance['AnnotationLabelID']]
                );
                $label_desc = $db->pselectone(
                    "SELECT LabelDescription
                    FROM physiological_annotation_label
                    WHERE AnnotationLabelID=:labelID",
                    ['labelID' => $instance['AnnotationLabelID']]
                );

                if (is_null($label_name)) {
                    $label_name = "";
                }
                $labels[$label_name] = $label_desc;

                //Setup each column in correct order
                $input_tsv = [
                    $instance['Onset'],
                    $instance['Duration'],
                    $label_name,
                    $instance['Channels'],
                    $instance['AbsoluteTime'],
                    $instance['Description']
                ];
                //Set all null values to 'n/a'
                $input_tsv = array_map(
                    function ($v) {
                        return (is_null($v)) ? "n/a" : $v;
                    },
                    $input_tsv
                );
                //Implode with tabs as delimeter
                $input = implode("\t", $input_tsv);

                fwrite($tsv_file, $input."\n");
            }
            fclose($tsv_file);

            //Write to metadata (json) file
            //Get metadata from database (should only be 1 entry)
            $json_desc   = $db->pselectone(
                "SELECT Description
                FROM physiological_annotation_parameter
                WHERE AnnotationFileID=:PFID",
                ['PFID' => $json_id]
            );
            $json_source = $db->pselectone(
                "SELECT Sources
                FROM physiological_annotation_parameter
                WHERE AnnotationFileID=:PFID",
                ['PFID' => $json_id]
            );
            $json_author = $db->pselectone(
                "SELECT Author
                FROM physiological_annotation_parameter
                WHERE AnnotationFileID=:PFID",
                ['PFID' => $json_id]
            );
            //Get "IntendedFor" entry: physiological file path
            $physioFilePath = $db->pselectone(
                "SELECT FilePath
                FROM physiological_file
                WHERE PhysiologicalFileID=:PFID",
                ['PFID' => $physioFileID]
            );

            $input_json   = [
                "Description"      => $json_desc,
                "IntendedFor"      => $physioFilePath,
                "Sources"          => $json_source,
                "Author"           => $json_author,
                "LabelDescription" => $labels
            ];
            $input_encode = json_encode($input_json, JSON_PRETTY_PRINT);

            $json_file = fopen($json_path, 'w');
            fwrite($json_file, $input_encode);
            fclose($json_file);

            //Make archive tgz and create new hash
            $tgz_file = new \PharData($tgz_path);
            $tgz_file->addFile($tsv_path, basename($tsv_path));
            $tgz_file->addFile($json_path, basename($json_path));

            $f    = file_get_contents($tgz_path);
            $hash = sodium_crypto_generichash($f);
            //Update database with hash
            $db->update(
                'physiological_annotation_archive',
                ['Blake2bHash' => bin2hex($hash)],
                ['PhysiologicalFileID' => $physioFileID]
            );
        }
    }

    /**
     * Writes to any derivative files that are not up to date
     * with the data in the database
     *
     * @return void
     */
    static function updateAllDerivativeFiles() : void
    {
        $db = \NDB_Factory::singleton()->database();

        //Get all file IDs that must be updated
        $physioFileIDs = $db->pselect(
            "SELECT DISTINCT PhysiologicalFileID
            FROM physiological_annotation_file",
            []
        );
        foreach ($physioFileIDs as $id) {
            self::updateDerivativeFiles(intval($id['PhysiologicalFileID']));
        }
    }
}