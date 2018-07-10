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

        // Check to see whether the quatUser is configured.
        // If this user is not configured, the instrument cannot be
        // automatically installed as the table will not be able to be
        // created.
        $quat_user_is_configured = $this->isQuatUserConfigured();
        if (!$quat_user_is_configured) {
            $this->tpl_data['can_install'] = false;
            $this->tpl_data['feedback']    = "Instrument installation is not "
                . "possible given the current server configuration; the "
                . "LORIS 'quatUser' is not configured properly. File upload is "
                . "still possible but instruments will need to be installed "
                . "manually.";
        }

        // Ensure we can write to folders in project/. If not, the upload
        // form will not be created on the front-end. Warnings will explain to
        // to the user that installation is not possible.
        $writable = is_writable($this->path . "project/instruments")
            && is_writable($this->path . "project/tables_sql");
        $this->tpl_data['writable'] = $writable;
        if (!$writable) {
            $this->tpl_data['feedback'] = "Automatic installation of "
                . "instruments is not possible given the current server "
                . "configuration. Please contact your administrator if you "
                . "require this functionality.";
        }
        // Process POST request (installation of an instrument).
        if ($writable && isset($_POST['install'])
            && $_POST['install'] == 'Install Instrument'
        ) {
            $instname = basename($_FILES['install_file']['name'], '.linst');
            // Check the test_names table for the existence of $instname using
            // COUNT in MySQL.
            // If it is positive, tell the user the instrument is already in the
            // test battery.
            // Note that if a user manually deletes entries from the test_names
            // table and tries to install an instrument with the same name, it
            // will fail as the instrument table itself will still exist.
            // In this case, the back-end admistrator is informed via logging
            // below.
            $db           = \Database::singleton();
            $sqlSelectOne = "SELECT count(*)".
                            " FROM test_names WHERE Test_name=:testname";
            $count_result = $db->pselectOne(
                $sqlSelectOne,
                array('testname' => $instname)
            );
            if (intval($count_result) > 0) {
                $this->tpl_data['feedback'] = "Instrument '$instname' already "
                    . "exists in the test battery!";
                http_response_code(409);
                return;
            }

            // Don't update the file if it already exists on the back-end.
            // Instead, inform users that an administrator must install it on
            // their behalf.
            // This should only happen for users on a system where automatic
            // installation is disabled (ie. has no quatUser), as the above
            // error will return before this one.
            $file_path = $this->path . "project/instruments/" .
                        $_FILES['install_file']['name'];
            if (file_exists($file_path)) {
                $this->tpl_data['feedback'] = "'$instname.linst' has already "
                    . "been uploaded. Please contact your administrator to "
                    . "install the instrument.";
                http_response_code(409);
                return;
            }

            move_uploaded_file($_FILES['install_file']['tmp_name'], $file_path);
            chmod($file_path, 0644);
            // Scripts in tools/ often make relative imports, so we must change
            // our effective directory in order to use them.
            chdir($this->path . "/tools");

            // Use tools/ script to generate an SQL patch file based on the
            // structure of the uploaded .linst file.
            // If no quatUser is configured, automatic installation is not
            // possible, so this is the last step.
            $db_config = $config->getSetting('database');
            exec(
                'php generate_tables_sql_and_testNames.php < '
                . escapeshellarg($file_path)
            );
            if (!$quat_user_is_configured) {
                http_response_code(201);
                return;
            }

            // Install the instrument by directly sourcing the SQL file
            // generated by `generate_tables_sql_and_testNames.php` using bash.
            // If installation is successful, `exec` will complete
            // silently. Otherwise, it will return the exit code and error
            // messsage from MySQL. This will be stored in $result and
            // logged via LorisException.
            $instrument = \NDB_BVL_Instrument::factory(
                $instname,
                '',
                ''
            );
            exec(
                "mysql".
                " -h" . escapeshellarg($db_config['host']).
                " -u" . escapeshellarg($db_config['quatUser']).
                " -p" . escapeshellarg($db_config['quatPassword']).
                " " . escapeshellarg($db_config['database']).
                " < " . $this->path . "project/tables_sql/".
                escapeshellarg($instrument->table . '.sql'),
                $output, // $output and $status are created automatically
                $status  // by `exec` and so need not be declared above.
            );
            // An exit code of 0 is a success and 1 means failure
            if ($status) {
                $this->tpl_data['feedback'] = "The installation of "
                    . "$instrument->table.sql failed. "
                    . "Please contact your administrator.";
                error_log(
                    "The installation of $instrument->table.sql failed. "
                    . "Either: the instrument table exists (but is not in the "
                    . "test_names table), or "
                    . "LORIS could not connect to the database using the "
                    . "credentials supplied in the config file."
                    . print_r($object)
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

    /**
     * Return whether the quatUser is properly configured, ie. credentials are
     * set and are valid.
     * The quatUser is a MySQL user with CREATE table permissions.
     * `empty` is used instead of `isset` as blank values in the config file
     * are still considered set.
     *
     * @return bool True if a quatUser is configured properly. False if not.
     */
    function isQuatUserConfigured() : bool
    {
        $db        = \Database::singleton();
        $config    = \NDB_Config::singleton();
        $db_config = $config->getSetting('database');

        $credentials_set = !empty($db_config['quatUser'])
            && !empty($db_config['quatPassword']);
        if (!$credentials_set) {
            return false;
        }
        // Check if supplied credentials are valid by making a DB connection.
        // If the credentials are invalid, an error message will be logged to
        // the backend.
        return $db->connect(
            $db_config['database'],
            $db_config['quatUser'],
            $db_config['quatPassword'],
            $db_config['host'],
            false
        );
    }
}
