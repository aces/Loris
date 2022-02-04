#!/usr/bin/php
<?php

use LORIS\electrophysiology_browser\Models\ElectrophysioAnnotations;
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once __DIR__
    . "/../modules/electrophysiology_browser/php/models/"
    . "electrophysioannotations.class.inc";


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
            'AnnotationFileID'      => '1',
            'AnnotationParameterID' => '1',
            'AnnotationLabelID'     => '12',
            'Channels'              => 'Test Channel',
            'Description'           => 'Test Description'
        ]
    );
    $db->update(
        'physiological_annotation_parameter',
        [
            'Sources' => 'Source 900',
            'Author'  => 'Hemingway'
        ],
        ['AnnotationParameterID' => '1']
    );
    $db->update(
        'physiological_annotation_file',
        ['LastUpdate' => date("Y-m-d H:i:s", mktime(0, 0, 0, 7, 1, 2022))],
        ['PhysiologicalFileID' => 10]
    );
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
            ['PFID' => 11]
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
            ['PhysiologicalFileID' => 11]
        );
    }
}

$physioFileID = 10;
testAddDataToDB();

//Testing adding a new instance with new label/updating parameter table
$values1 = [
    'instance_id'  => 1,
    'parameter_id' => 1,
    'metadata'     => [
        'description' => 'A New Description!',
        'sources'     => 'Source Source',
        'author'      => 'Shakespeare',
    ],
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
    'instance_id'  => 1,
    'parameter_id' => 1,
    'metadata'     => [
        'description' => '',
        'sources'     => '',
        'author'      => '',
    ],
    'instance'     => [
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
    'metadata'     => [
        'description' => 'New Description New File!',
        'sources'     => 'New File Source',
        'author'      => 'Shakespeare Again',
    ],
    'instance'     => [
        'onset'             => 3.222,
        'duration'          => 5.000,
        'label_name'        => 'Another New Label',
        'label_description' => 'Another New Description',
        'channels'          => 'Test Channel',
        'abs_time'          => null,
        'description'       => 'new instance description'
    ],
    'instance_id'  => 1,
    'parameter_id' => 1
];

(new ElectrophysioAnnotations($physioFileID))->update(
    $values1['instance'],
    $values1['metadata'],
    $values1['instance_id'],
    $values1['parameter_id']
);

(new ElectrophysioAnnotations($physioFileID))->delete(2);
(new ElectrophysioAnnotations($physioFileID))->updateFiles();
