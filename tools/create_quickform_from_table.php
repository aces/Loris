<?
// create an NDB client
require_once "../php/libraries/NDB_Client.class.inc";
$client = new NDB_Client;
$client->makeCommandLine();
$client->initialize();

$dbname = $_SERVER['argv'][1];

require_once('MDB2.php');
$config =& NDB_Config::singleton();
$dbConfig = $config->getSetting('database');
$dsn = 'mysql://'.$dbConfig['username'].':'.$dbConfig['password'].'@'.$dbConfig['host'].'/information_schema';
$db =& MDB2::connect($dsn);
if (PEAR::isError($db)) {
    die($db->getUserInfo()."\n");
}
$db->setFetchMode(MDB2_FETCHMODE_ASSOC);

$sth = $db->prepare("SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, NUMERIC_PRECISION, NUMERIC_SCALE, COLUMN_TYPE FROM COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=?");
if (PEAR::isError($sth)) {
    die($sth->getUserInfo()."\n");
}

for($i=2; $i<count($_SERVER['argv']); $i++) {
  $res = $sth->execute(array($dbname, $_SERVER['argv'][$i]));
  if(PEAR::isError($res)) { die($res->getUserInfo()."\n"); }
  
  if($res->numRows() > 0) {
    while($row = $res->fetchRow()) {
      $creator = "print_field_".$row['data_type'];
      if(function_exists($creator)) {
        call_user_func($creator, $row);
      } else {
        print_field_default($row);
      }
    }
  }
}
print "\n";


function print_field_default($row) {
  _print_field(array('type'=>'text', 'name'=>$row['column_name'], 'desc'=>$row['column_name'], 'rules'=>($row['is_nullable'] == 'NO' ? 'required' : null)));
}

function print_field_enum($row) {
  _print_field(array('type'=>'select', 'name'=>$row['column_name'], 'desc'=>$row['column_name'], 'rules'=>($row['is_nullable'] == 'NO' ? 'required' : null), 'opts'=>_make_select_array($row['column_type'])));
}

function _make_select_array($x) {
  $x = substr($x, 5, strlen($x)-6);
  $y = explode(',', $x);
  foreach($y AS $z) {
    $bits[] = "$z => $z";
  }
  return "array(".join(',', $bits).")";
}

function _print_field($params) {
  print "\$this->form->addElement('$params[type]', '$params[name]', '$params[desc]'" . (!empty($params['opts']) ? ', '.$params['opts'] : '') . ");\n";

  if(!empty($params['rules'])) {
    $rules = explode(',', $params['rules']);
    foreach($rules AS $rule) {
      print "\$this->form->addRule('$params[name]', '$rule', '$rule', null, 'server');\n";
    }
  }
}

?>

