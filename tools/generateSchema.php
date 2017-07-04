<?php
set_include_path(get_include_path().":../../:../:");
require_once "generate_instrument_schemas.php";
$opts = getopt("f:w:");
$filename = $opts['f'];
$writepath = $opts['w'];
$fileContent = file_get_contents($filename);
//echo($fileContent);
$obj = new schema_generator();
$JSON = $obj->decodeJSON($fileContent);
$schema = $obj->generateSchema($JSON);
//echo($schema."\n");
file_put_contents($writepath, $schema);
?>
