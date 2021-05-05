#!/usr/bin/php
<?php

require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once "Archive/Tar.php";

/**
 * Testing edits to derivative database/files
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Sessions
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */
class TestEditingDerivatives
{

    /**
     *  Testing Blake2bHash generator
     *
     * @return void
     */
    function testHashGenerator()
    {
        $f    = file_get_contents(
            "/data-raisinbread/bids_imports/Face13_BIDSVersion_1.1.0/"
            ."sub-OTT166/ses-V1/eeg/sub-OTT166_ses-V1_task-faceO_eeg.tgz"
        );
        $hash = sodium_crypto_generichash($f);

        $realHash = 'a8ce4528e4ea23bd8834a03abd413f24c0008c66e9f5405326a91c2'
            .'f1c49f0039b9fbe7d14330f334939776b9e0ce4d3c5e6a49cda6f20'
            .'52c25a9b1010be7af2';
        if ($hash = $realHash) {
            echo "Hash generator works\n";
        } else {
            echo "Hash generator does not work\n";
        }
    }


    /**
     * Test that derivative file path is created correctly
     *
     * @return void
     */
    function testFilepathGeneration()
    {
        $db =& \Database::singleton();

        //Add derivative folder to filepath
        $physioFilePath = "bids_imports/__BIDSVersion_1.2.2/sub-DCC0001/"
            ."ses-V01/ieeg/sub-DCC0001_ses-V01_task-test_acq-seeg_ieeg.edf";
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
            ."bids_imports/derivatives/loris_annotations/"
            .$subPath;
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
        $tsv_path       = $pathWithoutEDF."_annotations.tsv";
        $json_path      = $pathWithoutEDF."_annotations.json";
        $tgz_path       = $pathWithoutEDF."_annotations.tgz";
        //Create files
        $tsv_file  = fopen($tsv_path, 'a+');
        $json_file = fopen($json_path, 'a+');
        $tgz_file  = new PharData($tgz_path);
        $tgz_file->addFile($tsv_path);
        $tgz_file->addFile($json_path);
        fclose($tsv_file);
        fclose($json_file);

        echo "tsv file:".$tsv_path."\n";
        echo "json file:".$json_path."\n";
        echo "tgz file:".$tgz_path."\n";
    }

    /**
     * Test that updating files works by changing data in DB
     * and calling updateDerivativeFiles
     *
     * @return void
     */
    function testAddDataToDB()
    {

        $db =& \Database::singleton();
        // Specify current database
        //$database = $config->getSetting('database');
        //$dbName = $database['database'];
        //$db->insert(
        //'physiological_annotation_label',
        //[
        //  'AnnotationLabelID' => 25,
        //  'LabelName'         => 'TestLabel',
        //  'LabelDescription'  => 'Test Description'
        //]
        //);
        $db->insert(
            'physiological_annotation_instance',
            [
                'AnnotationFileID'      => '1',
                'AnnotationParameterID' => '1',
                'AnnotationLabelID'     => '24',
                'Channels'              => 'channel1',
                'Description'           => 'Description 2'
            ]
        );
        $db->update(
            'physiological_annotation_parameter',
            [
                'Sources' => 'Source Test',
                'Author'  => 'Real Fake Person'
            ],
            ['AnnotationParameterID' => '1']
        );
        $db->update(
            'physiological_annotation_file',
            ['LastUpdate' => date("Y-m-d H:i:s", mktime(0, 0, 0, 7, 1, 2022))],
            ['PhysiologicalFileID' => 11]
        );
        $physioFileID = 11;
        self::updateDerivativeFiles($physioFileID);
    }

    /**
     * Update files (copied from Sessions.class.inc)
     *
     * @param int|null $physioFileID File ID
     *
     * @return void
     */
    static function updateDerivativeFiles(int $physioFileID=null): void
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
        $tgz_id      = $db->pselectone(
            "SELECT AnnotationArchiveID
            FROM physiological_annotation_archive
            WHERE PhysiologicalFileID=:PFID",
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
                $label_info = $db->pselectRow(
                    "SELECT LabelName, LabelDescription
                    FROM physiological_annotation_label
                    WHERE AnnotationLabelID=:labelID",
                    ['labelID' => $instance['AnnotationLabelID']]
                );
                $labels[$label_info['LabelName']] = $label_info['LabelDescription'];

                //Setup each column in correct order
                $input_tsv = [
                    $instance['Onset'],
                    $instance['Duration'],
                    $label_info['LabelName'],
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
            $metadata = $db->pselectRow(
                "SELECT Description, Sources, Author
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
                "Description"      => $metadata['Description'],
                "IntendedFor"      => $physioFilePath,
                "Sources"          => $metadata['Sources'],
                "Author"           => $metadata['Author'],
                "LabelDescription" => $labels
            ];
            $input_encode = json_encode($input_json, JSON_PRETTY_PRINT);

            $json_file = fopen($json_path, 'w');
            fwrite($json_file, $input_encode);
            fclose($json_file);

            //Make archive tgz and create new hash
            $tgz_file = new \PharData($tgz_path);
            $tgz_file->addFile($tsv_path);
            $tgz_file->addFile($json_path);

            $f    = file_get_contents($tgz_path);
            $hash = sodium_crypto_generichash($f);
            //Update database with hash
            $db->update(
                'physiological_annotation_archive',
                ['Blake2bHash' => $hash],
                ['PhysiologicalFileID' => $physioFileID]
            );
        }
    }
}

$testSessions = new TestEditingDerivatives();
$testSessions->testFilepathGeneration();
$testSessions->testAddDataToDB();
