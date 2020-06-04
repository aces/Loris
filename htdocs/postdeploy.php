<?php
/**
 * This file contains the post procedures for Heroku deployment
 *
 * PHP Version 5
 *
 * @category Main
 * @package  LORIS
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

if (file_exists('../project/config.xml')) {
    die("Project config.xml already exists. Aborting deploy.");
}

$url      = parse_url(getenv("CLEARDB_DATABASE_URL"));
$server   = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$db       = substr($url["path"], 1);
$conn     = new PDO("mysql:host=".$server."; dbname=".$db, $username, $password);

$path_to_file = '../SQL/0000-00-00-schema.sql';
$sqls         = file_get_contents($path_to_file);
$conn->exec($sqls);

$path_to_file = '../SQL/0000-00-01-Permission.sql';
$sqls         = file_get_contents($path_to_file);
$conn->exec($sqls);

$path_to_file = '../SQL/0000-00-02-Menus.sql';
$sqls         = file_get_contents($path_to_file);
$conn->exec($sqls);

$path_to_file = '../SQL/0000-00-03-ConfigTables.sql';
$sqls         = file_get_contents($path_to_file);
$conn->exec($sqls);

$path_to_file = '../SQL/0000-00-04-Help.sql';
$sqls         = file_get_contents($path_to_file);
$conn->exec($sqls);

$path_to_file = '../SQL/0000-00-05-ElectrophysiologyTables.sql';
$sqls         = file_get_contents($path_to_file);
$conn->exec($sqls);

$pw = password_hash($password, PASSWORD_DEFAULT);

$conn->query(
    "UPDATE users SET Password_hash=" . $conn->quote($pw) .
    ", Password_expiry='2020-01-01', Pending_approval='N' WHERE ID=1"
);
$RootDir = dirname(getcwd());
$conn->query(
    "UPDATE Config SET Value='$RootDir/'
    WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')"
);
$conn->query(
    "UPDATE Config SET Value=''
    WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')"
);
$conn->query(
    "UPDATE Config SET Value=''
    WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host')"
);

mkdir('../project');
mkdir('../project/data');
mkdir('../project/instruments');
mkdir('../project/templates');
mkdir('../project/tables_sql');
mkdir('../project/modules');
mkdir('../smarty/templates_c', 0777);
$path_to_file  = '../docs/config/config.xml';
$file_contents = file_get_contents($path_to_file);
$file_contents = str_replace("%HOSTNAME%", "$server", $file_contents);
$file_contents = str_replace("%USERNAME%", "$username", $file_contents);
$file_contents = str_replace("%PASSWORD%", "$password", $file_contents);
$file_contents = str_replace("%DATABASE%", "$db", $file_contents);
file_put_contents('../project/config.xml', $file_contents);

header("Location: /");
