#!/usr/bin/php
<?php declare(strict_types=1);

/**
 * This script generates a .pot file for a table for the data
 * from a database. This is intended to allow the data to be extracted
 * in a format that can be handed off to translators but can not
 * be maintained by LORIS as it's project specific.
 *
 * Database table .po files go in project/locale/ rather than
 * the LORIS locale/. 
 *
 * This script checks if the template exists and refuses to overwrite
 * it, but otherwise does little validation.
 *
 * Since there isn't a good way to determine which columns are translateable,
 * it must be called as:
 *   generate_table_po.php --columns=column1,column2,etc tablename
 *
 * to generate the po template for tablename.
 *
 * Duplicates are eliminated before writing the file.
 *
 * @category Tools
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";

function usage() {
	global $argv;
	fprintf(STDERR, "usage: %s --columns=column1,column2 tablename\n", $argv[0]);
	exit(1);
}
$lastidx = 0;
$opts = getopt("", [ "columns::" ], $lastidx);
$columns= $opts['columns'];
if(empty($opts['columns'])) {
	usage();
}

if($lastidx !== $argc-1) {
	usage();
}
$table = $argv[$lastidx];

$outputfile = __DIR__ . "/../project/locale/$table.pot";

if(file_exists($outputfile)) {
	fprintf(STDERR, "Will not overwrite existing template file %s. Backup and remove the file if you want to overwrite it.", realpath($outputfile));
	exit(2);
}

// This is not particularly robust or secure, but this script is only run by trusted users
// on the backend.
$rows = $DB->pselect("SELECT $columns from $table", []);

$values = [];
foreach ($rows as $row) {
	foreach($row as $val) {
		$values[$val] = '';
	}
}

$values = array_keys($values);

if(count($values) == 0) {
	fprintf(STDERR, "No translateable values found\n");
	exit(3);
}


$fd = fopen($outputfile, "w");

fwrite($fd, <<<EOF
msgid ""
msgstr ""

"Project-Id-Version: LORIS 28\\n"
"Report-Msgid-Bugs-To: https://github.com/aces/Loris/issues\\n"
"POT-Creation-Date: 2025-04-08 14:37-0400\\n"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"
"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n"
"Language-Team: LANGUAGE <LL@li.org>\\n"
"Language: \\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"


EOF);

foreach($values as $val)  {
	if(!empty($val)) {
		fprintf($fd, "msgid \"%s\"\n", $val);
		fprintf($fd, "msgstr \"\"\n\n");
	}
}
