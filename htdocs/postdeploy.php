<?php

$url = parse_url(getenv("CLEARDB_DATABASE_URL"));
$server = $url["host"];
$username = $url["user"];
$password = $url["pass"];
$db = substr($url["path"], 1);

$conn = new mysqli($server, $username, $password, $db);

$path_to_file = '../SQL/0000-00-00-schema.sql';
$sqls = file_get_contents($path_to_file);
$lines = explode("\n",$sqls);
$sqls = '';
foreach ($lines as $line) {
    $line = trim($line);
    substr($line, 0, 2) === "--";
    if ($line && substr($line, 0, 2) !== "--") {
        $sqls .= $line . "\n";
    }
}
$sqls = explode(";", $sqls);
foreach ($sqls as $sql) {
    if (trim($sql)) {
        $conn->query($sql);
    }
}

$conn->query("UPDATE users SET Password_MD5=CONCAT('aa', MD5('aa$password')), Password_expiry='2020-01-01', Pending_approval='N' WHERE ID=1");
$RootDir = dirname(getcwd());
$conn->query("UPDATE Config SET Value='$RootDir/' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='base')");
$conn->query("UPDATE Config SET Value='' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='url')");
$conn->query("UPDATE Config SET Value='' WHERE ConfigID=(SELECT ID FROM ConfigSettings WHERE Name='host')");

mkdir('../project');
mkdir('../smarty/templates_c',0777);
$path_to_file = '../docs/config/config.xml';
$file_contents = file_get_contents($path_to_file);
$file_contents = str_replace("%HOSTNAME%","$server",$file_contents);
$file_contents = str_replace("%USERNAME%","$username",$file_contents);
$file_contents = str_replace("%PASSWORD%","$password",$file_contents);
$file_contents = str_replace("%DATABASE%","$db",$file_contents);
file_put_contents('../project/config.xml',$file_contents);

header("Location: /main.php");

?>
