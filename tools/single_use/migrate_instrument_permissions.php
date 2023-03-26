<?php declare(strict_types=1);
require_once __DIR__ . "/../generic_includes.php";

$config = \NDB_Factory::singleton()->config();
$DB     = $lorisInstance->getDatabaseConnection();

$configSettings = $config->getSetting('instrumentPermissions');

if ($configSettings['useInstrumentPermissions'] === 'false') {
    fprintf(STDERR, "Instrument permissions disabled in config.xml\n");
    return;
}

foreach (
    \Utility::associativeToNumericArray($configSettings['instrument']) as $row
) {
    $testID = $DB->pselectOne(
        "SELECT ID FROM test_names WHERE test_name=:tn",
        ['tn' => $row['Test_name']],
    );
    if (empty($testID)) {
        fprintf(STDERR, "Test name $row[Test_name] in config.xml doesn't exist\n");
        continue;
    }
    $permID = $DB->pselectOne(
        "SELECT permID FROM permissions WHERE code=:pc",
        ['pc' => $row['permission']],
    );
    if (empty($permID)) {
        fprintf(
            STDERR,
            "Permission code $row[permission] for $row[Test_name]"
            . " in config.xml doesn't exist\n"
        );
        continue;
    }
    $DB->replace(
        'testnames_permissions_rel',
        ['TestID' => $testID, 'permID' => $permID],
    );
}
