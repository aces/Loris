<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser\Models;
use SodiumException;

/**
 * This object contains the methods to get/update/delete
 * Electrophysiology annotations from the DB
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ElectrophysioAnnotations
{
    private int $_physioFileID;
    private array $_data;

    /**
     * Construct an Annotation object
     *
     * @param integer $physioFileID Electrophysiological file ID
     *                              to collect annotation data from
     */
    function __construct(int $physioFileID)
    {
        $this->_physioFileID = $physioFileID;
        $db = \NDB_Factory::singleton()->database();

        $annotationInstance = $db->pselect(
            'SELECT i.* 
                FROM physiological_annotation_instance AS i
                JOIN physiological_annotation_file AS f
                ON f.AnnotationFileID = i.AnnotationFileID 
                WHERE f.PhysiologicalFileID=:PFID AND f.FileType="tsv"',
            ['PFID' => $this->_physioFileID]
        );

        $annotationMetadata = $db->pselect(
            'SELECT p.*
                FROM physiological_annotation_parameter AS p
                JOIN physiological_annotation_file AS f
                ON f.AnnotationFileID = p.AnnotationFileID
                WHERE f.PhysiologicalFileID=:PFID AND f.FileType="json"',
            ['PFID' => $this->_physioFileID]
        );

        $annotationLabels = $db->pselect(
            'SELECT * FROM physiological_annotation_label',
            ['PFID' => $this->_physioFileID]
        );

        $this->_data = [
            'instances' => $annotationInstance,
            'metadata'  => $annotationMetadata,
            'labels'    => $annotationLabels,
        ];
    }

    /**
     * Get data for the Electrophysiological file annotations
     *
     * @return array The data array
     */
    function getData(): array
    {
        return $this->_data;
    }

    /**
     * Updates annotation tables when there is a POST request.
     * Will add new derivative files if none exist for the given instance.
     * Will either add new annotations or update existing ones.
     *
     * @param array $instance_data Instance data
     * @param array $metadata      Metadata
     * @param int   $instance_id   InstanceID
     * @param int   $parameter_id  ParameterID
     *
     * @return void
     */
    function update(
        array $instance_data,
        array $metadata,
        int $instance_id,
        int $parameter_id
    ): void {

        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $db      = $factory->database();

        if ($user->hasPermission('electrophysiology_browser_edit_annotations')) {

            //If the label is new, add to annotation label table
            //and get label ID
            $labelID = $db->pselectOne(
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
                $labelID = $db->pselectOne(
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
                ['PFID' => $this->_physioFileID]
            );

            //Get data from POST request
            $metadata = [
                'Description' => $metadata['description'],
                'Sources'     => $metadata['sources'],
                'Author'      => $metadata['author']
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

                //Create new annotation files
                $this->_createFiles();

                //Get new annotation file ID
                $annotation_tsv_ID = $db->pselectOne(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='tsv'",
                    ['PFID' => $this->_physioFileID]
                );
                //Get new annotation file ID
                $annotation_json_ID = $db->pselectOne(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='json'",
                    ['PFID' => $this->_physioFileID]
                );

                $metadata['AnnotationFileID'] = $annotation_json_ID;
                $instance['AnnotationFileID'] = $annotation_tsv_ID;

                $db->insert("physiological_annotation_parameter", $metadata);

                //Get new metadata file ID
                $metadata_ID = $db->pselectOne(
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
                $tsv_ID = $db->pselectOne(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='tsv'",
                    ['PFID' => $this->_physioFileID]
                );
                //Get annotation file ID for the json file
                $json_ID = $db->pselectOne(
                    "SELECT AnnotationFileID
                        FROM physiological_annotation_file
                        WHERE PhysiologicalFileID=:PFID
                        AND FileType='json'",
                    ['PFID' => $this->_physioFileID]
                );

                $instance['AnnotationFileID'] = $tsv_ID;
                $metadata['AnnotationFileID'] = $json_ID;

                /* If no instance ID is specified, insert new instance
                 * into instance table and get the parameter file ID
                 * from the parameter table
                 */
                if (is_null($instance_id)) {
                    $parameterID = $db->pselectOne(
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
                        ['AnnotationInstanceID' => $instance_id]
                    );
                }
                //Update parameter table if parameter ID provided
                if (!is_null($parameter_id)) {
                    $db->update(
                        'physiological_annotation_parameter',
                        $metadata,
                        ['AnnotationParameterID' => $parameter_id]
                    );
                }

                //In all cases where files are not new,
                //set LastUpdate time for all related files

                $db->update(
                    'physiological_annotation_file',
                    ['LastUpdate' => date("Y-m-d H:i:s")],
                    ['PhysiologicalFileID' => $this->_physioFileID]
                );
            }
        }
    }

    /**
     * Deletes one annotation
     *
     * @param int $annotationID Annotation ID
     *
     * @return void
     */
    function delete(int $annotationID): void
    {
        // TODO : check that $annotationID belongs to physioFileID
        $db = \NDB_Factory::singleton()->database();

        $physioFileID = $db->pselectone(
            'SELECT PhysiologicalFileID
            FROM physiological_annotation_file AS f
            INNER JOIN physiological_annotation_instance AS i
            ON f.AnnotationFileID=i.AnnotationFileID
            AND i.AnnotationInstanceID=:annotationID',
            ['annotationID' => $annotationID]
        );

        if ($this->_physioFileID == $physioFileID) {
            $db->delete(
                "physiological_annotation_instance",
                ['AnnotationInstanceID' => $annotationID]
            );
        }
    }

    /**
     * Updates the derivative files associated with the given
     * physiological file ID
     *
     * @return void
     * @throws SodiumException
     */
    function updateFiles(): void
    {
        $db = \NDB_Factory::singleton()->database();

        //Get data directory base path from Config
        $dataDir = $db->pselectOne(
            'SELECT Value
            FROM Config AS config
            INNER JOIN ConfigSettings AS c
            ON c.Name=:name AND config.ConfigID=c.ID',
            ['name' => 'dataDirBasepath']
        );

        $tsv_entries = [
            'onset', 'duration', 'label', 'channels', 'aboslute_time', 'description'
        ];

        $tsv = $db->pselect(
            "SELECT
              AnnotationFileID AS id,
              FilePath         AS filePath,
              LastUpdate       AS lastUpdate,
              LastWritten      AS lastWritten
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='tsv'",
            ['PFID' => $this->_physioFileID]
        );

        $json = $db->pselect(
            "SELECT
              AnnotationFileID AS id,
              FilePath         AS filePath,
              LastUpdate       AS lastUpdate,
              LastWritten      AS lastWritten
            FROM physiological_annotation_file
            WHERE PhysiologicalFileID=:PFID
            AND FileType='json'",
            ['PFID' => $this->_physioFileID]
        );

        $tsv_path  = $dataDir.$tsv[0]['filePath'];
        $json_path = $dataDir.$json[0]['filePath'];

        //Update files if files updated before database updated
        if ($tsv[0]['lastWritten'] <= $tsv[0]['lastUpdate']
            || $json[0]['lastWritten'] <= $json[0]['lastUpdate']
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
                  p.Onset AS Onset,
                  p.Duration AS Duration,
                  l.LabelName AS LabelName,
                  l.LabelDescription AS LabelDescription,
                  p.Channels AS Channels,
                  p.AbsoluteTime AS AbsoluteTime,
                  p.Description AS Description
                FROM physiological_annotation_instance p
                  LEFT JOIN physiological_annotation_label l 
                    ON (l.AnnotationLabelID=p.AnnotationLabelID)
                WHERE p.AnnotationFileID=:AFID",
                ['AFID' => $tsv[0]['id']]
            );

            foreach ($instances as $instance) {
                //Add labels to list for parameter file
                $labels[$instance['LabelName']] = $instance['LabelDescription'];

                //Setup each column in correct order
                $input_tsv = [
                    $instance['Onset'],
                    $instance['Duration'],
                    $instance['LabelName'],
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
            $json_desc   = $db->pselectOne(
                "SELECT Description
                FROM physiological_annotation_parameter
                WHERE AnnotationFileID=:AFID",
                ['AFID' => $json[0]['id']]
            );
            $json_source = $db->pselectOne(
                "SELECT Sources
                FROM physiological_annotation_parameter
                WHERE AnnotationFileID=:AFID",
                ['AFID' => $json[0]['id']]
            );
            $json_author = $db->pselectOne(
                "SELECT Author
                FROM physiological_annotation_parameter
                WHERE AnnotationFileID=:AFID",
                ['AFID' => $json[0]['id']]
            );
            //Get "IntendedFor" entry: physiological file path
            $physioFilePath = $db->pselectOne(
                "SELECT FilePath
                FROM physiological_file
                WHERE PhysiologicalFileID=:PFID",
                ['PFID' => $this->_physioFileID]
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

            //Update archives and create new hash
            $this->_updateArchives([$tsv_path, $json_path]);

            //Update time that files were written to
            $db->update(
                'physiological_annotation_file',
                ['LastWritten' => date("Y-m-d H:i:s")],
                ['PhysiologicalFileID' => $this->_physioFileID]
            );
        }
    }

    /**
     * Creates new annotation files for the given physiological file
     * and inserts their information into database
     *
     * @return void
     * @throws SodiumException
     */
    function _createFiles() : void
    {
        $db = \NDB_Factory::singleton()->database();

        $physioFilePath = $db->pselectOne(
            'SELECT FilePath
                    FROM physiological_file
                    WHERE PhysiologicalFileID=:PFID',
            ['PFID' => $this->_physioFileID]
        );

        //Create new filepaths
        //Get data directory base path from Config
        $dataDir = $db->pselectOne(
            'SELECT Value
                    FROM Config AS config
                    INNER JOIN ConfigSettings AS c
                    ON c.Name=:name AND config.ConfigID=c.ID',
            ['name' => 'dataDirBasepath']
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

        $tgz_file = new \PharData($tgz_path);
        $tgz_file->addFile($tsv_path, basename($tsv_path));
        $tgz_file->addFile($json_path, basename($json_path));
        fclose($tsv_file);
        fclose($json_file);

        $annotation_f    = file_get_contents($tgz_path);
        $annotation_hash = sodium_crypto_generichash($annotation_f);

        $params_tsv     = [
            'PhysiologicalFileID' => $this->_physioFileID,
            'FileType'            => 'tsv',
            'FilePath'            => str_replace($dataDir, '', $tsv_path)
        ];
        $params_json    = [
            'PhysiologicalFileID' => $this->_physioFileID,
            'FileType'            => 'json',
            'FilePath'            => str_replace($dataDir, '', $json_path),
        ];
        $params_archive = [
            'PhysiologicalFileID' => $this->_physioFileID,
            'FilePath'            => str_replace($dataDir, '', $tgz_path),
            'Blake2bHash'         => bin2hex($annotation_hash)
        ];
        $db->insert("physiological_annotation_file", $params_tsv);
        $db->insert("physiological_annotation_file", $params_json);
        $db->insert("physiological_annotation_archive", $params_archive);
    }

    /**
     * Updates the annotation and physiological archives for the given
     * physiological file ID with the provided paths and updates
     * database with new archive file hash
     *
     * @param array $paths Paths to files to be added to archive
     *
     * @return void
     * @throws SodiumException
     */
    function _updateArchives(array $paths) : void
    {
        $db = \NDB_Factory::singleton()->database();

        $dataDir = $db->pselectOne(
            'SELECT Value
        FROM Config AS config
        INNER JOIN ConfigSettings AS c
        ON c.Name=:name AND config.ConfigID=c.ID',
            ['name' => 'dataDirBasepath']
        );
        $queries = [
            'physiological_annotation_archive',
            'physiological_archive'
        ];

        foreach ($queries as $query) {
            $filepath = $db->pselectone(
                "SELECT
                DISTINCT(FilePath)
                FROM $query
                WHERE PhysiologicalFileID=:PFID",
                ['PFID' => $this->_physioFileID]
            );
            $filepath = $dataDir.$filepath;

            $arch_file = new \PharData($filepath);
            foreach ($paths as $path) {
                $arch_file->addFile($path, basename($path));
            }

            $f    = file_get_contents($filepath);
            $hash = sodium_crypto_generichash($f);

            //Update database with hash
            $db->update(
                $query,
                ['Blake2bHash'         => bin2hex($hash)],
                ['PhysiologicalFileID' => $this->_physioFileID]
            );
        }
    }
}
