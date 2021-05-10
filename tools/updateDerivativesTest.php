#!/usr/bin/php
<?php

use LORIS\electrophysiology_browser\Model\ElectrophysioAnnotations;
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";

/**
 *  Testing Blake2bHash generator
 *
 * @return void
 */
function testHashGenerator()
{
    $db = \NDB_Factory::singleton()->database();

    $f    = file_get_contents(
        "/data/loris-mri/data/bids_imports/derivatives/"
        ."loris_annotations/sub-DCC0001/ses-V01/ieeg/"
        ."sub-DCC0001_ses-V01_task-test_acq-seeg_annotations.tgz"
    );
    $hash = sodium_crypto_generichash($f);

    $dbHash = $db->pselectone(
        'SELECT Blake2bHash
        FROM physiological_annotation_archive
        WHERE PhysiologicalFileID=:id',
        ['id' => '11']
    );

    if ($hash = $dbHash) {
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
    $tgz_file->addFile($tsv_path, basename($tsv_path));
    $tgz_file->addFile($json_path, basename($json_path));
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

    $db->insert(
        'physiological_annotation_instance',
        [
            'AnnotationFileID'      => '13',
            'AnnotationParameterID' => '5',
            'AnnotationLabelID'     => '12',
            'Channels'              => 'Fantastic Channel',
            'Description'           => 'Fantastic Description'
        ]
    );
    $db->update(
        'physiological_annotation_parameter',
        [
            'Sources' => 'Source 900',
            'Author'  => 'Hemingway'
        ],
        ['AnnotationParameterID' => '5']
    );
    $db->update(
        'physiological_annotation_file',
        ['LastUpdate' => date("Y-m-d H:i:s", mktime(0, 0, 0, 7, 1, 2022))],
        ['PhysiologicalFileID' => 11]
    );
}

$physioFileID = 11;
testFilepathGeneration();
testAddDataToDB();
testHashGenerator();

//Testing adding a new instance with new label/updating parameter table
$values1 = [
    'parameter_id' => 5,
    'description'  => 'A New Description!',
    'sources'      => 'Source Source',
    'author'       => 'Shakespeare',
    'instance'     => [
        'onset'             => 1.222,
        'duration'          => 3.444,
        'label_name'        => 'Fun Label',
        'label_description' => 'Fun Description',
        'channels'          => 'chan1',
        'abs_time'          => null,
        'description'       => 'instance description'
    ]
];

//Test updating an existing annotation
$values2 = [
    'instance_id' => 1,
    'description' => '',
    'sources'     => '',
    'author'      => '',
    'instance'    => [
        'onset'       => 1.222,
        'duration'    => 3.444,
        'label_name'  => 'Fun Label',
        'channels'    => 'chan1',
        'abs_time'    => null,
        'description' => 'instance description'
    ]
];

//Test creating new annotation files for a physiological file
//that doesn't have any annotation files
//Note: empty all annotation DB tables before running with this array
$values3 = [
    'description' => 'New Description New File!',
    'sources'     => 'New File Source',
    'author'      => 'Shakespeare Again',
    'instance'    => [
        'onset'             => 3.222,
        'duration'          => 5.000,
        'label_name'        => 'Another New Label',
        'label_description' => 'Another New Description',
        'channels'          => 'Test Channel',
        'abs_time'          => null,
        'description'       => 'new instance description'
    ]
];

(new ElectrophysioAnnotations($physioFileID))->update(
    $values1['instance_data'],
    $values1['description'],
    $values1['sources'],
    $values1['author'],
    $values1['instance_id'],
    $values1['parameter_id']
);
<<<<<<< 17b708655b62d3fdfb8e619bfdf71de94f5bdac1
//Annotations::delete(2);
=======

//(new ElectrophysioAnnotations($physioFileID))->delete(2);
//(new ElectrophysioAnnotations($physioFileID))->updateFiles();
>>>>>>> Refactoring (model class)
