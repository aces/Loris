<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all modules
 * for the Module Manager menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\instrument_manager;

/**
 * This class implements a data provisioner to get all modules
 * for the module manager menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class InstrumentManagerProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ModuleManagerProvisioner, which gets modules for the
     * module manager menu table.
     */
    private \NDB_Factory $_factory;

    /**
     * The LORIS base path
     *
     * @var string
     */
    private string $_path;
     /**
      * Create a ModuleManagerProvisioner, which gets modules for the
      * module manager menu table.
      */
    function __construct()
    {
        $this->_factory = \NDB_Factory::singleton();
        $this->_path    = $this->_factory->config()->getSetting("base");
        parent::__construct(
            "SELECT
            test_name as Instrument
	    FROM test_names
            ",
            [],
        );
    }

    /**
     * Returns an instance of a HelpRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $instrument = $row['Instrument'];
                $row['Instrument_Type'] = $this->checkInstrumentType($instrument);
                $row['Table_Installed'] = $this->checkTableInstalled($instrument);
                $row['Table_Valid']     = $this->checkTableValid($instrument);
                $row['Pages_Valid']     = $this->checkPagesValid($instrument);

            return new ModuleRow($row);
    }
    /**
     * Determine the instrument type between LINST and PHP
     *
     * @param string $instrument The instrument name
     *
     * @return string The instrument type
     */
    protected function checkInstrumentType(string $instrument): string
    {
        $linst = $this->_path . "/project/instruments/$instrument.linst";
        if (file_exists($linst)) {
            return 'Instrument Builder';
        }

        $php = $this->_path .
            "/project/instruments/NDB_BVL_Instrument_$instrument.class.inc";

        if (file_exists($php)) {
            return 'PHP';
        }

        return 'Missing';
    }
    /**
     * Checks if entries exists in the subtest table for each pages of the
     * instrument's linst file.
     *
     * @param string $instrument The instrument name
     *
     * @return string An evocative answer
     */
    protected function checkPagesValid(string $instrument): string
    {
        $filename = $this->_path . "/project/instruments/$instrument.linst";
        if (!file_exists($filename)) {
            return '?';
        } else {
            return $this->checkPages($instrument);
        }
    }

    /**
     * Checks if a table with that instrument name exists
     *
     * @param string $instrument The instrument name
     *
     * @return string An evocative answer
     */
    protected function checkTableValid(string $instrument): string
    {
        $filename = $this->_path . "/project/instruments/$instrument.linst";
        if (!file_exists($filename)) {
            return '?';
        } else {
            return $this->checkTable($instrument);
        }
    }

    /**
     * Checks if a table with that instrument name exists
     *
     * @param string $instrument The instrument name
     *
     * @return string An evocative answer
     */
    protected function checkTableInstalled(string $instrument): string
    {
        // This should also check that all the columns exist and
        // have the right type, for new style instruments
        $exists = $this->_factory->database()->pselectOne(
            '
           SELECT count(*)
           FROM information_schema.tables
           WHERE TABLE_SCHEMA=:dbname AND
           TABLE_NAME=:tablename
          ',
            [
                'dbname'    => $this->_factory->settings()->dbName(),
                'tablename' => $instrument,
            ]
        );
        return ($exists > 0) ? 'Exists' : 'Missing';
    }

    /**
     * Checks the test_names table for the existence of the instrument
     *
     * @param string $instrument The instrument name
     *
     * @return bool True if the name is found in the table
     */
    protected function instrumentExists(string $instrument): bool
    {
        $count = $this->_factory->database()->pselectOne(
            'SELECT count(*) FROM test_names WHERE Test_name=:v_instrument',
            [':v_instrument' => $instrument]
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
     * @return ?string
     */
    protected function checkType($tablename, $columnname, $type)
    {
        $db           = $this->_factory->database();
        $sqlSelectOne = "SELECT count(*)".
                        " FROM information_schema.columns".
                        " WHERE TABLE_SCHEMA=:dbname".
                        " AND TABLE_NAME=:tablename".
                        " AND COLUMN_NAME=:columnname".
                        " AND DATA_TYPE=:typename";
        $exists       = $db->pselectOne(
            $sqlSelectOne,
            [
                'dbname'     => $this->_factory->settings()->dbName(),
                'columnname' => $columnname,
                'tablename'  => $tablename,
                'typename'   => $type,
            ]
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
     * @return string An evocative answer
     */
    protected function checkTable($instname): string
    {
        $filename = $this->_path . "project/instruments/$instname.linst";
        $fp       = fopen($filename, "r");
        $db       = $this->_factory->database();

        while (($line = fgets($fp, 4096)) !== false) {
            $pieces = explode("{@}", $line);
            $type   = $pieces[0];
            $name   = $pieces[1];
            if ($name == 'Examiner') {
                continue;
            }
            switch ($type) {
            case 'page':
            case 'table':
            case 'title':
                break;
            case 'selectmultiple': // fallthrough, both selectmultiple and text
                // require varchar to save
            case 'text':
                $error = $this->checkType($instname, $name, 'varchar');
                if ($error == null) {
                    break;
                }
                return $error;
            case 'textarea':
                $error = $this->checkType($instname, $name, 'text');
                if ($error == null) {
                    break;
                }
                return $error;
            case 'date':
                $error = $this->checkType($instname, $name, 'date');
                if ($error == null) {
                    break;
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
                    [
                        'dbname'     => $this->_factory->settings()->dbName(),
                        'columnname' => $name,
                        'tablename'  => $instname,
                    ]
                );
                $options      = [];
                foreach ($enums as $enum) {
                    $enum_split = explode("=>", $enum);
                    $key        = $enum_split[0];
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
     * @return string An evocative response
     */
    protected function checkPages($instname): string
    {
        $filename = $this->_path . "project/instruments/$instname.linst";
        $fp       = fopen($filename, "r");
        $db       = $this->_factory->database();

        while (($line = fgets($fp, 4096)) !== false) {
            $pieces       = explode("{@}", $line);
            $type         = $pieces[0];
            $sqlSelectOne = "SELECT count(*)".
                            " FROM instrument_subtests".
                            " WHERE Test_name=:testname".
                            " AND Description=:testdesc";
            switch ($type) {
            case 'page':
                $exists = $db->pselectOne(
                    $sqlSelectOne,
                    [
                        'testname' => $instname,
                        'testdesc' => trim($pieces[2]),
                    ]
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
