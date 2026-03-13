<?php declare(strict_types=1);

/**
 * This class implements a data Instance which represents a single
 * module in the acknowledgements menu table.
 *
 * PHP Version 8
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\instrument_manager;

/**
 * A ModuleRow represents a row in the instrument_manager menu table.
 *
 * The instrument_manager requires a specific "row" concept because
 * the \Module class does not have any concept of the Active flag
 * for the module in order to serialize it as JSON for the data
 * table.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class InstrumentRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    private \NDB_Factory $_factory;

    /**
     * The LORIS base path
     *
     * @var string
     */
    private string $_path;

    /**
     * Create a new HelpRow
     *
     * @param array $row The row
     */
    public function __construct(array $row)
    {
        $this->_factory = \NDB_Factory::singleton();
        $this->_path    = $this->_factory->config()->getSetting("base");
        $instrument     = $row['Instrument'];
        $row['Instrument_Type'] = $this->checkInstrumentType($instrument);
        $row['Table_Installed'] = $this->checkTableInstalled($instrument);
        $row['Table_Valid']     = $this->checkTableValid($instrument);
        $row['Pages_Valid']     = $this->checkPagesValid($instrument);
        if ($row['Permissions_Required'] !== null) {
            $row['Permissions_Required'] = explode(
                ',',
                $row['Permissions_Required'],
            );
        }

        $this->DBRow = $row;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */

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

    /**
     * JsonSerialize function
     *
     * @return array response
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }

    /**
     * Check whether a user can access this data instance.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        return $user->hasAnyPermission(Instrument_Manager::PERMISSIONS);
    }
}
