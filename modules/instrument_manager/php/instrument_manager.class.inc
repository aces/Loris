<?php
/**
 * Instrument_manager
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Instrument_Manager
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\instrument_manager;
/**
 * Instrument_manager
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Instrument_Manager
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Instrument_Manager extends \NDB_Menu_Filter
{
    /**
    * Checking permissions
    *
    * @return bool
    */
    function _hasAccess()
    {
        $user =& \User::singleton();
        return $user->hasPermission('superuser');
    }
    /**
    * SetupVariables function
    *
    * @return void
    */
    function _setupVariables()
    {
        $config        = \NDB_Config::singleton();
        $this->path    = $config->getSetting("base");
        $this->headers = array(
                          'Instrument',
                          'Instrument_Type',
                          'Table_Installed',
                          'Table_Valid',
                          'Pages_Valid',
                         );
        $this->query   = " FROM test_names t";
        $this->columns = array(
                          't.Test_name as Instrument',
                          "'x' as Instrument_Type",
                          "'x' as Table_Installed",
                          "'x' as Table_Valid",
                          "'x' as Pages_Valid",
                         );
        $this->validFilters = array('');
        $this->formToFilter = array();

        $writable = true;
        if (!is_writable($this->path . "project/instruments")
            || !is_writable($this->path . "project/tables_sql")
        ) {
            $writable = false;
        } else {
            $writable = true;
        }
        $this->tpl_data['writable'] = $writable;
        if ($writable && $_POST['install'] == 'Install Instrument') {
            $db       = \Database::singleton();
            $instname = basename($_FILES['install_file']['name'], '.linst');

            $new_file = $this->path . "project/instruments/" .
                        $_FILES['install_file']['name'];
            move_uploaded_file($_FILES['install_file']['tmp_name'], $new_file);
            chmod($new_file, 0644);
            chdir($this->path . "/tools");
            $sqlSelectOne = "SELECT count(*)".
                            " FROM test_names WHERE Test_name=:testname";
            $exists       = $db->pselectOne(
                $sqlSelectOne,
                array('testname' => $_FILES['install_file']['name'])
            );
            if ($exists <= 0) {
                $db_config = $config->getSetting('database');
                exec("php generate_tables_sql_and_testNames.php < $new_file");

                $instrument =& \NDB_BVL_Instrument::factory(
                    $instname,
                    null,
                    null
                );
                if (!isset($db_config['quatUser'], $db_config['quatPassword'])) {
                    throw new \LorisException(
                        "SQL needs to be sourced manually at /project/tables_sql/".
                        $instrument->table.".sql"
                    );
                }
                exec(
                    "mysql".
                    " -h" . escapeshellarg($db_config['host']).
                    " -u" . escapeshellarg($db_config['quatUser']).
                    " -p" . escapeshellarg($db_config['quatPassword']).
                    " " . escapeshellarg($db_config['database']).
                    " < " . $this->path . "project/tables_sql/".
                    $instrument->table.".sql"
                );
            }
        }
    }
    /**
    * SetFilterForm function
    *
    * @return void
    */
    function _setFilterForm()
    {
    }
    /**
    * SetDataTableRows function
    *
    * @param integer $count the value of count
    *
    * @return void
    */
    function _setDataTableRows($count)
    {
        $factory = \NDB_Factory::singleton();
        $db      = \Database::singleton();
        $x       = 0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                if ($key == 'Instrument_Type') {
                    if (file_exists(
                        $this->path .
                        "/project/instruments/" .
                                    $this->tpl_data['items'][$x]['instrument_name'] .
                        ".linst"
                    )
                    ) {
                        $this->tpl_data['items'][$x][$i]['value']
                            = "Instrument Builder";
                    } else if (file_exists(
                        $this->path .
                        "project/instruments/NDB_BVL_Instrument_" .
                                    $this->tpl_data['items'][$x]['instrument_name'] .
                        ".class.inc"
                    )
                    ) {
                              $this->tpl_data['items'][$x][$i]['value'] = "PHP";
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = "Missing";
                    }
                } else if ($key == "Table_Installed") {
                    // This should also check that all the columns exist and
                    // have the right type, for new style instruments
                    $sqlSelectOne = "SELECT count(*)".
                                    " FROM information_schema.tables".
                                    " WHERE TABLE_SCHEMA=:dbname".
                                    " AND TABLE_NAME=:tablename";
                    $tableName    = $this->tpl_data['items'][$x]['instrument_name'];
                    $exists       = $db->pselectOne(
                        $sqlSelectOne,
                        array(
                         'dbname'    => $factory->settings()->dbName(),
                         'tablename' => $tableName,
                        )
                    );
                    if ($exists > 0) {
                        $this->tpl_data['items'][$x][$i]['value'] = 'Exists';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value'] = 'Missing';
                    }
                } else if ($key == "Table_Valid") {
                    if (!file_exists(
                        $this->path .
                           "project/instruments/" .
                           $this->tpl_data['items'][$x]['instrument_name'] .
                           ".linst"
                    )
                    ) {
                        $this->tpl_data['items'][$x][$i]['value'] = '?';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value']
                            = $this->checkTable(
                                $this->tpl_data['items'][$x]['instrument_name']
                            );
                    }
                } else if ($key == 'Pages_Valid') {
                    if (!file_exists(
                        $this->path .
                        "/project/instruments/" .
                        $this->tpl_data['items'][$x]['instrument_name'] .
                        ".linst"
                    )
                    ) {
                        $this->tpl_data['items'][$x][$i]['value'] = '?';
                    } else {
                        $this->tpl_data['items'][$x][$i]['value']
                            = $this->checkPages(
                                $this->tpl_data['items'][$x]['instrument_name']
                            );
                    }

                } else {
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }
                if ($key == 'Instrument') {
                    $this->tpl_data['items'][$x]['instrument_name'] = $val;
                }
                $i++;
            }
            $x++;
        }
    }
    /**
    * CheckType function
    *
    * @param string $tablename  the value of table name
    * @param string $columnname the value of column name
    * @param string $type       the value of the type
    *
    * @return string
    */
    function checkType($tablename, $columnname, $type)
    {
        $factory      = \NDB_Factory::singleton();
        $db           = \Database::singleton();
        $sqlSelectOne = "SELECT count(*)".
                        " FROM information_schema.columns".
                        " WHERE TABLE_SCHEMA=:dbname".
                        " AND TABLE_NAME=:tablename".
                        " AND COLUMN_NAME=:columnname".
                        " AND DATA_TYPE=:typename";
        $exists       = $db->pselectOne(
            $sqlSelectOne,
            array(
             'dbname'     => $factory->settings()->dbName(),
             'columnname' => $columnname,
             'tablename'  => $tablename,
             'typename'   => $type,
            )
        );
        if (!$exists) {
            return "Column $columnname invalid";
        }
        return null;
    }
    /**
    * CheckTable function
    *
    * @param string $instname the value of instname
    *
    * @return bool
    */
    function checkTable($instname)
    {
        $factory  = \NDB_Factory::singleton();
        $filename = $this->path . "project/instruments/$instname.linst";
        $fp       = fopen($filename, "r");
        $db       = \Database::singleton();

        while (($line = fgets($fp, 4096)) !== false) {
            $pieces = explode("{@}", $line);
            $type   = $pieces[0];
            $name   = $pieces[1];
            if ($name == 'Examiner') {
                continue;
            }
            switch($type) {
            case 'page':
                continue;
            case 'table':
            case 'title':
                continue; // Should these two do something special?
            case 'selectmultiple': // fallthrough, both selectmultiple and text
                // require varchar to save
            case 'text':
                $error = $this->checkType($instname, $name, 'varchar');
                if ($error == null) {
                    continue;
                }
                return $error;
            case 'textarea':
                $error = $this->checkType($instname, $name, 'text');
                if ($error == null) {
                    continue;
                }
                return $error;
            case 'date':
                $error = $this->checkType($instname, $name, 'date');
                if ($error == null) {
                    continue;
                }
                return $error;
            case 'select':
                // Enums can't just check the type, they also need to
                // check the values in the enum
                $enums        = explode("{-}", $pieces[3]);
                $sqlSelectOne = "SELECT COLUMN_TYPE".
                                " FROM information_schema.columns".
                                " WHERE TABLE_SCHEMA=:dbname".
                                " AND TABLE_NAME=:tablename".
                                " AND COLUMN_NAME=:columnname".
                                " AND DATA_TYPE='enum'";
                $db_enum      = $db->pselectOne(
                    $sqlSelectOne,
                    array(
                     'dbname'     => $factory->settings()->dbName(),
                     'columnname' => $name,
                     'tablename'  => $instname,
                    )
                );
                $options      = array();
                foreach ($enums as $enum) {
                    $enum_split = explode("=>", $enum);
                    $key        = $enum_split[0];
                    $val        = $enum_split[1];
                    if ($key == 'NULL') {
                        continue;
                    } else {
                        $options[] = $key;
                    }
                }
                if ('enum(' . join(",", $options) . ')' !== $db_enum) {
                    return "$name enum invalid";
                }
            default:
                break;
            }
        }

        return "Appears Valid";
    }
    /**
    * CheckPages function
    *
    * @param string $instname the value of instname
    *
    * @return bool
    */
    function checkPages($instname)
    {
        $filename = $this->path . "project/instruments/$instname.linst";
        $fp       = fopen($filename, "r");
        $db       = \Database::singleton();

        while (($line = fgets($fp, 4096)) !== false) {
            $pieces       = explode("{@}", $line);
            $type         = $pieces[0];
            $name         = $pieces[1];
            $sqlSelectOne = "SELECT count(*)".
                            " FROM instrument_subtests".
                            " WHERE Test_name=:testname".
                            " AND Description=:testdesc";
            switch($type) {
            case 'page':
                $exists = $db->pselectOne(
                    $sqlSelectOne,
                    array(
                     'testname' => $instname,
                     'testdesc' => trim($pieces[2]),
                    )
                );
                if ($exists <= 0) {
                    return "Missing page '" . trim($pieces[2]) . "'";
                }
            default:
                break;
            }
        }
        return 'Appears Valid';
    }
}
