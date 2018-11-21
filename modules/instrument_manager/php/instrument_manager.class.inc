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
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \LORIS\Http\EmptyStream;

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
    private $feedback;

    public function __construct($module, $page, $id, $commentID, $formname)
    {
        $this->feedback     = [];
        $this->AjaxModule   = true;
        $this->skipTemplate = true;
        $this->factory      = \NDB_Factory::singleton();
        $this->path         = $this->factory->config()->getSetting("base");

        parent::__construct($module, $page, $id, $commentID, $formname);
    }
    /**
    * Checking permissions
    *
    * @param \User $user The user whose access is being checked
    *
    * @return bool
    */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('superuser');
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $method = $request->getMethod();
        if ($method == 'POST') {
            return $this->handlePOST($request);
        }

        return parent::handle($request);
    }

    private function handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        if (!$this->canWriteFiles()) {
            return (new \Zend\Diactoros\Response())
                ->withStatus(403, 'Forbidden')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array('error' => 'Automatic installation of instruments is not possible given the current server configuration. Please contact your administrator if you require this functionality')
                        )
                    )
                );
        }
        $uploaded_file = $request->getUploadedFiles()['install_file'];
        $filename      = $uploaded_file->getClientFilename();
        $instrument    = pathinfo($filename)['filename'];

        if ($this->instrumentExists($instrument)) {
            return (new \Zend\Diactoros\Response())
                ->withStatus(409, 'Conflict')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array('error' => "Instrument `$instrument` already exists in the test battery")
                        )
                    )
                );
        }

        $fullpath = $this->path . "project/instruments/" . $filename;

        if (file_exists($fullpath)) {
            // Don't update the file if it already exists on the back-end.
            // Instead, inform users that an administrator must install it on
            // their behalf.
            // This should only happen for users on a system where automatic
            // installation is disabled (ie. has no quatUser), as the above
            // error will return before this one.
            return (new \Zend\Diactoros\Response())
                ->withStatus(409, 'Conflict')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array('error' => "$filename has already been uploaded. Please contact your administrator to install the instrument")
                        )
                    )
                );
        }

        $uploaded_file->moveTo($fullpath);
        chmod($fullpath, 0644);

        // Scripts in tools/ often make relative imports, so we must change
        // our effective directory in order to use them.
        chdir($this->path . "/tools");
        // Use tools/ script to generate an SQL patch file based on the
        // structure of the uploaded .linst file.
        exec(
            'php generate_tables_sql_and_testNames.php < '
            . escapeshellarg($fullpath)
        );

        if (!$this->isQuatUserConfigured()) {
            // If no quatUser is configured, automatic installation is not
            // possible, so this is the last step.
            return (new \Zend\Diactoros\Response())
                ->withStatus(200, 'OK')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array('message' => 'File upload is successful but the instrument needs to be installed manually')
                        )
                    )
                );
        }

        // Install the instrument by directly sourcing the SQL file
        // generated by `generate_tables_sql_and_testNames.php` using bash.
        // If installation is successful, `exec` will complete
        // silently. Otherwise, it will return the exit code and error
        // messsage from MySQL. This will be stored in $result and
        // logged via LorisException.
        $table_name = \NDB_BVL_Instrument::factory($instrument, '', '')->table;
        $db_config  = $this->factory->config()->getSetting('database');
        exec(
            "mysql".
            " -h" . escapeshellarg($db_config['host']).
            " -u" . escapeshellarg($db_config['quatUser']).
            " -p" . escapeshellarg($db_config['quatPassword']).
            " " . escapeshellarg($db_config['database']).
            " < " . $this->path . "project/tables_sql/".
            escapeshellarg($table_name . '.sql'),
            $output, // $output and $status are created automatically
            $status  // by `exec` and so need not be declared above.
        );
        // An exit code of 0 is a success and 1 means failure
        if ($status) {
            error_log(
                "The installation of $instrument->table.sql failed. "
                . "Either: the instrument table exists (but is not in the "
                . "test_names table), or "
                . "LORIS could not connect to the database using the "
                . "credentials supplied in the config file."
                . print_r($object)
            );
            return (new \Zend\Diactoros\Response())
                ->withStatus(500, 'Internal Server Error')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array('error' => 'File upload is successful but the installation failed. Please contact your administrator')
                        )
                    )
                );
        }

        return (new \Zend\Diactoros\Response())
            ->withStatus(201, 'Created')
            ->withBody(new EmptyStream());
    }

    /**
    * SetupVariables function
    *
    * @return void
    */
    function _setupVariables()
    {
        $this->headers      = array(
                               'Instrument',
                               'Instrument_Type',
                               'Table_Installed',
                               'Table_Valid',
                               'Pages_Valid',
                              );
        $this->columns      = array('Test_name as Instrument');
        $this->query        = " FROM test_names";
        $this->validFilters = array();
        $this->formToFilter = array();

        // Check to see whether the quatUser is configured.
        // If this user is not configured, the instrument cannot be
        // automatically installed as the table will not be able to be
        // created.
        if (!$this->isQuatUserConfigured()) {
            $this->can_install = false;
            $this->feedback[]  = "Instrument installation is not "
                . "possible given the current server configuration; the "
                . "LORIS 'quatUser' is not configured properly. File upload is "
                . "still possible but instruments will need to be installed "
                . "manually.";
        }

        // Ensure we can write to folders in project/. If not, the upload
        // form will not be created on the front-end. Warnings will explain to
        // to the user that installation is not possible.
        if (!$this->canWriteFiles()) {
            $this->feedback[] = "Automatic installation of "
                . "instruments is not possible given the current server "
                . "configuration. Please contact your administrator if you "
                . "require this functionality.";
        }
    }

    /**
     * Converts this menu filter to an array of the form
     *
     * Headers => (string array)
     * Data => (array of arrays of row data)
     *
     * Suitable for serializing to JSON, CSV, etc..
     *
     * @return array
     */
    function toArray()
    {
        $data = array_map(
            function ($row) {
                $instrument = $row['Instrument'];
                $row['Instrument_Type'] = $this->checkInstrumentType($instrument);
                $row['Table_Installed'] = $this->checkTableInstalled($instrument);
                $row['Table_Valid']     = $this->checkTableValid($instrument);
                $row['Pages_Valid']     = $this->checkPagesValid($instrument);
                return $row;
            },
            $this->_getFullList()
        );

        $headers = array_map(
            function ($header) {
                return ucwords(str_replace('_', ' ', $header));
            },
            $this->headers
        );

        $MappedData = array();
        foreach ($data as $row) {
            $MappedData[] = array_values($row);
        }

        return array(
                'Headers'      => $headers,
                'Data'         => $MappedData,
                'fieldOptions' => $this->fieldOptions,
                'writable'     => $this->canWriteFiles(),
                'caninstall'   => $this->isQuatUserConfigured(),
                'feedback'     => $this->feedback,
               );
    }

    /**
    * SetFilterForm function
    *
    * @return void
    */
    function _setFilterForm()
    {
    }

    private function checkInstrumentType(string $instrument): string
    {
        $linst = $this->path . "/project/instruments/$instrument.linst";
        if (file_exists($linst)) {
            return 'Instrument Builder';
        }

        $php = $this->path . "/project/instruments/NDB_BVL_Instrument_$instrument.class.inc";
        if (file_exists($php)) {
            return 'PHP';
        }

        return 'Missing';
    }

    private function checkPagesValid(string $instrument): string
    {
        $filename = $this->path . "/project/instruments/$instrument.linst";
        if (!file_exists($filename)) {
            return '?';
        } else {
            return $this->checkPages($instrument);
        }
    }

    private function checkTableValid(string $instrument): string
    {
        $filename = $this->path . "/project/instruments/$instrument.linst";
        if (!file_exists($filename)) {
            return '?';
        } else {
            return $this->checkTable($instrument);
        }
    }

    private function checkTableInstalled(string $instrument): string
    {
        // This should also check that all the columns exist and
        // have the right type, for new style instruments
        $exists = $this->factory->database()->pselectOne(
            '
           SELECT count(*)
           FROM information_schema.tables
           WHERE TABLE_SCHEMA=:dbname AND
           TABLE_NAME=:tablename
          ',
            array(
             'dbname'    => $this->factory->settings()->dbName(),
             'tablename' => $instrument,
            )
        );
        return ($exists > 0) ? 'Exists' : 'Missing';
    }

            // Check the test_names table for the existence of $instname using
            // COUNT in MySQL.
            // If it is positive, tell the user the instrument is already in the
            // test battery.
            // Note that if a user manually deletes entries from the test_names
            // table and tries to install an instrument with the same name, it
            // will fail as the instrument table itself will still exist.
            // In this case, the back-end admistrator is informed via logging
            // below.
    private function instrumentExists(string $instrument): bool
    {
        $count = $this->factory->database()->pselectOne(
            'SELECT count(*) FROM test_names WHERE Test_name=:v_instrument',
            array(':v_instrument' => $instrument)
        );
        return $count > 0;
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
        $db        = $this->factory->database();
        $db_config = $this->factory->config()->getSetting('database');

        $credentials_set = !empty($db_config['quatUser'])
            && !empty($db_config['quatPassword']);
        if (!$credentials_set) {
            return false;
        }
        // Check if supplied credentials are valid by making a DB connection.
        // If the credentials are invalid, an error message will be logged to
        // the backend.
        try {
            $connected = $db->connect(
                $db_config['database'],
                $db_config['quatUser'],
                $db_config['quatPassword'],
                $db_config['host'],
                false
            );
        } catch (\DatabaseException $e) {
            $connected = false;
        }
        return $connected;
    }

    private function canWriteFiles(): bool
    {
        $instrument_dir = $this->path . 'project/instruments';
        $table_dir      = $this->path . 'project/tables_sql';

        return is_writable($instrument_dir) && is_writable($table_dir);
    }


    /**
     * Adds React table related dependencies to menu filters, since forms don't
     * usually have tables or pagination
     *
     * @return array of javascript files to be sourced
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $depends = parent::getJSDependencies();
        $baseURL = $factory->settings()->getBaseURL();
        return array_merge(
            $depends,
            array(
             $baseURL . '/instrument_manager/js/instrumentManagerIndex.js',
            )
        );
    }
}

