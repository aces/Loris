<?php
/**
 * This class implements a data Instance which represents a single
 * file in the media menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\module_manager;

/**
 * A Meida File represents a row in the Media menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ModuleRow implements \LORIS\Data\DataInstance
{
    protected $Module;
    protected $DBRow;
    protected $Active;

    /**
     * Create a new Media File Instance.
     *
     * @param array $row The Media File Instance
     */
    public function __construct(array $row)
    {
        $this->Module = \Module::factory($row['name']);
        $this->Active = $row['active'];
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the instance data.
     */
    public function toJSON(): string
    {
        return json_encode([
            'Name' => $this->Module->getName(),
            'LongName' => $this->Module->getLongName(),
            'Active' => $this->Active,
        ]);
    }

}
