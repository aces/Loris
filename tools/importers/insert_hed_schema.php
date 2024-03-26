<?php declare(strict_types=1);
// This script imports a HED Schema in XML format in the database
// Example usage: php insert_hed_schema.php https://raw.githubusercontent.com/hed-standard/hed-schemas/main/standard_schema/hedxml/HED8.2.0.xml
require_once __DIR__ . "/../../tools/generic_includes.php";

$fileLocation = $argv[1];

if (empty($fileLocation)) {
    die("You must supply the HED schema XML location\n");
}

$db  = \NDB_Factory::singleton()->database();
$xml = simplexml_load_file($fileLocation) or die("Error: Unable to load schema\n");

$hedAttributes      = $xml->xpath('/HED')[0]->attributes();
$slashSplit         = explode('/', $fileLocation);
$libraryName        = explode(
    '.xml',
    end($slashSplit)
)[0]; // $hedAttributes->library->__toString();
$versionPattern     = '~[0-9]\.[0-9]\.[0-9]~';
$libraryVersion     = preg_match($versionPattern, $libraryName, $hedVersion)
                        ? $hedVersion[0]
                        : 'n/a';  // $hedAttributes->version->__toString();
$libraryDescription = $xml->xpath('/HED/prologue')[0]->__toString();

$schema = $xml->xpath('/HED/schema/node');
if (!$schema) {
    die("Failed to get nodes from schema");
}

$db->insert(
    'hed_schema',
    [
        'Name'        => $libraryName,
        'Version'     => $libraryVersion,
        'Description' => $libraryDescription,
        'URL'         => $fileLocation
    ]
);

$newSchemaID = intval($db->getLastInsertId());

foreach ($schema as $parentNode) {
    echo "Inserting '$parentNode->name' nodes\n";
    insertNodes($newSchemaID, $parentNode, 0, '');
}


/**
 * Insert HED tag nodes in DB
 *
 * @param int    $schemaID   PK of schema HED tag belongs to
 * @param object $parentNode Parent node object
 * @param int    $parentID   PK of parent node
 * @param string $rootString Assembled HED string of parent nodes
 *
 * @return void
 */
function insertNodes($schemaID, $parentNode, $parentID, $rootString) : void
{
    $nodeName = $parentNode->name->__toString();

    // We are omitting and considering '#' nodes as leaf nodes
    if (strcmp($nodeName, '#') == 0) {
        return;
    }

    $longName    = strlen($rootString) == 0 ? $nodeName : "$rootString/$nodeName";
    $description = $parentNode->description ?: 'No description available';
    $insertID    = dbInsert(
        $schemaID,
        $parentID,
        $nodeName,
        $longName,
        $description
    );

    foreach ($parentNode->node as $childNode) {
        insertNodes($schemaID, $childNode, $insertID, $longName);
    }
}

/**
 * Insert HED tag node in DB
 *
 * @param int    $schemaID    PK of schema HED tag belongs to
 * @param int    $parentID    PK of parent node
 * @param string $nodeName    HED tag short name
 * @param string $longName    Full HED tag name
 * @param string $description Text description
 *
 * @return int                 Node Primary Key
 */
function dbInsert($schemaID, $parentID, $nodeName, $longName, $description) : int
{
    global $db;
    $db->insert(
        'hed_schema_nodes',
        [
            'ParentID'    => $parentID == 0 ? null : $parentID,
            'SchemaID'    => $schemaID,
            'Name'        => $nodeName,
            'LongName'    => $longName,
            'Description' => $description
        ]
    );
    return intval($db->getLastInsertId());
}
