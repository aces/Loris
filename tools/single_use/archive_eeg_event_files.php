<?php declare(strict_types=1);
require_once __DIR__ . "/../generic_includes.php";

$db = \NDB_Factory::singleton()->database();

$dataDir = $db->pselectOne(
    'SELECT Value
    FROM Config AS config
    INNER JOIN ConfigSettings AS c
    ON c.Name=:name AND config.ConfigID=c.ID',
    ['name' => 'dataDirBasepath']
);

$filepaths = $db->pselect(
    "SELECT
    DISTINCT(FilePath), PhysiologicalFileID
    FROM physiological_event_file
    WHERE FileType='tsv'",
    []
);

foreach ($filepaths as $record) {
    $tgz_name = str_replace(".tsv", '.tgz', $record['FilePath']);
    $tgz_path = $dataDir . $tgz_name;
    print_r($tgz_path . "\n");
    $eventPath = $dataDir . $record['FilePath'];
    $arch_file = new \PharData($tgz_path);
    $arch_file->addFile($eventPath, basename($eventPath));

    $f    = file_get_contents($tgz_path);
    $hash = sodium_crypto_generichash($f);

    //Update database with hash
    $db->insert(
        'physiological_event_archive',
        [
            'PhysiologicalFileID' => $record['PhysiologicalFileID'],
            'FilePath'            => str_replace($dataDir, '', $tgz_path),
            'Blake2bHash'         => bin2hex($hash)
        ]
    );
}
