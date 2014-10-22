<?php
require_once 'NDB_Menu_Filter.class.inc';

class NDB_Menu_Filter_instrument_manager extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        $user =& User::singleton();
        if (PEAR::isError($user)) {
            return PEAR::raiseError("User Error: " .$user->getMessage());
        }
        return $user->hasPermission('superuser');
    }

    function _setupVariables()
    {
        $config = NDB_Config::singleton();
        $this->path = $config->getSetting("base");
        $this->headers = array('Instrument',
            'Instrument_Type',
            'Table_Installed', 
            'Table_Valid', 
            'Pages_Valid'
        );
        $this->query = " FROM test_names t";
        $this->columns = array('t.Test_name as Instrument', "'x' as Instrument_Type", "'x' as Table_Installed", "'x' as Table_Valid", "'x' as Pages_Valid");
        $this->validFilters = array('');
        $this->formToFilter = array (
        );

        $writable = true;
        if (!is_writeable($this->path . "project/instruments") || !is_writable($this->path . "project/tables_sql")) {
            $writable = false;
        } else {
            $writable = true;
        }

        $this->tpl_data['writeable'] = $writable;

        if($writable && $_POST['install'] == 'Install Instrument') {
            $db = Database::singleton();
            $instname = basename($_FILES['install_file']['name'], '.linst');

            $new_file = $this->path . "project/instruments/" . $_FILES['install_file']['name'];
            move_uploaded_file($_FILES['install_file']['tmp_name'], $new_file);
            chmod($new_file, 0644);
            chdir($this->path . "/tools");

            $exists = $db->pselectOne("SELECT count(*) FROM test_names WHERE Test_name=:testname", array('testname' => $_FILES['install_file']['name']));
            if($exists <= 0) {
                $db_config = $config->getSetting('database');
                exec("php generate_tables_sql_and_testNames.php < $new_file");
                exec("mysql -u" . escapeshellarg($db_config['quatUser']) 
                                . " -p" . escapeshellarg($db_config['quatPassword']) 
                                ." " . escapeshellarg($db_config['database'])  
                                . " < " . $this->path . "project/tables_sql/$instname.super_sql");
                $db->insert("test_names", array(
                    "Test_name" => $instname,
                    'Sub_group' => 0
                ));
            }
        }
    }

    function _setFilterForm()
    {
    }


    function _setDataTableRows($count)
    {
        $db = Database::singleton();
        $x = 0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                if($key == 'Instrument_Type') {
                    if(file_exists($this->path . "/project/instruments/" . $this->tpl_data['items'][$x]['instrument_name'] . ".linst")) {
                        $this->tpl_data['items'][$x][$i]['value'] = "Instrument Builder";
                    } else if(file_exists($this->path . "project/instruments/NDB_BVL_Instrument_" . $this->tpl_data['items'][$x]['instrument_name'] . ".class.inc")) {
                        $this->tpl_data['items'][$x][$i]['value'] = "PHP";
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = "Missing";
                    }
                } else if($key == "Table_Installed") {
                    // This should also check that all the columns exist and have the right type, for new style instruments
                    $exists = $db->pselectOne("SELECT count(*) FROM information_schema.tables WHERE TABLE_SCHEMA=:dbname AND TABLE_NAME=:tablename", array(
                        'dbname' => 'loris',
                        'tablename' => $this->tpl_data['items'][$x]['instrument_name']
                    ));
                    if($exists > 0) {
                        $this->tpl_data['items'][$x][$i]['value'] = 'Exists';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = 'Missing';
                    }
                } else if($key == "Table_Valid") {
                    if(!file_exists($this->path . "project/instruments/" . $this->tpl_data['items'][$x]['instrument_name'] . ".linst")) {
                        $this->tpl_data['items'][$x][$i]['value'] = '?';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = $this->CheckTable($this->tpl_data['items'][$x]['instrument_name']);
                    }
                } else if($key == 'Pages_Valid') {
                    if(!file_exists($this->path . "/project/instruments/" . $this->tpl_data['items'][$x]['instrument_name'] . ".linst")) {
                        $this->tpl_data['items'][$x][$i]['value'] = '?';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = $this->CheckPages($this->tpl_data['items'][$x]['instrument_name']);
                    }

                } else {
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }
                if($key == 'Instrument') {
                    $this->tpl_data['items'][$x]['instrument_name'] = $val;
                }
                $i++;
            }
            $x++;
        }
    }

    function CheckType($tablename, $columnname, $type) {
        $db = Database::singleton();
        $exists = $db->pselectOne("SELECT count(*) FROM information_schema.columns WHERE TABLE_SCHEMA=:dbname AND TABLE_NAME=:tablename AND COLUMN_NAME=:columnname AND DATA_TYPE=:typename", array(
            'dbname' => 'loris',
            'columnname' => $columnname,
            'tablename' => $tablename,
            'typename'  => $type
        ));
        if(!$exists) {
            return "Column $columnname invalid";
        }
        return null;
    }
    function CheckTable($instname) {
        $filename = $this->path . "project/instruments/$instname.linst";
        $fp = fopen($filename, "r");
        $db = Database::singleton();

        while(($line = fgets($fp, 4096)) !== false) {
            $pieces = explode("{@}", $line);
            $type = $pieces[0];
            $name = $pieces[1];
            if($name == 'Examiner') {
                continue;
            }
            switch($type) {
            case 'page': continue;
            case 'table':
            case 'title': continue; // Should these two do something special?
            case 'selectmultiple': // fallthrough, both selectmultiple and text
                // require varchar to save
            case 'text':
                $error = $this->CheckType($instname, $name, 'varchar');
                if($error == null) {
                    continue;
                }
                return $error; 
            case 'textarea':
                $error = $this->CheckType($instname, $name, 'text');
                if($error == null) {
                    continue;
                }
                return $error; 
            case 'date':
                $error = $this->CheckType($instname, $name, 'date');
                if($error == null) {
                    continue;
                }
                return $error; 
            case 'select':
                // Enums can't just check the type, they also need to
                // check the values in the enum
                $enums = explode("{-}", $pieces[3]);
                $db_enum = $db->pselectOne("SELECT COLUMN_TYPE FROM information_schema.columns WHERE TABLE_SCHEMA=:dbname AND TABLE_NAME=:tablename AND COLUMN_NAME=:columnname AND DATA_TYPE='enum'", array(
                    'dbname' => 'loris',
                    'columnname' => $name,
                    'tablename' => $instname
                ));
                $options = array();
                foreach($enums as $enum) {
                    $enum_split = explode("=>", $enum);
                    $key = $enum_split[0];
                    $val = $enum_split[1];
                    if($key == 'NULL') {
                        continue;
                    } else {
                        $options[] = $key;
                    }
                }
                if('enum(' . join(",", $options) . ')' !== $db_enum) {
                    return "$name enum invalid";
                }
            default: break;
            }
        }

        return "Appears Valid";
    }

    function CheckPages($instname) {
        $filename = $this->path . "project/instruments/$instname.linst";
        $fp = fopen($filename, "r");
        $db = Database::singleton();

        while(($line = fgets($fp, 4096)) !== false) {
            $pieces = explode("{@}", $line);
            $type = $pieces[0];
            $name = $pieces[1];
            switch($type) {
            case 'page':
                $exists = $db->pselectOne("SELECT count(*) FROM instrument_subtests WHERE Test_name=:testname AND Description=:testdesc", array(
                    'testname' => $instname,
                    'testdesc' => trim($pieces[2])
                ));
                if($exists <= 0) {
                    return "Missing page '" . trim($pieces[2]) . "'";
                }
            default:break;
            }
        }
        return 'Appears Valid';
    }
}
